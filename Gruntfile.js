module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files : {
    src:['Gruntfile.js','app.js', 'database/*.js','models/*.js', 'public/**/*.js','!public/lib/**/*.js','routes/**/*.js','routes/*.js','test/*.js','!**/node_modules/**/*.js']//'**/*.js',,'!node_modules/**/*.js'
     }
    },
    htmlhint: {
      all: ['**/*.html', '!**/node_modules/**/*.html']
    },
    csslint: {
      all: ['public/stylesheets/**/*.css']
    },
    // min: {
    //   jsMinify: {
    //     files: [{
    //       expand: true,
    //       src: ['**/*.js', '!node_modules/**/*.js'],
    //       dest: '.',
    //       ext: '.min.js'
    //     }]
    //   }
    // },
    cssmin: {
      cssMinify: {
        files: [{
          expand: true,
          src: ['public/stylesheets/**/*.css'],
          dest: '.',
          ext: '.min.css'
        }]
      }
    },
    mochaTest: {
      all: {
        src: ['test/*.js','!**/node_modules/**/*.js']
      }
    },
    copy: {
      main: {
        files: [
          // includes files within path
          {
            src: ['**/*', '!node_modules/**', '!test/*.js'],
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
  //   watch: {
  //     server: {
  //       files: ['*.js', 'database/*.js','models/*.js', 'public/**/*.js','routes/**/*.js','routes/*.js','test/*.js'],
  //       tasks: ['jshint','express'],
  //       options: {
  //         spawn: false,
  //         //livereload: true
  //           // livereload: 1337
  //       },
  //     },
  //     client: {
  //       files: ['**/*.html', '!node_modules/**/*.html', 'public/stylesheets/**/*.css','public/stylesheets/*.css'],
  //       tasks: [ 'htmlhint', 'csslint'],
  //       options: {
  //         spawn: false,
  //         livereload: true
  //           // livereload: 1337
  //       },
  //     },
  //   },
  // });
  watch: {
    server: {
      files: ['Gruntfile.js','app.js', 'database/*.js','models/*.js', 'public/**/*.js','!public/lib/**/*.js','routes/**/*.js','routes/*.js','test/*.js','!**/node_modules/**/*.js','**/*.html', '!node_modules/**/*.html', 'public/stylesheets/**/*.css'],
      tasks: ['express'],
      options: {
        spawn: false,
        //livereload: true
          // livereload: 1337
      },
    },
    // client: {
    //   files: ['**/*.html', '!node_modules/**/*.html', 'public/stylesheets/**/*.css','public/stylesheets/*.css'],
    //   tasks: [ 'htmlhint', 'csslint'],
    //   options: {
    //     spawn: false,
    //     livereload: true
    //       // livereload: 1337
    //   },
    // },
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
  //grunt.registerTask('servewatch', ['jshint','htmlhint','csslint','express', 'watch']);
grunt.registerTask('testwatch', ['express', 'watch']);
};
