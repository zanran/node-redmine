module.exports = {
	js: {
		files: [
			'app/model/**/*.js',
			'app/routes/**/*.js'
		],
		tasks: ['jshint:all']
	},
	express: {
		files: [
			'app.js',
			'app/public/js/lib/**/*.{js,json}'
		],
		tasks: ['jshint:server', 'concurrent:dev']
	},
	sass: {
		files: ['app/public/styles/**/*.scss'],
		tasks: ['sass']
	},
	livereload: {
		files: [
			'app/public/styles/**/*.css',
		],
		options: {
			livereload: true
		}
	}
};
