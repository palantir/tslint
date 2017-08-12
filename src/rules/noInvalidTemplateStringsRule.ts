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

import * as utils from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-invalid-template-strings",
        // tslint:disable-next-line no-invalid-template-strings
        description: "Warns on use of `${` in non-template strings.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Interpolation will only work for template strings.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (utils.isStringLiteral(node)) {
            check(node);
        }
        return ts.forEachChild(node, cb);
    });

    function check(node: ts.StringLiteral): void {
        /**
         * Finds instances of '${'
         */
        const findTemplateString = new RegExp(/\$\{/);
        const index = node.text.search(findTemplateString);
        if (index !== -1) {
            /**
             * Support for ignoring case: '\${template-expression}'
             */
            const unescapedText = node.getFullText();
            const preceedingCharacter = unescapedText.substr(unescapedText.search(findTemplateString) - 1, 1);
            if (isBackslash(preceedingCharacter)) {
                return;
            }

            const textStart = node.getStart() + 1;
            ctx.addFailureAt(textStart + index, 2, Rule.FAILURE_STRING);
        }
    }
}

function isBackslash(character: string): boolean {
    return character === "\\";
}
