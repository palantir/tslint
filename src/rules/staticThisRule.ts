/**
 * @license
 * Copyright 2019 Palantir Technologies, Inc.
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

import * as utils from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "static-this",
        description: "Ban the use of `this` in static methods.",
        hasFix: true,
        options: null,
        optionsDescription: "",
        optionExamples: [true],
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = (className?: string) => {
        let message =
            "`this` usage in static context could be a potential reason of runtime errors.";
        if (className !== undefined) {
            /* tslint:disable-next-line:prefer-template */
            message = "`this` should be replaced with `" + className + "`.";
        }

        return message;
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new StaticThisWalker(sourceFile, this.getOptions()));
    }
}

const enum ParentType {
    None,
    Class,
    ClassEntity,
}

class StaticThisWalker extends Lint.RuleWalker {
    public walk(sourceFile: ts.SourceFile) {
        let currentParent: ParentType = ParentType.None;
        let currentClassName: string | undefined;

        const cb = (node: ts.Node): void => {
            const originalParent = currentParent;
            const originalClassName = currentClassName;

            if (utils.isClassLikeDeclaration(node)) {
                currentParent = ParentType.Class;

                if (node.name !== undefined) {
                    currentClassName = node.name.text;
                }

                ts.forEachChild(node, cb);

                currentParent = originalParent;
                currentClassName = originalClassName;
                return;
            }

            switch (node.kind) {
                case ts.SyntaxKind.MethodDeclaration:
                case ts.SyntaxKind.GetAccessor:
                case ts.SyntaxKind.SetAccessor:
                case ts.SyntaxKind.PropertyDeclaration:
                case ts.SyntaxKind.FunctionDeclaration:
                case ts.SyntaxKind.FunctionExpression:
                    if (
                        ParentType.Class === currentParent &&
                        utils.hasModifier(node.modifiers, ts.SyntaxKind.StaticKeyword)
                    ) {
                        currentParent = ParentType.ClassEntity;
                        ts.forEachChild(node, cb);
                        currentParent = originalParent;
                    }
                    return;

                case ts.SyntaxKind.ThisKeyword:
                    if (ParentType.ClassEntity === currentParent) {
                        let fix: Lint.Fix | undefined;
                        if (currentClassName !== undefined) {
                            fix = Lint.Replacement.replaceNode(node, currentClassName);
                        }

                        return this.addFailureAtNode(
                            node,
                            Rule.FAILURE_STRING(currentClassName),
                            fix,
                        );
                    }
            }

            ts.forEachChild(node, cb);
        };

        return ts.forEachChild(sourceFile, cb);
    }
}
