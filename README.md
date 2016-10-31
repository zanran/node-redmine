node-redmine
============

[![Build Status](https://travis-ci.org/zanran/node-redmine.svg?branch=master)](https://travis-ci.org/zanran/node-redmine)
[![npm version](https://img.shields.io/npm/v/node-redmine.svg?style=flat)](https://www.npmjs.com/package/node-redmine)

*[node-redmine](https://github.com/zanran/node-redmine) is a nodejs library that supports 100% the [Redmine's REST API](http://www.redmine.org/projects/redmine/wiki/Rest_api)'s features.*

## Installation

To install node-redmine, simply:

```shell
npm install node-redmine
```

## Usage

```js
var Redmine = require('node-redmine');

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

| Resource            | Status    | Availability | Supported |
|:--------------------|:----------|-------------:|:---------:|
| Issues              | Stable    |          1.0 |     ✓     |
| Projects            | Stable    |          1.0 |     ✓     |
| Project Memberships | Alpha     |          1.4 |     ✓     |
| Users               | Stable    |          1.1 |     ✓     |
| Time Entries        | Stable    |          1.1 |     ✓     |
| News                | Prototype |          1.1 |     ✓     |
| Issue Relations     | Alpha     |          1.3 |     ✓     |
| Versions            | Alpha     |          1.3 |     ✓     |
| Wiki Pages          | Alpha     |          2.2 |     ✓     |
| Queries             | Alpha     |          1.3 |     ✓     |
| Attachments         | Beta      |          1.3 |     ✓     |
| Issue Statuses      | Alpha     |          1.3 |     ✓     |
| Trackers            | Alpha     |          1.3 |     ✓     |
| Enumerations        | Alpha     |          2.2 |     ✓     |
| Issue Categories    | Alpha     |          1.3 |     ✓     |
| Roles               | Alpha     |          1.4 |     ✓     |
| Groups              | Alpha     |          2.1 |     ✓     |
| Custom Fields       | Alpha     |          2.4 |     ✓     |
| Search              | Alpha     |          3.3 |    N/A    |

## Links

* Redmine wiki page: http://www.redmine.org/projects/redmine/wiki/Rest_api
* NPM package: https://www.npmjs.com/package/node-redmine


## Notice
+ node-redmine only supports using the [JSON](http://en.wikipedia.org/wiki/JSON) format.
