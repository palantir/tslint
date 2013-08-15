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

    tslint: {
      options: {
        configuration: grunt.file.readJSON(".tslintrc")
      },
      src: [
        "src/*.ts",
        "src/formatters/**/*.ts",
        "src/language/**/*.ts",
        "src/rules/**/*.ts"
      ],
      test: [
        "test/**/*.ts",
        "!test/**/*.test.ts",
        "!test/typings/*.ts"
      ]
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
  grunt.loadNpmTasks('grunt-tslint');
  grunt.loadNpmTasks('grunt-typescript');

  // register custom tasks
  grunt.registerTask('bin', ['clean:bin', 'typescript:bin', /*'tslint:src'*/]);
  grunt.registerTask('lib', ['clean:lib', 'typescript:lib', /*'tslint:src'*/]);
  grunt.registerTask('test', ['clean:test', 'typescript:test', /*'tslint:test',*/ 'mochaTest']);

  // create default task
  grunt.registerTask('default', ['bin', 'lib', 'test']);
};
