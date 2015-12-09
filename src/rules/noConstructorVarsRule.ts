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
import * as Lint from "../lint";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-constructor-vars",
        description: "Disallows parameter properties.",
        rationale: Lint.Utils.dedent`
            Parameter properties can be confusing to those new to TS as they are less explicit
            than other ways of declaring and initializing class members.`,
        optionsDescription: "Not configurable.",
        options: {},
        optionExamples: ["true"],
        type: "style",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_PART = " cannot be declared in the constructor";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoConstructorVarsWalker(sourceFile, this.getOptions()));
    }
}

export class NoConstructorVarsWalker extends Lint.RuleWalker {
    public visitConstructorDeclaration(node: ts.ConstructorDeclaration) {
        const parameters = node.parameters;
        for (let parameter of parameters) {
            if (parameter.modifiers != null && parameter.modifiers.length > 0) {
                const name = <ts.Identifier> parameter.name;
                const errorMessage = "'" + name.text + "'" + Rule.FAILURE_STRING_PART;
                const lastModifier = parameter.modifiers[parameter.modifiers.length - 1];
                const position = lastModifier.getEnd() - parameter.getStart();
                this.addFailure(this.createFailure(parameter.getStart(), position, errorMessage));
            }
        }
        super.visitConstructorDeclaration(node);
    }
}
