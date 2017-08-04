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

import {
    isCallExpression,
    isExternalModuleReference,
    isIdentifier,
    isImportDeclaration,
    isImportEqualsDeclaration,
    isTextualLiteral,
} from "tsutils";
import * as ts from "typescript";
import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-import-submodules",
        description: Lint.Utils.dedent`
            Disallows importing any submodule of the listed modules.`,
        rationale: Lint.Utils.dedent`
            Submodules of some packages are treated as private APIs and the import
            paths may change without deprecation periods. It's best to stick with
            top-level package exports.`,
        optionsDescription: "A list of packages whose submodules are blacklisted.",
        options: {
            type: "array",
            items: {
                type: "string",
            },
            minLength: 1,
        },
        optionExamples: [true, [true, "rxjs", "lodash", "@blueprintjs/core"]],
        type: "functionality",
        typescriptOnly: false,
    };

    public static FAILURE_STRING = "Submodule import paths from this package are disallowed; import from the root instead";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoSubmoduleImportsWalker(sourceFile, this.ruleName, this.ruleArguments));
    }
}

class NoSubmoduleImportsWalker extends Lint.AbstractWalker<string[]> {
    public walk(sourceFile: ts.SourceFile) {
        const findRequire = (node: ts.Node): void => {
            if (isCallExpression(node) && node.arguments.length === 1 &&
                (isIdentifier(node.expression) && node.expression.text === "require" ||
                node.expression.kind === ts.SyntaxKind.ImportKeyword)) {
                this.checkForBannedImport(node.arguments[0]);
            }
            return ts.forEachChild(node, findRequire);
        };

        for (const statement of sourceFile.statements) {
            if (isImportDeclaration(statement)) {
                this.checkForBannedImport(statement.moduleSpecifier);
            } else if (isImportEqualsDeclaration(statement)) {
                if (isExternalModuleReference(statement.moduleReference) && statement.moduleReference.expression !== undefined) {
                    this.checkForBannedImport(statement.moduleReference.expression);
                }
            } else {
                ts.forEachChild(statement, findRequire);
            }
        }
    }

    private checkForBannedImport(expression: ts.Expression) {
        if (isTextualLiteral(expression)) {
            let blacklistOption = "";

            for (const option of this.options) {
                if (expression.text.indexOf(option) !== -1) {
                    blacklistOption = option;
                }
            }

            if (blacklistOption === "") { return; }

            const failText = `${blacklistOption}/`;
            if (expression.text.indexOf(failText) !== -1) {
                this.addFailure(
                    expression.getStart(this.sourceFile) +
                    (blacklistOption.length + 1),
                    expression.end - 1,
                    Rule.FAILURE_STRING,
                );
            }
        }
    }
}
