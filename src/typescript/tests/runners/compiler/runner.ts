/// <reference path='..\..\..\src\harness\harness.ts' />
/// <reference path='..\..\..\src\compiler\diagnostics.ts' />
/// <reference path='..\runnerbase.ts' />

class CompilerBaselineRunner extends RunnerBase {

    private basePath = 'tests/cases';
    private errors;
    private emit;
    private decl;
    private output;

    public options: string;

    constructor(public testType?: string) {
        super(testType);
        this.errors = true;
        this.emit = true;
        this.decl = true;
        this.output = true;
        this.basePath += '/compiler';
    }    

    public checkTestCodeOutput(fileName: string) {
        // strips the fileName from the path.
        var justName = fileName.replace(/^.*[\\\/]/, '');
        var content = IO.readFile(fileName).contents();
        var testCaseContent = Harness.TestCaseParser.makeUnitsFromTest(content, justName);

        var units = testCaseContent.testUnitData;
        var tcSettings = testCaseContent.settings;

        var lastUnit = units[units.length - 1];
        describe('JS output and errors for ' + fileName, () => {
            Harness.Assert.bugs(content);

            var jsOutputAsync = '';
            var jsOutputSync = '';

            var declFileName = TypeScript.isDTSFile(lastUnit.name) ? lastUnit.name : lastUnit.name.replace('.ts', '.d.ts');
            var declFileCode = '';

            var errorDescriptionAsync = '';
            var errorDescriptionLocal = '';

            // compile as CommonJS module                    
            Harness.Compiler.compileUnits(Harness.Compiler.CompilerInstance.RunTime, units, function (result) {
                var jsResult = result.commonJSResult;
                for (var i = 0; i < jsResult.errors.length; i++) {
                    errorDescriptionLocal += jsResult.errors[i].file + ' line ' + jsResult.errors[i].line + ' col ' + jsResult.errors[i].column + ': ' + jsResult.errors[i].message + '\r\n';
                }
                jsOutputSync = jsResult.code;

                // save away any generated .d.ts code for later verification
                jsResult.fileResults.forEach(r => {
                    if (r.fileName === declFileName) {
                        declFileCode = r.file.lines.join('\n');
                    }
                });

                // AMD output
                var amdResult = result.amdResult;
                for (var i = 0; i < amdResult.errors.length; i++) {
                    errorDescriptionAsync += amdResult.errors[i].file + ' line ' + amdResult.errors[i].line + ' col ' + amdResult.errors[i].column + ': ' + amdResult.errors[i].message + '\r\n';
                }
                jsOutputAsync = amdResult.code;
                if (declFileCode) {
                    // this isn't adding any real test value, just avoids having to rebaseline a bunch of AMD tests for now
                    // not sufficient for multi file tests that had .d.ts but the commonjs baseline already has this baselined properly
                    jsOutputAsync += '\r\n' + declFileCode;
                }
            }, function (settings?: TypeScript.CompilationSettings) {
                tcSettings.push({ flag: "module", value: "commonjs" });
                Harness.Compiler.setCompilerSettings(tcSettings, Harness.Compiler.CompilerInstance.RunTime);
            });

            // check errors
            if (this.errors) {
                Harness.Baseline.runBaseline('Correct errors for ' + fileName + ' (commonjs)', justName.replace(/\.ts/, '.errors.txt'), () => {
                    if (errorDescriptionLocal === '') {
                        return null;
                    } else {
                        return errorDescriptionLocal;
                    }
                });
            }

            // if the .d.ts is non-empty, confirm it compiles correctly as well
            if (this.decl && declFileCode) {
                var declErrors = '';
                // For single file tests we don't want the baseline file to be named 0.d.ts
                var realDeclName = (lastUnit.name === '0.ts') ? justName.replace('.ts', '.d.ts') : declFileName;
                // For multi-file tests we need to include their dependencies in case the .d.ts has an import so just fix up a new lastUnit
                var newLastUnit = {
                    content: declFileCode,
                    name: realDeclName,
                    fileOptions: lastUnit.fileOptions,
                    originalFilePath: lastUnit.originalFilePath,
                    references: lastUnit.references
                };
                var newUnits = units.slice(0, units.length - 1).concat([newLastUnit]);
                
                Harness.Compiler.compileUnits(Harness.Compiler.CompilerInstance.RunTime, newUnits, function (result) {
                    var jsOutputSync = result.commonJSResult;
                    for (var i = 0; i < jsOutputSync.errors.length; i++) {
                        declErrors += jsOutputSync.errors[i].file + ' line ' + jsOutputSync.errors[i].line + ' col ' + jsOutputSync.errors[i].column + ': ' + jsOutputSync.errors[i].message + '\r\n';
                    }
                });

                Harness.Baseline.runBaseline('.d.ts for ' + fileName + ' compiles without error', realDeclName.replace(/\.ts/, '.errors.txt'), () => {
                    return (declErrors === '') ? null : declErrors;
                });

                //Harness.Baseline.runBaseline('.d.ts for ' + fileName + ' matches the baseline', realDeclName, () => {
                //    return declFileCode;
                //});
            }

            if (!TypeScript.isDTSFile(lastUnit.name)) {
                if (this.emit) {
                    // check js output
                    Harness.Baseline.runBaseline('Correct JS output (commonjs) for ' + fileName, justName.replace(/\.ts/, '.commonjs.js'), () => {
                        return jsOutputSync;
                    });

                    Harness.Baseline.runBaseline('Correct JS output (AMD) for ' + fileName, justName.replace(/\.ts/, '.amd.js'), () => {
                        return jsOutputAsync;
                    });
                }
            }
        });
    }

    public initializeTests() {       
        describe("Setup compiler for compiler baselines", () => {
            // REVIEW: would like to use the minimal lib.d.ts but a bunch of tests need to be converted to use non-DOM APIs
            Harness.Compiler.recreate(Harness.Compiler.CompilerInstance.RunTime, false);
            this.parseOptions();
        });

        if (this.tests.length === 0) {
            this.enumerateFiles(this.basePath).forEach(fn => {
                fn = fn.replace(/\\/g, "/");
                this.checkTestCodeOutput(fn);
            });
        }
        else {
            this.tests.forEach(test => this.checkTestCodeOutput(test));
        }
    }

    private parseOptions() {
        if (this.options && this.options.length > 0) {
            this.errors = false;
            this.emit = false;
            this.decl = false;
            this.output = false;

            var opts = this.options.split(',');
            for (var i = 0; i < opts.length; i++) {
                switch (opts[i]) {
                    case 'error':
                        this.errors = true;
                        break;
                    case 'emit':
                        this.emit = true;
                        break;
                    case 'decl':
                        this.decl = true;
                        break;
                    case 'output':
                        this.output = true;
                        break;
                    default:
                        throw new Error('unsupported flag');
                }
            }
        }
    }
}