'use strict';

var Promise = require('bluebird'),
    rp = require('request-promise'),
    gm = require('gm').subClass({imageMagick: true}),
    path = require('path'),
    tmpFile = path.join(require('os').tmpdir(), 'overwrite'),
    fs = require('fs'),
    utils = require('./utils.js');

Promise.promisifyAll(gm.prototype);

/**
 * Creates a thumbnail from URL to image
 *
 * @param url
 * @returns {Promose} node Buffer of thumbnail
 */
exports.thumbnail = Promise.method(function(url) {
  return rp({
    uri: url,
    encoding: null,
  })
      .then(function(body) {
        //gm.thumb forces u to output file :(
        var i = gm(body);
        return Promise.all([i, i.thumbAsync(100, 100, tmpFile, 85, 'center')]);
      })
      .spread(function(img) {
        return fs.readFileSync(tmpFile);
      })
      .then(function(imgBuffer) {
        return utils.uploadToS3(imgBuffer);
      });
});

exports.scale = Promise.method(function(url, targetW, targetH) {
  //TODO: implement
});
