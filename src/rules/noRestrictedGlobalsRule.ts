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
        ruleName: "no-restricted-globals",
        description: "Disallow specific global variables.",
        descriptionDetails: Lint.Utils.dedent`
            Disallowing usage of specific global variables can be useful if you want to allow
            a set of global variables by enabling an environment, but still want to disallow
            some of those. For instance, early Internet Explorer versions exposed the current
            DOM event as a global variable event, but using this variable has been considered
            as a bad practice for a long time. Restricting this will make sure this variable
            isn’t used in browser code.
        `,
        optionsDescription: "This rule takes a list of strings, where each string is a global to be restricted.",
        options: {
            type: "list",
            items: {type: "string"},
        },
        optionExamples: [
            [
                true,
                "name",
                "length",
                "event",
            ],
        ],
        type: "functionality",
        typescriptOnly: false,
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING(name: string) {
        return `Unexpected global variable '${name}'. Use local parameter instead.`;
    }

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        const bannedGlobals = new Set(this.ruleArguments as string[]);
        return this.applyWithFunction(sourceFile, walk, bannedGlobals, program.getTypeChecker());
    }
}

function walk(ctx: Lint.WalkContext<Set<string>>, checker: ts.TypeChecker): void {
    return ts.forEachChild(ctx.sourceFile, function recur(node: ts.Node): void {
        switch (node.kind) {
            case ts.SyntaxKind.TypeReference:
                // Ignore types.
                return;
            case ts.SyntaxKind.PropertyAccessExpression:
                // Ignore `y` in `x.y`, but recurse to `x`.
                return recur((node as ts.PropertyAccessExpression).expression);
            case ts.SyntaxKind.Identifier:
                return checkIdentifier(node as ts.Identifier);
            default:
                return ts.forEachChild(node, recur);
        }
    });

    function checkIdentifier(node: ts.Identifier): void {
        if (!ctx.options.has(node.text)) {
            return;
        }

        const symbol = checker.getSymbolAtLocation(node);
        const declarations = symbol === undefined ? undefined : symbol.declarations;
        if (declarations === undefined || declarations.length === 0) {
            return;
        }

        const declaredInLibDom = declarations.some((decl) => decl.getSourceFile().fileName.endsWith(".d.ts"));

        if (declaredInLibDom) {
            ctx.addFailureAtNode(node, Rule.FAILURE_STRING(node.text));
        }
    }
}
