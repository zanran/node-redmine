'use strict';

module.exports = function clean(grunt) {
  // Load task
  grunt.loadNpmTasks('grunt-mocha-istanbul');

  // Options
  return {
    coverage: {
      src: 'test', // a folder works nicely
      options: {
        coverage: true,
        reportFormats: ['lcov','lcovonly'],
        root: '.',
        recursive: true
      }
    }
  };
};
