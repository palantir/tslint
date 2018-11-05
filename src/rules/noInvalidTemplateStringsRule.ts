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
        description: "Warns on use of `${` in non-template strings.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        rationale: "Interpolation will only work for template strings.",
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
        const text = node.getText(ctx.sourceFile);
        const findTemplateStrings = /(\\*)(\$\{.+?\})/g;
        let instance = findTemplateStrings.exec(text);
        while (instance !== null) {
            const backslashCount = instance[1].length;
            const instanceIsEscaped = backslashCount % 2 === 1;
            if (!instanceIsEscaped) {
                const start = node.getStart() + (instance.index + backslashCount);
                ctx.addFailureAt(start, instance[2].length, Rule.FAILURE_STRING);
            }
            instance = findTemplateStrings.exec(text);
        }
    }
}
