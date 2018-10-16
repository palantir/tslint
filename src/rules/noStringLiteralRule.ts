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

import { isElementAccessExpression, isStringLiteral, isValidPropertyAccess } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-string-literal",
        description: Lint.Utils.dedent`
            Forbids unnecessary string literal property access.
            Allows \`obj["prop-erty"]\` (can't be a regular property access).
            Disallows \`obj["property"]\` (should be \`obj.property\`).`,
        rationale: Lint.Utils.dedent`
            If \`--noImplicitAny\` is turned off,
            property access via a string literal will be 'any' if the property does not exist.`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "functionality",
        typescriptOnly: false,
        hasFix: true
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "object access via string literals is disallowed";

    public static id(input: string) {
        return input;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (isElementAccessExpression(node)) {
            const argument = node.argumentExpression;
            if (
                argument !== undefined &&
                isStringLiteral(argument) &&
                isValidPropertyAccess(argument.text)
            ) {
                // typescript@<2.5.0 has an extra underscore in escaped identifier text content,
                // to avoid fixing issue `expr['__foo'] → expr.___foo`, unescapeIdentifier() is to be used
                // As of typescript@3, unescapeIdentifier() removed, thus check in runtime, if the method exists
                // tslint:disable-next-line no-unsafe-any strict-boolean-expressions
                const unescapeIdentifier: typeof Rule["id"] =
                    (ts as any).unescapeIdentifier || Rule.id;
                const propertyName = unescapeIdentifier(argument.text);
                ctx.addFailureAtNode(
                    argument,
                    Rule.FAILURE_STRING,
                    // expr['foo'] -> expr.foo
                    Lint.Replacement.replaceFromTo(
                        node.expression.end,
                        node.end,
                        `.${propertyName}`
                    )
                );
            }
        }
        return ts.forEachChild(node, cb);
    });
}
