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

import * as ts from "typescript";
import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "concat operation should be assigned";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new AssignConcatWalker(sourceFile, this.getOptions()));
    }
}

class AssignConcatWalker extends Lint.RuleWalker {
    public visitCallExpression(node: ts.CallExpression) {
        if (node.expression.kind === ts.SyntaxKind.PropertyAccessExpression) {
            const pae = node.expression as ts.PropertyAccessExpression;

            if (pae.name.text === "concat") {
                if (node.parent!.kind === ts.SyntaxKind.BinaryExpression) {
                    const be = node.parent as ts.BinaryExpression;

                    if (be.operatorToken.kind === ts.SyntaxKind.EqualsToken) {
                        // Assigment: concat is being correctly used.
                    } else if (be.parent!.kind === ts.SyntaxKind.VariableDeclaration) {
                        // Assigment: concat is being correctly used.
                    } else if (be.parent!.kind === ts.SyntaxKind.BinaryExpression) {
                        // Here we can't decide, will have to analize the parent chain.
                    } else if (be.parent!.kind === ts.SyntaxKind.ExpressionStatement) {
                        // Here we can't decide, will have to analize the parent chain.
                    } else {
                        // tslint:disable-next-line:no-console
                        console.log(be.parent!.kind);
                        // tslint:disable-next-line:no-console
                        // console.log(be.parent);
                        this.addFailure(
                            this.createFailure(
                                node.getStart(),
                                node.getWidth(),
                                Rule.FAILURE_STRING
                            )
                        );
                    }
                } else if (node.parent!.kind === ts.SyntaxKind.VariableDeclaration) {
                    // Assigment: concat is being correctly used.
                } else if (node.parent!.kind === ts.SyntaxKind.ArrowFunction) {
                    // Assigment: concat is being correctly used.
                } else if (node.parent!.kind === ts.SyntaxKind.ReturnStatement) {
                    // Assigment: concat is being correctly used.
                } else if (node.parent!.kind === ts.SyntaxKind.PropertyAccessExpression) {
                    // Here the result of the concat it is being accesed at least.
                } else if (node.parent!.kind === ts.SyntaxKind.CallExpression) {
                    // Here the result of the concat it is being used as a param.
                } else {
                    // tslint:disable-next-line:no-console
                    console.log(node.parent!.kind);

                    this.addFailure(
                        this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING)
                    );
                }
            }
        }

        super.visitCallExpression(node);
    }
}
