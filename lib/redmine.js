/*!
 * node-redmine
 * A nodejs library which supports 100% features of Redmine's REST API.
 * Author: zanran <wayne@zanran.me>
 */

 'use strict()';

/**
 * Module dependencies
 */
var http = require('http');
var url = require('url');
var debug = require('debug')('node-redmine');
var util = require('util');
var http = require('http');
var urlparse = require('url').parse;
var querystring = require('querystring');

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

  if (config.format) {
    if ('json' !== config.format && 'xml' !== config.format) throw new Error('Redmine REST API only supports json and xml !');
  }

  this.config = config;
  this.config.host = host;

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

  var query = querystring.stringify(params);
  if (query) path = path + '?' + query;

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
      'X-Redmine-API-Key': this.config.apiKey,
      'Content-Type': this.config.format == 'json' ? 'application/json' : 'application/xml'
    }
  };

  var req = http.request(opts, function(res) {
    console.log('----------- start request options ------------------');
    console.log(opts);
    console.log('----------- end request options ------------------\n');

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
      var data;
      if (body) {
        data = JSON.parse(body);
      } else {
        data = {statusCode: res.statusCode, statusMessage: res.statusMessage};
      }
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

/**
 *  REST API for issues (Stable)
 */
Redmine.prototype.get_issue_by_id = function(id, params, callback) {
  if (typeof id !== 'number') throw new Error('Issue ID must be an integer above 0 !');

  this.request('GET', '/issues/' + id + '.' + this.config.format, params, callback);
};

Redmine.prototype.issues = function(params, callback) {
  this.request('GET', '/issues' + '.' + this.config.format, params, callback);
};
/*
Redmine.prototype.create_issue = function(id, callback) {
  this.request('GET', '/issues/' + id + '.' + this.config.format, {}, callback);
};
*/
Redmine.prototype.update_issue = function(id, params, callback) {
  this.request('PUT', '/issues/' + id + '.' + this.config.format, params, callback);
};

Redmine.prototype.delete_issue = function(id, callback) {
  this.request('DELETE', '/issues/' + id + '.' + this.config.format, {}, callback);
};

Redmine.prototype.add_watcher = function(id, params, callback) {
  if (!params.user_id) throw new Error('user_id (required): id of the user to add as a watcher !');

  this.request('POST', '/issues/' + id + '/watchers.' + this.config.format, params, callback);
};

Redmine.prototype.remove_watcher = function(issue_id, user_id, callback) {
  this.request('DELETE', '/issues/' + issue_id + '/watchers/' + user_id + '.' + this.config.format, {}, callback);
};


/**
 * REST API for Projects (Stable)
 *//*
 Redmine.prototype.projects = function(id, callback) {
   this.request('GET', '/issues/' + id + '.' + this.config.format, {}, callback);
 };

 Redmine.prototype.get_project_by_id = function(id, callback) {
   this.request('GET', '/issues/' + id + '.' + this.config.format, {}, callback);
 };

 Redmine.prototype.create_project = function(id, callback) {
   this.request('GET', '/issues/' + id + '.' + this.config.format, {}, callback);
 };

 Redmine.prototype.update_project = function(id, callback) {
   this.request('GET', '/issues/' + id + '.' + this.config.format, {}, callback);
 };

 Redmine.prototype.delete_project = function(id, callback) {
   this.request('GET', '/issues/' + id + '.' + this.config.format, {}, callback);
 };*/


 /**
  * REST API for Project Users (Stable)
  */
  /*
 Redmine.prototype.users = function(id, callback) {
   this.request('GET', '/issues/' + id + '.' + this.config.format, {}, callback);
 };

 Redmine.prototype.get_user_by_id = function(id, callback) {
   this.request('GET', '/issues/' + id + '.' + this.config.format, {}, callback);
 };

 Redmine.prototype.create_user = function(id, callback) {
   this.request('GET', '/issues/' + id + '.' + this.config.format, {}, callback);
 };

 Redmine.prototype.update_user = function(id, callback) {
   this.request('GET', '/issues/' + id + '.' + this.config.format, {}, callback);
 };

 Redmine.prototype.delete_user = function(id, callback) {
   this.request('GET', '/issues/' + id + '.' + this.config.format, {}, callback);
 };
*/

 /**
  * REST API for Project Users (Stable)
  */
 Redmine.prototype.time_entries = function(id, callback) {
   this.request('GET', '/issues/' + id + '.' + this.config.format, {}, callback);
 };

 Redmine.prototype.get_time_entry_by_id = function(id, callback) {
   this.request('GET', '/issues/' + id + '.' + this.config.format, {}, callback);
 };

 Redmine.prototype.create_time_entry = function(id, callback) {
   this.request('GET', '/issues/' + id + '.' + this.config.format, {}, callback);
 };

 Redmine.prototype.update_time_entry = function(id, callback) {
   this.request('GET', '/issues/' + id + '.' + this.config.format, {}, callback);
 };

 Redmine.prototype.delete_time_entry = function(id, callback) {
   this.request('GET', '/issues/' + id + '.' + this.config.format, {}, callback);
 };

////////////////////////////////////////////////////////////////////////////////////////
module.exports = Redmine;
