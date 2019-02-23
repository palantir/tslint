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

import {
    getChildOfKind,
    isCallSignatureDeclaration,
    isConstructSignatureDeclaration,
    isIdentifier,
    isInterfaceDeclaration,
    isTypeLiteralNode,
} from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "callable-types",
        description:
            "An interface or literal type with just a call signature can be written as a function type.",
        rationale: "style",
        optionsDescription: "Not configurable.",
        options: null,
        type: "style",
        typescriptOnly: true,
        hasFix: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_FACTORY(type: string, sigSuggestion: string) {
        return `${type} has only a call signature — use \`${sigSuggestion}\` instead.`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (
            ((isInterfaceDeclaration(node) && noSupertype(node)) || isTypeLiteralNode(node)) &&
            node.members.length === 1
        ) {
            const member = node.members[0];
            if (
                (isConstructSignatureDeclaration(member) || isCallSignatureDeclaration(member)) &&
                // avoid bad parse
                member.type !== undefined
            ) {
                const suggestion = renderSuggestion(member, node, ctx.sourceFile);
                const fixStart =
                    node.kind === ts.SyntaxKind.TypeLiteral
                        ? node.getStart(ctx.sourceFile)
                        : getChildOfKind(node, ts.SyntaxKind.InterfaceKeyword)!.getStart(
                              ctx.sourceFile,
                          );
                ctx.addFailureAtNode(
                    member,
                    Rule.FAILURE_STRING_FACTORY(
                        node.kind === ts.SyntaxKind.TypeLiteral ? "Type literal" : "Interface",
                        suggestion,
                    ),
                    Lint.Replacement.replaceFromTo(fixStart, node.end, suggestion),
                );
            }
        }
        return ts.forEachChild(node, cb);
    });
}

/** True if there is no supertype or if the supertype is `Function`. */
function noSupertype(node: ts.InterfaceDeclaration): boolean {
    if (node.heritageClauses === undefined) {
        return true;
    }
    if (node.heritageClauses.length !== 1) {
        return false;
    }
    const expr = node.heritageClauses[0].types[0].expression;
    return isIdentifier(expr) && expr.text === "Function";
}

function renderSuggestion(
    call: ts.CallSignatureDeclaration | ts.ConstructSignatureDeclaration,
    parent: ts.InterfaceDeclaration | ts.TypeLiteralNode,
    sourceFile: ts.SourceFile,
): string {
    const start = call.getStart(sourceFile);
    const colonPos = call.type!.pos - 1 - start;
    const text = sourceFile.text.substring(start, call.end);

    let suggestion = `${text.substr(0, colonPos)} =>${text.substr(colonPos + 1)}`;
    if (shouldWrapSuggestion(parent.parent)) {
        suggestion = `(${suggestion})`;
    }
    if (parent.kind === ts.SyntaxKind.InterfaceDeclaration) {
        if (parent.typeParameters !== undefined) {
            return `type${sourceFile.text.substring(
                parent.name.pos,
                parent.typeParameters.end + 1,
            )} = ${suggestion}`;
        } else {
            return `type ${parent.name.text} = ${suggestion}`;
        }
    }
    return suggestion.endsWith(";") ? suggestion.slice(0, -1) : suggestion;
}

function shouldWrapSuggestion(parent: ts.Node) {
    switch (parent.kind) {
        case ts.SyntaxKind.UnionType:
        case ts.SyntaxKind.IntersectionType:
        case ts.SyntaxKind.ArrayType:
            return true;
        default:
            return false;
    }
}
