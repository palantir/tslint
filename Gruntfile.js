module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      bin: ['bin/tslint-cli.js'],
      core: ['build/rules/', 'lib/*'],
      test: ['build/test/']
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['build/test/**/*.js']
      },
    },

    tslint: {
      options: {
        configuration: grunt.file.readJSON("tslint.json")
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

      core: {
        options: {
          declaration: true,
          module: 'commonjs',
          target: 'es5'
        },
        src: ['src/tslint.ts'],
        dest: 'lib/tslint.js'
      },

      core_rules: {
        options: {
          base_path: 'src/rules',
          module: 'commonjs',
          target: 'es5'
        },
        src: ['lib/tslint.d.ts', 'src/rules/*.ts'],
        dest: ['build/rules/']
      },

      test: {
        options: {
          target: 'es5'
        },
        src: ['test/ruleLoaderTests.ts', 'test/rules/bitwiseRuleTests.ts', '!test/files/**/*.ts'],
        dest: 'build/test/tslint-tests.js'
      }
    }
  });

  // load NPM tasks
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-tslint');
  grunt.loadNpmTasks('grunt-typescript');

  // register custom tasks
  grunt.registerTask('core', ['clean:core', 'typescript:core', 'typescript:core_rules']);
  grunt.registerTask('bin', ['clean:bin', 'core', 'typescript:bin', 'tslint:src']);
  grunt.registerTask('test', ['clean:test', 'core', 'typescript:test', 'tslint:test', 'mochaTest']);

  // create default task
  grunt.registerTask('default', ['core', 'bin', 'test']);
};
