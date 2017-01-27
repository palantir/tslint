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
        ruleName: "no-floating-promises",
        description: "Promises returned by functions must be handled appropriately.",
        optionsDescription: Lint.Utils.dedent`
            A list of \'string\' names of any additional classes that should also be handled as Promises.
        `,
        options: {
            type: "list",
            listType: {
                type: "array",
                items: {type: "string"},
            },
        },
        optionExamples: ["true", `[true, "JQueryPromise"]`],
        rationale: "Unhandled Promises can cause unexpected behavior, such as resolving at unexpected times.",
        type: "functionality",
        typescriptOnly: true,
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Promises must be handled appropriately";

    public applyWithProgram(sourceFile: ts.SourceFile, langSvc: ts.LanguageService): Lint.RuleFailure[] {
        const walker = new NoFloatingPromisesWalker(sourceFile, this.getOptions(), langSvc.getProgram());

        for (const className of this.getOptions().ruleArguments) {
            walker.addPromiseClass(className);
        }

        return this.applyWithWalker(walker);
    }
}

class NoFloatingPromisesWalker extends Lint.ProgramAwareRuleWalker {
    private static barredParentKinds: { [x: number]: boolean } = {
        [ts.SyntaxKind.Block]: true,
        [ts.SyntaxKind.ExpressionStatement]: true,
        [ts.SyntaxKind.SourceFile]: true,
    };

    private promiseClasses = ["Promise"];

    public addPromiseClass(className: string) {
        this.promiseClasses.push(className);
    }

    public visitCallExpression(node: ts.CallExpression): void {
        this.checkNode(node);
        super.visitCallExpression(node);
    }

    public visitExpressionStatement(node: ts.ExpressionStatement): void {
        this.checkNode(node);
        super.visitExpressionStatement(node);
    }

    private checkNode(node: ts.CallExpression | ts.ExpressionStatement) {
        if (node.parent && this.kindCanContainPromise(node.parent.kind)) {
            return;
        }

        const typeChecker = this.getTypeChecker();
        const type = typeChecker.getTypeAtLocation(node);

        if (this.symbolIsPromise(type.symbol)) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }
    }

    private symbolIsPromise(symbol?: ts.Symbol) {
        if (!symbol) {
            return false;
        }

        return this.promiseClasses.indexOf(symbol.name) !== -1;
    }

    private kindCanContainPromise(kind: ts.SyntaxKind) {
        return !NoFloatingPromisesWalker.barredParentKinds[kind];
    }
}
