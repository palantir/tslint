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
        ruleName: "align",
        description: "Enforces vertical alignment.",
        hasFix: true,
        rationale: "Helps maintain a readable, consistent style in your codebase.",
        optionsDescription: Lint.Utils.dedent`
            Three arguments may be optionally provided:

            * \`"parameters"\` checks alignment of function parameters.
            * \`"arguments"\` checks alignment of function call arguments.
            * \`"statements"\` checks alignment of statements.`,
        options: {
            type: "array",
            items: {
                type: "string",
                enum: ["arguments", "parameters", "statements"],
            },
            minLength: 1,
            maxLength: 3,
        },
        optionExamples: ['[true, "parameters", "statements"]'],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static PARAMETERS_OPTION = "parameters";
    public static ARGUMENTS_OPTION = "arguments";
    public static STATEMENTS_OPTION = "statements";

    public static FAILURE_STRING_SUFFIX = " are not aligned";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const alignWalker = new AlignWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(alignWalker);
    }
}

class AlignWalker extends Lint.RuleWalker {
    public visitConstructorDeclaration(node: ts.ConstructorDeclaration) {
        this.checkAlignment(Rule.PARAMETERS_OPTION, node.parameters);
        super.visitConstructorDeclaration(node);
    }

    public visitFunctionDeclaration(node: ts.FunctionDeclaration) {
        this.checkAlignment(Rule.PARAMETERS_OPTION, node.parameters);
        super.visitFunctionDeclaration(node);
    }

    public visitFunctionExpression(node: ts.FunctionExpression) {
        this.checkAlignment(Rule.PARAMETERS_OPTION, node.parameters);
        super.visitFunctionExpression(node);
    }

    public visitMethodDeclaration(node: ts.MethodDeclaration) {
        this.checkAlignment(Rule.PARAMETERS_OPTION, node.parameters);
        super.visitMethodDeclaration(node);
    }

    public visitCallExpression(node: ts.CallExpression) {
        this.checkAlignment(Rule.ARGUMENTS_OPTION, node.arguments);
        super.visitCallExpression(node);
    }

    public visitNewExpression(node: ts.NewExpression) {
        this.checkAlignment(Rule.ARGUMENTS_OPTION, node.arguments);
        super.visitNewExpression(node);
    }

    public visitBlock(node: ts.Block) {
        this.checkAlignment(Rule.STATEMENTS_OPTION, node.statements);
        super.visitBlock(node);
    }

    private checkAlignment(kind: string, nodes: ts.Node[]) {
        if (nodes == null || nodes.length === 0 || !this.hasOption(kind)) {
            return;
        }

        let prevPos = this.getLineAndCharacterOfPosition(nodes[0].getStart());
        const alignToColumn = prevPos.character;

        // skip first node in list
        for (const node of nodes.slice(1)) {
            const curPos = this.getLineAndCharacterOfPosition(node.getStart());
            if (curPos.line !== prevPos.line && curPos.character !== alignToColumn) {
                const diff = alignToColumn - curPos.character;
                let fix;
                if (0 < diff) {
                    fix = this.createFix(this.appendText(node.getStart(), " ".repeat(diff)));
                } else {
                    fix = this.createFix(this.deleteText(node.getStart() + diff, -diff));
                }
                this.addFailureAtNode(node, kind + Rule.FAILURE_STRING_SUFFIX, fix);
            }
            prevPos = curPos;
        }
    }
}
