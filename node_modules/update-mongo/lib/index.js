var child_process = require('child_process');
var async = require('async');
var path = require('path');

/**
 *
 * @param options
 * @returns {{run: Function}}
 */
module.exports = function(options) {
  // Document the location of the code that loaded this module.
  var root = path.dirname(module.parent.id);

  // Store the output for debugging purposes.
  var output = {};

  // The database to connect to.
  if (!options.db) {
    throw new Error('The `db` is required in the `options`.');
  }

  // The affix to add to the beginning of each file path.
  if (!options.prefix) {
    options.prefix = '';
  }

  // The affix to add to the end of each file path.
  if (!options.suffix) {
    options.suffix = '';
  }

  /**
   *
   * @param file
   * @param next
   */
  var execute = function(file, next) {
    // Append the prefix and suffix to the file.
    file = options.prefix + file + options.suffix;

    // Resolve the absolute filepath, if relative files were given.
    if (!path.isAbsolute(file)) {
      file = path.join(root, file);
    }

    var connection = 'mongo ' + options.db + ' ' + file;
    child_process.exec(connection, function(err, stdout, stderr) {
      output[file] = {
        code: err,
        stdout: stdout,
        stderr: stderr
      };

      if (err || stderr) {
        var error = err.code
          ? 'Update.js child process failed with error code: ' + err.code
          : '';

        error = stderr
          ? error + '\n' + 'STDERR: ' + stderr
          : error;

        return next(new Error(error));
      }

      next();
    });
  };

  /**
   *
   * @param sequence
   * @param next
   */
  var composeOperations = function(sequence, next) {
    var stack = [];

    // Iterate each item in the sequence, and compose a list of functions to execute.
    async.each(sequence, function(element, callback) {
      if (typeof element === 'function') {
        stack.push(element);
        return callback();
      }
      else if (typeof element === 'string') {
        //stack.push(async.apply(execute, element));
        stack.push(function(cb) {
          execute(element, cb);
        });
        return callback();
      }

      // Only handle strings and functions.
      callback(new Error('composeOperations only works with strings and JavaScript functions.'));
    }, function(err) {
      if (err) {
        return next(err);
      }

      // Execute all the composed functions.
      async.series(stack, function(err) {
        if (err) {
          return next(err);
        }

        next();
      });
    });
  };

  /**
   *
   * @param scripts
   * @param next
   */
  var run = function(scripts, next) {
    // Store the output data from each script run.
    output = {};

    if (!(scripts instanceof Array)) {
      throw new Error('The scripts to run must be given in an Array.');
    }

    async.eachSeries(scripts, function(file, callback) {
      if (typeof file === 'string') {
        execute(file, callback);
      }
      else if (file instanceof Array) {
        composeOperations(file, callback);
      }
      else if (typeof file === 'function') {
        file(callback);
      }
      else {
        next(new Error('Incorrect file format received for run(). Expected an array of file names (strings) or' +
          ' and array of file names and javascript functions to be executed in order. Given: ' + typeof file));
      }
    }, function(err, results) {
      if (err) {
        return next(err, output);
      }

      next(null, output);
    });
  };

  return {
    run: run
  };
};
