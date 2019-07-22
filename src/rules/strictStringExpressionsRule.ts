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

import * as ts from "typescript";

import * as Lint from "../index";
import { isTypeFlagSet } from 'tsutils';

export class Rule extends Lint.Rules.TypedRule {
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "strict-string-expressions",
        description: Lint.Utils.dedent`
            Require explicit toString() call for variables used in strings. By default only strings are allowed.

            The following nodes are checked:

            * String literals ("foo" + bar)
            * ES6 templates (\`foo \${bar}\`)`,
        type: "functionality",
        typescriptOnly: true,
        requiresTypeInfo: true,
        options: [],
        optionExamples: [true],
        optionsDescription: "Not configurable."
    };

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, undefined, program.getTypeChecker());
    }
}

function walk(ctx: Lint.WalkContext<undefined>, checker: ts.TypeChecker): void {
    const { sourceFile } = ctx;
    ts.forEachChild(sourceFile, function cb(node: ts.Node): void {
        switch (node.kind) {
            case ts.SyntaxKind.BinaryExpression: {
                const binaryExpr = node as ts.BinaryExpression;
                if (binaryExpr.operatorToken.kind === ts.SyntaxKind.PlusToken) {
                    const leftIsString = isTypeFlagSet(checker.getTypeAtLocation(binaryExpr.left), ts.TypeFlags.StringLike);
                    const rightIsString = isTypeFlagSet(checker.getTypeAtLocation(binaryExpr.right), ts.TypeFlags.StringLike);
                    if (
                        (leftIsString && !rightIsString)
                        || (!leftIsString && rightIsString)
                    ) {
                        addFailure(ctx, node);
                    }
                }
                break;
            }
            case ts.SyntaxKind.TemplateSpan: {
                const templateSpanNode = node as ts.TemplateSpan;
                const type = checker.getTypeAtLocation(templateSpanNode.expression);
                const isString = isTypeFlagSet(type, ts.TypeFlags.StringLike);
                if (!isString) {
                    addFailure(ctx, node);
                }
                break;
            }
        }
        return ts.forEachChild(node, cb);
    });
}

function addFailure (ctx: Lint.WalkContext, node: ts.Node) {
    ctx.addFailureAtNode(node, 'Explicit conversion to string type required');
}

declare module "typescript" {
    // No other way to distinguish boolean literal true from boolean literal false
    export interface IntrinsicType extends ts.Type {
        intrinsicName: string;
    }
}
