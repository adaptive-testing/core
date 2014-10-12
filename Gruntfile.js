'use strict';

module.exports = function (grunt) {
  // Show elapsed time at the end
  require('time-grunt')(grunt);
  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    nodeunit: {
      files: ['test/**/*_test.js']
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          growl: 'true'
        },
        src: ['spec/**/*.js']
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib: {
        src: ['lib/**/*.js']
      },
      test: {
        src: ['test/**/*.js']
      },
      spec: {
        src: ['spec/**/*.js']
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib: {
        files: '<%= jshint.lib.src %>',
        tasks: ['jshint:lib', 'mochaTest']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'nodeunit']
      },
      spec: {
        files: '<%= jshint.spec.src %>',
        tasks: ['jshint:spec', 'mochaTest']
      }
    },
    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      specs: {
        tasks: ['watch:lib', 'watch:spec']
      }
    }
  });


  // Default task.
  grunt.registerTask('default', ['jshint', 'mochaTest']);
  grunt.registerTask('start', ['concurrent:specs']);
  grunt.registerTask('all', ['jshint', 'mochaTest', 'nodeunit']);
};
