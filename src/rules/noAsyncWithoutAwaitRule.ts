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
    public static FAILURE_STRING = "Functions marked async must contain an await or return statement.";

    public static metadata: Lint.IRuleMetadata = {
        codeExamples,
        description: Rule.FAILURE_STRING,
        hasFix: false,
        optionExamples: [true],
        options: null,
        optionsDescription: "Not configurable.",
        rationale: "Cleaner code, can possibly reduce transpiled output",
        ruleName: "no-async-without-await",
        type: "functionality",
        typescriptOnly: false,
    };

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
        return this.getAsyncModifier(node) !== undefined;
    }

    private getAsyncModifier(node: ts.Node) {
        if (node.modifiers !== undefined) {
            return node.modifiers.find((modifier) => modifier.kind === ts.SyntaxKind.AsyncKeyword);
        }

        return undefined;
    }

    private isAwait(node: ts.Node): boolean {
        return node.kind === ts.SyntaxKind.AwaitKeyword;
    }

    private isReturn(node: ts.Node): boolean {
        return node.kind === ts.SyntaxKind.ReturnKeyword;
    }

    private functionBlockHasAwait(node: ts.Node): boolean {
        if (this.isAwait(node)) {
            return true;
        }

        // tslint:disable-next-line:no-unsafe-any
        if (node.kind === ts.SyntaxKind.ArrowFunction
            || node.kind === ts.SyntaxKind.FunctionDeclaration) {
            return false;
        }

        const awaitInChildren = node.getChildren()
            .map((functionBlockNode: ts.Node) => this.functionBlockHasAwait(functionBlockNode));
        return awaitInChildren.some(Boolean);
    }

    private functionBlockHasReturn(node: ts.Node): boolean {
        if (this.isReturn(node)) {
            return true;
        }

        // tslint:disable-next-line:no-unsafe-any
        if (node.kind === ts.SyntaxKind.ArrowFunction
            || node.kind === ts.SyntaxKind.FunctionDeclaration) {
            return false;
        }

        const returnInChildren = node.getChildren()
            .map((functionBlockNode: ts.Node) => this.functionBlockHasReturn(functionBlockNode));
        return returnInChildren.some(Boolean);
    }

    private isShortArrowReturn(node: ts.ArrowFunction | ts.FunctionDeclaration | ts.MethodDeclaration) {
        return node.kind === ts.SyntaxKind.ArrowFunction && node.body.kind !== ts.SyntaxKind.Block;
    }

    private addFailureIfAsyncFunctionHasNoAwait(node: ts.ArrowFunction | ts.FunctionDeclaration | ts.MethodDeclaration) {
        if (this.isAsyncFunction(node)
            && !this.functionBlockHasAwait(node.body as ts.Node)
            && !this.functionBlockHasReturn(node.body as ts.Node)
            && !this.isShortArrowReturn(node)) {
            const asyncModifier = this.getAsyncModifier(node);
            if (asyncModifier !== undefined) {
                this.addFailureAt(asyncModifier.getStart(), asyncModifier.getEnd() - asyncModifier.getStart(), Rule.FAILURE_STRING);
            }
        }
    }
}
