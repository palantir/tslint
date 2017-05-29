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

import { isBlock, isIfStatement, isIterationStatement, isSameLine } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

const OPTION_NEVER = "never";
const OPTION_IGNORE_SAME_LINE = "ignore-same-line";

interface Options {
    ignoreSameLine: boolean;
}

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "curly",
        description: "Enforces braces for `if`/`for`/`do`/`while` statements.",
        rationale: Lint.Utils.dedent`
            \`\`\`ts
            if (foo === bar)
                foo++;
                bar++;
            \`\`\`

            In the code above, the author almost certainly meant for both \`foo++\` and \`bar++\`
            to be executed only if \`foo === bar\`. However, he forgot braces and \`bar++\` will be executed
            no matter what. This rule could prevent such a mistake.`,
        optionsDescription: Lint.Utils.dedent`
            One of the following options may be provided:

            * \`"${OPTION_NEVER}"\` forbids any unnecessary curly braces.
            * \`"${OPTION_IGNORE_SAME_LINE}"\` skips checking braces for control-flow statements
            that are on one line and start on the same line as their control-flow keyword
        `,
        options: {
            type: "array",
            items: {
                type: "string",
                enum: [
                    OPTION_NEVER,
                    OPTION_IGNORE_SAME_LINE,
                ],
            },
        },
        optionExamples: [
            true,
            [true, "ignore-same-line"],
            [true, "never"],
        ],
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_NEVER = "Block contains only one statement; remove the curly braces.";
    public static FAILURE_STRING_FACTORY(kind: string) {
        return `${kind} statements must be braced`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        if (this.ruleArguments.indexOf(OPTION_NEVER) !== -1) {
            return this.applyWithFunction(sourceFile, walkNever);
        }

        return this.applyWithWalker(new CurlyWalker(sourceFile, this.ruleName, {
            ignoreSameLine: this.ruleArguments.indexOf(OPTION_IGNORE_SAME_LINE) !== -1,
        }));
    }
}

function walkNever(ctx: Lint.WalkContext<void>): void {
    ts.forEachChild(ctx.sourceFile, function cb(node) {
        if (isBlock(node) && isBlockUnnecessary(node)) {
            ctx.addFailureAtNode(Lint.childOfKind(node, ts.SyntaxKind.OpenBraceToken)!, Rule.FAILURE_STRING_NEVER);
        }
        ts.forEachChild(node, cb);
    });
}

function isBlockUnnecessary(node: ts.Block): boolean {
    const parent = node.parent!;
    if (node.statements.length !== 1) { return false; }
    const statement = node.statements[0];
    if (isIterationStatement(parent)) { return true; }
    /*
    Watch out for this case:
    if (so) {
        if (also)
            foo();
    } else
        bar();
    */
    return isIfStatement(parent) && !(isIfStatement(statement)
        && statement.elseStatement === undefined
        && parent.thenStatement === node
        && parent.elseStatement !== undefined);
}

class CurlyWalker extends Lint.AbstractWalker<Options> {
    public walk(sourceFile: ts.SourceFile) {
        const cb = (node: ts.Node): void => {
            if (isIterationStatement(node)) {
                this.checkStatement(node.statement, node, 0, node.end);
            } else if (isIfStatement(node)) {
                this.checkStatement(node.thenStatement, node, 0);
                if (node.elseStatement !== undefined && node.elseStatement.kind !== ts.SyntaxKind.IfStatement) {
                    this.checkStatement(node.elseStatement, node, 5);
                }
            }
            return ts.forEachChild(node, cb);
        };
        return ts.forEachChild(sourceFile, cb);
    }

    private checkStatement(statement: ts.Statement, node: ts.Node, childIndex: number, end = statement.end) {
        if (statement.kind !== ts.SyntaxKind.Block &&
            !(this.options.ignoreSameLine && isSameLine(this.sourceFile, statement.pos, statement.end))) {
            const token = node.getChildAt(childIndex, this.sourceFile);
            const tokenText = ts.tokenToString(token.kind);
            this.addFailure(token.end - tokenText.length, end, Rule.FAILURE_STRING_FACTORY(tokenText));
        }
    }
}
