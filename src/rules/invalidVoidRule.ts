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

import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "invalid-void",
        description: Lint.Utils.dedent`
            Disallows usage of \`void\` type outside of return type.
            If \`void\` is used as return type, it shouldn't be a part of intersection/union type.`,
        rationale: Lint.Utils.dedent`
            The \`void\` type means "nothing" or that a function does not return any value,
            in contra with implicit \`undefined\` type which means that a function returns a value \`undefined\`.
            So "nothing" cannot be mixed with any other types.
            If you need this - use \`undefined\` type instead.`,
        hasFix: false,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "maintainability",
        typescriptOnly: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "void is not a valid type other than return types";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

const failedKinds = new Set([
    ts.SyntaxKind.PropertySignature,
    ts.SyntaxKind.PropertyDeclaration,

    ts.SyntaxKind.VariableDeclaration,
    ts.SyntaxKind.TypeAliasDeclaration,

    ts.SyntaxKind.IntersectionType,
    ts.SyntaxKind.UnionType,
]);

function walk(ctx: Lint.WalkContext): void {
    ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node) {
        if (node.kind === ts.SyntaxKind.VoidKeyword && failedKinds.has(node.parent.kind)) {
            ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
        }

        ts.forEachChild(node, cb);
    });
}
