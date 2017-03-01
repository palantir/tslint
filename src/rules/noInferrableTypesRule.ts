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

import * as Lint from "../index";

const OPTION_IGNORE_PARMS = "ignore-params";
const OPTION_IGNORE_PROPERTIES = "ignore-properties";

interface IOptions {
    ignoreParameters: boolean;
    ignoreProperties: boolean;
}

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-inferrable-types",
        description: "Disallows explicit type declarations for variables or parameters initialized to a number, string, or boolean.",
        rationale: "Explicit types where they can be easily inferred by the compiler make code more verbose.",
        optionsDescription: Lint.Utils.dedent`
            Two arguments may be optionally provided:

            * \`${OPTION_IGNORE_PARMS}\` allows specifying an inferrable type annotation for function params.
            This can be useful when combining with the \`typedef\` rule.
            * \`${OPTION_IGNORE_PROPERTIES}\` allows specifying an inferrable type annotation for class properties.`,
        options: {
            type: "array",
            items: {
                type: "string",
                enum: [OPTION_IGNORE_PARMS, OPTION_IGNORE_PROPERTIES],
            },
            minLength: 0,
            maxLength: 2,
        },
        hasFix: true,
        optionExamples: [
            "true",
            `[true, "${OPTION_IGNORE_PARMS}"]`,
            `[true, "${OPTION_IGNORE_PARMS}", "${OPTION_IGNORE_PROPERTIES}"]`,
        ],
        type: "typescript",
        typescriptOnly: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_FACTORY = (type: string) => {
        return `Type ${type} trivially inferred from a ${type} literal, remove type annotation`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoInferrableTypesWalker(sourceFile, this.ruleName, {
            ignoreParameters: this.ruleArguments.indexOf(OPTION_IGNORE_PARMS) !== -1,
            ignoreProperties: this.ruleArguments.indexOf(OPTION_IGNORE_PROPERTIES) !== -1,
        }));
    }
}

class NoInferrableTypesWalker extends Lint.AbstractWalker<IOptions> {
    public walk(sourceFile: ts.SourceFile) {
        const cb = (node: ts.Node): void => {
            switch (node.kind) {
                case ts.SyntaxKind.Parameter:
                    if (!this.options.ignoreParameters) {
                        this.checkDeclaration(node as ts.ParameterDeclaration);
                    }
                    break;
                case ts.SyntaxKind.PropertyDeclaration:
                    if (this.options.ignoreProperties) {
                        break;
                    }
                    /* falls through*/
                case ts.SyntaxKind.VariableDeclaration:
                    this.checkDeclaration(node as ts.VariableLikeDeclaration);
                default:
            }
            return ts.forEachChild(node, cb);
        };
        return ts.forEachChild(sourceFile, cb);
    }

    private checkDeclaration(node: ts.VariableLikeDeclaration) {
        if (node.type != null && node.initializer != null) {
            let failure: string | null = null;

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
                default:
                    break;
            }

            if (failure != null) {
                this.addFailureAtNode(node.type,
                                      Rule.FAILURE_STRING_FACTORY(failure),
                                      this.createFix(Lint.Replacement.deleteFromTo(node.name.end, node.type.end)),
                );
            }
        }
    }
}
