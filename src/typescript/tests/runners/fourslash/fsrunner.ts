///<reference path='..\..\..\src\harness\fourslash.ts' />
///<reference path='..\..\..\src\harness\harness.ts'/>
///<reference path='..\runnerbase.ts' />

class FourslashRunner extends RunnerBase {
    public basePath = 'tests/cases/';

    constructor(testType?: string) {
        super(testType);
        if(testType == 'all') {
            this.basePath += 'fourslash_old/'
        } else {
            this.basePath += 'fourslash/';
        }
    }

    public initializeTests() {
        var runSingleFourslashTest = (fn: string) => {
            var justName = fn.replace(/^.*[\\\/]/, '');

            if (!justName.match(/fourslash.ts$/i) && !justName.match(/.d.ts$/i)) {
                describe('FourSlash test ' + justName, function () {
                    it('Runs correctly', function () {
                        FourSlash.runFourSlashTest(fn);
                    });
                });
            }
        }

        if (this.tests.length === 0) {
            this.tests = this.enumerateFiles(this.basePath);
        }

        describe("Setup compiler for compiler baselines", () => {
            Harness.Compiler.recreate(Harness.Compiler.CompilerInstance.RunTime);
        });

        this.tests.forEach(runSingleFourslashTest);
    }
}

class GeneratedFourslashRunner extends FourslashRunner {
    constructor(testType?: string) {
        super(testType);
        this.basePath += 'generated/';
    }
}
