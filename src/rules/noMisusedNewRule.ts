/**
 * @license
 * Copyright 2017 Palantir Technologies, Inc.
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
    getPropertyName,
    isConstructSignatureDeclaration,
    isMethodDeclaration,
    isMethodSignature,
    isTypeReferenceNode
} from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-misused-new",
        description:
            "Warns on apparent attempts to define constructors for interfaces or `new` for classes.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        rationale: Lint.Utils.dedent`
            Interfaces in TypeScript aren't meant to describe constructors on their implementations.
            The \`new\` descriptor is primarily for describing JavaScript libraries.
            If you're trying to describe a function known to be a class, it's typically better to \`declare class\`.
        `,
        type: "functionality",
        typescriptOnly: true
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_INTERFACE =
        "Interfaces cannot be constructed, only classes. Did you mean `declare class`?";
    public static FAILURE_STRING_CLASS =
        '`new` in a class is a method named "new". Did you mean `constructor`?';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (isMethodSignature(node)) {
            if (getPropertyName(node.name) === "constructor") {
                ctx.addFailureAtNode(node, Rule.FAILURE_STRING_INTERFACE);
            }
        } else if (isMethodDeclaration(node)) {
            if (
                node.body === undefined &&
                getPropertyName(node.name) === "new" &&
                returnTypeMatchesParent(node.parent as ts.ClassLikeDeclaration, node)
            ) {
                ctx.addFailureAtNode(node, Rule.FAILURE_STRING_CLASS);
            }
        } else if (isConstructSignatureDeclaration(node)) {
            if (returnTypeMatchesParent(node.parent as ts.InterfaceDeclaration, node)) {
                ctx.addFailureAtNode(node, Rule.FAILURE_STRING_INTERFACE);
            }
        }
        return ts.forEachChild(node, cb);
    });
}

function returnTypeMatchesParent(
    parent: { name?: ts.Identifier },
    decl: ts.SignatureDeclaration
): boolean {
    if (parent.name === undefined || decl.type === undefined || !isTypeReferenceNode(decl.type)) {
        return false;
    }
    return (
        decl.type.typeName.kind === ts.SyntaxKind.Identifier &&
        decl.type.typeName.text === parent.name.text
    );
}
