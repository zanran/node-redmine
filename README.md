node-redmine
===============

# [![Build Status](https://travis-ci.org/zanran/node-redmine.svg?branch=master)](https://travis-ci.org/zanran/node-redmine)   [![npm version](https://img.shields.io/npm/v/node-redmine.svg?style=flat)](https://www.npmjs.com/package/node-redmine)

*[node-redmine](https://github.com/zanran/node-redmine) is a nodejs library which supports 100% features of [Redmine's REST API](http://www.redmine.org/projects/redmine/wiki/Rest_api).*

## Installation
To install node-redmine, simply:
```noodejs
npm install node-redmine
```
## Usage
```
var Redmine = require('../lib/redmine');

///////////////////////////////////////////////////////////////
var hostname = process.env.REDMINE_HOST || 'redmine.zanran.me';
var config = {
  apiKey: process.env.REDMINE_APIKEY || 'bed1ba0544b681e530c2447341607f423c9c8781'
};

var redmine = new Redmine(hostname, config);

/**
 * Dump issue
 */
var dump_issue = function(issue) {
  console.log('Dumping issue:');
  for (var item in issue) {
    console.log('  ' + item + ': ' + JSON.stringify(issue[item]));
  }
};

redmine.issues({limit: 2}, function(err, data) {
  if (err) throw err;

  for (var i in data.issues) {
    dump_issue(data.issues[i]);
  }

  console.log('total_count: ' + data.total_count);
});
```

## Supported features for Redmine REST API

|Resource|Status|Availability|Supported|
|------------- |:-------------:|:-----:|:-----:|
|Issues|Stable|1.0|Y|
|Projects |Stable |1.0|Y|
|Project Memberships|Alpha |1.4|Y|
|Users |Stable |1.1|Y|
|Time Entries |Stable|1.1|Y|
|News |Prototype |1.1|Y|
|Issue Relations |Alpha |1.3|Y|
|Versions |Alpha |1.3|Y|
|Wiki Pages |Alpha |2.2|Y|
|Queries |Alpha |1.3|Y|
|Attachments |Beta |1.3|Y|
|Issue Statuses |Alpha |1.3|Y|
|Trackers |Alpha |1.3|Y|
|Enumerations |Alpha |2.2|Y|
|Issue Categories |Alpha |1.3|Y|
|Roles|Alpha |1.4|Y|
|Groups|Alpha |2.1|Y|
|Custom Fields |Alpha |2.4|Y|
|Search|Alpha|3.3|N/A|


## Link

* http://www.redmine.org/projects/redmine/wiki/Rest_api


## Notice
+ node-redmine only supports [JSON](http://en.wikipedia.org/wiki/JSON) format.
