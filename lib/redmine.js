/*!
 * node-redmine
 * A nodejs library which supports 100% features of Redmine's REST API.
 * Author: zanran <wayne@zanran.me>
 * Reference: http://www.redmine.org/projects/redmine/wiki/Rest_api
 */

 'use strict()';

/**
 * Module dependencies
 */
var http = require('http');
var debug = require('debug')('node-redmine');
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
 *  - {String} impersonate, impersonate to a login user.
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
  this.config.format = 'json';

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
  },
  get password() {
    return this.config.password;
  },
  set password(password) {
    this.config.password = password;
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
    headers: {}
  };

  // add auth for access redmine
  if (this.apiKey) {
    opts.headers['X-Redmine-API-Key'] = this.config.apiKey;
  } else if (this.username && this.password) {
    opts.auth = this.username + ':' + this.password;
  } else {
    throw new Error('Neither api key nor username/password provided !');
  }

  // impersonate to a login user
  if (this.impersonate) {
    opts.headers['X-Redmine-Switch-User'] = this.config.impersonate;
  }

  var req = http.request(opts, function(res) {
    if (res.statusCode != 200 && res.statusCode != 201) {
      callback('Server returns : ' + res.statusMessage + ' (' + String(res.statusCode) + ')', null);
      callback = null;
      return ;
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
        data = {statusCode: res.statusCode, statusMessage: res.statusMessage };
      }
      callback(null, data);
      callback = null;
      return ;
    });
  });

  req.on('error', function(err) {
    callback(err, null);
    callback = null;
    return ;
  });

  if ('PUT' == method || 'POST' == method) {
    // add post data for POST and PUT
    var data = JSON.stringify(params);
    req.setHeader('Content-Length', data.length);
    req.setHeader('Content-Type', this.config.format == 'json' ? 'application/json' : 'application/xml');
    req.write(data);
  }

  req.end();
};


/////////////////////////////////////// REST API for issues (Stable) ///////////////////////////////////////
/**
 * Listing issues
 *    Returns a paginated list of issues. By default, it returns open issues only.
 * http://www.redmine.org/projects/redmine/wiki/Rest_Issues#Listing-issues
 */
Redmine.prototype.get_issue_by_id = function(id, params, callback) {
  if (typeof id !== 'number') throw new Error('Issue ID must be an integer above 0 !');

  this.request('GET', '/issues/' + id + '.' + this.config.format, params, callback);
};

/**
 * Showing an issue
 * http://www.redmine.org/projects/redmine/wiki/Rest_Issues#Showing-an-issue
 */
Redmine.prototype.issues = function(params, callback) {
  this.request('GET', '/issues' + '.' + this.config.format, params, callback);
};

/**
 * Creating an issue
 * http://www.redmine.org/projects/redmine/wiki/Rest_Issues#Creating-an-issue
 */
Redmine.prototype.create_issue = function(issue, callback) {
  this.request('POST', '/issues.' + this.config.format, issue, callback);
};

/**
 * Updating an issue
 * http://www.redmine.org/projects/redmine/wiki/Rest_Issues#Updating-an-issue
 */
Redmine.prototype.update_issue = function(id, issue, callback) {
  this.request('PUT', '/issues/' + id + '.' + this.config.format, issue, callback);
};

/**
 * Deleting an issue
 * http://www.redmine.org/projects/redmine/wiki/Rest_Issues#Deleting-an-issue
 */
Redmine.prototype.delete_issue = function(id, callback) {
  this.request('DELETE', '/issues/' + id + '.' + this.config.format, {}, callback);
};

/**
 * Adding a watcher
 * http://www.redmine.org/projects/redmine/wiki/Rest_Issues#Adding-a-watcher
 */
Redmine.prototype.add_watcher = function(id, params, callback) {
  if (!params.user_id) throw new Error('user_id (required): id of the user to add as a watcher !');

  this.request('POST', '/issues/' + id + '/watchers.' + this.config.format, params, callback);
};

/**
 * Removing a watcher
 * http://www.redmine.org/projects/redmine/wiki/Rest_Issues#Removing-a-watcher
 */
Redmine.prototype.remove_watcher = function(issue_id, user_id, callback) {
  this.request('DELETE', '/issues/' + issue_id + '/watchers/' + user_id + '.' + this.config.format, {}, callback);
};


/////////////////////////////////////// REST API for Projects (Stable) ///////////////////////////////////////
/**
 * Listing projects
 * http://www.redmine.org/projects/redmine/wiki/Rest_Projects#Listing-projects
 */
Redmine.prototype.projects = function(params, callback) {
 this.request('GET', '/projects.' + this.config.format, params, callback);
};

/**
 * Showing a project
 * http://www.redmine.org/projects/redmine/wiki/Rest_Projects#Showing-a-project
 */
