module.exports = function(grunt) {
  "use strict";

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
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
          "dist/css/index.css": "scss/index.scss",
          "dist/css/projects.css": "scss/projects.scss",
          "dist/css/about.css": "scss/about.scss"
        }

      }
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        // we concat requirejs with our js code (created in requirejs task)
        src: ['bower_components/requirejs/require.js', '<%= concat.dist.dest %>'],
        dest: 'dist/js/app.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/js/app.min.js'
      }
    },
    jshint: {
      gruntfile: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: 'Gruntfile.js'
      },
      app: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: ['js/**/*.js']
      }
    },
    watch: {
      options:{
        livereload: true
      },
      html: {
        files: ['*.html', 'projects/projects.html', 'about/about.html']
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
    requirejs: {
      compile: {
        options: {
          name: "main",
          baseUrl: "js/",
          mainConfigFile: "config.js",
          out: "<%= concat.dist.dest %>"
        }
      }
    },
    copy: {
      main: {
        files: [
          // includes files within path
          {expand: true, src: ['img/**/*'], dest: 'dist/'},

          // makes all src relative to cwd
          {expand: true, cwd: 'bower_components/font-awesome/', src: ['fonts/*'], dest: 'dist/'}
        ]
      }
    },
    uncss: {
      dist: {
        files: {
          // this reads dist/css/main.css and overwrites it with a lightweight one
          'dist/css/main.css': ['./index.html']
        }
      },
      options: {
        compress: false
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
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-uncss');

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

  grunt.registerTask('build-dev', ['jshint', 'clean', 'requirejs', 'concat', 'sass', 'copy']);
  grunt.registerTask('build-prod', ['jshint', 'clean', 'requirejs', 'concat', 'uglify', 'sass', 'uncss', 'copy']);

  grunt.registerTask('default', ['build-prod']);

};
