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

redmine.membership_by_project_id(1, function(err, data) {
  if (err) throw err;

  console.log(data);
});


redmine.project_membership_by_id(1, function(err, data) {
  if (err) throw err;

  for (var item in data.membership) {
    console.log(data.membership[item]);
  }
});

/*
redmine.delete_project_membership(2, function(err, data) {
  if (err) throw err;

  console.log(data);
});
*/
/*
var membership = {
  role_ids: {
    role_id: 5
  }
};
redmine.update_project_membership(1, membership, function(err, data) {
  if (err) throw err;

  console.log(data);
});


var membership = {
  user_id: 5,
  role_ids: [2]
};
redmine.create_project_membership(5, membership, function(err, data) {
  if (err) throw err;

  console.log(data);
});
*/
