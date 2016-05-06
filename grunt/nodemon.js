module.exports = {
	debug: {
		script: 'app.js',
		options: {
			nodeArgs: ['--debug'],
			env: {
				port: 3000
			}
		}
	}
};
