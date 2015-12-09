/**
 * @license
 * Copyright 2015 Palantir Technologies, Inc.
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

const OPTION_IGNORE_PARMS = "ignore-params";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-inferrable-types",
        description: "Disallows explicit type declarations for variables or parameters initialized to a number, string, or boolean.",
        rationale: "Explicit types where they can be easily infered by the compiler make code more verbose.",
        optionsDescription: "Not configurable.",
        options: {},
        optionExamples: ["true"],
        type: "typescript",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_FACTORY = (type: string) => `LHS type (${type}) inferred by RHS expression, remove type annotation`;

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoInferrableTypesWalker(sourceFile, this.getOptions()));
    }
}

class NoInferrableTypesWalker extends Lint.RuleWalker {
    public visitVariableDeclaration(node: ts.VariableDeclaration) {
        this.checkDeclaration(node);
        super.visitVariableDeclaration(node);
    }

    public visitParameterDeclaration(node: ts.ParameterDeclaration) {
        if (!this.hasOption(OPTION_IGNORE_PARMS)) {
            this.checkDeclaration(node);
        }
        super.visitParameterDeclaration(node);
    }

    private checkDeclaration(node: ts.ParameterDeclaration | ts.VariableDeclaration) {
        if (node.type != null && node.initializer != null) {
            let failure: string;

            switch (node.type.kind) {
                case ts.SyntaxKind.BooleanKeyword:
                    if (node.initializer.kind === ts.SyntaxKind.TrueKeyword || node.initializer.kind === ts.SyntaxKind.FalseKeyword) {
                        failure = "boolean";
                    }
                    break;
                case ts.SyntaxKind.NumberKeyword:
                    if (node.initializer.kind === ts.SyntaxKind.NumericLiteral) {
                        failure = "number";
                    }
                    break;
                case ts.SyntaxKind.StringKeyword:
                    switch (node.initializer.kind) {
                        case ts.SyntaxKind.StringLiteral:
                        case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
                        case ts.SyntaxKind.TemplateExpression:
                            failure = "string";
                            break;
                        default:
                            break;
                    }
                    break;
            }

            if (failure != null) {
                this.addFailure(this.createFailure(node.type.getStart(), node.type.getWidth(), Rule.FAILURE_STRING_FACTORY(failure)));
            }
        }
    }
}
