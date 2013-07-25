/// <reference path='../../typescript/compiler/core/errors.ts'/>
/// <reference path='../../typescript/compiler/syntax/positionTrackingWalker.ts'/>
/// <reference path='../../typescript/compiler/syntax/syntaxKind.ts'/>

/// <reference path='../rules/rule.ts'/>

module Lint {

  export class RuleWalker extends TypeScript.PositionTrackingWalker {
    private fileName: string;
    private failures: RuleFailure[];
    private syntaxTree: TypeScript.SyntaxTree;

    constructor(syntaxTree: TypeScript.SyntaxTree) {
      super();

      this.syntaxTree = syntaxTree;
      this.failures = [];
    }

    public getSyntaxTree(): TypeScript.SyntaxTree {
      return this.syntaxTree;
    }

    public getFailures(): RuleFailure[] {
      return this.failures;
    }

    public positionAfter(...elements: TypeScript.ISyntaxElement[]): number {
      var position = this.position();

      for (var i = 0; i < elements.length; ++i) {
        var element = elements[i];
        if(element !== null) {
          position += element.fullWidth();
        }
      }

      return position;
    }

    // create a failure at the given position
    public createFailure(position: number, failure: string): Lint.RuleFailure {
      var lineMap = this.syntaxTree.lineMap();
      var lineAndCharacter = lineMap.getLineAndCharacterFromPosition(position);

      return new Lint.RuleFailure(this.syntaxTree.fileName(), lineAndCharacter, failure);
    }

    public addFailure(failure: RuleFailure) {
      if(!this.existsFailure(failure)) {
        this.failures.push(failure);
      }
    }

    private existsFailure(failure: RuleFailure) {
      var filteredFailures = this.failures.filter(function(f) {
        return f.equals(failure);
      });

      return (filteredFailures.length > 0);
    }
  }

}
