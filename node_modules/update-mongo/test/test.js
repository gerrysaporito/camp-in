'use strict';

var assert = require('assert');
var MongoClient = require('mongodb').MongoClient;

// Include update-mongo and use the provided test database.
var updates = require('../lib/index')({db: 'test'});

// The db references.
var db = null;
var test = null;

describe('Update-Mongo test suite.', function() {
  it('Should be able to connect to mongo', function(done) {
    MongoClient.connect('mongodb://localhost:27017/test', function(err, connection) {
      if (err) {
        throw err;
      }

      connection.open(function(err, database) {
        if (err) {
          throw err;
        }

        db = database;
        done();
      });
    });
  });

  it('Should be able to run the Mongo update scripts', function(done) {
    // Run the provided update scripts in order, than invoke our callback.
    updates.run([
      './update1.js',
      './update2.js'
    ], function() {
      done();
    });
  });

  it('Should be able to connect to the test Collection', function(done) {
    db.collection('test', function(err, collection) {
      if (err) {
        throw err;
      }

      test = collection;
      done();
    });
  });

  it('Should be able to see the changes from the Mongo update scripts', function(done) {
    test.findOne({foo: 'bar'}, function(err, document) {
      if (err) {
        throw err;
      }

      assert.notEqual(document, null);
      assert.equal(document.foo, 'bar');

      done();
    });
  });

  it('Should be able to handle functions alongside update scripts', function(done) {
    var stack = [];

    updates.run([
      function(callback) {
        stack.push('fn1');
        callback();
      },
      './update1.js',
      function(callback) {
        stack.push('fn2');
        callback();
      }
    ], function(err, out) {
      if (err) {
        throw err;
      }

      assert.deepEqual(stack, ['fn1', 'fn2']);

      done();
    });
  });

  it('Should be able to handle arrays of operations with the update list', function(done) {
    var stack = [];

    updates.run([
      [
        function(callback) {
          stack.push('fn1');
          callback();
        },
        './update1.js',
        function(callback) {
          stack.push('fn2');
          callback();
        }
      ]
    ], function(err, out) {
      if (err) {
        throw err;
      }

      assert.deepEqual(stack, ['fn1', 'fn2']);

      done();
    });
  });

  it('Should be able to handle functions alongside update scripts, and arrays of operations with the update list', function(done) {
    var stack = [];

    updates.run([
      function(callback) {
        stack.push('A');
        callback();
      },
      [
        function(callback) {
          stack.push('fn1');
          callback();
        },
        './update1.js',
        function(callback) {
          stack.push('fn2');
          callback();
        }
      ],
      function(callback) {
        stack.push('B');
        callback();
      },
    ], function(err, out) {
      if (err) {
        throw err;
      }

      assert.deepEqual(stack, ['A', 'fn1', 'fn2', 'B']);

      done();
    });
  });
});
