'use strict';

module.exports = function mocha_istanbul(grunt) {
  // Load task
  grunt.loadNpmTasks('grunt-mocha-istanbul');

  grunt.event.on('coverage', function(lcov, done) {
    //console.log(lcov);
    done();
  });

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
