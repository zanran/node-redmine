/*!
 * node-redmine
 * A nodejs library which supports 100% features of Redmine's REST API.
 * Author: zanran <wayne@zanran.me>
 */

/**
 * Module dependencies
 */
var http = require('http');
var url = require('url');
var debug = require('debug')('node-redmine');
var util = require('util');
var http = require('http');
var urlparse = require('url').parse;

////////////////////////////////////////////////////////////////////////////////////
/**
 * Redmine
 *
 * @param {String} host, Redmine hostname
 * @param {Object} config
 *  - {String} apiKey, API access key for Redmine, if apiKey occured, username and password will be ignored.
 *  - {String} username, username to login Redmine.
 *  - {String} password, password for login Redmine.
 *  - {String} format, REST API formats, xml or json.
 */
function Redmine(host, config) {
  if (!host) throw new Error('Invalidate hostname !');

  if (typeof host !== 'string') throw new Error('hostname should be a String !');

  if (!(config.apiKey || (config.username && config.password))) {
    throw new Error('You should provide an API key or username & password !');
  }

  this.config = config;

  if (!this.config.format) this.config.format = 'json';
}

Redmine.prototype = {
  // get & set property
  get apiKey() {
      return this.config.apiKey;
  },
  set apiKey(apiKey) {
      this.config.apiKey = apiKey;
  },
  get host() {
      return this.config.host;
  },
  set host(host) {
      this.config.host = host;
  },
  get username() {
      return this.config.username;
  },
  set username(username) {
      this.config.username = username;
  }
};

/**
 * encodeURL
 */
Redmine.prototype.encodeURL = function(path, params) {
  if (path.slice(0, 1) != '/') path = '/' + path;

  return path;
};

/**
 * request - request url from Redmine
 */
Redmine.prototype.request = function(method, path, params, callback) {
  var opts = {
    host: this.config.host,
    path: method == 'GET' ? this.encodeURL(path, params) : path,
    method: method,
    headers: {
      'X-Redmine-API-Key': this.config.apiKey
    }
  };

  var req = http.request(opts, function(res) {
    console.log('request: ' + String(opts));
    console.log('response: ' + String(res));

    if (res.statusCode != 200) {
      callback('Server returns status code: ' + res.statusCode, null);
      callback = null;
    }

    var body = "";
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      body += chunk;
    });

    res.on('end', function(e) {
      var data = JSON.parse(body);
      callback(null, data);
      callback = null;
    });
  });

  req.on('error', function(err) {
    callback(err, null);
    callback = null;
  });

  req.end();
};


Redmine.prototype.getIssue = function(id, callback) {
  this.request('GET', '/issues/' + id + '.' + this.config.format, {}, callback);
};


/**
 * Exports
 */
module.exports = Redmine;