Redmine.prototype.get_project_by_id = function(id, params, callback) {
 this.request('GET', '/projects/' + id + '.' + this.config.format, params, callback);
};

/**
 * Creating a project
 * http://www.redmine.org/projects/redmine/wiki/Rest_Projects#Creating-a-project
 */
Redmine.prototype.create_project = function(params, callback) {
 this.request('POST', '/projects.' + this.config.format, params, callback);
};

/**
 * Updating a project - Updates the project of given id or identifier
 * http://www.redmine.org/projects/redmine/wiki/Rest_Projects#Updating-a-project
 */
Redmine.prototype.update_project = function(id, params, callback) {
 this.request('PUT', '/projects/' + id + '.' + this.config.format, params, callback);
};

/**
 * Deleting a project - Deletes the project of given id or identifier
 * http://www.redmine.org/projects/redmine/wiki/Rest_Projects#Deleting-a-project
 */
Redmine.prototype.delete_project = function(id, callback) {
 this.request('DELETE', '/projects/' + id + '.' + this.config.format, {}, callback);
};


/////////////////////////////////////// REST API for Users (Stable) ///////////////////////////////////////
/**
 * list Users
 * http://www.redmine.org/projects/redmine/wiki/Rest_Users#GET
 */
Redmine.prototype.users = function(params, callback) {
 this.request('GET', '/users.' + this.config.format, params, callback);
};

/**
 * Returns the user details
 * http://www.redmine.org/projects/redmine/wiki/Rest_Users#GET-2
 */
Redmine.prototype.get_user_by_id = function(id, params, callback) {
 this.request('GET', '/users/' + id + '.' + this.config.format, params, callback);
};

/**
 * Returns current user details
 * http://www.redmine.org/projects/redmine/wiki/Rest_Users#GET-2
 */
Redmine.prototype.current_user = function(params, callback) {
 this.request('GET', '/users/current.' + this.config.format, params, callback);
};

/**
 * create user
 * http://www.redmine.org/projects/redmine/wiki/Rest_Users#POST
 */
Redmine.prototype.create_user = function(params, callback) {
 this.request('POST', '/users.' + this.config.format, params, callback);
};

/**
 * update user
 * http://www.redmine.org/projects/redmine/wiki/Rest_Users#PUT
 */
Redmine.prototype.update_user = function(id, params, callback) {
 this.request('PUT', '/users/' + id + '.' + this.config.format, params, callback);
};

/**
 * Deleting user
 * http://www.redmine.org/projects/redmine/wiki/Rest_Users#DELETE
 */
Redmine.prototype.delete_user = function(id, callback) {
 this.request('DELETE', '/users/' + id + '.' + this.config.format, {}, callback);
};


/////////////////////////////////////// REST API for Time Entries (Stable) ///////////////////////////////////////
/**
 * Listing time entries
 * http://www.redmine.org/projects/redmine/wiki/Rest_TimeEntries#Listing-time-entries
 */
Redmine.prototype.time_entries = function(callback) {
  this.request('GET', '/time_entries.' + this.config.format, {}, callback);
};

/**
 * Showing a time entry
 * http://www.redmine.org/projects/redmine/wiki/Rest_TimeEntries#Showing-a-time-entry
 */
Redmine.prototype.get_time_entry_by_id = function(id, callback) {
  this.request('GET', '/time_entries/' + id + '.' + this.config.format, {}, callback);
};

/**
 * Creating a time entry
 * http://www.redmine.org/projects/redmine/wiki/Rest_TimeEntries#Creating-a-time-entry
 */
Redmine.prototype.create_time_entry = function(params, callback) {
  this.request('POST', '/time_entries.' + this.config.format, params, callback);
};

/**
 * Updating a time entry
 * http://www.redmine.org/projects/redmine/wiki/Rest_TimeEntries#Updating-a-time-entry
 */
Redmine.prototype.update_time_entry = function(id, params, callback) {
  this.request('PUT', '/time_entries/' + id + '.' + this.config.format, params, callback);
};

/**
 * Deleting a time entry
 * http://www.redmine.org/projects/redmine/wiki/Rest_TimeEntries#Deleting-a-time-entry
 */
Redmine.prototype.delete_time_entry = function(id, callback) {
  this.request('DELETE', '/time_entries/' + id + '.' + this.config.format, {}, callback);
};


/////////////////////////////////////// REST API for Project Memberships (Alpha) ///////////////////////////////////////
/**
 * Returns a paginated list of the project memberships. :project_id can be either the project numerical id or the project identifier.
 * http://www.redmine.org/projects/redmine/wiki/Rest_Memberships#GET
 */
Redmine.prototype.membership_by_project_id = function(id, callback) {
  this.request('GET', '/projects/' + id + '/memberships.' + this.config.format, {}, callback);
};

