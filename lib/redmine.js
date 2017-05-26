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
var request = require('request');
var Url = require('url');

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
 * @param {String} port, Redmine port (defaults to 80)
 */
function Redmine(host, config, port) {
  if (!host) throw new Error('host not specified!');

  if (typeof host === 'string') {
    host = Url.parse(host);
  } else if (typeof host !== 'object') {
    throw new Error('host should be a string or url object!');
  }
  if (port) {
    host.port = port;
    host.host += ':' + port.toString();
  }

  var baseUrl = Url.format(host);
  this._request = request.defaults({baseUrl: baseUrl});

  if (!config || !(config.apiKey || (config.username && config.password))) {
    throw new Error('You should provide an API key or username & password !');
  }
  this.config = config;
}

Redmine.prototype = {
  // get & set property
  get apiKey() {
    return this.config.apiKey;
  },
  set apiKey(apiKey) {
    this.config.apiKey = apiKey;
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
    method: method,
    qs: method === 'GET' ? params : undefined,
    body: method === 'PUT' || method === 'POST' ? params : undefined,
    headers: {
      'Content-Type': 'application/json'
    },
    // auth: { user: this.username, pass: this.password },
    json: true
  };

  // impersonate to a login user
  if (this.impersonate) {
    opts.headers['X-Redmine-Switch-User'] = this.config.impersonate;
  }

  if (this.apiKey) {
    opts.headers['X-Redmine-API-Key'] = this.config.apiKey;
  } else if (this.username && this.password) {
    opts.auth = { username: this.username, password: this.password };
  } else {
    throw new Error('Neither api key nor username/password provided !');
  }

  var req = this._request(path, opts, function(err, res, body) {
    if (err) return callback(err);

    if (res.statusCode != 200 && res.statusCode != 201) {
      var msg = {
        ErrorCode: res.statusCode,
        Message: res.statusMessage,
        Detail: body
      };
      return callback(JSON.stringify(msg));
    }

    return callback(null, body);
  });
};

/////////////////////////////////////// REST API for issues (Stable) ///////////////////////////////////////
/**
 * Listing issues
 *    Returns a paginated list of issues. By default, it returns open issues only.
 * http://www.redmine.org/projects/redmine/wiki/Rest_Issues#Listing-issues
 */
 Redmine.prototype.issues = function(params, callback) {
   this.request('GET', '/issues.json', params, callback);
 };


/**
 * Showing an issue
 * http://www.redmine.org/projects/redmine/wiki/Rest_Issues#Showing-an-issue
 */
Redmine.prototype.get_issue_by_id = function(id, params, callback) {
  if (typeof id !== 'number') throw new Error('Issue ID must be an integer above 0 !');

  this.request('GET', '/issues/' + id + '.json', params, callback);
};


/**
 * Creating an issue
 * http://www.redmine.org/projects/redmine/wiki/Rest_Issues#Creating-an-issue
 */
Redmine.prototype.create_issue = function(issue, callback) {
  this.request('POST', '/issues.json', issue, callback);
};

/**
 * Updating an issue
 * http://www.redmine.org/projects/redmine/wiki/Rest_Issues#Updating-an-issue
 */
Redmine.prototype.update_issue = function(id, issue, callback) {
  this.request('PUT', '/issues/' + id + '.json', issue, callback);
};

/**
 * Deleting an issue
 * http://www.redmine.org/projects/redmine/wiki/Rest_Issues#Deleting-an-issue
 */
Redmine.prototype.delete_issue = function(id, callback) {
  this.request('DELETE', '/issues/' + id + '.json', {}, callback);
};

/**
 * Adding a watcher
 * http://www.redmine.org/projects/redmine/wiki/Rest_Issues#Adding-a-watcher
 */
Redmine.prototype.add_watcher = function(id, params, callback) {
  if (!params.user_id) throw new Error('user_id (required): id of the user to add as a watcher !');

  this.request('POST', '/issues/' + id + '/watchers.json', params, callback);
};

