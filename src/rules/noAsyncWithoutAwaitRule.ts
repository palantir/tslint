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

import * as ts from "typescript";
import * as Lint from "../index";
import { codeExamples } from "./code-examples/noAsyncWithoutAwait.examples";

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: Lint.IRuleMetadata = {
        codeExamples,
        description: "Do not write async functions that do not have an await statement in them",
        hasFix: false,
        optionExamples: [true],
        options: null,
        optionsDescription: "Not configurable.",
        rationale: "Cleaner code, can possibly reduce transpiled output",
        ruleName: "no-async-without-await",
        type: "functionality",
        typescriptOnly: false,
    };

    public static FAILURE_STRING = "Async functions with no await are not allowed.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new Walk(sourceFile, this.getOptions()));
    }
}

class Walk extends Lint.RuleWalker {
    protected visitFunctionDeclaration(node: ts.FunctionDeclaration) {
        this.addFailureIfAsyncFunctionHasNoAwait(node);
        super.visitFunctionDeclaration(node);
    }

    protected visitArrowFunction(node: ts.ArrowFunction) {
        this.addFailureIfAsyncFunctionHasNoAwait(node);
        super.visitArrowFunction(node);
    }

    protected visitMethodDeclaration(node: ts.MethodDeclaration) {
        this.addFailureIfAsyncFunctionHasNoAwait(node);
        super.visitMethodDeclaration(node);
    }

    private isAsyncFunction(node: ts.Node): boolean {
        return Boolean(this.getAsyncModifier(node));
    }

    private getAsyncModifier(node: ts.Node) {
        return node.modifiers && node.modifiers.find((modifier) => modifier.kind === ts.SyntaxKind.AsyncKeyword);
    }

    private isAwait(node: ts.Node): boolean {
        return node.kind === ts.SyntaxKind.AwaitKeyword;
    }

    private functionBlockHasAwait(node: ts.Node) {
        if (this.isAwait(node)) {
            return true;
        }

        if (node.kind === ts.SyntaxKind.ArrowFunction || node.kind === ts.SyntaxKind.FunctionDeclaration) {
            return false;
        }

        const awaitInChildren: boolean[] = node.getChildren().map(this.functionBlockHasAwait.bind(this));
        return awaitInChildren.some(Boolean);
    }

    private addFailureIfAsyncFunctionHasNoAwait(node: ts.ArrowFunction | ts.FunctionDeclaration | ts.MethodDeclaration) {
        if (this.isAsyncFunction(node) && !this.functionBlockHasAwait(node.body as ts.Node)) {
            const asyncModifier = this.getAsyncModifier(node);
            if (asyncModifier) {
                this.addFailureAt(asyncModifier.getStart(), asyncModifier.getEnd() - asyncModifier.getStart(), Rule.FAILURE_STRING);
            }
        }
    }
}
