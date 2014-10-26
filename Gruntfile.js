module.exports = function(grunt) {
  grunt.initConfig({    
    pkg: grunt.file.readJSON('package.json'),

    // typescript source folders from the compiler's Jakefile
    ts_compilerDirectory: "src/typescript/src/compiler",
    ts_servicesDirectory: "src/typescript/src/services",

    clean: {
      bin: ['bin/tslint-cli.js'],
      core: ['build/rules/', 'build/formatters', 'lib/tslint.*'],
      test: ['build/test/'],
      typescript: ['lib/typescript.*']
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['build/*-tests.js']
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
          module: 'commonjs'
        },
        src: [
          'lib/typescript.d.ts',
          'src/language/**/*.ts'
        ],
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
        src: ['lib/tslint.d.ts', 'src/rules/*.ts'],
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
        src: ['test/**/*.ts', '!test/files/**/*.ts'],
        out: 'build/tslint-tests.js'
      },

      typescript: {
        options: {
          declaration: true
        },
        src: [
          "<%= ts_compilerDirectory %>/core.ts",
          "<%= ts_compilerDirectory %>/sys.ts",
          "<%= ts_compilerDirectory %>/types.ts",
          "<%= ts_compilerDirectory %>/scanner.ts",
          "<%= ts_compilerDirectory %>/parser.ts",
          "<%= ts_compilerDirectory %>/binder.ts",
          "<%= ts_compilerDirectory %>/checker.ts",
          "<%= ts_compilerDirectory %>/emitter.ts",
          "<%= ts_compilerDirectory %>/commandLineParser.ts",
          "<%= ts_compilerDirectory %>/tsc.ts",
          "<%= ts_compilerDirectory %>/diagnosticInformationMap.generated.ts",

          "<%= ts_servicesDirectory %>/breakpoints.ts",
          "<%= ts_servicesDirectory %>/services.ts",
          "<%= ts_servicesDirectory %>/shims.ts",
          "<%= ts_servicesDirectory %>/outliningElementsCollector.ts"
        ],
        out: 'lib/typescript.js'
      }
    }
  });

  // load NPM tasks
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-tslint');
  grunt.loadNpmTasks('grunt-ts');

  // register custom tasks
  grunt.registerTask('typescript', ['clean:typescript', 'ts:typescript']);
  grunt.registerTask('core', ['clean:core', 'ts:core', 'ts:core_rules', 'ts:core_formatters']);
  grunt.registerTask('bin', ['clean:bin', 'ts:bin', 'tslint:src']);
  grunt.registerTask('test', ['clean:test', 'ts:test', 'tslint:test', 'mochaTest']);

  // create default task
  grunt.registerTask('default', ['typescript', 'core', 'bin', 'test']);
};
