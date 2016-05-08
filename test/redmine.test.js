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

  it('test-invalid-options-format', function(done) {
    try {
      new Redmine('localhost', {apiKey: process.env.REDMINE_APIKEY || 'my-redmine-api-key', 'format': 'html'});
    } catch (e) {
      assert.equal(e, 'Error: Redmine REST API only supports json and xml !');
    }
    done();
  });

  it('test-valid-options-format-xml', function(done) {
    new Redmine('localhost', {apiKey: process.env.REDMINE_APIKEY || 'my-redmine-api-key', 'format': 'xml'});

    done();
  });

  it('test-valid-options-format-json', function(done) {
    new Redmine('localhost', {apiKey: process.env.REDMINE_APIKEY || 'my-redmine-api-key', 'format': 'json'});

    done();
  });

  it('test-valid-options', function(done) {
    new Redmine(hostname, config);

    done();
  });

  it('test-valid-options-attributes', function(done) {
    var redmine = new Redmine(hostname, config);

    assert.equal(redmine.apiKey, config.apiKey);
    assert.equal(redmine.host, hostname);
    assert.equal(redmine.username, undefined);
    assert.equal(redmine.password, undefined);

    done();
  });
});
