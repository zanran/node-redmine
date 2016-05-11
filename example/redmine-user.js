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


var dump_user = function(user) {
  console.log('Dumping user:');
  for (var item in user) {
    console.log('  ' + item + ': ' + JSON.stringify(user[item]));
  }
};

redmine.users({status: 1}, function(err, data) {
  if (err) throw err;

  console.log(data);

  for (var i in data.users) {
    dump_user(data.users[i]);
  }

  console.log('total_count: ' + data.total_count);
});


redmine.get_user_by_id(9, {include: "memberships,groups"}, function(err, data) {
  if (err) throw err;


  dump_user(data.user);
});

redmine.current_user({include: "memberships,groups"}, function(err, data) {
  if (err) throw err;

  dump_user(data.user);
});

/*
var user = {
  user: {
    login: 'wayne1',
    firstname: 'zanran1',
    lastname: 'tianxiaxi1',
    mail: 'wayne@ctwushu1.com',
    password: 'password',
    status: '3'
  }
};
redmine.create_user(user, function(err, data) {
  if (err) throw err;

  console.log(data);
});

/*
var user = {
  user: {
    mail: 'wayne@zanran.me'
  }
};
redmine.update_user(5, user, function(err, data) {
  if (err) throw err;

  console.log(data);
});

redmine.delete_user('37', function(err, data) {
  if (err) {
    console.log(err);
    return ;
  } else {
    console.log('Delete user #1: ' + JSON.stringify(data));
  }
});
*/
