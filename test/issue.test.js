/*
 * issue.test.js - test request for issues
 * Author: wayne <wayne@zanran.me>
 */

var assert = require('assert');
var Redmine = require('../lib/redmine');

///////////////////////////////////////////////////////////////
var hostname = process.env.REDMINE_HOST || 'redmine.zanran.me';
var config = {
  apiKey: process.env.REDMINE_APIKEY || 'bed1ba0544b681e530c2447341607f423c9c8781'
};

var redmine = new Redmine(hostname, config);

describe('issue.test.js', function() {

  it('test-get-issue-with-invalid-id', function(done) {

    try {
      redmine.get_issue_by_id('0', function(err, data) {
        if (err) throw err;
      });
    } catch (e) {
      assert.equal(e, 'Error: Issue ID must be an integer above 0 !');
    }
    done();
  });
/*
  it('test-get-issue-by-id-1', function(done) {

    try {
      redmine.get_issue_by_id(1, {}, function(err, data) {
        if (err) throw err;

        console.log(data);
      });
    } catch (e) {
      assert.equal(e, 'Error: Issue ID must be an integer above 0 !');
    }
    done();
  });*/
});
