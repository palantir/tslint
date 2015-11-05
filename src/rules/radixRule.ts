/*
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

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "missing radix parameter";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const radixWalker = new RadixWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(radixWalker);
    }
}

class RadixWalker extends Lint.RuleWalker {
    public visitCallExpression(node: ts.CallExpression) {
        const expression = node.expression;

        if (expression.kind === ts.SyntaxKind.Identifier
                && node.getFirstToken().getText() === "parseInt"
                && node.arguments.length < 2) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }

        super.visitCallExpression(node);
    }
}
