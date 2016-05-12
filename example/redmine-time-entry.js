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


var dump_time_entry = function(fields) {
  for (var item in fields) {
    console.log('  ' + item + ': ' + JSON.stringify(fields[item]));
  }
};

redmine.time_entries(function(err, data) {
  if (err) throw err;
/*
  console.log(data);

  for (var i in data.time_entries) {
    dump_time_entry(data.time_entries[i]);
  }*/
});


redmine.get_time_entry_by_id(4, function(err, data) {
  if (err) throw err;

  dump_time_entry(data.time_entry);
});

/*
redmine.delete_time_entry(5, function(err, data) {
  if (err) throw err;

  console.log(data);
});
*/

/*
var time_entry = {
  time_entry: {
    project_id: 7,
    hours: '3'
  }
};
redmine.create_time_entry(time_entry, function(err, data) {
  if (err) throw err;

  console.log(data);
});
*/

var time_entry_update = {
  time_entry: {
    issue_id: '12',
    hours: 3
  }
};
redmine.update_time_entry(2, time_entry_update, function(err, data) {
  if (err) throw err;

  console.log(data);
});
