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
const OPTION_STRICT_BOUND_CLASS_METHODS = "strict-bound-class-methods";
const OPTION_IGNORE_INTERFACES = "ignore-interfaces";

const enum BoundClassMethodOption {
    Default,
    Ignore,
    Strict,
}

interface Options {
    boundClassMethods: BoundClassMethodOption;
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
            * \`"${OPTION_IGNORE_BOUND_CLASS_METHODS}"\` skips checking semicolons at the end of bound class methods.
            * \`"${OPTION_STRICT_BOUND_CLASS_METHODS}"\` disables any special handling of bound class methods and treats them as any
            other assignment. This option overrides \`"${OPTION_IGNORE_BOUND_CLASS_METHODS}"\`.
        `,
        options: {
            type: "array",
            items: [
                {
                    type: "string",
                    enum: [OPTION_ALWAYS, OPTION_NEVER],
                },
                {
                    type: "string",
                    enum: [OPTION_IGNORE_INTERFACES],
                },
            ],
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
            boundClassMethods:
                this.ruleArguments.indexOf(OPTION_STRICT_BOUND_CLASS_METHODS) !== -1
                    ? BoundClassMethodOption.Strict
                    : this.ruleArguments.indexOf(OPTION_IGNORE_BOUND_CLASS_METHODS) !== -1
                        ? BoundClassMethodOption.Ignore
                        : BoundClassMethodOption.Default,
            interfaces: this.ruleArguments.indexOf(OPTION_IGNORE_INTERFACES) === -1,
        };
        const Walker =
            this.ruleArguments.indexOf(OPTION_NEVER) === -1
                ? SemicolonAlwaysWalker
                : SemicolonNeverWalker;
        return this.applyWithWalker(new Walker(sourceFile, this.ruleName, options));
    }
}

abstract class SemicolonWalker extends Lint.AbstractWalker<Options> {
    public walk(sourceFile: ts.SourceFile) {
        const cb = (node: ts.Node): void => {
            this.visitNode(node);
            return ts.forEachChild(node, cb);
        };
        return ts.forEachChild(sourceFile, cb);
    }

    protected visitNode(node: ts.Node) {
        switch (node.kind) {
            case ts.SyntaxKind.SemicolonClassElement:
                return this.reportUnnecessary(node.end);
            case ts.SyntaxKind.EmptyStatement:
                return this.checkEmptyStatement(node);
            case ts.SyntaxKind.PropertyDeclaration:
                return this.visitPropertyDeclaration(node as ts.PropertyDeclaration);
        }
    }

    protected reportUnnecessary(pos: number, noFix?: boolean) {
        this.addFailure(
            pos - 1,
            pos,
            Rule.FAILURE_STRING_UNNECESSARY,
            noFix ? undefined : Lint.Replacement.deleteText(pos - 1, 1),
        );
    }

    protected checkSemicolonOrLineBreak(node: ts.Node) {
        if (this.sourceFile.text[node.end - 1] !== ";") {
            return;
        }
        const nextToken = utils.getNextToken(node, this.sourceFile)!;
        switch (nextToken.kind) {
            case ts.SyntaxKind.EndOfFileToken:
            case ts.SyntaxKind.CloseBraceToken:
                return this.reportUnnecessary(node.end);
            default:
                if (!utils.isSameLine(this.sourceFile, node.end, nextToken.end)) {
                    this.reportUnnecessary(node.end);
                }
        }
    }

