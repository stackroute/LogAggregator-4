module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      all: ['Gruntfile.js', '**/*.js', '!node_modules/**/*.js']
    },
    htmlhint: {
      all: ['**/*.html', '!node_modules/**/*.html']
    },
    csslint: {
      all: ['**/*.css', '!node_modules/**/*.css']
    },
    min: {
      jsMinify: {
        files: [{
          expand: true,
          src: ['**/*.js', '!node_modules/**/*.js'],
          dest: '.',
          ext: '.min.js'
        }]
      }
    },
    cssmin: {
      cssMinify: {
        files: [{
          expand: true,
          src: ['**/*.css', '!node_modules/**/*.css', '!*.min.css'],
          dest: '.',
          ext: '.min.css'
        }]
      }
    },
    mochaTest: {
      all: {
        src: ['test/**/*.spec.js']
      }
    },
    copy: {
      main: {
        files: [
          // includes files within path
          {
            src: ['**/*', '!node_modules/**', '!test/**/*.spec.js'],
            dest: 'build/'
          }
        ],
      },
    },
    clean: ['build/'],

    express: {
      server: {
        options: {
          // Override defaults here
          script: 'bin/www',
          //livereload: true
            // livereload: 1337
        }
      }
    },
    watch: {
      server: {
        files: ['Gruntfile.js', '**/*.js', '!node_modules/**/*.js'],
        tasks: ['jshint','express'],
        options: {
          spawn: false,
          //livereload: true
            // livereload: 1337
        },
      },
      client: {
        files: ['**/*.html', '!node_modules/**/*.html', '**/*.css', '!node_modules/**/*.css'],
        tasks: [ 'htmlhint', 'csslint'],
        options: {
          spawn: false,
          livereload: true
            // livereload: 1337
        },
      },
    },
  });


  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-htmlhint');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-min');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.registerTask('build', ['clean', 'jshint','htmlhint','csslint','mochaTest', 'copy']);

  grunt.registerTask('express-keepalive', function() {
    this.async();
  });

  grunt.registerTask('serve', ['express', 'express-keepalive']);

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('servewatch', ['jshint','htmlhint','csslint','express', 'watch']);

};
