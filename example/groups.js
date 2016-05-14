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


redmine.groups(function(err, data) {
  if (err) throw err;

  console.log(data);
});

/*
var group = {
  group: {
    name: 'rest-api-3-1',
    user_ids: [ 5]
  }
};
redmine.create_group(group, function(err, data) {
  if (err) throw err;

  console.log(data);
});
*/

redmine.group_by_id(73, {include: 'users, memberships'}, function(err, data) {
  if (err) throw err;

  console.log(data);
});

/*
var u_group = {
  group: {
    name: 'nodejs',
    user_ids: [ 5]
  }
};
redmine.update_group(73, u_group, function(err, data) {
  if (err) throw err;

  console.log(data);
});

redmine.delete_group(74, function(err, data) {
  if (err) throw err;

  console.log(data);
});
*/

/*
redmine.add_user_to_group(73, 9, function(err, data) {
  if (err) throw err;

  console.log(data);
});
*/

redmine.remove_user_from_group(73, 5, function(err, data) {
  if (err) throw err;

  console.log(data);
});
