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

import * as ts from "typescript";
import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {

    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "max-classes-per-file",
        description: Lint.Utils.dedent`
            A file may not contain more than the specified number of classes`,
        rationale: Lint.Utils.dedent`
            Ensures that files have a single responsibility so that that classes each exist in their own files`,
        optionsDescription: Lint.Utils.dedent`
            The one required argument is an integer indicating the maximum number of classes that can appear in a file.`,
        options: {
            type: "array",
            items: [
                {
                    type: "number",
                    minimum: 1,
                },
            ],
            additionalItems: false,
            minLength: 1,
            maxLength: 2,
        },
        optionExamples: ["[true, 1]", "[true, 5]"],
        type: "maintainability",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_FACTORY = (maxCount: number): string => {
        const maxClassWord = maxCount === 1 ? "class per file is" : "classes per file are";
        return `A maximum of ${maxCount} ${maxClassWord} allowed`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new MaxClassesPerFileWalker(sourceFile, this.getOptions()));
    }
}

class MaxClassesPerFileWalker extends Lint.RuleWalker {
    private classCount = 0;
    private maxClassCount: number;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);

        if (options.ruleArguments[0] === undefined
            || isNaN(options.ruleArguments[0])
            || options.ruleArguments[0] < 1) {

            this.maxClassCount = 1;
        } else {
            this.maxClassCount = options.ruleArguments[0];
        }
    }

    public visitClassDeclaration(node: ts.ClassDeclaration) {
        this.increaseClassCount(node);
        super.visitClassDeclaration(node);
    }

    public visitClassExpression(node: ts.ClassExpression) {
        this.increaseClassCount(node);
        super.visitClassExpression(node);
    }

    private increaseClassCount(node: ts.ClassExpression | ts.ClassDeclaration) {
        this.classCount++;
        if (this.classCount > this.maxClassCount) {
            const msg = Rule.FAILURE_STRING_FACTORY(this.maxClassCount);
            this.addFailureAtNode(node, msg);
        }
    }
}
