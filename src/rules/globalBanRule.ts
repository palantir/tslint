/**
 * @license
 * Copyright 2013 Palantir Technologies, Inc.
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

import * as Lint from "../lint";
import {IOptions} from "../lint";

export class Rule extends Lint.Rules.AbstractRule {

  /* tslint:disable:object-literal-sort-keys */
  public static metadata: Lint.IRuleMetadata = {
    ruleName: "global-ban",
    description: "Bans the use of specific global methods.",
    optionsDescription: "A list of global method names which ban `method()`.",
    options: {
      type: "list",
      listType: {
        type: "string",
      },
    },
    optionExamples: [`[true, "someGlobalMethod, "someOtherGlobalMethod"]`],
    type: "functionality",
  };
  /* tslint:enable:object-literal-sort-keys */

  public static FAILURE_STRING = "function invocation disallowed: ";

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new NoBannedGlobalFunctionCallsWalker(sourceFile, this.getOptions()));
  }
}

class NoBannedGlobalFunctionCallsWalker extends Lint.RuleWalker {
  private bannedFunctions: string[] = [];

  constructor(sourceFile: ts.SourceFile, options: IOptions) {
    super(sourceFile, options);
    this.bannedFunctions = options.ruleArguments;
  }

  public visitCallExpression(node: ts.CallExpression) {
    let expression = node.expression;

    if (expression.kind === ts.SyntaxKind.Identifier) {
      const identifierName = (<ts.Identifier> expression).text;
      if (this.bannedFunctions.indexOf(identifierName) !== -1) {
        this.addFailure(this.createFailure(expression.getStart(), expression.getWidth(), `${Rule.FAILURE_STRING}${identifierName}`));
      }

    }

    super.visitCallExpression(node);
  }
}
