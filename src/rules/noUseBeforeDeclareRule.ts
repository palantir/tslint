/**
 * @license
 * Copyright 2014 Palantir Technologies, Inc.
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

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-use-before-declare",
        description: "Disallows usage of variables before their declaration.",
        descriptionDetails: Lint.Utils.dedent`
            This rule is primarily useful when using the \`var\` keyword -
            the compiler will detect if a \`let\` and \`const\` variable is used before it is declared.`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING(name: string) {
        return `variable '${name}' used before declaration`;
    }

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoUseBeforeDeclareWalker(sourceFile, this.getOptions(), program));
    }
}

class NoUseBeforeDeclareWalker extends Lint.ProgramAwareRuleWalker {
    public visitIdentifier(node: ts.Identifier) {
        const parent = node.parent!;

        switch (parent!.kind) {
            case ts.SyntaxKind.PropertyAccessExpression:
                if ((parent as ts.PropertyAccessExpression).name === node) {
                    // Ignore `y` in `x.y`.
                   return;
                }
                break;

            case ts.SyntaxKind.TypeReference:
                // Ignore types.
                return;

            default:
        }

        const checker = this.getTypeChecker();
        const symbol = parent.kind === ts.SyntaxKind.ExportSpecifier
            ? checker.getExportSpecifierLocalTargetSymbol(parent as ts.ExportSpecifier)
            : checker.getSymbolAtLocation(node);
        if (!symbol) {
            return;
        }

        const { declarations } = symbol;
        if (!declarations) {
            return;
        }

        const declaredBefore = declarations.some((decl) => {
            switch (decl.kind) {
                case ts.SyntaxKind.FunctionDeclaration:
                    // Functions may be declared later.
                    return true;
                default:
                    // Use <= in case this *is* the declaration.
                    // If it's a global declared in a different file, OK.
                    return decl.pos <= node.pos || decl.getSourceFile() !== this.getSourceFile();
            }
        });

        if (!declaredBefore) {
            this.addFailureAtNode(node, Rule.FAILURE_STRING(node.text));
        }
    }
}
