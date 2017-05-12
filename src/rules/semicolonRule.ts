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

const OPTION_ALWAYS = "always";
const OPTION_NEVER = "never";
const OPTION_IGNORE_BOUND_CLASS_METHODS = "ignore-bound-class-methods";
const OPTION_IGNORE_INTERFACES = "ignore-interfaces";

interface Options {
    always: boolean;
    boundClassMethods: boolean;
    interfaces: boolean;
}

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "semicolon",
        description: "Enforces consistent semicolon usage at the end of every statement.",
        hasFix: true,
        optionsDescription: Lint.Utils.dedent`
            One of the following arguments must be provided:

            * \`"${OPTION_ALWAYS}"\` enforces semicolons at the end of every statement.
            * \`"${OPTION_NEVER}"\` disallows semicolons at the end of every statement except for when they are necessary.

            The following arguments may be optionally provided:

            * \`"${OPTION_IGNORE_INTERFACES}"\` skips checking semicolons at the end of interface members.
            * \`"${OPTION_IGNORE_BOUND_CLASS_METHODS}"\` skips checking semicolons at the end of bound class methods.`,
        options: {
            type: "array",
            items: [{
                type: "string",
                enum: [OPTION_ALWAYS, OPTION_NEVER],
            }, {
                type: "string",
                enum: [OPTION_IGNORE_INTERFACES],
            }],
            additionalItems: false,
        },
        optionExamples: [
            [true, OPTION_ALWAYS],
            [true, OPTION_NEVER],
            [true, OPTION_ALWAYS, OPTION_IGNORE_INTERFACES],
            [true, OPTION_ALWAYS, OPTION_IGNORE_BOUND_CLASS_METHODS],
        ],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_MISSING = "Missing semicolon";
    public static FAILURE_STRING_COMMA = "Properties should be separated by semicolons";
    public static FAILURE_STRING_UNNECESSARY = "Unnecessary semicolon";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const options: Options = {
            always: this.ruleArguments.indexOf(OPTION_NEVER) === -1,
            boundClassMethods: this.ruleArguments.indexOf(OPTION_IGNORE_BOUND_CLASS_METHODS) === -1,
            interfaces: this.ruleArguments.indexOf(OPTION_IGNORE_INTERFACES) === -1,
        };
        return this.applyWithWalker(new SemicolonWalker(sourceFile, this.ruleName, options));
    }
}

class SemicolonWalker extends Lint.AbstractWalker<Options> {
    private scanner?: ts.Scanner = undefined;
    public walk(sourceFile: ts.SourceFile) {
        // tslint:disable-next-line cyclomatic-complexity (Fixed in 5.3)
        const cb = (node: ts.Node): void => {
            switch (node.kind) {
                case ts.SyntaxKind.VariableStatement:
                case ts.SyntaxKind.ExpressionStatement:
                case ts.SyntaxKind.ReturnStatement:
                case ts.SyntaxKind.BreakStatement:
                case ts.SyntaxKind.ContinueStatement:
                case ts.SyntaxKind.ThrowStatement:
                case ts.SyntaxKind.ImportEqualsDeclaration:
                case ts.SyntaxKind.DoStatement:
                case ts.SyntaxKind.ExportAssignment:
                    this.checkSemicolonAt(node as ts.Statement);
                    break;
                case ts.SyntaxKind.TypeAliasDeclaration:
                case ts.SyntaxKind.ImportDeclaration:
                case ts.SyntaxKind.ExportDeclaration:
                case ts.SyntaxKind.DebuggerStatement:
                    this.checkSemicolonOrLineBreak(node);
                    break;
                case ts.SyntaxKind.ModuleDeclaration:
                    // shorthand module declaration
                    if ((node as ts.ModuleDeclaration).body === undefined) {
                        this.checkSemicolonOrLineBreak(node);
                    }
                    break;
                case ts.SyntaxKind.PropertyDeclaration:
                    this.visitPropertyDeclaration(node as ts.PropertyDeclaration);
                    break;
                case ts.SyntaxKind.MethodDeclaration:
                case ts.SyntaxKind.FunctionDeclaration:
                    if ((node as ts.FunctionLikeDeclaration).body === undefined) {
                        this.checkSemicolonOrLineBreak(node);
                    }
                    break;
                case ts.SyntaxKind.InterfaceDeclaration:
                    if (this.options.interfaces) {
                        this.checkInterface(node as ts.InterfaceDeclaration);
                    }
                    break;
                case ts.SyntaxKind.SemicolonClassElement:
                    return this.reportUnnecessary(node.end - 1);
                case ts.SyntaxKind.EmptyStatement:
                    return this.checkEmptyStatement(node);
                default:
            }
            return ts.forEachChild(node, cb);
        };
        return ts.forEachChild(sourceFile, cb);
    }

