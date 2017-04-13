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

import * as utils from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

interface Options {
    statements: boolean;
    parameters: boolean;
    arguments: boolean;
}

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
        optionExamples: [[true, "parameters", "statements"]],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static PARAMETERS_OPTION = "parameters";
    public static ARGUMENTS_OPTION = "arguments";
    public static STATEMENTS_OPTION = "statements";

    public static FAILURE_STRING_SUFFIX = " are not aligned";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new AlignWalker(sourceFile, this.ruleName, {
            arguments: this.ruleArguments.indexOf(Rule.ARGUMENTS_OPTION) !== -1,
            parameters: this.ruleArguments.indexOf(Rule.PARAMETERS_OPTION) !== -1,
            statements: this.ruleArguments.indexOf(Rule.STATEMENTS_OPTION) !== -1,
        }));
    }
}

class AlignWalker extends Lint.AbstractWalker<Options> {
    public walk(sourceFile: ts.SourceFile) {
        const cb = (node: ts.Node): void => {
            if (this.options.statements && utils.isBlockLike(node)) {
                this.checkAlignment(node.statements, Rule.STATEMENTS_OPTION);
            } else if (this.options.parameters) {
                switch (node.kind) {
                    case ts.SyntaxKind.FunctionDeclaration:
                    case ts.SyntaxKind.FunctionExpression:
                    case ts.SyntaxKind.Constructor:
                    case ts.SyntaxKind.MethodDeclaration:
                    case ts.SyntaxKind.ArrowFunction:
                    case ts.SyntaxKind.CallSignature:
                    case ts.SyntaxKind.ConstructSignature:
                    case ts.SyntaxKind.MethodSignature:
                    case ts.SyntaxKind.FunctionType:
                    case ts.SyntaxKind.ConstructorType:
                        this.checkAlignment((node as ts.SignatureDeclaration).parameters, Rule.PARAMETERS_OPTION);
                }
            } else if (this.options.arguments &&
                       (node.kind === ts.SyntaxKind.CallExpression ||
                        node.kind === ts.SyntaxKind.NewExpression && (node as ts.NewExpression).arguments !== undefined)) {
                this.checkAlignment((node as ts.CallExpression | ts.NewExpression).arguments, Rule.ARGUMENTS_OPTION);
            }
            return ts.forEachChild(node, cb);
        };
        return cb(sourceFile);
    }

    private checkAlignment(nodes: ts.Node[], kind: string) {
        if (nodes.length <= 1) {
            return;
        }
        const sourceFile = this.sourceFile;

        let pos = ts.getLineAndCharacterOfPosition(sourceFile, nodes[0].getStart(sourceFile));
        const alignToColumn = pos.character;
        let line = pos.line;

        // skip first node in list
        for (let i = 1; i < nodes.length; ++i) {
            const node = nodes[i];
            const start = node.getStart(sourceFile);
            pos = ts.getLineAndCharacterOfPosition(sourceFile, start);
            if (line !== pos.line && pos.character !== alignToColumn) {
                const diff = alignToColumn - pos.character;
                let fix: Lint.Fix | undefined;
                if (0 < diff) {
                    fix = Lint.Replacement.appendText(start, " ".repeat(diff));
                } else if (node.pos <= start + diff && /^\s+$/.test(sourceFile.text.substring(start + diff, start))) {
                    // only delete text if there is only whitespace
                    fix = Lint.Replacement.deleteText(start + diff, -diff);
                }
                this.addFailure(start, node.end, kind + Rule.FAILURE_STRING_SUFFIX, fix);
            }
            line = pos.line;
        }
    }
}
