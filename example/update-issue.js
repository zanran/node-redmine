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

/*
 * update issue
 */
var issue = {
   "issue": {
    "subject": 'Redmine REST API by Node.js',
    "assigned_to_id": 5,
    "notes": "automative update redmine notes by node js"
  }
};

redmine.update_issue(5, issue, function(err, data) {
  if (err) throw err;

  console.log(data);
});
