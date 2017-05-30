/**
 * @license
 * Copyright 2017 Palantir Technologies, Inc.
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

import { isBlock, isCaseOrDefaultClause, isIfStatement } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export const OPTION_MAX_LENGTH = "max-length";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "early-return",
        description: Lint.Utils.dedent`
            Suggests to use an early exit (such as 'return', 'continue', or 'break' from a switch statement)
            instead of leaving a large amount of code inside of an 'if' (or 'else') block.
            (Code is determined to be large based on the number of lines it takes up.)

            Note: If both' if' and 'else' blocks are present, this rule will only activate if
            one of them is a single line and the other is large.`,
        rationale: "Reduces indentation and requires less context to be held in mind at once.",
        optionsDescription: Lint.Utils.dedent`
            An options object may optionally be provided:

            * \`${OPTION_MAX_LENGTH}\` is the maximum allowed size (in lines)
              of an 'if' (or 'else') block before an early return is recommended.`,
        options: null,
        optionExamples: [true, [true, { [OPTION_MAX_LENGTH]: 4 }]],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING(exit: string): string {
        return `Remainder of block is inside 'if' statement. Prefer to invert the condition and '${exit}' early.`;
    }
    public static FAILURE_STRING_SMALL(exit: string, branch: "else" | "then"): string {
        return `'${branch}' branch is small; prefer an early '${exit}' to a full if-else.`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const options = { "max-length": 2, ...(this.ruleArguments[0] as Partial<Options> | undefined) };
        return this.applyWithFunction(sourceFile, walk, options);
    }
}

interface Options {
    "max-length": number;
}

function walk(ctx: Lint.WalkContext<Options>): void {
    const { sourceFile, options: { "max-length": maxLineLength } } = ctx;

    ts.forEachChild(sourceFile, function cb(node) {
        if (isIfStatement(node)) {
            check(node);
        }
        ts.forEachChild(node, cb);
    });

    function check(node: ts.IfStatement): void {
        const exit = getExit(node);
        if (exit === undefined) {
            return;
        }

        const { thenStatement, elseStatement } = node;
        const thenSize = size(thenStatement, sourceFile);

        if (elseStatement === undefined) {
            if (isLarge(thenSize)) {
                fail(Rule.FAILURE_STRING(exit));
            }
            return;
        }

        // Never fail if there's an `else if`.
        if (isIfStatement(elseStatement)) {
            return;
        }

        const elseSize = size(elseStatement, sourceFile);

        if (isSmall(thenSize) && isLarge(elseSize)) {
            fail(Rule.FAILURE_STRING_SMALL(exit, "then"));
        } else if (isSmall(elseSize) && isLarge(thenSize)) {
            fail(Rule.FAILURE_STRING_SMALL(exit, "else"));
        }

        function fail(failure: string) {
            ctx.addFailureAtNode(Lint.childOfKind(node, ts.SyntaxKind.IfKeyword)!, failure);
        }
    }

    function isSmall(size: number): boolean {
        return size === 1;
    }

    function isLarge(size: number): boolean {
        return size > maxLineLength;
    }
}

function size(node: ts.Node, sourceFile: ts.SourceFile): number {
    return isBlock(node)
        ? node.statements.length === 0 ? 0 : diff(node.statements[0], last(node.statements), sourceFile)
        : diff(node, node, sourceFile);
}

function diff(a: ts.Node, b: ts.Node, sourceFile: ts.SourceFile): number {
    const start = sourceFile.getLineAndCharacterOfPosition(a.getStart()).line;
    const end = sourceFile.getLineAndCharacterOfPosition(b.getEnd()).line;
    return end - start + 1;
}

function getExit(node: ts.IfStatement): string | undefined {
    const parent = node.parent!;
    if (isBlock(parent)) {
        const container = parent.parent!;
        return isCaseOrDefaultClause(container) && container.statements.length === 1
            ? getCaseClauseExit(container, parent, node)
            // Must be the last statement in the block
            : isLastStatement(node, parent.statements) ? getEarlyExitKind(container) : undefined;
    } else {
        return isCaseOrDefaultClause(parent)
            ? getCaseClauseExit(parent, parent, node)
            // This is the only statement in its container, so of course it's the final statement.
            : getEarlyExitKind(parent);
    }
}

function getCaseClauseExit(
    clause: ts.CaseOrDefaultClause,
    { statements }: ts.CaseOrDefaultClause | ts.Block,
    node: ts.IfStatement): string | undefined {
    return last(statements).kind === ts.SyntaxKind.BreakStatement
        // Must be the last node before the break statement
        ? isLastStatement(node, statements, statements.length - 2) ? "break" : undefined
        // If no 'break' statement, this is a fallthrough, unless we're at the last clause.
        : last(clause.parent!.clauses) === clause && isLastStatement(node, statements) ? "break" : undefined;
}

function getEarlyExitKind({ kind }: ts.Node): string | undefined {
    switch (kind) {
        case ts.SyntaxKind.FunctionDeclaration:
        case ts.SyntaxKind.FunctionExpression:
        case ts.SyntaxKind.ArrowFunction:
        case ts.SyntaxKind.MethodDeclaration:
        case ts.SyntaxKind.Constructor:
        case ts.SyntaxKind.GetAccessor:
        case ts.SyntaxKind.SetAccessor:
            return "return";

        case ts.SyntaxKind.ForInStatement:
        case ts.SyntaxKind.ForOfStatement:
        case ts.SyntaxKind.ForStatement:
        case ts.SyntaxKind.WhileStatement:
        case ts.SyntaxKind.DoStatement:
            return "continue";

        default:
            // At any other location, we can't use an early exit.
            // (TODO: maybe we could, but we would need more control flow information here.)
            // (Cause clauses handled separately.)
            return undefined;
    }
}

function isLastStatement(ifStatement: ts.IfStatement, statements: ReadonlyArray<ts.Statement>, i: number = statements.length - 1): boolean {
    while (true) { // tslint:disable-line strict-boolean-expressions (Fixed in tslint 5.3)
        const statement = statements[i];
        if (statement === ifStatement) {
            return true;
        }
        if (statement.kind !== ts.SyntaxKind.FunctionDeclaration) {
            return false;
        }
        if (i === 0) {
            // ifStatement should have been in statements
            throw new Error();
        }
        i--;
    }
}

function last<T>(arr: ReadonlyArray<T>): T {
    return arr[arr.length - 1];
}
