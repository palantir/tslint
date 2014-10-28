module.exports = function(grunt) {
  grunt.initConfig({    
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      bin: ['bin/tslint-cli.js'],
      core: ['build/rules/', 'build/formatters', 'lib/tslint.*'],
      test: ['build/test/'],
    },

    concat: {
      test: {
        src: ['lib/typescriptServices.js', 'build/tslint-tests.js'],
        dest: 'build/tslint-tests2.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['build/tslint-tests2.js']
      }
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

    ts: {
      options:{
        sourceMap: false,
        target: 'es5'
      },

      upgrade: {
        options: {
          declaration: true,
          module: 'commonjs'
        },
        src: ['src/tslint.ts', 'src/tslint-cli.ts'],
        out: 'lib/tslint.js'
      },

      bin: {
        src: ['src/tslint-cli.ts'],
        out: 'bin/tslint-cli.js'
      },

      core: {
        options: {
          declaration: true,
          module: 'commonjs'
        },
        src: ['src/tslint.ts'],
        out: 'lib/tslint.js'
      },

      core_rules: {
        options: {
          base_path: 'src/rules',
          noImplicitAny: true,
          module: 'commonjs'
        },
        src: [
          'lib/tslint.d.ts',
          'src/rules/*.ts',
          '!src/rules/indentRule.ts',
          '!src/rules/semicolonRule.ts'
        ],
        outDir: 'build/rules/'
      },

      core_formatters: {
        options: {
          base_path: 'src/formatters',
          noImplicitAny: true,
          module: 'commonjs'
        },
        src: ['lib/tslint.d.ts', 'src/formatters/*.ts'],
        outDir: 'build/formatters/'
      },

      test: {
        src: [
          'test/**/*.ts',
          '!test/files/**/*.ts',
          '!test/rules/indentRuleTests.ts',
          '!test/rules/semicolonRuleTests.ts',
        ],
        out: 'build/tslint-tests.js'
      }
    }
  });

  // load NPM tasks
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-tslint');
  grunt.loadNpmTasks('grunt-ts');

  // register custom tasks
  grunt.registerTask('core', ['clean:core', 'ts:core', 'ts:core_rules', 'ts:core_formatters']);
  grunt.registerTask('bin', ['clean:bin', 'ts:bin', 'tslint:src']);
  grunt.registerTask('test', ['clean:test', 'ts:test', 'tslint:test', 'concat:test', 'mochaTest']);

  // create default task
  grunt.registerTask('default', ['core', 'bin', 'test']);
};
