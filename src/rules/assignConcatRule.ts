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
    private checker: Checkable;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);

        this.checker = new ConcatPropertyAccessExpression([
            new ParentKind(ts.SyntaxKind.BinaryExpression, [
                new OperatorTokenKind(ts.SyntaxKind.EqualsToken),
                new ParentKind(ts.SyntaxKind.VariableDeclaration),
                new ParentKind(ts.SyntaxKind.BinaryExpression),
                new ParentKind(ts.SyntaxKind.ExpressionStatement)
            ]),
            new ParentKind(ts.SyntaxKind.VariableDeclaration),
            new ParentKind(ts.SyntaxKind.ArrowFunction),
            new ParentKind(ts.SyntaxKind.ReturnStatement),
            new ParentKind(ts.SyntaxKind.VariableDeclaration),
            new ParentKind(ts.SyntaxKind.PropertyAccessExpression),
            new ParentKind(ts.SyntaxKind.CallExpression)
        ]);
    }

    public visitCallExpression(node: ts.CallExpression) {
        if (!this.checker.check(node)) {
            this.addFailure(
                this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING)
            );
        }

        super.visitCallExpression(node);
    }
}

abstract class Checkable {
    private childs: Checkable[];

    public abstract check(node: ts.Node): boolean;

    constructor(childs: Checkable[]) {
        this.childs = childs;
    }

    protected runChecks(cond: boolean, node: ts.Node) {
        if (this.childs.length === 0) {
            // leaf
            return cond;
        } else if (!cond) {
            // branch with no precondition
            return true;
        } else {
            return this.childs.map(c => c.check(node)).reduce((acc, cur) => acc && cur);
        }
    }
}

class OperatorTokenKind extends Checkable {
    private kind: ts.SyntaxKind;

    constructor(kind: ts.SyntaxKind, childs: Checkable[] = []) {
        super(childs);
        this.kind = kind;
    }

    public check(node: ts.Node) {
        const be = node as ts.BinaryExpression;
        return this.runChecks(be.operatorToken.kind === this.kind, node);
    }
}

class ParentKind extends Checkable {
    private kind: ts.SyntaxKind;

    constructor(kind: ts.SyntaxKind, childs: Checkable[] = []) {
        super(childs);
        this.kind = kind;
    }

    public check(node: ts.Node) {
        return this.runChecks(node.parent!.kind === this.kind, node.parent!);
    }
}

class ConcatPropertyAccessExpression extends Checkable {
    constructor(childs: Checkable[] = []) {
        super(childs);
    }

    public check(node: ts.CallExpression) {
        const pae = node.expression as ts.PropertyAccessExpression;
        return this.runChecks(
            pae.kind === ts.SyntaxKind.PropertyAccessExpression && pae.name.text === "concat",
            node
        );
    }
}