/**
 * Removing a watcher
 * http://www.redmine.org/projects/redmine/wiki/Rest_Issues#Removing-a-watcher
 */
Redmine.prototype.remove_watcher = function(issue_id, user_id, callback) {
  this.request('DELETE', '/issues/' + issue_id + '/watchers/' + user_id + '.json', {}, callback);
};


/////////////////////////////////////// REST API for Projects (Stable) ///////////////////////////////////////
/**
 * Listing projects
 * http://www.redmine.org/projects/redmine/wiki/Rest_Projects#Listing-projects
 */
Redmine.prototype.projects = function(params, callback) {
 this.request('GET', '/projects.json', params, callback);
};

/**
 * Showing a project
 * http://www.redmine.org/projects/redmine/wiki/Rest_Projects#Showing-a-project
 */
Redmine.prototype.get_project_by_id = function(id, params, callback) {
 this.request('GET', '/projects/' + id + '.json', params, callback);
};

/**
 * Creating a project
 * http://www.redmine.org/projects/redmine/wiki/Rest_Projects#Creating-a-project
 */
Redmine.prototype.create_project = function(params, callback) {
 this.request('POST', '/projects.json', params, callback);
};

/**
 * Updating a project - Updates the project of given id or identifier
 * http://www.redmine.org/projects/redmine/wiki/Rest_Projects#Updating-a-project
 */
Redmine.prototype.update_project = function(id, params, callback) {
 this.request('PUT', '/projects/' + id + '.json', params, callback);
};

/**
 * Deleting a project - Deletes the project of given id or identifier
 * http://www.redmine.org/projects/redmine/wiki/Rest_Projects#Deleting-a-project
 */
Redmine.prototype.delete_project = function(id, callback) {
 this.request('DELETE', '/projects/' + id + '.json', {}, callback);
};


/////////////////////////////////////// REST API for Users (Stable) ///////////////////////////////////////
/**
 * list Users
 * http://www.redmine.org/projects/redmine/wiki/Rest_Users#GET
 */
Redmine.prototype.users = function(params, callback) {
 this.request('GET', '/users.json', params, callback);
};

/**
 * Returns the user details
 * http://www.redmine.org/projects/redmine/wiki/Rest_Users#GET-2
 */
Redmine.prototype.get_user_by_id = function(id, params, callback) {
 this.request('GET', '/users/' + id + '.json', params, callback);
};

/**
 * Returns current user details
 * http://www.redmine.org/projects/redmine/wiki/Rest_Users#GET-2
 */
Redmine.prototype.current_user = function(params, callback) {
 this.request('GET', '/users/current.json', params, callback);
};

/**
 * create user
 * http://www.redmine.org/projects/redmine/wiki/Rest_Users#POST
 */
Redmine.prototype.create_user = function(params, callback) {
 this.request('POST', '/users.json', params, callback);
};

/**
 * update user
 * http://www.redmine.org/projects/redmine/wiki/Rest_Users#PUT
 */
Redmine.prototype.update_user = function(id, params, callback) {
 this.request('PUT', '/users/' + id + '.json', params, callback);
};

/**
 * Deleting user
 * http://www.redmine.org/projects/redmine/wiki/Rest_Users#DELETE
 */
Redmine.prototype.delete_user = function(id, callback) {
 this.request('DELETE', '/users/' + id + '.json', {}, callback);
};


/////////////////////////////////////// REST API for Time Entries (Stable) ///////////////////////////////////////
/**
 * Listing time entries
 * http://www.redmine.org/projects/redmine/wiki/Rest_TimeEntries#Listing-time-entries
 */
Redmine.prototype.time_entries = function(params, callback) {
  this.request('GET', '/time_entries.json', params, callback);
};

/**
 * Showing a time entry
 * http://www.redmine.org/projects/redmine/wiki/Rest_TimeEntries#Showing-a-time-entry
 */
