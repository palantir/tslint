module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      bin: ['bin/tslint-cli.js'],
      core: ['build/rules/', 'build/formatters', 'lib/*'],
      test: ['build/test/']
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
        dest: 'build/rules/'
      },

      core_formatters: {
        options: {
          base_path: 'src/formatters',
          module: 'commonjs',
          target: 'es5'
        },
        src: ['lib/tslint.d.ts', 'src/formatters/*.ts'],
        dest: 'build/formatters/'
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
  grunt.registerTask('core', ['clean:core', 'typescript:core', 'typescript:core_rules', 'typescript:core_formatters']);
  grunt.registerTask('bin', ['clean:bin', 'typescript:bin', 'tslint:src']);
  grunt.registerTask('test', ['clean:test', 'typescript:test', 'tslint:test', 'mochaTest']);

  // create default task
  grunt.registerTask('default', ['core', 'bin', 'test']);
};
