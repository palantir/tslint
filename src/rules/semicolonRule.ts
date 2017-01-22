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

const OPTION_ALWAYS = "always";
const OPTION_NEVER = "never";
const OPTION_IGNORE_BOUND_CLASS_METHODS = "ignore-bound-class-methods";
const OPTION_IGNORE_INTERFACES = "ignore-interfaces";

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

            The following arguments may be optionaly provided:

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
            `[true, "${OPTION_ALWAYS}"]`,
            `[true, "${OPTION_NEVER}"]`,
            `[true, "${OPTION_ALWAYS}", "${OPTION_IGNORE_INTERFACES}"]`,
            `[true, "${OPTION_ALWAYS}", "${OPTION_IGNORE_BOUND_CLASS_METHODS}"]`,
        ],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_MISSING = "Missing semicolon";
    public static FAILURE_STRING_COMMA = "Interface properties should be separated by semicolons";
    public static FAILURE_STRING_UNNECESSARY = "Unnecessary semicolon";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalk(sourceFile, ctx => walk(ctx, parseOptions(this.getOptions().ruleArguments)));
    }
}

type Options = Record<"ignoreInterfaces" | "ignoreBoundClassMethods" | "never" | "always", boolean>;
function parseOptions(options: any[]): Options {
    const never = hasOption(OPTION_NEVER);
    return {
        ignoreInterfaces: hasOption(OPTION_IGNORE_INTERFACES),
        ignoreBoundClassMethods: hasOption(OPTION_IGNORE_BOUND_CLASS_METHODS),
        never,
        // Backwards compatible with plain {"semicolon": true}
        always: !never && (hasOption(OPTION_ALWAYS) || (options && options.length === 0))
    }

    //TODO: parser utilities
    function hasOption(s: string){
        return options.indexOf(s) !== -1;
    }
}

function walk(ctx: Lint.WalkContext, options: Options) {
    const { sourceFile } = ctx;
    cb(sourceFile);
    return;

    function cb(node: ts.Node) {
        switch (node.kind) {
            case ts.SyntaxKind.VariableStatement:
            case ts.SyntaxKind.ExpressionStatement:
            case ts.SyntaxKind.ReturnStatement:
            case ts.SyntaxKind.BreakStatement:
            case ts.SyntaxKind.ContinueStatement:
            case ts.SyntaxKind.ThrowStatement:
            case ts.SyntaxKind.ImportDeclaration:
            case ts.SyntaxKind.ImportEqualsDeclaration:
            case ts.SyntaxKind.DoStatement:
            case ts.SyntaxKind.DebuggerStatement:
            case ts.SyntaxKind.ExportAssignment:
            case ts.SyntaxKind.TypeAliasDeclaration:
                checkSemicolonAt(node);
                break;

            case ts.SyntaxKind.FunctionDeclaration:
                if (!(node as ts.FunctionDeclaration).body) {
                    checkSemicolonAt(node);
                }
                break;

            case ts.SyntaxKind.PropertyDeclaration: {
                const { initializer } = node as ts.PropertyDeclaration;
                // check if this is a multi-line arrow function (`[^]` in the regex matches all characters including CR & LF)
                if (initializer && initializer.kind === ts.SyntaxKind.ArrowFunction && /\{[^]*\n/.test(node.getText())) {
                    if (!options.ignoreBoundClassMethods) {
                        checkSemicolonAt(node, "never");
                    }
                } else {
                    checkSemicolonAt(node);
                }
                break;
            }

            case ts.SyntaxKind.InterfaceDeclaration:
                if (options.ignoreInterfaces) {
                    break;
                }

                for (const member of (node as ts.InterfaceDeclaration).members) {
                    checkSemicolonAt(member);
                }
                break;
        }

        ts.forEachChild(node, cb);
    }

    function checkSemicolonAt(node: ts.Node, override?: "never") {
        const hasSemicolon = Lint.childOfKind(node, ts.SyntaxKind.SemicolonToken) !== undefined;
        const position = node.getStart(sourceFile) + node.getWidth(sourceFile);
        const never = override === "never" || options.never;

        if (options.always && !hasSemicolon) {
            const children = node.getChildren(sourceFile);
            const lastChild = children[children.length - 1];
            if (node.parent!.kind === ts.SyntaxKind.InterfaceDeclaration && lastChild.kind === ts.SyntaxKind.CommaToken) {
                const failureStart = lastChild.getStart(sourceFile);
                const fix = ctx.createFix(new Lint.Replacement(failureStart, lastChild.getWidth(sourceFile), ";"));
                ctx.addFailureAt(failureStart, 0, Rule.FAILURE_STRING_COMMA, fix);
            } else {
                const failureStart = Math.min(position, ctx.limit);
                const fix = ctx.createFix(Lint.Replacement.appendText(failureStart, ";"));
                ctx.addFailureAt(failureStart, 0, Rule.FAILURE_STRING_MISSING, fix);
            }
        } else if (never && hasSemicolon) {
            const scanner = ts.createScanner(ts.ScriptTarget.ES5, false, ts.LanguageVariant.Standard, sourceFile.text);
            scanner.setTextPos(position);

            let tokenKind = scanner.scan();
            while (tokenKind === ts.SyntaxKind.WhitespaceTrivia || tokenKind === ts.SyntaxKind.NewLineTrivia) {
                tokenKind = scanner.scan();
            }

            if (tokenKind !== ts.SyntaxKind.OpenParenToken && tokenKind !== ts.SyntaxKind.OpenBracketToken
                    && tokenKind !== ts.SyntaxKind.PlusToken && tokenKind !== ts.SyntaxKind.MinusToken) {
                const failureStart = Math.min(position - 1, ctx.limit);
                const fix = ctx.createFix(Lint.Replacement.deleteText(failureStart, 1));
                ctx.addFailureAt(failureStart, 1, Rule.FAILURE_STRING_UNNECESSARY, fix);
            }
        }
    }
}
