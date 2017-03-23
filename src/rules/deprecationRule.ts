/**
 * @license
 * Copyright 2016 Palantir Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as ts from "typescript";
import * as Lint from "../index";

export class Rule extends Lint.Rules.TypedRule {

    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "deprecation",
        description: "Warns when deprecated APIs are used.",
        descriptionDetails: Lint.Utils.dedent`Any usage of an identifier
            with the @deprecated JSDoc annotation will trigger a warning.
            See http://usejsdoc.org/tags-deprecated.html`,
        rationale: Lint.Utils.dedent`
            Deprecated APIs should be avoided, and usage updated.`,
        optionsDescription: "",
        options: null,
        optionExamples: [],
        type: "maintainability",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */
    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithWalker(new Walker(sourceFile, this.getOptions(), program));
    }
}

class Walker extends Lint.ProgramAwareRuleWalker {
  // Implementation inspired by angular/tsickle:
  // https://github.com/angular/tsickle/blob/cad7c180a2155db6f6fb8d22c44151d7e8a9149f/src/decorator-annotator.ts#L42
  protected visitIdentifier(node: ts.Identifier) {
    let decSym = this.getTypeChecker().getSymbolAtLocation(node);

    // tslint:disable-next-line:no-bitwise
    if (decSym.flags & ts.SymbolFlags.Alias) {
        decSym = this.getTypeChecker().getAliasedSymbol(decSym);
    }
    for (const d of decSym.getDeclarations()) {
      // Switch to the TS JSDoc parser in the future to avoid false positives here.
      // For example using '@deprecated' in a true comment.
      // However, a new TS API would be needed, track at
      // https://github.com/Microsoft/TypeScript/issues/7393.
      const commentNode: ts.Node = d;

      // Don't warn on the declaration of the @deprecated symbol.
      if (commentNode.getSourceFile() === node.getSourceFile()
          && commentNode.getStart() <= node.getStart()
          && node.getEnd() <= commentNode.getEnd()) {
          continue;
      }

      const range = ts.getLeadingCommentRanges(commentNode.getFullText(), 0);
      if (!range) { continue; }
      for (const {pos, end} of range) {
        const jsDocText = commentNode.getFullText().substring(pos, end);
        if (jsDocText.includes("@deprecated")) {
            this.addFailureAtNode(node, node.getText() + " is deprecated.");
        }
      }
    }

    super.visitIdentifier(node);
  }
}
