/**
 * @license
 * Copyright 2018 Palantir Technologies, Inc.
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

import { isClassDeclaration, isClassExpression } from "tsutils";
import * as ts from "typescript";
import * as Lint from "../index";

interface Options {
    excludeClassExpressions: boolean;
    maxClasses: number;
}

const OPTION_EXCLUDE_CLASS_EXPRESSIONS = "exclude-class-expressions";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "max-classes-per-file",
        description: Lint.Utils.dedent`
            A file may not contain more than the specified number of classes`,
        rationale: Lint.Utils.dedent`
            Ensures that files have a single responsibility so that that classes each exist in their own files`,
        optionsDescription: Lint.Utils.dedent`
            The one required argument is an integer indicating the maximum number of classes that can appear in a
            file. An optional argument \`"exclude-class-expressions"\` can be provided to exclude class expressions
            from the overall class count.`,
        options: {
            type: "array",
            items: [
                {
                    type: "number",
                    minimum: 1,
                },
                {
                    type: "string",
                    enum: [OPTION_EXCLUDE_CLASS_EXPRESSIONS],
                },
            ],
            additionalItems: false,
            minLength: 1,
            maxLength: 2,
        },
        optionExamples: [[true, 1], [true, 5, OPTION_EXCLUDE_CLASS_EXPRESSIONS]],
        type: "maintainability",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING(maxCount: number): string {
        const maxClassWord = maxCount === 1 ? "class per file is" : "classes per file are";
        return `A maximum of ${maxCount} ${maxClassWord} allowed.`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const argument = this.ruleArguments[0] as number;
        const maxClasses = isNaN(argument) || argument > 0 ? argument : 1;
        return this.applyWithFunction(sourceFile, walk, {
            excludeClassExpressions:
                this.ruleArguments.indexOf(OPTION_EXCLUDE_CLASS_EXPRESSIONS) !== -1,
            maxClasses,
        });
    }
}

function walk(ctx: Lint.WalkContext<Options>): void {
    const {
        sourceFile,
        options: { maxClasses, excludeClassExpressions },
    } = ctx;
    let classes = 0;
    return ts.forEachChild(sourceFile, function cb(node: ts.Node): void {
        if (isClassDeclaration(node) || (!excludeClassExpressions && isClassExpression(node))) {
            classes++;
            if (classes > maxClasses) {
                ctx.addFailureAtNode(node, Rule.FAILURE_STRING(maxClasses));
            }
        }
        return ts.forEachChild(node, cb);
    });
}
