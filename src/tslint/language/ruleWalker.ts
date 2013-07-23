/// <reference path='../../typescript/compiler/core/errors.ts'/>
/// <reference path='../../typescript/compiler/syntax/positionTrackingWalker.ts'/>
/// <reference path='../../typescript/compiler/syntax/syntaxKind.ts'/>

/// <reference path='../rules/rule.ts'/>

module Lint {

  export class RuleWalker extends TypeScript.PositionTrackingWalker {
    private fileName: string;
    private failures: RuleFailure[];

    constructor(fileName: string) {
      super();

      this.fileName = fileName;
      this.failures = [];
    }

    public getFileName(): string {
      return this.fileName;
    }

    public addFailure(failure: RuleFailure) {
      this.failures.push(failure);
    }

    public getFailures(): RuleFailure[] {
      return this.failures;
    }
  }

}
