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

import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-string-literal",
        description: "Disallows object access via string literals.",
        rationale: "Encourages using strongly-typed property access.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "object access via string literals is disallowed";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoStringLiteralWalker(sourceFile, this.getOptions()));
    }
}

class NoStringLiteralWalker extends Lint.RuleWalker {
    public visitElementAccessExpression(node: ts.ElementAccessExpression) {
        const argument = node.argumentExpression;
        if (argument != null) {
            const accessorText = argument.getText();

            // the argument expression should be a string of length at least 2 (due to quote characters)
            if (argument.kind === ts.SyntaxKind.StringLiteral && accessorText.length > 2) {
                const unquotedAccessorText = accessorText.substring(1, accessorText.length - 1);

                // only create a failure if the identifier is valid, in which case there's no need to use string literals
                if (isValidIdentifier(unquotedAccessorText)) {
                    this.addFailureAtNode(argument, Rule.FAILURE_STRING);
                }
            }
        }

        super.visitElementAccessExpression(node);
    }
}

function isValidIdentifier(token: string) {
    const scanner = ts.createScanner(ts.ScriptTarget.ES5, false, ts.LanguageVariant.Standard, token);
    scanner.scan();
    // if we scanned to the end of the token, we can check if the scanned item was an identifier
    return scanner.getTokenText() === token && scanner.isIdentifier();
}
