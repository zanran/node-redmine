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

redmine.issue_relation_by_issue_id(5, function(err, data) {
  if (err) throw err;

  console.log(data);
});


redmine.issue_relation_by_id(1, function(err, data) {
  if (err) throw err;

  console.log(data);
});

/*
redmine.delete_issue_relation(19, function(err, data) {
  if (err) throw err;

  console.log(data);
});
*/

var relations = {
  relation: {
    issue_to_id: 77,
    relation_type: 'duplicates'
  }
};
redmine.create_issue_relation(5, relations, function(err, data) {
  if (err) throw err;

  console.log(data);
});
