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
          'src/rules/banRule.ts',
          'src/rules/classNameRule.ts',
          'src/rules/commentFormatRule.ts',
          'src/rules/curlyRule.ts',
          'src/rules/eoflineRule.ts',
          'src/rules/forinRule.ts',
          '!src/rules/indentRule.ts',
          'src/rules/interfaceNameRule.ts',
          'src/rules/jsdocFormatRule.ts',
          'src/rules/labelPositionRule.ts',
          'src/rules/labelUndefinedRule.ts',
          'src/rules/maxLineLengthRule.ts',
          'src/rules/memberOrderingRule.ts',
          'src/rules/noAnyRule.ts',
          'src/rules/noArgRule.ts',
          'src/rules/noBitwiseRule.ts',
          'src/rules/noConsecutiveBlankLinesRule.ts',
          'src/rules/noConsoleRule.ts',
          'src/rules/noConstructorVarsRule.ts',
          'src/rules/noConstructRule.ts',
          'src/rules/noDebuggerRule.ts',
          'src/rules/noDuplicateKeyRule.ts',
          'src/rules/noDuplicateVariableRule.ts',
          'src/rules/noEmptyRule.ts',
          'src/rules/noEvalRule.ts'
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
          '!test/rules/*.ts',
          'test/rules/banRuleTests.ts',
          'test/rules/classNameRuleTests.ts',
          'test/rules/commentFormatRuleTests.ts',
          'test/rules/curlyRuleTests.ts',
          'test/rules/eoflineRuleTests.ts',
          'test/rules/forinRuleTests.ts',
          '!test/rules/indentRuleTests.ts',
          'test/rules/interfaceNameRuleTests.ts',
          'test/rules/jsdocFormatRuleTests.ts',
          'test/rules/labelPositionRuleTests.ts',
          'test/rules/labelUndefinedRuleTests.ts',
          'test/rules/maxLineLengthRuleTests.ts',
          'test/rules/memberOrderingRuleTests.ts',
          'test/rules/noAnyRuleTests.ts',
          'test/rules/noArgRuleTests.ts',
          'test/rules/noBitwiseRuleTests.ts',
          'test/rules/noConsecutiveBlankLinesRuleTests.ts',
          'test/rules/noConsoleRuleTests.ts',
          'test/rules/noConstructorVarsRuleTests.ts',
          'test/rules/noConstructRuleTests.ts',
          'test/rules/noDebuggerRuleTests.ts',
          'test/rules/noDuplicateKeyRuleTests.ts',
          'test/rules/noDuplicateVariableRuleTests.ts',
          'test/rules/noEmptyRuleTests.ts',
          'test/rules/noEvalRuleTests.ts'
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
