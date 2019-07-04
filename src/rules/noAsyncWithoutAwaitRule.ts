/**
 * @license
 * Copyright 2018 Palantir Technologies, Inc.
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

import * as tsutils from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

import { codeExamples } from "./code-examples/noAsyncWithoutAwait.examples";

type FunctionNodeType =
    | ts.ArrowFunction
    | ts.FunctionDeclaration
    | ts.MethodDeclaration
    | ts.FunctionExpression;

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING =
        "Functions marked async must contain an await or return statement.";

    public static metadata: Lint.IRuleMetadata = {
        codeExamples,
        description: Rule.FAILURE_STRING,
        hasFix: false,
        optionExamples: [true],
        options: null,
        optionsDescription: "Not configurable.",
        /* tslint:disable:max-line-length */
        rationale: Lint.Utils.dedent`
        Marking a function as \`async\` without using \`await\` or returning a value inside it can lead to an unintended promise return and a larger transpiled output.
        Often the function can be synchronous and the \`async\` keyword is there by mistake.
        Return statements are allowed as sometimes it is desirable to wrap the returned value in a Promise.`,
        /* tslint:enable:max-line-length */
        ruleName: "no-async-without-await",
        type: "functionality",
        typescriptOnly: false,
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(context: Lint.WalkContext) {
    const reportFailureIfAsyncFunction = (node: FunctionNodeType) => {
        const asyncModifier = getAsyncModifier(node);
        if (asyncModifier !== undefined) {
            context.addFailureAt(
                asyncModifier.getStart(),
                asyncModifier.getEnd() - asyncModifier.getStart(),
                Rule.FAILURE_STRING,
            );
        }
    };

    const addFailureIfAsyncFunctionHasNoAwait = (node: FunctionNodeType) => {
        if (node.body === undefined) {
            if (node.type === undefined) {
                reportFailureIfAsyncFunction(node);
            }
            return;
        }

        if (
            !isShortArrowReturn(node) &&
            !functionBlockHasAwait(node.body) &&
            !functionBlockHasReturn(node.body)
        ) {
            reportFailureIfAsyncFunction(node);
        }
    };

    return ts.forEachChild(context.sourceFile, function visitNode(node): void {
        if (
            tsutils.isArrowFunction(node) ||
            tsutils.isFunctionDeclaration(node) ||
            tsutils.isFunctionExpression(node) ||
            tsutils.isMethodDeclaration(node)
        ) {
            addFailureIfAsyncFunctionHasNoAwait(node);
        }

        return ts.forEachChild(node, visitNode);
    });
}

const getAsyncModifier = (node: ts.Node) => {
    if (node.modifiers !== undefined) {
        return node.modifiers.find(modifier => modifier.kind === ts.SyntaxKind.AsyncKeyword);
    }

    return undefined;
};

const isReturn = (node: ts.Node): boolean => node.kind === ts.SyntaxKind.ReturnKeyword;

const functionBlockHasAwait = (node: ts.Node): boolean => {
    if (tsutils.isAwaitExpression(node)) {
        return true;
    }

    if (
        node.kind === ts.SyntaxKind.ArrowFunction ||
        node.kind === ts.SyntaxKind.FunctionDeclaration
    ) {
        return false;
    }

    return node.getChildren().some(functionBlockHasAwait);
};

const functionBlockHasReturn = (node: ts.Node): boolean => {
    if (isReturn(node)) {
        return true;
    }

    if (
        node.kind === ts.SyntaxKind.ArrowFunction ||
        node.kind === ts.SyntaxKind.FunctionDeclaration
    ) {
        return false;
    }

    return node.getChildren().some(functionBlockHasReturn);
};

const isShortArrowReturn = (node: FunctionNodeType) =>
    node.kind === ts.SyntaxKind.ArrowFunction && node.body.kind !== ts.SyntaxKind.Block;
