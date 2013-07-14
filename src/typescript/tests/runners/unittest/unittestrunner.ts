///<reference path="../../../src/harness/harness.ts" />
///<reference path="../runnerbase.ts" />

class UnitTestRunner extends RunnerBase {

    constructor(public testType?: string) {
        super(testType);
    }

    public initializeTests() {
        switch (this.testType) {
            case 'compiler':
                this.tests = this.enumerateFiles('tests/cases/unittests/compiler');
                break;
            case 'ls':
                this.tests = this.enumerateFiles('tests/cases/unittests/ls');
                break;
            case 'services':
                this.tests = this.enumerateFiles('tests/cases/unittests/services');
                break;
            case 'harness':
                this.tests = this.enumerateFiles('tests/cases/unittests/harness');
                break;
            case 'samples':
                this.tests = this.enumerateFiles('tests/cases/unittests/samples');
                break;
            default:
                if (this.tests.length === 0) {
                    throw new Error('Unsupported test cases: ' + this.testType);
                }
                break;
        }

        var outfile = new Harness.Compiler.WriterAggregator()
        var outerr = new Harness.Compiler.WriterAggregator();

        for (var i = 0; i < this.tests.length; i++) {
            try {
                Harness.Compiler.addUnit(Harness.Compiler.CompilerInstance.DesignTime, IO.readFile(this.tests[i]).contents(), this.tests[i]);
            }
            catch (e) {
                IO.printLine('FATAL ERROR COMPILING TEST: ' + this.tests[i]);
                throw e;
            }
        }

        Harness.Compiler.compile(Harness.Compiler.CompilerInstance.DesignTime);
        
        var stdout = new Harness.Compiler.EmitterIOHost();
        var emitDiagnostics = Harness.Compiler.emitAll(Harness.Compiler.CompilerInstance.DesignTime, stdout);
        var results = stdout.toArray();
        var lines = [];
        results.forEach(v => lines = lines.concat(v.file.lines));
        var code = lines.join("\n")

        describe("Setup compiler for compiler unittests", () => {
            var useMinimalDefaultLib = this.testType !== 'samples'
            Harness.Compiler.recreate(Harness.Compiler.CompilerInstance.RunTime, useMinimalDefaultLib);
        });

        if (typeof require !== "undefined") {
            var vm = require('vm');
            vm.runInNewContext(code,
                {
                    require: require,
                    TypeScript: TypeScript,
                    process: process,
                    describe: describe,
                    it: it,
                    assert: Harness.Assert,
                    Harness: Harness,
                    IO: IO,
                    Exec: Exec,
                    Services: Services,
                    DumpAST: DumpAST,
                    // Formatting: Formatting,
                    Diff: Diff,
                    FourSlash: FourSlash
                },
                "generated_test_code.js"
            );
        } else {
            eval(code);
        }

        // make sure the next unittestrunner doesn't include the previous one's stuff
        Harness.Compiler.recreate(Harness.Compiler.CompilerInstance.DesignTime);
    }
}