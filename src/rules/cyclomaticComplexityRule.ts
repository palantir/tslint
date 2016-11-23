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

    public static DEFAULT_THRESHOLD = 20;
    public static MINIMUM_THRESHOLD = 2;

    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "cyclomatic-complexity",
        description: "Enforces a threshold of cyclomatic complexity.",
        descriptionDetails: Lint.Utils.dedent`
            Cyclomatic complexity is assessed for each function of any type. A starting value of 1
            is assigned and this value is then incremented for every statement which can branch the
            control flow within the function. The following statements and expressions contribute
            to cyclomatic complexity:
            * \`catch\`
            * \`if\` and \`? :\`
            * \`||\` and \`&&\` due to short-circuit evaluation
            * \`for\`, \`for in\` and \`for of\` loops
            * \`while\` and \`do while\` loops`,
        rationale: Lint.Utils.dedent`
            Cyclomatic complexity is a code metric which indicates the level of complexity in a
            function. High cyclomatic complexity indicates confusing code which may be prone to
            errors or difficult to modify.`,
        optionsDescription: Lint.Utils.dedent`
            An optional upper limit for cyclomatic complexity can be specified. If no limit option
            is provided a default value of $(Rule.DEFAULT_THRESHOLD) will be used.`,
        options: {
            type: "number",
            minimum: "$(Rule.MINIMUM_THRESHOLD)",
        },
        optionExamples: ["true", "[true, 20]"],
        type: "maintainability",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static ANONYMOUS_FAILURE_STRING = (expected: number, actual: number) => {
        return `The function has a cyclomatic complexity of ${actual} which is higher than the threshold of ${expected}`;
    }

    public static NAMED_FAILURE_STRING = (expected: number, actual: number, name: string) => {
        return `The function ${name} has a cyclomatic complexity of ${actual} which is higher than the threshold of ${expected}`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new CyclomaticComplexityWalker(sourceFile, this.getOptions(), this.threshold));
    }

    public isEnabled(): boolean {
        // Disable the rule if the option is provided but non-numeric or less than the minimum.
        const isThresholdValid = typeof this.threshold === "number" && this.threshold >= Rule.MINIMUM_THRESHOLD;
        return super.isEnabled() && isThresholdValid;
    }

    private get threshold(): number {
        return this.getOptions().ruleArguments[0] || Rule.DEFAULT_THRESHOLD;
    }
}

class CyclomaticComplexityWalker extends Lint.RuleWalker {

    private functions: number[] = [];

    public constructor(sourceFile: ts.SourceFile, options: Lint.IOptions, private threshold: number) {
        super(sourceFile, options);
    }

    protected visitArrowFunction(node: ts.FunctionLikeDeclaration) {
        this.startFunction();
        super.visitArrowFunction(node);
        this.endFunction(node);
    }

    protected visitBinaryExpression(node: ts.BinaryExpression) {
        switch (node.operatorToken.kind) {
            case ts.SyntaxKind.BarBarToken:
            case ts.SyntaxKind.AmpersandAmpersandToken:
                this.incrementComplexity();
                break;
            default:
                break;
        }
        super.visitBinaryExpression(node);
    }

    protected visitCaseClause(node: ts.CaseClause) {
        this.incrementComplexity();
        super.visitCaseClause(node);
    }

    protected visitCatchClause(node: ts.CatchClause) {
        this.incrementComplexity();
        super.visitCatchClause(node);
    }

    protected visitConditionalExpression(node: ts.ConditionalExpression) {
        this.incrementComplexity();
        super.visitConditionalExpression(node);
    }

    public visitConstructorDeclaration(node: ts.ConstructorDeclaration) {
        this.startFunction();
        super.visitConstructorDeclaration(node);
        this.endFunction(node);
    }

    protected visitDoStatement(node: ts.DoStatement) {
        this.incrementComplexity();
        super.visitDoStatement(node);
    }

    protected visitForStatement(node: ts.ForStatement) {
        this.incrementComplexity();
        super.visitForStatement(node);
    }

    protected visitForInStatement(node: ts.ForInStatement) {
        this.incrementComplexity();
        super.visitForInStatement(node);
    }

    protected visitForOfStatement(node: ts.ForOfStatement) {
        this.incrementComplexity();
        super.visitForOfStatement(node);
    }

    protected visitFunctionDeclaration(node: ts.FunctionDeclaration) {
        this.startFunction();
        super.visitFunctionDeclaration(node);
        this.endFunction(node);
    }

    protected visitFunctionExpression(node: ts.FunctionExpression) {
        this.startFunction();
        super.visitFunctionExpression(node);
        this.endFunction(node);
    }

    protected visitGetAccessor(node: ts.AccessorDeclaration) {
        this.startFunction();
        super.visitGetAccessor(node);
        this.endFunction(node);
    }

    protected visitIfStatement(node: ts.IfStatement) {
        this.incrementComplexity();
        super.visitIfStatement(node);
    }

    protected visitMethodDeclaration(node: ts.MethodDeclaration) {
        this.startFunction();
        super.visitMethodDeclaration(node);
        this.endFunction(node);
    }

    protected visitSetAccessor(node: ts.AccessorDeclaration) {
        this.startFunction();
        super.visitSetAccessor(node);
        this.endFunction(node);
    }

    protected visitWhileStatement(node: ts.WhileStatement) {
        this.incrementComplexity();
        super.visitWhileStatement(node);
    }

    private startFunction() {
        // Push an initial complexity value to the stack for the new function.
        this.functions.push(1);
    }

    private endFunction(node: ts.FunctionLikeDeclaration) {
        const complexity = this.functions.pop();

        // Check for a violation.
        if (complexity > this.threshold) {
            let failureString: string;

            // Attempt to find a name for the function.
            if (node.name && node.name.kind === ts.SyntaxKind.Identifier) {
                failureString = Rule.NAMED_FAILURE_STRING(this.threshold, complexity, (node.name as ts.Identifier).text);
            } else {
                failureString = Rule.ANONYMOUS_FAILURE_STRING(this.threshold, complexity);
            }

            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), failureString));
        }
    }

    private incrementComplexity() {
        if (this.functions.length) {
            this.functions[this.functions.length - 1]++;
        }
    }
}
