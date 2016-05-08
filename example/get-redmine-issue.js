/*
 * get-redmine-issue - test request for issues
 * Author: wayne <wayne@zanran.me>
 */

var Redmine = require('../lib/redmine');

///////////////////////////////////////////////////////////////
var hostname = process.env.REDMINE_HOST || 'redmine.zanran.me';
var config = {
  apiKey: process.env.REDMINE_APIKEY || 'bed1ba0544b681e530c2447341607f423c9c8781',
  format: 'json'
};

var redmine = new Redmine(hostname, config);

/**
 * Dump issue
 */
var dump_issue = function(issue) {
  console.log('Dumping issue:')
  for (var item in issue) {
    console.log('  ' + item + ': ' + JSON.stringify(issue[item]));
  };
};

redmine.issues({limit: 2}, function(err, data) {
  if (err) throw err;

  for (var i in data.issues) {
    dump_issue(data.issues[i]);
  }

  console.log('total_count: ' + data.total_count);
});

// add watchers
redmine.add_watcher(2, {user_id: 5}, function(err, data) {
  if (err) throw err;

  console.log(data);
});

// add watchers
redmine.remove_watcher(2, 6, function(err, data) {
  if (err) throw err;

  console.log(data);
});

redmine.update_issue(2, {subject: 'Redmine REST API by Node.js'}, function(err, data) {
  if (err) throw err;

  console.log(data);
});

// get issue by id
var params = {include: 'attachments,journals,watchers'};
redmine.get_issue_by_id(2, params, function(err, data) {
  if (err) throw err;

  dump_issue(data.issue);
});

/*
redmine.delete_issue(1, function(err, data) {
  if (err) {
    console.log(err);
    return ;
  } else {
    console.log('Delete issue #1: ' + JSON.stringify(data));
  }
});
*/
