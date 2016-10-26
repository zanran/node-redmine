/*
 * redmine.test.js - test request for redmine
 * Author: wayne <wayne@zanran.me>
 */

var assert = require('assert');
var Redmine = require('../lib/redmine');


///////////////////////////////////////////////////////////////
var hostname = process.env.REDMINE_HOST || 'localhost';

describe('Redmine constructor', function() {
  it('should throw host not specified error when no host or config given', function(done) {
    try {
      new Redmine();
    } catch (e) {
      assert.equal(e, 'Error: host not specified!');
    }
    done();
  });

  it('should throw invalid hostname error when host is invalid', function(done) {
    try {
      new Redmine(1);
    } catch (e) {
      assert.equal(e, 'Error: host should be a string or url object!');
    }
    done();
  });

  it('should throw authentication missing error when no config given', function(done) {
    try {
      new Redmine('localhost');
    } catch (e) {
      assert.equal(e, 'Error: You should provide an API key or username & password !');
    }
    done();
  });

  it('should throw authentication missing error when API key and credentials missing', function(done) {
    try {
      new Redmine('localhost', {});
    } catch (e) {
      assert.equal(e, 'Error: You should provide an API key or username & password !');
    }
    done();
  });

  it('should throw authentication missing error when password missing', function(done) {
    var config = {
      username: 'dummy-username'
    };
    try {
      new Redmine('localhost', {});
    } catch (e) {
      assert.equal(e, 'Error: You should provide an API key or username & password !');
    }
    done();
  });

  it('should throw authentication missing error when username missing', function(done) {
    var config = {
      password: 'dummy-password'
    };
    try {
      new Redmine('localhost', {});
    } catch (e) {
      assert.equal(e, 'Error: You should provide an API key or username & password !');
    }
    done();
  });

  it('should not throw errors when host and api key given', function(done) {
    var config = {
      apiKey: process.env.REDMINE_APIKEY || 'my-redmine-api-key'
    };
    new Redmine(hostname, config);
    done();
  });

  it('should not throw errors when host and credentials given', function(done) {
    var config = {
      username: 'dummy-username',
      password: 'dummy-password'
    };
    new Redmine(hostname, config);
    done();
  });

  it('test-valid-options-attributes', function(done) {
    var config = {
      apiKey:   'dummy-api-key',
      username: 'dummy-username',
      password: 'dummy-password'
    };
    var redmine = new Redmine(hostname, config);

    assert.equal(redmine.apiKey,   'dummy-api-key');
    assert.equal(redmine.username, 'dummy-username');
    assert.equal(redmine.password, 'dummy-password');

    done();
  });
});