Redmine.prototype.get_time_entry_by_id = function(id, callback) {
  this.request('GET', '/time_entries/' + id + '.json', {}, callback);
};

/**
 * Creating a time entry
 * http://www.redmine.org/projects/redmine/wiki/Rest_TimeEntries#Creating-a-time-entry
 */
Redmine.prototype.create_time_entry = function(params, callback) {
  this.request('POST', '/time_entries.json', params, callback);
};

/**
 * Updating a time entry
 * http://www.redmine.org/projects/redmine/wiki/Rest_TimeEntries#Updating-a-time-entry
 */
Redmine.prototype.update_time_entry = function(id, params, callback) {
  this.request('PUT', '/time_entries/' + id + '.json', params, callback);
};

/**
 * Deleting a time entry
 * http://www.redmine.org/projects/redmine/wiki/Rest_TimeEntries#Deleting-a-time-entry
 */
Redmine.prototype.delete_time_entry = function(id, callback) {
  this.request('DELETE', '/time_entries/' + id + '.json', {}, callback);
};


/////////////////////////////////////// REST API for Project Memberships (Alpha) ///////////////////////////////////////
/**
 * Returns a paginated list of the project memberships. :project_id can be either the project numerical id or the project identifier.
 * http://www.redmine.org/projects/redmine/wiki/Rest_Memberships#GET
 */
Redmine.prototype.membership_by_project_id = function(id, params, callback) {
  this.request('GET', '/projects/' + id + '/memberships.json', params, callback);
};

/**
 * Adds a project member
 * http://www.redmine.org/projects/redmine/wiki/Rest_Memberships#POST
 */
Redmine.prototype.create_project_membership = function(id, params, callback) {
  this.request('POST', '/projects/' + id + '/memberships.json', params, callback);
};

/**
 * Returns the membership of given :id.
 * http://www.redmine.org/projects/redmine/wiki/Rest_Memberships#GET-2
 */
Redmine.prototype.project_membership_by_id = function(id,params, callback) {
  this.request('GET', '/memberships/' + id + '.json', params, callback);
};

/**
 * Updates the membership of given :id. Only the roles can be updated, the project and the user of a membership are read-only.
 * http://www.redmine.org/projects/redmine/wiki/Rest_Memberships#PUT
 */
Redmine.prototype.update_project_membership = function(id, params, callback) {
  this.request('PUT', '/memberships/' + id + '.json', params, callback);
};

/**
 * Deletes a memberships
 * http://www.redmine.org/projects/redmine/wiki/Rest_Memberships#DELETE
 */
Redmine.prototype.delete_project_membership = function(id, callback) {
  this.request('DELETE', '/memberships/' + id + '.json', {}, callback);
};


/////////////////////////////////////// REST API for Issue Relations (Alpha) ///////////////////////////////////////
/**
 * Returns the relations for the issue of given id (:issue_id).
 * http://www.redmine.org/projects/redmine/wiki/Rest_IssueRelations#GET
 */
Redmine.prototype.issue_relation_by_issue_id = function(id, callback) {
  this.request('GET', '/issues/' + id + '/relations.json', {}, callback);
};

/**
 * Creates a relation for the issue of given id (:issue_id).
 * http://www.redmine.org/projects/redmine/wiki/Rest_IssueRelations#POST
 */
Redmine.prototype.create_issue_relation = function(id, params, callback) {
  this.request('POST', '/issues/' + id + '/relations.json', params, callback);
};

/**
 * Returns the relation of given id.
 * http://www.redmine.org/projects/redmine/wiki/Rest_IssueRelations#GET-2
 */
Redmine.prototype.issue_relation_by_id = function(id, callback) {
  this.request('GET', '/relations/' + id + '.json', {}, callback);
};

/**
 * Deletes the relation of given id.
 * http://www.redmine.org/projects/redmine/wiki/Rest_IssueRelations#DELETE
 */
