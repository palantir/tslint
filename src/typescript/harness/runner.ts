//
// Copyright (c) Microsoft Corporation.  All rights reserved.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

///<reference path='..\compiler\optionsParser.ts' />
///<reference path='..\compiler\io.ts'/>
///<reference path='..\compiler\typescript.ts'/>
///<reference path='harness.ts'/>
///<reference path='dumpAST-baselining.ts'/>
///<reference path='exec.ts'/>
///<reference path='diff.ts'/>
///<reference path='..\..\tests\runners\runnerfactory.ts' />
///<reference path='..\..\tests\runners\compiler\runner.ts' />
///<reference path='..\..\tests\runners\fourslash\fsrunner.ts' />
///<reference path='..\..\tests\runners\projects\runner.ts' />
///<reference path='..\..\tests\runners\unittest\unittestrunner.ts' />

declare var _inheritsFrom; // reference base inheritsFrom in child contexts.

class ConsoleLogger extends Harness.Logger {
    private descriptionStack: string[] = [];
    private errorString: string = '';
    private passCounts = { Scenario: 0, Testcase: 0 };
    private failCounts = { Scenario: 0, Testcase: 0 };
    private blockedScenarioCount = 0;

    // Adds the specified indentation to each line in the string
    private fixIndent(str: string, indent: string) {
        var lines = str.split('\n');

        for (var i = 0; i < lines.length; i++) {
            lines[i] = indent + lines[i];
        }

        return lines.join('\n');
    }

    private addError(error: Error) {
        var tab = '  ';
        var indent = (new Array(this.descriptionStack.length + 1)).join(tab);

        for (var i = 0; i < this.descriptionStack.length; i++) {
            this.errorString += (new Array(i + 1)).join(tab) + this.descriptionStack[i] + '\n';
        }

        var stack = (<any>error).stack;
        if (stack) {
            this.errorString += this.fixIndent(stack, indent) + '\n';
        } else {
            this.errorString += indent + error.message + '\n';
        }
    }

    public start() {
        IO.printLine("Running tests" + (iterations > 1 ? " " + iterations + " times" : "") + (reverse ? " in reverse." : "."));
    }

    public end() {
        // Test execution is complete
        IO.printLine('');
        IO.printLine('');
        IO.printLine(this.errorString);
        IO.printLine('');

        IO.printLine('Scenarios: ' + (this.passCounts['Scenario'] || 0) + ' passed, ' + (this.failCounts['Scenario'] || 0) + ' failed.');
        IO.printLine('Testcases: ' + (this.passCounts['Testcase'] || 0) + ' passed, ' + (this.failCounts['Testcase'] || 0) + ' failed.');
        IO.printLine('  Blocked: ' + this.blockedScenarioCount);
        return;
    }

    public testStart(test: Harness.ITestMetadata) {
        this.descriptionStack.push(test.desc);
        //IO.printLine(test.id);
        //IO.printLine(test.desc);
    }

    public pass(test: Harness.ITestMetadata) {
        if (test.perfResults) {
            IO.printLine(test.desc + ": " + test.perfResults.trials.length + " trials");
            IO.printLine('    mean: ' + test.perfResults.mean.toFixed(1) + "ms");
            IO.printLine('     min: ' + test.perfResults.min.toFixed(1) + "ms");
            IO.printLine('     max: ' + test.perfResults.max.toFixed(1) + "ms");
            IO.printLine('  stdDev: ' + test.perfResults.stdDev.toFixed(1) + "ms");
            IO.printLine('');
            this.descriptionStack.pop();
        } else {
            IO.print(".");
            this.passCounts.Testcase++;
            this.descriptionStack.pop();
        }
    }

    public bug(test: Harness.ITestMetadata) {
        IO.print('*');
    }

    public fail(test: Harness.ITestMetadata) {
        IO.print("F");
        this.failCounts.Testcase++;
        this.descriptionStack.pop();
    }

    public error(test: Harness.ITestMetadata, error: Error) {
        IO.print("F");
        this.failCounts.Testcase++;
        this.addError(error);
        this.descriptionStack.pop();
    }

    public scenarioStart(scenario: Harness.IScenarioMetadata) {
        this.descriptionStack.push(scenario.desc);
        //IO.printLine(scenario.id);
        //IO.printLine(scenario.desc);
    }

    public scenarioEnd(scenario: Harness.IScenarioMetadata, error?: Error) {
        if (scenario.pass) {
            this.passCounts.Scenario++;
        } else {
            this.failCounts.Scenario++;
        }

        if (scenario.bugs && scenario.bugs.length > 0) {
            this.blockedScenarioCount++;
        }

        if (error) {
            this.addError(error);
        }
        this.descriptionStack.pop();
    }
}

