'use strict';

var AWS     = require('aws-sdk'),
    Promise = require('bluebird'),
    s3      = Promise.promisifyAll(new AWS.S3()),
    rp      = require('request-promise'),
    shortid = require('shortid');

var ir = require('awsm-images/lib/resize.js');

console.log('Using AWS SDK ver: ' + require('aws-sdk/package.json').version);

/**
 * Export for lambda handler
 * @param event
 * @param context
 * @param cb
 */
exports.run = function(event, context, cb) {
  if (!event.url) {
    return cb(new Error('Missing url parameter'));
  }

  if (!process.env.IMAGE_RESIZE_BUCKET) {
    return cb(new Error('IMAGE_RESIZE_BUCKET env var not set'));
  }

  var imgBucket = process.env.IMAGE_RESIZE_BUCKET,
      key       = [process.env.JAWS_DATA_MODEL_STAGE, shortid.generate() + '.jpg'].join('/');

  ir.thumbnail(event.url)
      .then(function(thumbBuffer) {
        //upload thumb to s3
        var params = {
          Bucket: imgBucket,
          Key: key,
          ACL: 'public-read',
          Body: thumbBuffer,
          ContentType: 'image/jpeg'
        };

        return s3.putObjectAsync(params);
      })
      .then(function() {
        var s3HttpsUrl = 'https://' + s3.endpoint.hostname + '/' + imgBucket + '/' + key;

        return cb(null, {thumbUrl: s3HttpsUrl});
      })
      .catch(function(e) {
        return cb(e);
      });
};
