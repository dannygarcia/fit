'use strict';

module.exports = function (grunt) {

	require('load-grunt-tasks')(grunt);

	grunt.initConfig({

		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: [
				'Gruntfile.js',
				'index.js',
				'src/*.js',
				'test/*.js'
			]
		},

		browserify: {
			dist: {
				files: {
					'build/fit.js': ['index.js', 'src/*.js']
				},
				options: {
					debug: false
				}
			},
			dev: {
				files: {
					'build/fit.js': ['index.js', 'src/*.js']
				},
				options: {
					debug: false
				}
			}
		},

		uglify: {
			build: {
				src: 'build/fit.js',
				dest: 'build/fit.min.js'
			}
		},

		watch: {
			all: {
				files: ['./*.js', 'src/*.js', 'test/*.js'],
				tasks: ['default']
			}
		},

		qunit: {
			files: ['test/runner.html'],
			options: {
				force: true
			}
		}

	});

	// Default task(s).
	grunt.registerTask('test', 'qunit');
	grunt.registerTask('default', ['jshint', 'browserify:dev']);
	grunt.registerTask('build', ['jshint', 'browserify:dist', 'uglify', 'test']);

};