Redmine.prototype.delete_issue_relation = function(id, callback) {
 this.request('DELETE', '/relations/' + id + '.json', {}, callback);
};


/////////////////////////////////////// REST API for News (Prototype) ///////////////////////////////////////
/**
 * Returns all news across all projects with pagination
 * http://www.redmine.org/projects/redmine/wiki/Rest_News#GET
 */
Redmine.prototype.news = function(params,callback) {
  this.request('GET', '/news.json', params, callback);
};

/**
 * Returns all news from project with given id or identifier with pagination.
 * http://www.redmine.org/projects/redmine/wiki/Rest_News#GET-2
 */
Redmine.prototype.new_by_project_id = function(id, callback) {
  this.request('GET', '/projects/' + id + '/news.json', {}, callback);
};


/////////////////////////////////////// REST API for Versions (Alpha) ///////////////////////////////////////
/**
 * Returns the versions available for the project of given id or identifier (:project_id).
 *    The response may include shared versions from other projects.
 * http://www.redmine.org/projects/redmine/wiki/Rest_Versions#GET
 */
Redmine.prototype.version_by_project_id = function(id, callback) {
  this.request('GET', '/projects/' + id + '/versions.json', {}, callback);
};

/**
 * Creates a version for the project of given id or identifier (:project_id).
 * http://www.redmine.org/projects/redmine/wiki/Rest_Versions#POST
 */
Redmine.prototype.create_version = function(id, params, callback) {
  this.request('POST', '/projects/' + id + '/versions.json', params, callback);
};

/**
 * Returns the version of given id
 * http://www.redmine.org/projects/redmine/wiki/Rest_Versions#GET-2
 */
Redmine.prototype.version_by_id = function(id, callback) {
  this.request('GET', '/versions/' + id + '.json', {}, callback);
};

/**
 * Updates the version of given id
 * http://www.redmine.org/projects/redmine/wiki/Rest_Versions#PUT
 */
Redmine.prototype.update_version = function(id, params, callback) {
  this.request('PUT', '/versions/' + id + '.json', params, callback);
};

/**
 * Deletes the version of given id
 * http://www.redmine.org/projects/redmine/wiki/Rest_Versions#DELETE
 */
Redmine.prototype.delete_version = function(id, callback) {
  this.request('DELETE', '/versions/' + id + '.json', {}, callback);
};


/////////////////////////////////////// REST API for Wiki Pages (Alpha) ///////////////////////////////////////
/**
 * Getting the pages list of a wiki
 * http://www.redmine.org/projects/redmine/wiki/Rest_WikiPages#Wiki-Pages
 */
Redmine.prototype.wiki_by_project_id = function(id, callback) {
  this.request('GET', '/projects/' + id + '/wiki/index.json', {}, callback);
};

/**
 * Getting a wiki page
 * http://www.redmine.org/projects/redmine/wiki/Rest_WikiPages#Getting-a-wiki-page
 */
Redmine.prototype.wiki_by_title = function(id, title, params, callback) {
  this.request('GET', '/projects/' + id + '/wiki/' + title + '.json', params, callback);
};

/**
 * Getting an old version of a wiki page
 * http://www.redmine.org/projects/redmine/wiki/Rest_WikiPages#Getting-an-old-version-of-a-wiki-page
 */
Redmine.prototype.wiki_history_by_title = function(id, title, version, params, callback) {
  this.request('GET', '/projects/' + id + '/wiki/' + title + '/' + version + '.json', params, callback);
};

/**
 * Creating or updating a wiki page
 * http://www.redmine.org/projects/redmine/wiki/Rest_WikiPages#Creating-or-updating-a-wiki-page
 */
Redmine.prototype.create_wiki = function(id, title, params, callback) {
  this.request('PUT', '/projects/' + id + '/wiki/' + title + '.json', params, callback);
};

/**
 * Deletes the issue category of given id.
 * http://www.redmine.org/projects/redmine/wiki/Rest_IssueCategories#DELETE
 */