class JSONLogger extends Harness.Logger {
    private root = [];
    private scenarioStack: Harness.IScenarioMetadata[] = [];

    constructor(public path: string) {
        super();
    }

    private addTestResult(test: Harness.ITestMetadata) {
        if (this.scenarioStack.length === 0) {
            this.root.push(test);
        } else {
            (<any>this.scenarioStack[this.scenarioStack.length - 1]).children.push(test);
        }
    }

    public pass(test: Harness.ITestMetadata) {
        this.addTestResult(test);
    }

    public fail(test: Harness.ITestMetadata) {
        this.addTestResult(test);
    }

    public error(test: Harness.ITestMetadata, error: Error) {
        (<any>test).errorString = error.message;
        this.addTestResult(test);
    }

    public scenarioStart(scenario: Harness.IScenarioMetadata) {
        (<any>scenario).children = [];

        if (this.scenarioStack.length === 0) {
            this.root.push(scenario);
        } else {
            (<any>this.scenarioStack[this.scenarioStack.length - 1]).children.push(scenario);
        }

        this.scenarioStack.push(scenario);
    }

    public scenarioEnd() {
        this.scenarioStack.pop();
    }

    public end() {
        IO.writeFile(this.path, JSON.stringify(this.root), /*writeByteOrderMark:*/ false);
    }
}

function runTests(tests: RunnerBase[]) {
    if (reverse) {
        tests = tests.reverse();
    }

    for (var i = iterations; i > 0; i--) {
        for (var j = 0; j < tests.length; j++) {
            tests[j].initializeTests();
        }
    }

    run();
}

var runners: RunnerBase[] = [];
global.runners = runners;
var reverse: boolean = false;
var iterations: number = 1;

var opts = new OptionsParser(IO);

opts.flag('compiler', {
    set: function () {
        runners.push(new CompilerBaselineRunner());
        runners.push(new UnitTestRunner('compiler'));        
        runners.push(new ProjectRunner());
    }
});

opts.flag('project', {
    set: function () {
        runners.push(new ProjectRunner());
    }
});

opts.flag('fourslash', {
    set: function () {
        runners.push(new FourslashRunner());
    }
});

opts.flag('fourslash-generated', {
    set: function () {
        runners.push(new GeneratedFourslashRunner());
    }
});

// for running fourslash tests written against 0.8.3 in the fourslash_old directory
opts.option('fourslash-all', {
    experimental: true,
    set: function (str) {
        runners.push(new FourslashRunner('all'));
    }
});

opts.flag('unittests', {
    set: function () {
        runners.push(new UnitTestRunner('compiler'));
        runners.push(new UnitTestRunner('samples'));
    }
});

opts.flag('samples', {
    set: function () {
        runners.push(new UnitTestRunner('samples'));
    }
});

opts.flag('ls', {
    set: function () {
        runners.push(new UnitTestRunner('ls'));
    }
});

opts.flag('services', {
    set: function () {
        runners.push(new UnitTestRunner('services'));
    }
});

opts.flag('harness', {
    set: function () {
        runners.push(new UnitTestRunner('harness'));
    }
});

opts.option('dump', {
    set: function (file) { Harness.registerLogger(new JSONLogger(file)); }
});

opts.option('root', {
    usage: 'Sets the root for the tests")',
    experimental: true,
    set: function (str) {
        Harness.userSpecifiedroot = str;
    }
});

opts.flag('reverse', {
    experimental: true,
    set: function () {
        reverse = true;
    }
});

opts.option('iterations', {
    experimental: true,
    set: function (str) {
        var val = parseInt(str);
        iterations = val < 1 ? 1 : val;
    }
});

// For running only compiler baselines with specific options like emit, decl files, etc
opts.option('compiler-baselines', {
    experimental: true,
    set: function (str) {
        var runner = new CompilerBaselineRunner();
        runner.options = str;
        runners.push(runner);
    }
});

opts.parse(IO.arguments)

if (runners.length === 0) {
    if (opts.unnamed.length === 0) {
        // compiler
        runners.push(new CompilerBaselineRunner());
        runners.push(new UnitTestRunner('compiler'));        
        runners.push(new ProjectRunner());

        // language services
        runners.push(new FourslashRunner());
        runners.push(new GeneratedFourslashRunner());

        // samples
        runners.push(new UnitTestRunner('samples'));
    } else {
        var runnerFactory = new RunnerFactory();
        var tests = opts.unnamed[0].split(' ');
        for (var i = 0; i < tests.length; i++) {
            runnerFactory.addTest(tests[i]);
        }
        runners = runnerFactory.getRunners();
    }
}

var c = new ConsoleLogger();
Harness.registerLogger(c);
runTests(runners);