/**
 * Adds a project member
 * http://www.redmine.org/projects/redmine/wiki/Rest_Memberships#POST
 */
Redmine.prototype.create_project_membership = function(id, params, callback) {
  this.request('POST', '/projects/' + id + '/memberships.' + this.config.format, params, callback);
};

/**
 * Returns the membership of given :id.
 * http://www.redmine.org/projects/redmine/wiki/Rest_Memberships#GET-2
 */
Redmine.prototype.project_membership_by_id = function(id, callback) {
  this.request('GET', '/memberships/' + id + '.' + this.config.format, {}, callback);
};

/**
 * Updates the membership of given :id. Only the roles can be updated, the project and the user of a membership are read-only.
 * http://www.redmine.org/projects/redmine/wiki/Rest_Memberships#PUT
 */
Redmine.prototype.update_project_membership = function(id, params, callback) {
  this.request('PUT', '/memberships/' + id + '.' + this.config.format, params, callback);
};

/**
 * Deletes a memberships
 * http://www.redmine.org/projects/redmine/wiki/Rest_Memberships#DELETE
 */
Redmine.prototype.delete_project_membership = function(id, callback) {
  this.request('DELETE', '/memberships/' + id + '.' + this.config.format, {}, callback);
};


/////////////////////////////////////// REST API for Issue Relations (Alpha) ///////////////////////////////////////
/**
 * Returns the relations for the issue of given id (:issue_id).
 * http://www.redmine.org/projects/redmine/wiki/Rest_IssueRelations#GET
 */
Redmine.prototype.issue_relation_by_issue_id = function(id, callback) {
  this.request('GET', '/issues/' + id + '/relations.' + this.config.format, {}, callback);
};

/**
 * Creates a relation for the issue of given id (:issue_id).
 * http://www.redmine.org/projects/redmine/wiki/Rest_IssueRelations#POST
 */
Redmine.prototype.create_issue_relation = function(id, params, callback) {
  this.request('POST', '/issues/' + id + '/relations.' + this.config.format, params, callback);
};

/**
 * Returns the relation of given id.
 * http://www.redmine.org/projects/redmine/wiki/Rest_IssueRelations#GET-2
 */
Redmine.prototype.issue_relation_by_id = function(id, callback) {
  this.request('GET', '/relations/' + id + '.' + this.config.format, {}, callback);
};

/**
 * Deletes the relation of given id.
 * http://www.redmine.org/projects/redmine/wiki/Rest_IssueRelations#DELETE
 */
Redmine.prototype.delete_issue_relation = function(id, callback) {
 this.request('DELETE', '/relations/' + id + '.' + this.config.format, {}, callback);
};


/////////////////////////////////////// REST API for News (Prototype) ///////////////////////////////////////
/**
 * Returns all news across all projects with pagination
 * http://www.redmine.org/projects/redmine/wiki/Rest_News#GET
 */
Redmine.prototype.news = function(callback) {
  this.request('GET', '/news.' + this.config.format, {}, callback);
};

/**
 * Returns all news from project with given id or identifier with pagination.
 * http://www.redmine.org/projects/redmine/wiki/Rest_News#GET-2
 */
Redmine.prototype.new_by_project_id = function(id, callback) {
  this.request('GET', '/projects/' + id + '/news.' + this.config.format, {}, callback);
};


/////////////////////////////////////// REST API for Versions (Alpha) ///////////////////////////////////////
/////////////////////////////////////// REST API for Wiki Pages (Alpha) ///////////////////////////////////////
/////////////////////////////////////// REST API for Queries (Alpha) ///////////////////////////////////////
/////////////////////////////////////// REST API for Attachments (Beta) ///////////////////////////////////////
/////////////////////////////////////// REST API for Issue Statuses (Alpha) ///////////////////////////////////////
/////////////////////////////////////// REST API for Trackers (Alpha) ///////////////////////////////////////
/////////////////////////////////////// REST API for Enumerations (Alpha) ///////////////////////////////////////
/////////////////////////////////////// REST API for Issue Categories (Alpha) ///////////////////////////////////////
/////////////////////////////////////// REST API for Roles (Alpha) ///////////////////////////////////////
/////////////////////////////////////// REST API for Groups (Alpha) ///////////////////////////////////////


/////////////////////////////////////// REST API for Custom Fields (Alpha) ///////////////////////////////////////
/**
 * Get custom fields
 * http://www.redmine.org/projects/redmine/wiki/Rest_CustomFields#GET
 */
Redmine.prototype.custom_fields = function (callback) {
  this.request('GET', '/custom_fields.' + this.config.format, {}, callback);
};


/////////////////////////////////////// REST API for Search (Alpha) ///////////////////////////////////////
// http://www.redmine.org/projects/redmine/wiki/Rest_Search
// Not documented yet.


////////////////////////////////////////////////////////////////////////////////////////
module.exports = Redmine;