    protected checkUnnecessary(node: ts.Node) {
        if (this.sourceFile.text[node.end - 1] !== ";") {
            return;
        }
        const lastToken = utils.getPreviousToken(
            node.getLastToken(this.sourceFile)!,
            this.sourceFile,
        )!;
        // yield does not continue on the next line if there is no yielded expression
        if (
            (lastToken.kind === ts.SyntaxKind.YieldKeyword &&
                lastToken.parent.kind === ts.SyntaxKind.YieldExpression) ||
            // arrow functions with block as body don't continue on the next line
            (lastToken.kind === ts.SyntaxKind.CloseBraceToken &&
                lastToken.parent.kind === ts.SyntaxKind.Block &&
                lastToken.parent.parent.kind === ts.SyntaxKind.ArrowFunction)
        ) {
            return this.checkSemicolonOrLineBreak(node);
        }
        const nextToken = utils.getNextToken(node, this.sourceFile)!;
        switch (nextToken.kind) {
            case ts.SyntaxKind.OpenParenToken:
            case ts.SyntaxKind.OpenBracketToken:
            case ts.SyntaxKind.PlusToken:
            case ts.SyntaxKind.MinusToken:
            case ts.SyntaxKind.RegularExpressionLiteral:
            case ts.SyntaxKind.LessThanToken:
            case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
            case ts.SyntaxKind.TemplateHead:
                break;
            case ts.SyntaxKind.CloseBraceToken:
            case ts.SyntaxKind.EndOfFileToken:
                return this.reportUnnecessary(node.end);
            default:
                if (!utils.isSameLine(this.sourceFile, node.end, nextToken.end)) {
                    this.reportUnnecessary(node.end);
                }
        }
    }

    protected abstract checkPropertyDeclaration(node: ts.PropertyDeclaration): void;

    private checkEmptyStatement(node: ts.Node) {
        // An empty statement is only ever useful when it is the only statement inside a loop
        if (!utils.isIterationStatement(node.parent)) {
            const parentKind = node.parent.kind;
            // don't remove empty statement if it is a direct child of if, with or a LabeledStatement
            // otherwise this would unintentionally change control flow
            const noFix =
                parentKind === ts.SyntaxKind.IfStatement ||
                parentKind === ts.SyntaxKind.LabeledStatement ||
                parentKind === ts.SyntaxKind.WithStatement;
            this.reportUnnecessary(node.end, noFix);
        }
    }

    private visitPropertyDeclaration(node: ts.PropertyDeclaration) {
        // check if this is a multi-line arrow function
        if (
            this.options.boundClassMethods !== BoundClassMethodOption.Strict &&
            node.initializer !== undefined &&
            node.initializer.kind === ts.SyntaxKind.ArrowFunction &&
            !utils.isSameLine(this.sourceFile, node.getStart(this.sourceFile), node.end)
        ) {
            if (this.options.boundClassMethods === BoundClassMethodOption.Default) {
                this.checkUnnecessary(node);
            }
        } else {
            this.checkPropertyDeclaration(node);
        }
    }
}

class SemicolonAlwaysWalker extends SemicolonWalker {
    protected visitNode(node: ts.Node) {
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
            case ts.SyntaxKind.TypeAliasDeclaration:
            case ts.SyntaxKind.ImportDeclaration:
            case ts.SyntaxKind.ExportDeclaration:
            case ts.SyntaxKind.DebuggerStatement:
                return this.checkMissing(node);
            case ts.SyntaxKind.ModuleDeclaration:
            case ts.SyntaxKind.MethodDeclaration:
            case ts.SyntaxKind.FunctionDeclaration:
                // check shorthand module declarations and method / function signatures
                if (
                    (node as ts.FunctionLikeDeclaration | ts.ModuleDeclaration).body === undefined
                ) {
                    this.checkMissing(node);
                }
                break;
            case ts.SyntaxKind.InterfaceDeclaration:
                if (this.options.interfaces) {
                    this.checkInterface(node as ts.InterfaceDeclaration);
                }
                break;
            default:
                return super.visitNode(node);
        }
    }

    protected checkPropertyDeclaration(node: ts.PropertyDeclaration) {
        return this.checkMissing(node);
    }

    private checkMissing(node: ts.Node) {
        if (this.sourceFile.text[node.end - 1] !== ";") {
            this.reportMissing(node.end);
        }
    }

    private reportMissing(pos: number) {
        this.addFailureAt(
            pos,
            0,
            Rule.FAILURE_STRING_MISSING,
            Lint.Replacement.appendText(pos, ";"),
        );
    }

    private checkInterface(node: ts.InterfaceDeclaration) {
        for (const member of node.members) {
            switch (this.sourceFile.text[member.end - 1]) {
                case ";":
                    break;
                case ",":
                    this.addFailureAt(
                        member.end - 1,
                        1,
                        Rule.FAILURE_STRING_COMMA,
                        new Lint.Replacement(member.end - 1, 1, ";"),
                    );
                    break;
                default:
                    this.reportMissing(member.end);
            }
        }
    }
}

