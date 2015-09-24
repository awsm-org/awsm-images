'use strict';

var Promise = require('bluebird'),
    rp      = require('request-promise'),
    gm      = require('gm').subClass({imageMagick: true}),
    path    = require('path'),
    tmpFile = path.join(require('os').tmpdir(), 'overwrite');

Promise.promisifyAll(gm.prototype);

/**
 * Creates a thumbnail from URL to image
 *
 * @param url
 * @returns {Promose} node Buffer of thumbnail
 */
exports.thumbnail = Promise.method(function(url) {
  return rp(url)
      .then(function(body) {
        //gm.thumb forces u to output file :(
        return gm(body).thumbAsync(100, 100, tmpFile);
      })
      .then(function(img) {
        return img.toBufferAsync('jpg');
      });
});

exports.scale = Promise.method(function(url, targetW, targetH) {
  //TODO: implement
});
