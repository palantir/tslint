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

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "require-jsdoc",
        description: "Require JSDoc comments.",
        hasFix: false,
        optionsDescription: Lint.Utils.dedent`
            Ensure your project is documented. Defaults to only show errors 
            on undocumented classes or functions which are exported.

            You can opt out of checking for a specific set of declarations in
            the options.
            `,
        options: {
            type: "object",
            properties: {
                exportedOnly: {
                    type: "boolean",
                },
                functionDeclaration: {
                    type: "boolean",
                },
                classDeclaration: {
                    type: "boolean",
                },
                methodDefinition: {
                    type: "boolean",
                },
            },
            additionalProperties: false,
        },
        optionExamples: ['[true, {"exportedOnly": false, "classDeclaration": false}]',
                         '[true, {"exportedOnly": false, "classDeclaration": false, functionDeclaration: false, methodDefinition: false}]'],

        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Missing JSDoc comment.";

    public applyWithProgram(sourceFile: ts.SourceFile, langSvc: ts.LanguageService): Lint.RuleFailure[] {
        const noForInArrayWalker = new RequireJSDocWalker(sourceFile, this.getOptions(), langSvc.getProgram());
        return this.applyWithWalker(noForInArrayWalker);
    }
}

class RequireJSDocWalker extends Lint.ProgramAwareRuleWalker {
    public visitClassDeclaration(node: ts.ClassDeclaration) {
        const settings = this.getRequireJSDocOptions();
        if (settings.classDeclaration) {
            this.checkJSDoc(node);
        }
        super.visitClassDeclaration(node);
    }

    public visitFunctionExpression(node: ts.FunctionExpression) {
        const settings = this.getRequireJSDocOptions();
        if (settings.functionDeclaration) {
            this.checkJSDoc(node);
        }
        super.visitFunctionExpression(node);
    }

    public visitFunctionDeclaration(node: ts.FunctionDeclaration) {
        const settings = this.getRequireJSDocOptions();
        if (settings.functionDeclaration) {
            this.checkJSDoc(node);
        }
        super.visitFunctionDeclaration(node);
    }

    public visitMethodDeclaration(node: ts.MethodDeclaration) {
        const settings = this.getRequireJSDocOptions();
        if (settings.methodDefinition) {
            this.checkJSDoc(node);
        }
        super.visitMethodDeclaration(node);
    }

    private getRequireJSDocOptions() {
        const DEFAULT_OPTIONS = {
            classDeclaration: true,
            exportedOnly: true,
            functionDeclaration: true,
            methodDefinition: true,
        };

        const ruleOptions = this.getOptions();
        return Object.assign(DEFAULT_OPTIONS, ruleOptions && ruleOptions[0]);
    }

    private checkJSDoc(node: ts.FunctionDeclaration | ts.FunctionExpression | ts.ClassDeclaration | ts.MethodDeclaration) {
        if (node.name) {
            const checker = this.getTypeChecker();
            const symbol = checker.getSymbolAtLocation(node.name);
            const hasDocs = symbol.getDocumentationComment().length > 0;

            if (!hasDocs ) {
                const settings = this.getRequireJSDocOptions();
                // console.log(settings);
                if (settings.exportedOnly && !this.isExportedNode(node)) {
                    return;
                }
                this.addFailureAtNode(node.name, Rule.FAILURE_STRING);
            }
        }
    }

    private isExportedNode(node: ts.Node): boolean {
        if (Lint.hasModifier(node.modifiers, ts.SyntaxKind.ExportKeyword)) { return true; }
        if (!node.parent) { return false; }
        return this.isExportedNode(node.parent);
    }
}
