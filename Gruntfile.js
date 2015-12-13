module.exports = function(grunt) {
    'use strict';

    // Autoload grunt tasks
    require('load-grunt-tasks')(grunt);

    // Project configuration
    grunt.initConfig({
        jshint: {
            all: ['Gruntfile.js', 'lib/**/*.js'],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        mochaTest: {
            test: {
                src: ['tests/**/*.js']
            }
        }
    });
    grunt.registerTask('test', ['jshint', 'mochaTest']);
};