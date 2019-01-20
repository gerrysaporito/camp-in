# update-mongo
A simple Node.js Module to run updates for [MongoDB](https://www.mongodb.org/).

# About
All commands in the Mongo shell are synchronous and therefore simple to control the flow of execution, but that is not the case with the Native Node.js Driver. Using the `update-mongo` interface, you can easily write scripts for the mongo shell and run them during code execution.

 update-mongo allows you to run update scripts for MongoDB without interacting with the [Mongo DB Native NodeJS Driver](https://github.com/mongodb/node-mongodb-native). This is an open source project under the MIT license, see [LICENSE.md](LICENSE.md) for additional information.

 **Skip to [Examples](#example) on how to use `update-mongo`**

# Installation
```
npm install --save update-mongo
```

# Usage
One method is provided: `updates.run(scripts, callback);`

See [Scripts](#scripts) for more information on how the scripts are loaded.
The callback function takes two parameters:
```javascript
var callback = function(error, info) {};
```

Basic usage is as follows:
```javascript
var updates = require('update-mongo')(options);

// Run the given update scripts in order, then execute the given callback function.
updates.run(scripts, callback);
```

# Options
The options are given as an object upon loading `update-mongo`. The only required option is, `db`, which defines the database the updates will be run against.

```javascript
var updates = require('update-mongo')(options);
```

```javascript
var options = {
  db: '',     // String [required] - The database to connect to and perform updates.
  prefix: '', // String - The string to affix before each given update file.
  suffix: ''  // String - The string to affix after each given update file.
};
```

# Scripts
The scripts provided to `updates.run()` can be provided in a few different ways: and array of strings (script file names) to run in-order, a combination of JavaScript functions and strings, or an array of the previous.

__Note: When functions are supplied, the require a single parameter, a callback function, which will be called when the function is complete.__

Possible combinations follow:
```javascript
// The order of execution in this example is: script1, script2, script3
updates.run([
  './script1',
  './script2',
  './script3'
], callback);

// The order of execution in this example is: function A, script2, function B
updates.run([
  function A(done) { done(); },
  'script2',
  function B(done) { done(); }
], callback);

// The order of execution in this example is: script1, function A, script2,
// function B, script3
updates.run([
  './script1',
  [
    function A(done) { done(); },
    './script2',
    function B(done) { done(); }
  ],
  './script3'
], callback);
```

If a String is given in the scripts array, `update-mongo` will look for the file given by:
```
options.prefix + script + options.suffix
```

Example
```javascript
// The Script to run:  ./scripts/script1.js

var updates = require('update-mongo')({
  db: 'foo',
  prefix: './scripts/',
  suffix: '.js'
});

updates.run([
  'script1'
], callback);
```

# Example
```javascript
var updates = require('update-mongo')({
  db: 'some-test-db'
});

// Run the given update scripts in order, then execute the given callback function.
updates.run([
  './script1',
  './script2',
  './script3'
], function() {
  // Do something when all updates are complete.
  console.log('Done running update scripts1-3');
});
```
