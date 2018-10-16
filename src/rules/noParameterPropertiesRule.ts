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

import { isParameterProperty } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-parameter-properties",
        description: "Disallows parameter properties in class constructors.",
        rationale: Lint.Utils.dedent`
            Parameter properties can be confusing to those new to TS as they are less explicit
            than other ways of declaring and initializing class members.

            It can be cleaner to keep member variable declarations in one list directly only the class
            (instead of mixed between direct class members and constructor parameter properties).
        `,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "style",
        typescriptOnly: true
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_FACTORY(ident: string) {
        return `Property '${ident}' cannot be declared in the constructor`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    return ts.forEachChild(ctx.sourceFile, function cb(node): void {
        if (node.kind === ts.SyntaxKind.Constructor) {
            for (const parameter of (node as ts.ConstructorDeclaration).parameters) {
                if (isParameterProperty(parameter)) {
                    ctx.addFailure(
                        parameter.getStart(ctx.sourceFile),
                        parameter.name.pos,
                        Rule.FAILURE_STRING_FACTORY(parameter.name.getText(ctx.sourceFile))
                    );
                }
            }
        }
        return ts.forEachChild(node, cb);
    });
}
