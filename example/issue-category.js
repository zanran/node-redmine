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
var dump_obj = function(obj) {
  for (var item in obj) {
    console.log('  ' + item + ': ' + JSON.stringify(obj[item]));
  }
};

/*
redmine.projects({include: "issue_categories"}, function(err, data) {
  if (err) throw err;

  for (var i in data.projects) {
    dump_project(data.projects[i]);
  }

  console.log('total_count: ' + data.total_count);
});
*/
redmine.issue_categories_by_project_id(1, function(err, data) {
  if (err) throw err;

  dump_obj(data.issue_categories);
});

/*
var issue_category = {
  issue_category: {
    name: 'rest api',
    assigned_to_id: 5
  }
};
redmine.create_issue_category(1, issue_category, function(err, data) {
  if (err) throw err;

  console.log(data);
});
*/

redmine.issue_category_by_id(1, function(err, data) {
  if (err) throw err;

  dump_obj(data.issue_categories);
});
/*
var issue_category = {
  issue_category: {
    name: 'rest api - 2',
    assigned_to_id: 5
  }
};
redmine.update_issue_category(1, issue_category, function(err, data) {
  if (err) throw err;

  console.log(data);
});


redmine.delete_issue_category(1, function(err, data) {
  if (err) throw err;

  console.log(data);
});
*/
