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

import { isConstructorDeclaration, isIterationStatement } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-duplicate-super",
        description: "Warns if 'super()' appears twice in a constructor.",
        rationale: "The second call to 'super()' will fail at runtime.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_DUPLICATE =
        "Multiple calls to 'super()' found. It must be called only once.";
    public static FAILURE_STRING_LOOP = "'super()' called in a loop. It must be called only once.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>): void {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (isConstructorDeclaration(node) && node.body !== undefined) {
            getSuperForNode(node.body);
        }
        return ts.forEachChild(node, cb);
    });

    function getSuperForNode(node: ts.Node): Super {
        if (isIterationStatement(node)) {
            const bodySuper = combineSequentialChildren(node);
            if (typeof bodySuper === "number") {
                return Kind.NoSuper;
            }
            if (!bodySuper.break) {
                ctx.addFailureAtNode(bodySuper.node, Rule.FAILURE_STRING_LOOP);
            }
            return { ...bodySuper, break: false };
        }

        switch (node.kind) {
            case ts.SyntaxKind.ReturnStatement:
            case ts.SyntaxKind.ThrowStatement:
                return Kind.Return;

            case ts.SyntaxKind.BreakStatement:
                return Kind.Break;

            case ts.SyntaxKind.ClassDeclaration:
            case ts.SyntaxKind.ClassExpression:
                // 'super()' is bound differently inside, so ignore.
                return Kind.NoSuper;

            case ts.SyntaxKind.SuperKeyword:
                return node.parent.kind === ts.SyntaxKind.CallExpression &&
                    (node.parent as ts.CallExpression).expression === node
                    ? { node: node.parent as ts.CallExpression, break: false }
                    : Kind.NoSuper;

            case ts.SyntaxKind.ConditionalExpression: {
                const { condition, whenTrue, whenFalse } = node as ts.ConditionalExpression;
                const inCondition = getSuperForNode(condition);
                const inBranches = worse(getSuperForNode(whenTrue), getSuperForNode(whenFalse));
                if (typeof inCondition !== "number" && typeof inBranches !== "number") {
                    addDuplicateFailure(inCondition.node, inBranches.node);
                }
                return worse(inCondition, inBranches);
            }

            case ts.SyntaxKind.IfStatement: {
                const { thenStatement, elseStatement } = node as ts.IfStatement;
                return worse(
                    getSuperForNode(thenStatement),
                    elseStatement !== undefined ? getSuperForNode(elseStatement) : Kind.NoSuper,
                );
            }

            case ts.SyntaxKind.SwitchStatement:
                return getSuperForSwitch(node as ts.SwitchStatement);

            default:
                return combineSequentialChildren(node);
        }
    }

    function getSuperForSwitch(node: ts.SwitchStatement): Super {
        // 'super()' from any clause. Used to track whether 'super()' happens in the switch at all.
        let foundSingle: ts.CallExpression | undefined;
        // 'super()' from the previous clause if it did not 'break;'.
        let fallthroughSingle: ts.CallExpression | undefined;
        for (const clause of node.caseBlock.clauses) {
            const clauseSuper = combineSequentialChildren(clause);
            switch (clauseSuper) {
                case Kind.NoSuper:
                    break;

                case Kind.Break:
                    fallthroughSingle = undefined;
                    break;

                case Kind.Return:
                    return Kind.NoSuper;

                default:
                    if (fallthroughSingle !== undefined) {
                        addDuplicateFailure(fallthroughSingle, clauseSuper.node);
                    }
                    if (!clauseSuper.break) {
                        fallthroughSingle = clauseSuper.node;
                    }
                    foundSingle = clauseSuper.node;
            }
        }

        return foundSingle !== undefined ? { node: foundSingle, break: false } : Kind.NoSuper;
    }

    /**
     * Combines children that come one after another.
     * (As opposed to if/else, switch, or loops, which need their own handling.)
     */
    function combineSequentialChildren(node: ts.Node): Super {
        let seenSingle: Single | undefined;
        const res = ts.forEachChild<Super | undefined>(node, child => {
            const childSuper = getSuperForNode(child);
            switch (childSuper) {
                case Kind.NoSuper:
                    return undefined;

                case Kind.Break:
                    if (seenSingle !== undefined) {
                        return { ...seenSingle, break: true };
                    }
                    return childSuper;

                case Kind.Return:
                    return childSuper;

                default:
                    if (seenSingle !== undefined && !seenSingle.break) {
                        addDuplicateFailure(seenSingle.node, childSuper.node);
                    }
                    seenSingle = childSuper;
                    return undefined;
            }
        });
        return res !== undefined ? res : seenSingle !== undefined ? seenSingle : Kind.NoSuper;
    }

    function addDuplicateFailure(a: ts.Node, b: ts.Node): void {
        ctx.addFailure(a.getStart(), b.end, Rule.FAILURE_STRING_DUPLICATE);
    }
}

/** Kind of 'super()' use in a node. */
type Super = Kind | Single;
const enum Kind {
    /** 'super()' never called. */
    NoSuper,
    /** This node returns. It doesn't matter whether 'super()' was called in it. */
    Return,
    /** This node breaks, and doesn't have 'super()'. */
    Break,
}
/** Represents a single 'super()' call. */
interface Single {
    /** Node of the 'super()' call. */
    node: ts.CallExpression;
    /** Whether it is followed by 'break;'. */
    break: boolean;
}

// If/else run separately, so return the branch more likely to result in eventual errors.
function worse(a: Super, b: Super): Super {
    return typeof a === "number"
        ? typeof b === "number"
            ? a < b
                ? b
                : a
            : b
        : typeof b === "number"
            ? a
            : a.break
                ? b
                : a;
}
