module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    typescript: {
      bin: {
        options: {
          target: 'es5'
        },
        src: ['src/tslint/tslint-cli.ts'],
        dest: 'bin/tslint.js'
      },
      lib: {
        options: {
          target: 'es5',
          module: 'commonjs'
        },
        src: ['src/tslint/tslint.ts'],
        dest: 'lib/tslint.js'
      }
    }
  });

  // load NPM tasks
  grunt.loadNpmTasks('grunt-typescript');

  // other tasks
  grunt.registerTask('bin', ['typescript:bin']);
  grunt.registerTask('lib', ['typescript:lib']);
  grunt.registerTask('default', ['bin', 'lib']);
};
