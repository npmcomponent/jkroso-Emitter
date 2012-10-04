/*
 * grunt-contrib-coffee
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 Eric Woroshow, contributors
 * Licensed under the MIT license.
 * https://github.com/gruntjs/grunt-contrib-coffee/blob/master/LICENSE-MIT
 */

module.exports = function(grunt) {
  'use strict';

  // TODO: ditch this when grunt v0.4 is released
  grunt.util = grunt.util || grunt.utils;

  grunt.registerMultiTask('six', 'Transpile Harmony files into es5 JavaScript', function() {

    var _ = grunt.util._;
    var helpers = require('grunt-contrib-lib').init(grunt);
    var options = helpers.options(this);

    grunt.verbose.writeflags(options, 'Options');

    // TODO: ditch this when grunt v0.4 is released
    this.files = this.files || helpers.normalizeMultiTaskFiles(this.data, this.target);

    var srcFiles;
    var taskOutput;
    var sourceCode;
    var helperOptions;

    this.files.forEach(function(file) {
      srcFiles = grunt.file.expandFiles(file.src);

      taskOutput = []

      srcFiles.forEach(function(srcFile) {
        helperOptions = _.extend({filename: srcFile}, options);

        taskOutput.push(
          compile(
            grunt.file.read(srcFile),
            helperOptions))
      })

      if (taskOutput.length > 0) {
        grunt.file.write(file.dest, taskOutput.join('\n'))
        grunt.log.writeln('File ' + file.dest + ' created.')
      }
    });
  });

  function compile (src, options) {
    try {
      return require('six').compile(src, options);
    } catch (e) {
      grunt.log.error(e);
      grunt.fail.warn('JavaScript failed to transpile.');
    }
  }
};