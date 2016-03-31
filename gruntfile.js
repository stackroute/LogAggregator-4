var grunt = require('grunt');

module.exports=function(grunt) {

grunt.initConfig({
  jshint:{
  all:['fun.js','!**/node_modules/**/*.js']
},
copy:{
  main:{
    files:[{expand: true, src: ['routes/**'], dest: 'dest/', filter: 'isFile'}]
  }
}
})

grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-copy');
}
