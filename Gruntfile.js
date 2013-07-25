module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    typescript: {
      compile: {
        options: {
          target: 'es5'
        },
        src: ['src/tslint/tslint.ts'],
        dest: 'tslint.js'
      }
    }
  });

  // load NPM tasks
  grunt.loadNpmTasks('grunt-typescript');

  // other tasks
  grunt.registerTask('default', ['typescript']);
};
