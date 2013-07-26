/// <reference path='../../typescript/src/compiler/syntax/syntaxTree.ts'/>
/// <reference path='../../typescript/src/compiler/text/linePosition.ts'/>

module Lint {

  // TODO: Make this immutable somehow
  export interface Rule {
    getName(): string;

    getValue(): any;

    setValue(value: any): void;

    apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[];
  }

  export class RuleFailure {
    private fileName: string;
    private lineAndCharacter: TypeScript.LineAndCharacter;
    private failure: string;

    constructor(fileName: string, lineAndCharacter: TypeScript.LineAndCharacter, failure: string) {
      this.fileName = fileName;
      this.lineAndCharacter = lineAndCharacter;
      this.failure = failure;
    }

    public getFileName() {
      return this.fileName;
    }

    public getLineAndCharacter(): TypeScript.LineAndCharacter {
      return this.lineAndCharacter;
    }

    public getFailure() {
      return this.failure;
    }

    public toJson(): any {
      return {
        name: this.fileName,
        position: {
          line: this.lineAndCharacter.line(),
          character: this.lineAndCharacter.character()
        },
        failure: this.failure
      }
    }

    public equals(ruleFailure: RuleFailure): boolean {
      return (this.failure  === ruleFailure.getFailure() &&
              this.fileName === ruleFailure.getFileName() &&
              this.lineAndCharacter.line() === ruleFailure.getLineAndCharacter().line() &&
              this.lineAndCharacter.character() === ruleFailure.getLineAndCharacter().character());
    }
  }

}
