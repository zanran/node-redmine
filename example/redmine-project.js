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


var dump_project = function(project) {
  console.log('Dumping project:');
  for (var item in project) {
    console.log('  ' + item + ': ' + JSON.stringify(project[item]));
  }
};

redmine.projects({include: "trackers, issue_categories, enabled_modules"}, function(err, data) {
  if (err) throw err;

  console.log(data);

  for (var i in data.projects) {
    dump_project(data.projects[i]);
  }

  console.log('total_count: ' + data.total_count);
});


redmine.get_project_by_id(5, {include: "trackers, issue_categories, enabled_modules"}, function(err, data) {
  if (err) throw err;

  console.log(data);

  dump_project(data.project);
});

/*
var project = {
  project: {
    name: 'TEST PROJECT FOR REST API - 2',
    identifier: 'test-rest-api-2',
    enabled_module_names: ['boards', 'calendar', 'documents', 'files', 'gantt', 'issue_tracking', 'news']
  }
};
redmine.create_project(project, function(err, data) {
  if (err) throw err;

  console.log(data);
});


var project = {
  project: {
    name: 'TEST PROJECT FOR REST API - 5',
    enabled_module_names: ['wiki', 'issue_tracking', 'news']
  }
};
redmine.update_project('test-rest-api-2', project, function(err, data) {
  if (err) throw err;

  console.log(data);
});


redmine.delete_project('6', function(err, data) {
  if (err) {
    console.log(err);
    return ;
  } else {
    console.log('Delete project #1: ' + JSON.stringify(data));
  }
});
*/
