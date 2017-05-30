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

import { isIdentifier } from "tsutils";
import * as ts from "typescript";
import * as Lint from "../index";

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "deprecation",
        description: "Warns when deprecated APIs are used.",
        descriptionDetails: Lint.Utils.dedent`Any usage of an identifier
            with the @deprecated JSDoc annotation will trigger a warning.
            See http://usejsdoc.org/tags-deprecated.html`,
        rationale: "Deprecated APIs should be avoided, and usage updated.",
        optionsDescription: "",
        options: null,
        optionExamples: [],
        type: "maintainability",
        typescriptOnly: false,
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING(name: string, message: string) {
        return `${name} is deprecated${message === "" ? "." : `: ${message.trim()}`}`;
    }

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, (ctx: Lint.WalkContext<void>) => walk(ctx, program.getTypeChecker()));
    }
}

function walk(ctx: Lint.WalkContext<void>, tc: ts.TypeChecker) {
    return ts.forEachChild(ctx.sourceFile, function cb(node): void {
        if (!isIdentifier(node)) {
            return ts.forEachChild(node, cb);
        }
        if (isDeclaration(node)) { return; }

        const deprecation = getDeprecation(node, tc);
        if (deprecation !== undefined) {
            ctx.addFailureAtNode(node, Rule.FAILURE_STRING(node.text, deprecation));
        }
    });
}

function isDeclaration(identifier: ts.Identifier): boolean {
    const parent = identifier.parent!;
    switch (parent.kind) {
        case ts.SyntaxKind.ClassDeclaration:
        case ts.SyntaxKind.ClassExpression:
        case ts.SyntaxKind.InterfaceDeclaration:
        case ts.SyntaxKind.TypeParameter:
        case ts.SyntaxKind.FunctionExpression:
        case ts.SyntaxKind.FunctionDeclaration:
        case ts.SyntaxKind.LabeledStatement:
        case ts.SyntaxKind.JsxAttribute:
        case ts.SyntaxKind.MethodDeclaration:
        case ts.SyntaxKind.MethodSignature:
        case ts.SyntaxKind.PropertySignature:
        case ts.SyntaxKind.TypeAliasDeclaration:
        case ts.SyntaxKind.GetAccessor:
        case ts.SyntaxKind.SetAccessor:
        case ts.SyntaxKind.EnumDeclaration:
            return true;
        case ts.SyntaxKind.VariableDeclaration:
        case ts.SyntaxKind.TypeAliasDeclaration:
        case ts.SyntaxKind.Parameter:
        case ts.SyntaxKind.ModuleDeclaration:
        case ts.SyntaxKind.PropertyDeclaration:
        case ts.SyntaxKind.PropertyAssignment:
        case ts.SyntaxKind.EnumMember:
            return (parent as ts.Declaration).name === identifier;
        case ts.SyntaxKind.BindingElement:
        case ts.SyntaxKind.ExportSpecifier:
        case ts.SyntaxKind.ImportSpecifier:
            // return true for `b` in `import {a as b} from "foo"`
            return (parent as ts.ImportOrExportSpecifier | ts.BindingElement).name === identifier &&
                (parent as ts.ImportOrExportSpecifier | ts.BindingElement).propertyName !== undefined;
        default:
            return false;
    }
}

function getDeprecation(node: ts.Identifier, tc: ts.TypeChecker): string | undefined {
    let symbol = tc.getSymbolAtLocation(node);
    if (symbol !== undefined && Lint.isSymbolFlagSet(symbol, ts.SymbolFlags.Alias)) {
        symbol = tc.getAliasedSymbol(symbol);
    }
    if (symbol !== undefined) {
        for (const tag of symbol.getJsDocTags()) {
            if (tag.name === "deprecated") {
                return tag.text;
            }
        }
    }
    return undefined;
}
