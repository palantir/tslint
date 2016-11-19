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

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "completed-docs",
        description: "Enforces documentation for important items be filled out.",
        optionsDescription: Lint.Utils.dedent`
            Either \`true\` to enable for all, or any of
            \`["classes", "functions", "methods", "properties"]
            to choose individual ones.\``,
        options: {
            type: "array",
            items: {
                type: "string",
                enum: ["classes", "functions", "methods", "properties"],
            },
        },
        optionExamples: ["true", `[true, ["classes", "functions"]`],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_EXIST = " must have documentation.";

    public static ARGUMENT_CLASSES = "classes";
    public static ARGUMENT_FUNCTIONS = "functions";
    public static ARGUMENT_METHODS = "methods";
    public static ARGUMENT_PROPERTIES = "properties";

    public static defaultArguments = [
        Rule.ARGUMENT_CLASSES,
        Rule.ARGUMENT_FUNCTIONS,
        Rule.ARGUMENT_METHODS,
        Rule.ARGUMENT_PROPERTIES,
    ];

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        const options = this.getOptions();
        const completedDocsWalker = new CompletedDocsWalker(sourceFile, options, program);

        const nodesToCheck = this.getNodesToCheck(options.ruleArguments);
        completedDocsWalker.setNodesToCheck(nodesToCheck);

        return this.applyWithWalker(completedDocsWalker);
    }

    private getNodesToCheck(ruleArguments: string[]) {
        return ruleArguments.length === 0 ? Rule.defaultArguments : ruleArguments;
    }
}

export class CompletedDocsWalker extends Lint.ProgramAwareRuleWalker {
    private nodesToCheck: { [i: string]: boolean } = {};

    public setNodesToCheck(nodesToCheck: string[]): void {
        for (const nodeType of nodesToCheck) {
            this.nodesToCheck[nodeType] = true;
        }
    }

    public visitClassDeclaration(node: ts.ClassDeclaration): void {
        this.checkComments(node, Rule.ARGUMENT_CLASSES);
        super.visitClassDeclaration(node);
    }

    public visitFunctionDeclaration(node: ts.FunctionDeclaration): void {
        this.checkComments(node, Rule.ARGUMENT_FUNCTIONS);
        super.visitFunctionDeclaration(node);
    }

    public visitPropertyDeclaration(node: ts.PropertyDeclaration): void {
        this.checkComments(node, Rule.ARGUMENT_PROPERTIES);
        super.visitPropertyDeclaration(node);
    }

    public visitMethodDeclaration(node: ts.MethodDeclaration): void {
        this.checkComments(node, Rule.ARGUMENT_METHODS);
        super.visitMethodDeclaration(node);
    }

    private checkComments(node: ts.Declaration, nodeToCheck: string): void {
        if (!this.nodesToCheck[nodeToCheck]) {
            return;
        }

        const comments = this.getTypeChecker().getSymbolAtLocation(node.name).getDocumentationComment();

        if (comments.map((comment) => comment.text).join("").trim() === "") {
            this.addFailure(this.createDocumentationFailure(node, nodeToCheck));
        }
    }

    private createDocumentationFailure(node: ts.Declaration, nodeToCheck: string): Lint.RuleFailure {
        const start = node.getStart();
        const width = node.getText().split(/\r|\n/g)[0].length;
        const description = nodeToCheck[0].toUpperCase() + nodeToCheck.substring(1) + Rule.FAILURE_STRING_EXIST;

        return this.createFailure(start, width, description);
    }
}
