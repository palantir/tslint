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

import * as Lint from "../lint";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "label-undefined",
        description: "Checks that labels are defined before usage.",
        descriptionDetails: "This rule is now implemented in the TypeScript compiler and does not need to be used.",
        rationale: "Using `break` or `continue` to go to an out-of-scope label is an error in JS.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "functionality",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "undefined label: '";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new LabelUndefinedWalker(sourceFile, this.getOptions()));
    }
}

class LabelUndefinedWalker extends Lint.ScopeAwareRuleWalker<{[key: string]: any}> {
    public createScope(): {[key: string]: any} {
        return {};
    }

    public visitLabeledStatement(node: ts.LabeledStatement) {
        const label = node.label.text;
        const currentScope = this.getCurrentScope();

        currentScope[label] = true;
        super.visitLabeledStatement(node);
    }

    public visitBreakStatement(node: ts.BreakOrContinueStatement) {
        this.validateLabelAt(node.label, node.getStart(), node.getChildAt(0).getWidth());
        super.visitBreakStatement(node);
    }

    public visitContinueStatement(node: ts.BreakOrContinueStatement) {
        this.validateLabelAt(node.label, node.getStart(), node.getChildAt(0).getWidth());
        super.visitContinueStatement(node);
    }

    private validateLabelAt(label: ts.Identifier, position: number, width: number) {
        const currentScope = this.getCurrentScope();

        if (label != null && !currentScope[label.text]) {
            const failureString = Rule.FAILURE_STRING + label.text + "'";
            const failure = this.createFailure(position, width, failureString);
            this.addFailure(failure);
        }
    }
}
