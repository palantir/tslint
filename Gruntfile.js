module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      bin: ['bin/tslint-cli.js'],
      lib: ['lib/tslint.js'],
      test: ['build/']
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['build/**/*.js']
      },
    },

    typescript: {
      bin: {
        options: {
          target: 'es5'
        },
        src: ['src/tslint-cli.ts'],
        dest: 'bin/tslint-cli.js'
      },

      lib: {
        options: {
          target: 'es5',
          module: 'commonjs'
        },
        src: ['src/tslint.ts'],
        dest: 'lib/tslint.js'
      },

      test: {
        options: {
          target: 'es5'
        },
        src: ['test/**/*.ts', '!test/files/**/*.ts'],
        dest: 'build/tslint-tests.js'
      }
    }
  });

  // load NPM tasks
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-typescript');

  // register custom tasks
  grunt.registerTask('bin', ['clean:bin', 'typescript:bin']);
  grunt.registerTask('lib', ['clean:lib', 'typescript:lib']);
  grunt.registerTask('test', ['clean:test', 'typescript:test', 'mochaTest']);

  // create default task
  grunt.registerTask('default', ['bin', 'lib', 'test']);
};