Redmine.prototype.delete_wiki = function(id, title, callback) {
  this.request('DELETE', '/projects/' + id + '/wiki/' + title + '.json', {}, callback);
};


/////////////////////////////////////// REST API for Queries (Alpha) ///////////////////////////////////////
/**
 * Returns the list of all custom queries visible by the user (public and private queries) for all projects.
 * http://www.redmine.org/projects/redmine/wiki/Rest_Queries#GET
 */
Redmine.prototype.queries = function(params,callback) {
  this.request('GET', '/queries.json', params, callback);
};


/////////////////////////////////////// REST API for Attachments (Beta) ///////////////////////////////////////
/**
 * Returns the description of the attachment of given id.
 *  The file can actually be downloaded at the URL given by the content_url attribute in the response.
 * http://www.redmine.org/projects/redmine/wiki/Rest_Attachments#GET
 */
Redmine.prototype.attachment_by_id = function(id, callback) {
  this.request('GET', '/attachments/' + id + '.json', {}, callback);
};


/////////////////////////////////////// REST API for Issue Statuses (Alpha) ///////////////////////////////////////
/**
 * Returns the list of all issue statuses.
 * http://www.redmine.org/projects/redmine/wiki/Rest_IssueStatuses#GET
 */
Redmine.prototype.issue_statuses = function(callback) {
  this.request('GET', '/issue_statuses.json', {}, callback);
};


/////////////////////////////////////// REST API for Trackers (Alpha) ///////////////////////////////////////
/**
 * Returns the list of all trackers.
 * http://www.redmine.org/projects/redmine/wiki/Rest_Trackers#GET
 */
Redmine.prototype.trackers = function(callback) {
  this.request('GET', '/trackers.json', {}, callback);
};


/////////////////////////////////////// REST API for Enumerations (Alpha) ///////////////////////////////////////
/**
 * Returns the list of issue priorities.
 * http://www.redmine.org/projects/redmine/wiki/Rest_Enumerations#GET
 */
Redmine.prototype.issue_priorities = function(callback) {
  this.request('GET', '/enumerations/issue_priorities.json', {}, callback);
};

/**
 * Returns the list of time entry activities.
 * http://www.redmine.org/projects/redmine/wiki/Rest_Enumerations#GET-2
 */
Redmine.prototype.time_entry_activities = function(callback) {
  this.request('GET', '/enumerations/time_entry_activities.json', {}, callback);
};


/////////////////////////////////////// REST API for Issue Categories (Alpha) ///////////////////////////////////////
/**
 * Returns the issue categories available for the project of given id or identifier (:project_id).
 * http://www.redmine.org/projects/redmine/wiki/Rest_IssueCategories#GET
 */
Redmine.prototype.issue_categories_by_project_id = function(id, callback) {
  this.request('GET', '/projects/' + id + '/issue_categories.json', {}, callback);
};

/**
 * Creates an issue category for the project of given id or identifier (:project_id).
 * http://www.redmine.org/projects/redmine/wiki/Rest_IssueCategories#POST
 */
Redmine.prototype.create_issue_category = function(id, params, callback) {
  this.request('POST', '/projects/' + id + '/issue_categories.json', params, callback);
};

/**
 * Returns the issue category of given id.
 * http://www.redmine.org/projects/redmine/wiki/Rest_IssueCategories#GET-2
 */
Redmine.prototype.issue_category_by_id = function(id, callback) {
  this.request('GET', '/issue_categories/' + id + '.json', {}, callback);
};

/**
 * Updates the issue category of given id
 * http://www.redmine.org/projects/redmine/wiki/Rest_IssueCategories#PUT
 */
Redmine.prototype.update_issue_category = function(id, params, callback) {
  this.request('PUT', '/issue_categories/' + id + '.json', params, callback);
};

