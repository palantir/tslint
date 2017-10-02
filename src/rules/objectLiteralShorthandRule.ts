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

import {
    getChildOfKind,
    hasModifier,
    isFunctionExpression,
    isIdentifier,
    isMethodDeclaration,
    isPropertyAssignment,
    isShorthandPropertyAssignment,
} from "tsutils";
import * as ts from "typescript";
import * as Lint from "..";

const OPTION_NEVER = "never";

interface Options {
    allowShorthandAssignments: boolean;
}

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "object-literal-shorthand",
        description: "Enforces/disallows use of ES6 object literal shorthand.",
        hasFix: true,
        optionsDescription: Lint.Utils.dedent`
        If the \'never\' option is provided, any shorthand object literal syntax will cause a failure.`,
        options: {
            type: "string",
            enum: [OPTION_NEVER],
        },
        optionExamples: [true, [true, OPTION_NEVER]],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static LONGHAND_PROPERTY = "Expected property shorthand in object literal ";
    public static LONGHAND_METHOD = "Expected method shorthand in object literal ";
    public static SHORTHAND_ASSIGNMENT = "Shorthand property assignments have been disallowed.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, {
            allowShorthandAssignments: this.ruleArguments.indexOf("never") === -1,
        });
    }
}

function walk(ctx: Lint.WalkContext<Options>) {
    const { options: { allowShorthandAssignments } } = ctx;
    allowShorthandAssignments ? enforceShorthand(ctx) : disallowShorthand(ctx);
}

function disallowShorthand(ctx: Lint.WalkContext<Options>): void {
    return ts.forEachChild(ctx.sourceFile, function cb(node): void {
        if (isShorthandAssignment(node)) {
            ctx.addFailureAtNode(
                node,
                Rule.SHORTHAND_ASSIGNMENT,
                fixShorthandToLonghand(node as ts.ShorthandPropertyAssignment | ts.MethodDeclaration),
            );
            return;
        }
        return ts.forEachChild(node, cb);
    });
}

function enforceShorthand(ctx: Lint.WalkContext<Options>): void {
    return ts.forEachChild(ctx.sourceFile, function cb(node): void {
        if (isPropertyAssignment(node)) {
            if (node.name.kind === ts.SyntaxKind.Identifier &&
                isIdentifier(node.initializer) &&
                node.name.text === node.initializer.text) {
                ctx.addFailureAtNode(
                    node,
                    `${Rule.LONGHAND_PROPERTY}('{${node.name.text}}').`,
                    Lint.Replacement.deleteFromTo(node.name.end, node.end),
                );
            } else if (isFunctionExpression(node.initializer) &&
                       // allow named function expressions
                       node.initializer.name === undefined) {
                const [name, fix] = handleLonghandMethod(node.name, node.initializer, ctx.sourceFile);
                ctx.addFailureAtNode(node, `${Rule.LONGHAND_METHOD}('{${name}() {...}}').`, fix);
            }
        }
        return ts.forEachChild(node, cb);
    });
}

function fixShorthandToLonghand(node: ts.ShorthandPropertyAssignment | ts.MethodDeclaration): Lint.Fix {
    let replacementText = isMethodDeclaration(node) ? ": function" : `: ${node.name.getText()}`;

    replacementText = isGeneratorFunction(node) ? `${replacementText}*` : replacementText;

    const fixes: Lint.Fix = [Lint.Replacement.appendText(node.name.end, replacementText)];
    if (isGeneratorFunction(node)) {
        const asteriskPosition = (node as ts.MethodDeclaration).asteriskToken!.getStart();
        fixes.push(Lint.Replacement.replaceFromTo(asteriskPosition, asteriskPosition + 1, ""));
    }
    return fixes;
}

function handleLonghandMethod(name: ts.PropertyName, initializer: ts.FunctionExpression, sourceFile: ts.SourceFile): [string, Lint.Fix] {
    const nameStart = name.getStart(sourceFile);
    let fix: Lint.Fix = Lint.Replacement.deleteFromTo(name.end, getChildOfKind(initializer, ts.SyntaxKind.OpenParenToken)!.pos);
    let prefix = "";
    if (initializer.asteriskToken !== undefined) {
        prefix = "*";
    }
    if (hasModifier(initializer.modifiers, ts.SyntaxKind.AsyncKeyword)) {
        prefix = `async ${prefix}`;
    }
    if (prefix !== "") {
        fix = [fix, Lint.Replacement.appendText(nameStart, prefix)];
    }
    return [prefix + sourceFile.text.substring(nameStart, name.end), fix];
}

function isGeneratorFunction(node: ts.ShorthandPropertyAssignment | ts.MethodDeclaration): boolean {
    return isMethodDeclaration(node) && node.asteriskToken !== undefined;
}

function isShorthandAssignment(node: ts.Node): boolean {
    return (
        isShorthandPropertyAssignment(node) ||
        (isMethodDeclaration(node) && node.parent !== undefined ? node.parent.kind === ts.SyntaxKind.ObjectLiteralExpression : false)
    );
}
