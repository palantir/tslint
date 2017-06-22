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

import { isThrowStatement } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-string-throw",
        description: "Flags throwing plain strings or concatenations of strings " +
            "because only Errors produce proper stack traces.",
        hasFix: true,
        options: null,
        optionsDescription: "Not configurable.",
        type: "functionality",
        typescriptOnly: false,
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING =
            "Throwing plain strings (not instances of Error) gives no stack traces";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithWalker(new Walker(sourceFile, this.ruleName, program.getTypeChecker()));
    }
}

class Walker extends Lint.AbstractWalker<void> {
    constructor(sourceFile: ts.SourceFile, ruleName: string, private readonly checker: ts.TypeChecker) {
        super(sourceFile, ruleName, undefined);
    }

    public walk(sourceFile: ts.SourceFile) {
        const cb = (node: ts.Node): void => {
            if (isThrowStatement(node)) {
                const type = this.checker.getTypeAtLocation(node.expression);
                if (Lint.isTypeFlagSet(type, ts.TypeFlags.StringLike)) {
                    this.addFailureAtNode(node, Rule.FAILURE_STRING, [
                        Lint.Replacement.appendText(node.expression.getStart(sourceFile), "new Error("),
                        Lint.Replacement.appendText(node.expression.getEnd(), ")"),
                    ]);
                }
            }

            return ts.forEachChild(node, cb);
        };

        return ts.forEachChild(sourceFile, cb);
    }
}
