/// <reference path="../../src/compiler/io.ts" />
/// <reference path="../../src/harness/harness.ts" />

class RunnerBase {
    constructor(public testType?: string) { }

    // contains the tests to run
    public tests: string[] = [];

    /** Add a source file to the runner's list of tests that need to be initialized with initializeTests */
    public addTest(fileName: string) {
        this.tests.push(fileName);
    }

    public enumerateFiles(folder: string, recursive: boolean = false): string[] {
        return IO.dir(Harness.userSpecifiedroot + folder, /\.ts$/);
    }

    /** Setup the runner's tests so that they are ready to be executed by the harness 
     *  The first test should be a describe/it block that sets up the harness's compiler instance appropriately
     */
    public initializeTests(): void {
        throw new Error('run method not implemented');
    }
}