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

import * as ts from 'typescript';
import * as Lint from "../index";

export class Rule extends Lint.Rules.TypedRule {
  static metadata: Lint.IRuleMetadata = {
    ruleName: 'no-unnecessary-cast',
    description: `Warns if a cast does not change the type of an expression.`,
    options: null,
    optionsDescription: 'Not configurable',
    type: 'typescript',
    typescriptOnly: true,
    requiresTypeInfo: true,
  };

  static FAILURE_STRING = 'This cast is unnecessary.';

  applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
    return this.applyWithWalker(new Walker(sourceFile, this.getOptions(), program));
  }
}

class Walker extends Lint.ProgramAwareRuleWalker {
  protected visitNonNullExpression(node: ts.NonNullExpression) {
    this.verifyCast(node);
    super.visitNonNullExpression(node);
  }

  protected visitTypeAssertionExpression(node: ts.TypeAssertion) {
    this.verifyCast(node);
    super.visitTypeAssertionExpression(node);
  }

  protected visitAsExpression(node: ts.AsExpression) {
    this.verifyCast(node);
    super.visitAsExpression(node);
  }

  private verifyCast(node: ts.TypeAssertion|ts.NonNullExpression|
                     ts.AsExpression) {
    const checker = this.getTypeChecker();
    const castType = checker.getTypeAtLocation(node);
    const uncastType = checker.getTypeAtLocation(node.expression);

    if (uncastType && castType && uncastType === castType) {
      const replacements: Lint.Replacement[] = [];
      if (node.pos !== node.expression.pos) {
        replacements.push(
          Lint.Replacement.deleteFromTo(node.getStart(), node.expression.getStart()));
      }
      if (node.end !== node.expression.end) {
        replacements.push(
          Lint.Replacement.deleteFromTo(node.expression.getEnd(), node.getEnd()));
      }
      this.addFailure(this.createFailure(
        node.getStart(), node.getWidth(), Rule.FAILURE_STRING, replacements));
    }
  }
}
