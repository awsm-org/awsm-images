'use strict';

var AWS = require('aws-sdk'),
    Promise = require('bluebird'),
    s3 = Promise.promisifyAll(new AWS.S3()),
    shortid = require('shortid');

var imgBucket = process.env.IMAGE_RESIZE_BUCKET;

console.log('Using AWS SDK ver: ' + require('aws-sdk/package.json').version);

/**
 * Take image buffer and upload it to the s3 image bucket
 *
 * @param imgBuffer
 * @returns {Promise} full https path to uploaded image
 */
exports.uploadToS3 = function(imgBuffer) {
  var key = [process.env.JAWS_DATA_MODEL_STAGE, shortid.generate() + '.jpg'].join('/'),
      params = {
        Bucket: imgBucket,
        Key: key,
        ACL: 'public-read',
        Body: imgBuffer,
        ContentType: 'image/jpeg'
      };

  return s3.putObjectAsync(params)
      .then(function() {
        var s3HttpsUrl = 'https://' + s3.endpoint.hostname + '/' + imgBucket + '/' + key;

        return s3HttpsUrl;
      })
};