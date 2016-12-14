/**
 * @license
 * Copyright 2016 Palantir Technologies, Inc.
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

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "promise-function-async",
        description: "Requires any function or method that returns a promise to be marked async.",
        rationale: Lint.Utils.dedent`
            Ensures that each function is only capable of 1) returning a rejected promise, or 2)
            throwing an Error object. In contrast, non-\`async\` \`Promise\`-returning functions
            are technically capable of either. This practice removes a requirement for consuming
            code to handle both cases.
        `,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "typescript",
        typescriptOnly: false,
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "functions that return promises must be async";

    public applyWithProgram(sourceFile: ts.SourceFile, langSvc: ts.LanguageService): Lint.RuleFailure[] {
        return this.applyWithWalker(new PromiseAsyncWalker(sourceFile, this.getOptions(), langSvc.getProgram()));
    }
}

class PromiseAsyncWalker extends Lint.ProgramAwareRuleWalker {
    public visitArrowFunction(node: ts.ArrowFunction) {
        this.handleDeclaration(node);
        super.visitArrowFunction(node);
    }

    public visitFunctionDeclaration(node: ts.FunctionDeclaration) {
        this.handleDeclaration(node);
        super.visitFunctionDeclaration(node);
    }

    public visitFunctionExpression(node: ts.FunctionExpression) {
        this.handleDeclaration(node);
        super.visitFunctionExpression(node);
    }

    public visitMethodDeclaration(node: ts.MethodDeclaration) {
        this.handleDeclaration(node);
        super.visitMethodDeclaration(node);
    }

    private handleDeclaration(node: ts.SignatureDeclaration & { body?: ts.Node }) {
        const tc = this.getTypeChecker();
        const signature = tc.getTypeAtLocation(node).getCallSignatures()[0];
        const returnType = tc.typeToString(tc.getReturnTypeOfSignature(signature));

        const isAsync = Lint.hasModifier(node.modifiers, ts.SyntaxKind.AsyncKeyword);
        const isPromise = returnType.indexOf("Promise<") === 0;

        const signatureEnd = node.body != null
            ? node.body.getStart() - node.getStart() - 1
            : node.getWidth();

        if (isPromise && !isAsync) {
            this.addFailureAt(node.getStart(), signatureEnd, Rule.FAILURE_STRING);
        }
    }
}