/**
 * Deletes the issue category of given id.
 * http://www.redmine.org/projects/redmine/wiki/Rest_IssueCategories#DELETE
 */
Redmine.prototype.delete_issue_category = function(id, callback) {
  this.request('DELETE', '/issue_categories/' + id + '.json', {}, callback);
};


/////////////////////////////////////// REST API for Roles (Alpha) ///////////////////////////////////////
/**
 * Returns the list of roles.
 * http://www.redmine.org/projects/redmine/wiki/Rest_Roles#GET
 */
Redmine.prototype.roles = function(callback) {
  this.request('GET', '/roles.json', {}, callback);
};

/**
 * Returns the list of permissions for a given role
 * http://www.redmine.org/projects/redmine/wiki/Rest_Roles#GET-2
 */
Redmine.prototype.role_by_id = function(id, callback) {
  this.request('GET', '/roles/' + id + '.json', {}, callback);
};


/////////////////////////////////////// REST API for Groups (Alpha) ///////////////////////////////////////
/**
 * Returns the list of Groups
 * http://www.redmine.org/projects/redmine/wiki/Rest_Groups#groupsformat
 */
Redmine.prototype.groups = function (callback) {
  this.request('GET', '/groups.json', {}, callback);
};

/**
 * Creates a Group
 * http://www.redmine.org/projects/redmine/wiki/Rest_Groups#POST
 */
Redmine.prototype.create_group = function (params, callback) {
  this.request('POST', '/groups.json', params, callback);
};

/**
 * Returns details of a group.
 * http://www.redmine.org/projects/redmine/wiki/Rest_Groups#GET-2
 */
Redmine.prototype.group_by_id = function (id, params, callback) {
  this.request('GET', '/groups/' + id + '.json', params, callback);
};

/**
 * Updates an existing group
 * http://www.redmine.org/projects/redmine/wiki/Rest_Groups#PUT
 */
Redmine.prototype.update_group = function (id, params, callback) {
  this.request('PUT', '/groups/' + id + '.json', params, callback);
};

/**
 * Deletes an existing group
 * http://www.redmine.org/projects/redmine/wiki/Rest_Groups#DELETE
 */
Redmine.prototype.delete_group = function (id, callback) {
  this.request('DELETE', '/groups/' + id + '.json', {}, callback);
};

/**
 * Adds an existing user to a group
 * http://www.redmine.org/projects/redmine/wiki/Rest_Groups#POST-2
 */
Redmine.prototype.add_user_to_group = function (group_id, user_id, callback) {
  var params = {
    user_id: user_id
  };
  this.request('POST', '/groups/' + group_id + '/users.json', params, callback);
};

/**
 * Removes a user from a group
 * http://www.redmine.org/projects/redmine/wiki/Rest_Groups#DELETE-2
 */
Redmine.prototype.remove_user_from_group = function (group_id, user_id, callback) {
  this.request('DELETE', '/groups/' + group_id + '/users/' + user_id + '.json', {}, callback);
};

/////////////////////////////////////// REST API for Custom Fields (Alpha) ///////////////////////////////////////
/**
 * Get custom fields
 * http://www.redmine.org/projects/redmine/wiki/Rest_CustomFields#GET
 */
Redmine.prototype.custom_fields = function (callback) {
  this.request('GET', '/custom_fields.json', {}, callback);
};


/////////////////////////////////////// REST API for Search (Alpha) ///////////////////////////////////////
// http://www.redmine.org/projects/redmine/wiki/Rest_Search
// Not documented yet.


/////////////////////////////////////// REST API for Common (Alpha) ///////////////////////////////////////
/**
 * upload a file to redmine
 * http://www.redmine.org/projects/redmine/wiki/Rest_WikiPages#Attaching-files
 */
/*
Redmine.prototype.upload = function(filepath, callback) {
  this.request('POST', '/uploads.json', {}, callback);
};
*/

////////////////////////////////////////////////////////////////////////////////////////
module.exports = Redmine;