    private visitPropertyDeclaration(node: ts.PropertyDeclaration) {
        // check if this is a multi-line arrow function
        if (node.initializer !== undefined &&
            node.initializer.kind === ts.SyntaxKind.ArrowFunction &&
            ts.getLineAndCharacterOfPosition(this.sourceFile, node.getStart(this.sourceFile)).line
                !== ts.getLineAndCharacterOfPosition(this.sourceFile, node.getEnd()).line) {
            if (this.options.boundClassMethods) {
                if (this.sourceFile.text[node.end - 1] === ";" &&
                    this.isFollowedByLineBreak(node.end)) {
                    this.reportUnnecessary(node.end - 1);
                }
            }
        } else {
            this.checkSemicolonOrLineBreak(node);
        }
    }

    private isFollowedByLineBreak(pos: number) {
        const scanner = this.scanner !== undefined ? this.scanner :
            (this.scanner = ts.createScanner(this.sourceFile.languageVersion, true, this.sourceFile.languageVariant, this.sourceFile.text));
        scanner.setTextPos(pos);
        return scanner.scan() === ts.SyntaxKind.EndOfFileToken || scanner.hasPrecedingLineBreak();
    }

    private checkSemicolonOrLineBreak(node: ts.Node) {
        const hasSemicolon = this.sourceFile.text[node.end - 1] === ";";
        if (this.options.always && !hasSemicolon) {
            this.reportMissing(node.end);
        } else if (!this.options.always && hasSemicolon && this.isFollowedByLineBreak(node.end)) {
            // semicolon can be removed if followed by line break;
            this.reportUnnecessary(node.end - 1);
        }
    }

    private checkEmptyStatement(node: ts.Node) {
        // An empty statement is only ever useful when it is the only statement inside a loop
        if (!utils.isIterationStatement(node.parent!)) {
            const parentKind = node.parent!.kind;
            // don't remove empty statement if it is a direct child of if, with or a LabeledStatement
            // otherwise this would unintentionally change control flow
            const noFix = parentKind === ts.SyntaxKind.IfStatement ||
                          parentKind === ts.SyntaxKind.LabeledStatement ||
                          parentKind === ts.SyntaxKind.WithStatement;
            this.reportUnnecessary(node.end - 1, noFix);
        }
    }

    private checkInterface(node: ts.InterfaceDeclaration) {
        for (const member of node.members) {
            const lastChar = this.sourceFile.text[member.end - 1];
            const hasSemicolon = lastChar === ";";
            if (this.options.always && !hasSemicolon) {
                if (lastChar === ",") {
                    this.addFailureAt(member.end - 1, 1, Rule.FAILURE_STRING_COMMA, new Lint.Replacement(member.end - 1, 1, ";"));
                } else {
                    this.reportMissing(member.end);
                }
            } else if (!this.options.always && hasSemicolon &&
                       (member === node.members[node.members.length - 1] || this.isFollowedByLineBreak(member.end))) {
                this.reportUnnecessary(member.end - 1);
            }
        }
    }

    private reportMissing(pos: number) {
        this.addFailureAt(pos, 0, Rule.FAILURE_STRING_MISSING, Lint.Replacement.appendText(pos, ";"));
    }

    private reportUnnecessary(pos: number, noFix?: boolean) {
        this.addFailureAt(pos, 1, Rule.FAILURE_STRING_UNNECESSARY, noFix === true ? undefined : Lint.Replacement.deleteText(pos, 1));
    }

    private checkSemicolonAt(node: ts.Statement) {
        const hasSemicolon = this.sourceFile.text[node.end - 1] === ";";

        if (this.options.always && !hasSemicolon) {
            this.reportMissing(node.end);
        } else if (!this.options.always && hasSemicolon) {
            switch (utils.getNextToken(node, this.sourceFile)!.kind) {
                case ts.SyntaxKind.OpenParenToken:
                case ts.SyntaxKind.OpenBracketToken:
                case ts.SyntaxKind.PlusToken:
                case ts.SyntaxKind.MinusToken:
                case ts.SyntaxKind.RegularExpressionLiteral:
                    break;
                default:
                    if (!this.isFollowedByStatement(node)) {
                        this.reportUnnecessary(node.end - 1);
                    }
            }
        }
    }

    private isFollowedByStatement(node: ts.Statement): boolean {
        const nextStatement = utils.getNextStatement(node);
        if (nextStatement === undefined) {
            return false;
        }
        return ts.getLineAndCharacterOfPosition(this.sourceFile, node.end).line
            === ts.getLineAndCharacterOfPosition(this.sourceFile, nextStatement.getStart(this.sourceFile)).line;
    }
}
