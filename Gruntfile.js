module.exports = function(grunt) {
  "use strict";

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    // Task configuration.
    clean: {
      files: ['dist']
    },
    sass: {                              // Task
      dist: {                            // Target
        options: {                       // Target options
          style: 'expanded'
        },
        files: {
          "dist/css/index.css": "scss/index.scss"
        }

      }
    },
    watch: {
      options:{
        livereload: true
      },
      html: {
        files: ['*.html']
      },
      js: {
        files: ['js/**/*.js'],
        tasks: ['jshint']
      },
      css: {
        files: ['scss/**/*.scss', 'projects/projects.css'],
        tasks: ['sass']
      },
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      app: {
        files: '<%= jshint.app.src %>',
        tasks: ['jshint:app']
      }
    },
    connect: {
      development: {
        options: {
        }
      },
      production: {
        options: {
          keepalive: true,
          port: 8000
        }
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Default task:
  // 1. Lint js in js/ folder
  // 2. Clean dist folder
  // 3. Create the app.js from the main.js script dependency tree
  // 4. Concat js from 3. with requirejs lib
  // 5. Uglify the 4. script
  // 6. Create the main.css from main.scss, this scss contains deps like bootstrap and font-awesome
  // 7. Copy img/ and font-awesome/fonts folders needed for 6. styles
  grunt.registerTask('dev', ['default', 'connect:development', 'watch']);

  grunt.registerTask('preview-live', ['default', 'connect:production']);

  grunt.registerTask('build-dev', ['clean', 'sass']);
  grunt.registerTask('build-prod', ['clean', 'sass']);

  grunt.registerTask('default', ['build-prod']);

};
