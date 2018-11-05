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
import { codeExamples } from "./code-examples/assignConcat.example";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "assign-concat",
        description: "Prevents user assuming concat is destructive.",
        hasFix: false,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        rationale: Lint.Utils.dedent`
            Helps one remember that the concat method in javascript is not destructive.
            Every once and then happens that one forgets that and incurs in hard to find bugs.
        `,
        type: "functionality",
        typescriptOnly: false,
        codeExamples
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "concat operation should be assigned";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new AssignConcatWalker(sourceFile, this.getOptions()));
    }
}

class AssignConcatWalker extends Lint.RuleWalker {
    private readonly checker: Checkable;

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
            this.addFailureAt(node.getStart(), node.getWidth(), Rule.FAILURE_STRING);
        }

        super.visitCallExpression(node);
    }
}

abstract class Checkable {
    private readonly childs: Checkable[];

    public abstract check(node: ts.Node): boolean;

    constructor(childs: Checkable[]) {
        this.childs = childs;
    }

    protected runChecks(cond: boolean, node: ts.Node) {
        return (
            cond &&
            (this.childs.length === 0 ||
                !!this.childs.map(c => c.check(node)).find(result => result))
        );
    }
}

class OperatorTokenKind extends Checkable {
    private readonly kind: ts.SyntaxKind;

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
    private readonly kind: ts.SyntaxKind;

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
        const cond =
            pae.kind === ts.SyntaxKind.PropertyAccessExpression && pae.name.text === "concat";
        return !cond || this.runChecks(true, node);
    }
}
