/*
 * get-redmine-issue - test request for issues
 * Author: wayne <wayne@zanran.me>
 */

'use strict()';

var Redmine = require('../lib/redmine');

///////////////////////////////////////////////////////////////
var hostname = process.env.REDMINE_HOST || 'redmine.zanran.me';
var config = {
  apiKey: process.env.REDMINE_APIKEY || 'bed1ba0544b681e530c2447341607f423c9c8781',
  format: 'json'
};

var redmine = new Redmine(hostname, config);

// -----------------------------------------------------------------------------

redmine.version_by_project_id(1, function(err, data) {
  if (err) throw err;

  console.log(data);
});
/*
var version = {
  version: {
    name: 'test for version (bugfix - last)'
  }
};
redmine.create_version(4, version, function(err, data) {
  if (err) throw err;

  console.log(data);
});

/*
redmine.version_by_id(1, function(err, data) {
  if (err) throw err;

  for (var item in data.version) {
    console.log(data.version[item]);
  }
});
/*
redmine.delete_version(1, function(err, data) {
  if (err) throw err;

  console.log(data);
});
*/

redmine.queries(function(err, data) {
  if (err) throw err;

  console.log(data);
});

redmine.attachment_by_id(178, function(err, data) {
  if (err) throw err;

  console.log(data);
});

redmine.issue_statuses(function(err, data) {
  if (err) throw err;

  console.log(data);
});

redmine.trackers(function(err, data) {
  if (err) throw err;

  console.log(data);
});
