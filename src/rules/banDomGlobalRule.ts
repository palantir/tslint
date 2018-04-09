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
        ruleName: "ban-dom-global",
        description: "Ban specific refrences to DOM globals.",
        descriptionDetails: Lint.Utils.dedent`
            For example, \`self\`, \`name\`
        `,
        optionsDescription: "Not configurable.",
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
        return `variable '${name}' is defined in lib.dom.d.ts.`;
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

        const declaredInLibDom = declarations.some((decl) => decl.getSourceFile().fileName.endsWith("lib.dom.d.ts"));

        if (declaredInLibDom) {
            ctx.addFailureAtNode(node, Rule.FAILURE_STRING(node.text));
        }
    }
}
