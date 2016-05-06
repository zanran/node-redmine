module.exports = {
  options: {
    globals: {
      reporter: require('jshint-stylish'),
      jshintrc: true,
      force: true
    }
  },

  all: [ 'lib/**/*.js',
    'example/**/*.js',
    'example/**/*.js'
  ],
  server: [
    './index.js'
  ]
}
