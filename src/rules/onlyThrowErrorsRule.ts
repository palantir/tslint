/**
 * @license
 * Copyright 2013 Palantir Technologies, Inc.
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
import { isTypeOfClassName } from "../language/utils";

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "only-throw-errors",
        description: "Requires that only instances of Error or its subclass be thrown.",
        descriptionDetails: Lint.Utils.dedent`
            It is considered good practice to only throw the Error object itself or an
            object using the Error object as base objects for user-defined exceptions.`,
        hasFix: true,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Only Error instances may be thrown";

    public applyWithProgram(sourceFile: ts.SourceFile, langSvc: ts.LanguageService): Lint.RuleFailure[] {
        return this.applyWithWalker(new OnlyThrowErrorsWalker(sourceFile, this.getOptions(), langSvc.getProgram()));
    }
}

class OnlyThrowErrorsWalker extends Lint.ProgramAwareRuleWalker {
    public visitThrowStatement(node: ts.ThrowStatement) {
        const expression = node.expression;
        const type = this.getTypeChecker().getTypeAtLocation(expression);

        if (type && this.symbolIsError(type)) {
            this.addFailure(this.createFailure(expression.getStart(), expression.getWidth(), Rule.FAILURE_STRING));
        }

        super.visitThrowStatement(node);
    }

     private symbolIsError(type: ts.Type) {
         return isTypeOfClassName(type, "Error");
     }
}
