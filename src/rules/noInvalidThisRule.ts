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
import * as Lint from "../lint";

interface Scope {
    inClass: boolean;
    inFunction: boolean;
}

const OPTION_FUNCTION_IN_METHOD = "check-function-in-method";
const DEPRECATED_OPTION_FUNCTION_IN_METHOD = "no-this-in-function-in-method";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-invalid-this",
        description: "Disallows using the `this` keyword outside of classes.",
        rationale: "See [the rule's author's rationale here.](https://github.com/palantir/tslint/pull/1105#issue-147549402)",
        optionsDescription: Lint.Utils.dedent`
            One argument may be optionally provided:

            * \`${OPTION_FUNCTION_IN_METHOD}\` disallows using the \`this\` keyword in functions within class methods.`,
        options: {
            type: "list",
            listType: {
                type: "enum",
                enumValues: [OPTION_FUNCTION_IN_METHOD],
            },
        },
        optionExamples: ["true", `[true, "${OPTION_FUNCTION_IN_METHOD}"]`],
        type: "functionality",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_OUTSIDE = "the \"this\" keyword is disallowed outside of a class body" ;
    public static FAILURE_STRING_INSIDE = "the \"this\" keyword is disallowed in function bodies inside class methods, " +
        "use arrow functions instead";
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoInvalidThisWalker(sourceFile, this.getOptions()));
    }
}

class NoInvalidThisWalker extends Lint.ScopeAwareRuleWalker<Scope> {
    public createScope(node: ts.Node): Scope {
        const isClassScope = node.kind === ts.SyntaxKind.ClassDeclaration || node.kind === ts.SyntaxKind.ClassExpression;
        let inFunction = node.kind === ts.SyntaxKind.FunctionDeclaration || node.kind === ts.SyntaxKind.FunctionExpression;
        return {
            inClass: isClassScope,
            inFunction: inFunction,
        };
    }

    protected validateThisKeyword(node: ts.Node) {
        let inClass = 0;
        let inFunction = 0;
        this.getAllScopes().forEach((scope, index) => {
            inClass = scope.inClass ? index + 1 : inClass;
            inFunction = scope.inFunction ? index + 1 : inFunction;
        });

        if (inClass === 0) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING_OUTSIDE));
        }

        const checkFuncInMethod = this.hasOption(DEPRECATED_OPTION_FUNCTION_IN_METHOD) || this.hasOption(OPTION_FUNCTION_IN_METHOD);
        if (checkFuncInMethod && inClass > 0 && inFunction > inClass) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING_INSIDE));
        }
    }

    public visitNode(node: ts.Node) {
        if (node.kind === ts.SyntaxKind.ThisKeyword) {
            this.validateThisKeyword(node);
        }

        super.visitNode(node);
    }
}
