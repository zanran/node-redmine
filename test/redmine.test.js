/*
 * redmine.test.js - test request for redmine
 * Author: wayne <wayne@zanran.me>
 */

var assert = require('assert');
var Redmine = require('../lib/redmine');


///////////////////////////////////////////////////////////////
var hostname = process.env.REDMINE_HOST || 'localhost';
var config = {
  apiKey: process.env.REDMINE_APIKEY || 'my-redmine-api-key'
};

describe('redmine.test.js', function() {
  it('test-empty-confgi', function(done) {
    try {
      new Redmine();
    } catch (e) {
      assert.equal(e, 'Error: Invalidate hostname !');
    }

    done();
  });

  it('test-invalid-hostname-1', function(done) {
    try {
      new Redmine({});
    } catch (e) {
      assert.equal(e, 'Error: hostname should be a String !');
    }
    done();
  });

  it('test-invalid-hostname-2', function(done) {
    try {
      new Redmine(1);
    } catch (e) {
      assert.equal(e, 'Error: hostname should be a String !');
    }
    done();
  });

  it('test-invalid-options-2', function(done) {
    try {
      new Redmine('localhost', {});
    } catch (e) {
      assert.equal(e, 'Error: You should provide an API key or username & password !');
    }
    done();
  });

  it('test-valid-options', function(done) {
    new Redmine(hostname, config);

    done();
  });
});
