/**
 * @license
 * Copyright 2018 Palantir Technologies, Inc.
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
        return this.applyWithFunction(
            sourceFile,
            this.ruleArguments.indexOf(OPTION_NEVER) === -1
                ? enforceShorthandWalker
                : disallowShorthandWalker,
        );
    }
}

function disallowShorthandWalker(ctx: Lint.WalkContext<void>) {
    return ts.forEachChild(ctx.sourceFile, function cb(node): void {
        if (isShorthandPropertyAssignment(node)) {
            ctx.addFailureAtNode(
                node.name,
                Rule.SHORTHAND_ASSIGNMENT,
                Lint.Replacement.appendText(node.getStart(ctx.sourceFile), `${node.name.text}: `),
            );
        } else if (
            isMethodDeclaration(node) &&
            node.parent.kind === ts.SyntaxKind.ObjectLiteralExpression
        ) {
            ctx.addFailureAtNode(
                node.name,
                Rule.SHORTHAND_ASSIGNMENT,
                fixShorthandMethodDeclaration(node, ctx.sourceFile),
            );
        }
        return ts.forEachChild(node, cb);
    });
}

function enforceShorthandWalker(ctx: Lint.WalkContext<void>) {
    return ts.forEachChild(ctx.sourceFile, function cb(node): void {
        if (isPropertyAssignment(node)) {
            if (
                node.name.kind === ts.SyntaxKind.Identifier &&
                isIdentifier(node.initializer) &&
                node.name.text === node.initializer.text
            ) {
                ctx.addFailureAtNode(
                    node,
                    `${Rule.LONGHAND_PROPERTY}('{${node.name.text}}').`,
                    Lint.Replacement.deleteFromTo(node.name.end, node.end),
                );
            } else if (
                isFunctionExpression(node.initializer) &&
                // allow named function expressions
                node.initializer.name === undefined
            ) {
                const [name, fix] = handleLonghandMethod(
                    node.name,
                    node.initializer,
                    ctx.sourceFile,
                );
                ctx.addFailure(
                    node.getStart(ctx.sourceFile),
                    getChildOfKind(node.initializer, ts.SyntaxKind.OpenParenToken, ctx.sourceFile)!
                        .pos,
                    `${Rule.LONGHAND_METHOD}('{${name}() {...}}').`,
                    fix,
                );
            }
        }
        return ts.forEachChild(node, cb);
    });
}

function fixShorthandMethodDeclaration(node: ts.MethodDeclaration, sourceFile: ts.SourceFile) {
    const isGenerator = node.asteriskToken !== undefined;
    const isAsync = hasModifier(node.modifiers, ts.SyntaxKind.AsyncKeyword);

    return Lint.Replacement.replaceFromTo(
        node.getStart(sourceFile),
        node.name.end,
        `${node.name.getText(sourceFile)}:${isAsync ? " async" : ""} function${
            isGenerator ? "*" : ""
        }`,
    );
}

function handleLonghandMethod(
    name: ts.PropertyName,
    initializer: ts.FunctionExpression,
    sourceFile: ts.SourceFile,
): [string, Lint.Fix] {
    const nameStart = name.getStart(sourceFile);
    let fix: Lint.Fix = Lint.Replacement.deleteFromTo(
        name.end,
        getChildOfKind(initializer, ts.SyntaxKind.OpenParenToken)!.pos,
    );
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
