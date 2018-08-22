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

import { isConditionalExpression, isTypeFlagSet } from "tsutils";
import * as ts from "typescript";

import { needsParenthesesForNegate } from "..";
import * as Lint from "../index";

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-boolean-literal-in-conditional",
        description: Lint.Utils.dedent`
            Forbids either of a conditional expression's branches to be a boolean literal.
            All such expressions can be simplified using logical operators.`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING(desc: string): string {
        return `Conditional expression with a boolean literal can be simplified to '${desc}'.`;
    }

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, (ctx) => walk(ctx, program.getTypeChecker()));
    }
}

function walk(ctx: Lint.WalkContext<void>, checker: ts.TypeChecker): void {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (isConditionalExpression(node)) {
            const failure = check(node, checker);
            if (failure !== undefined) {
                ctx.addFailureAtNode(node, Rule.FAILURE_STRING(failure.desc), failure.fix);
            }
        }
        return ts.forEachChild(node, cb);
    });
}

function check(node: ts.ConditionalExpression, checker: ts.TypeChecker): { desc: string; fix: Lint.Fix | undefined } | undefined {
    const { condition, whenTrue, whenFalse } = node;
    const l = getLiteralBoolean(whenTrue);
    const r = getLiteralBoolean(whenFalse);
    // Perf: only check type of condition if there would be a failure otherwise
    if ((l !== undefined || r !== undefined) && !isBoolean(condition, checker)) {
        return undefined;
    }

    if (l !== undefined && r !== undefined) {
        const deleteThenAndElse = Lint.Replacement.deleteFromTo(condition.getEnd(), node.getEnd());
        if (l && !r) {
            return { desc: "x", fix: deleteThenAndElse };
        } else if (!l && r) {
            return { desc: "!x", fix: [...negateCondition(), deleteThenAndElse] };
        } else {
            // Don't try fixing `? true : true` or ? false : false`, they probably were typos that should be examined.
            return { desc: l.toString(), fix: undefined };
        }
    } else if (l !== undefined && isBoolean(whenFalse, checker)) {
        const op = (operator: string) =>
            Lint.Replacement.replaceFromTo(condition.getEnd(), whenFalse.getStart(), ` ${operator} `);
        if (l) {
            // `b ? true : c` -> `b || c`
            return { desc: "x || y", fix: op("||") };
        } else {
            // `b ? false : c` -> `!b && c`
            return { desc: "!x && y", fix: [...negateCondition(), op("&&")] };
        }
    } else if (r !== undefined && isBoolean(whenTrue, checker)) {
        const op = (operator: string) =>
            Lint.Replacement.replaceFromTo(condition.getEnd(), whenTrue.getStart(), ` ${operator} `);
        const deleteElse = Lint.Replacement.deleteFromTo(whenTrue.getEnd(), whenFalse.getEnd());
        if (r) {
            // `b ? c : true` -> `!b || c`
            return { desc: "!x || y", fix: [...negateCondition(), op("||"), deleteElse] };
            // `b ? c : false` -> `b && c`
        } else {
            return { desc: "x && y", fix: [op("&&"), deleteElse] };
        }
    } else {
        return undefined;
    }

    function negateCondition(): Lint.Replacement[] {
        return needsParenthesesForNegate(condition)
            ? [
                Lint.Replacement.appendText(condition.getStart(), "!("),
                Lint.Replacement.appendText(condition.getEnd(), ")"),
            ]
            : [Lint.Replacement.appendText(condition.getStart(), "!")];
    }
}

function isBoolean(node: ts.Expression, checker: ts.TypeChecker): boolean {
    return isTypeFlagSet(checker.getTypeAtLocation(node), ts.TypeFlags.Boolean);
}

function getLiteralBoolean(node: ts.Expression): boolean | undefined {
    switch (node.kind) {
        case ts.SyntaxKind.TrueKeyword:
            return true;
        case ts.SyntaxKind.FalseKeyword:
            return false;
        default:
            return undefined;
    }
}
