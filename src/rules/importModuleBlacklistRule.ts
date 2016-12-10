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

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "This import is not allowed.";

    public isEnabled(): boolean {
        if (super.isEnabled()) {
            return !!this.getOptions().ruleArguments.length;
        }

        return false;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const options = this.getOptions();
        const walker = new NoRequireFullLibraryWalker(sourceFile, this.getOptions());
        const libsToBan = options.ruleArguments;
        walker.setBannedLibs(libsToBan);

        return this.applyWithWalker(walker);
    }
}

function formatErrorMessage(libraryName: string) {
    return Rule.FAILURE_STRING.replace(/\{0\}/g, libraryName);
}

class NoRequireFullLibraryWalker extends Lint.RuleWalker {
    protected bannedLibs: string[];

    public setBannedLibs(libs: string[]) {
        this.bannedLibs = libs;
    }

    /**
     * @param text quoted import name
     * @return matched library name or null
     */
    protected matchBannedLibrary(text: string) {
        for (let libName of this.bannedLibs) {
            // String single or double quotes
            if (text.substring(1, text.length - 1) === libName) {
                return libName;
            }
        }

        return null;
    }

    public visitVariableStatement(node: ts.VariableStatement) {
        const declarations = node.declarationList.declarations;
        for (let decl of declarations) {
            this.handleDeclaration(decl);
        }
        super.visitVariableStatement(node);
    }

    public visitImportEqualsDeclaration(node: ts.ImportEqualsDeclaration) {
        let moduleReference = <ts.ExternalModuleReference> node.moduleReference;
        // If it's an import require and not an import alias
        if (moduleReference.expression) {
            const matchedBannedLib = this.matchBannedLibrary(moduleReference.expression.getText());
            if (matchedBannedLib) {
                this.addFailure(
                    this.createFailure(
                        moduleReference.expression.getStart(),
                        moduleReference.expression.getWidth(),
                        formatErrorMessage(matchedBannedLib)
                    )
                );
            }
        }
        super.visitImportEqualsDeclaration(node);
    }

    public visitImportDeclaration(node: ts.ImportDeclaration) {
        const matchedBannedLib = this.matchBannedLibrary(node.moduleSpecifier.getText());
        if (matchedBannedLib) {
            this.addFailure(
                this.createFailure(
                    node.moduleSpecifier.getStart(),
                    node.moduleSpecifier.getWidth(),
                    formatErrorMessage(matchedBannedLib)
                )
            );
        }
        super.visitImportDeclaration(node);
    }

    private handleDeclaration(decl: ts.VariableDeclaration)  {
        // make sure the RHS is a call expression.
        const call = <ts.CallExpression> (decl.initializer);
        if (call && call.arguments && call.expression) {
            const callExpressionText = call.expression.getText(this.getSourceFile());
            if (callExpressionText === "require") {
                const moduleIdToken = call.arguments[0];
                const matchedBannedLib = this.matchBannedLibrary(moduleIdToken.getText());

                if (matchedBannedLib) {
                    this.addFailure(
                        this.createFailure(
                            moduleIdToken.getStart(),
                            moduleIdToken.getWidth(),
                            formatErrorMessage(matchedBannedLib)
                        )
                    );
                }
            }
        }
    }
}
