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


var dump_fields = function(fields) {
  console.log('Dumping Custom Fields:');
  for (var item in fields) {
    console.log('  ' + item + ': ' + JSON.stringify(fields[item]));
  }
};

redmine.custom_fields(function(err, data) {
  if (err) throw err;

  console.log(data);

  for (var i in data.custom_fields) {
    dump_fields(data.custom_fields[i]);
  }
});