class SemicolonNeverWalker extends SemicolonWalker {
    protected visitNode(node: ts.Node) {
        switch (node.kind) {
            case ts.SyntaxKind.ExpressionStatement:
            case ts.SyntaxKind.ThrowStatement:
            case ts.SyntaxKind.ExportAssignment:
                return this.checkUnnecessary(node as ts.Statement);
            case ts.SyntaxKind.VariableStatement:
                return this.checkVariableStatement(node as ts.VariableStatement);
            case ts.SyntaxKind.ReturnStatement:
                if ((node as ts.ReturnStatement).expression === undefined) {
                    // return does not continue on the next line if the is no returned expression
                    return this.checkSemicolonOrLineBreak(node);
                }
                return this.checkUnnecessary(node);
            case ts.SyntaxKind.TypeAliasDeclaration:
            case ts.SyntaxKind.ImportEqualsDeclaration:
            case ts.SyntaxKind.ImportDeclaration:
            case ts.SyntaxKind.ExportDeclaration:
            case ts.SyntaxKind.DebuggerStatement:
            case ts.SyntaxKind.BreakStatement:
            case ts.SyntaxKind.ContinueStatement:
            case ts.SyntaxKind.DoStatement:
                return this.checkSemicolonOrLineBreak(node);
            case ts.SyntaxKind.ModuleDeclaration:
                // shorthand module declaration
                if ((node as ts.ModuleDeclaration).body === undefined) {
                    this.checkShorthandModuleDeclaration(node as ts.ModuleDeclaration);
                }
                break;
            case ts.SyntaxKind.MethodDeclaration:
                // check method signature
                if ((node as ts.MethodDeclaration).body === undefined) {
                    this.checkSemicolonOrLineBreak(node);
                }
                break;
            case ts.SyntaxKind.FunctionDeclaration:
                // check function signature
                if ((node as ts.FunctionDeclaration).body === undefined) {
                    this.checkSemicolonOrLineBreak(node);
                }
                break;
            case ts.SyntaxKind.InterfaceDeclaration:
                if (this.options.interfaces) {
                    this.checkInterface(node as ts.InterfaceDeclaration);
                }
                break;
            default:
                return super.visitNode(node);
        }
    }

    protected checkPropertyDeclaration(node: ts.PropertyDeclaration) {
        if (node.initializer === undefined) {
            return this.checkSemicolonOrLineBreak(node);
        }
        return this.checkUnnecessary(node);
    }

    private checkVariableStatement(node: ts.VariableStatement) {
        const declarations = node.declarationList.declarations;
        if (
            declarations.length !== 0 &&
            declarations[declarations.length - 1].initializer === undefined
        ) {
            // variable declaration does not continue on the next line if it has no initializer
            return this.checkSemicolonOrLineBreak(node);
        }
        return this.checkUnnecessary(node);
    }

    private checkShorthandModuleDeclaration(node: ts.ModuleDeclaration) {
        const nextStatement = utils.getNextStatement(node);
        if (nextStatement === undefined || nextStatement.kind !== ts.SyntaxKind.Block) {
            this.checkSemicolonOrLineBreak(node);
        }
    }

    private checkInterface(node: ts.InterfaceDeclaration) {
        for (const member of node.members) {
            this.checkSemicolonOrLineBreak(member);
        }
    }
}
