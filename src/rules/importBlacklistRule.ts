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
    isExportDeclaration,
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
        ruleName: "import-blacklist",
        description: Lint.Utils.dedent`
            Disallows importing the specified modules directly via \`import\` and \`require\`.
            Instead only sub modules may be imported from that module.`,
        rationale: Lint.Utils.dedent`
            Some libraries allow importing their submodules instead of the entire module.
            This is good practise as it avoids loading unused modules.`,
        optionsDescription: "A list of blacklisted modules.",
        options: {
            type: "array",
            items: {
                type: "string",
            },
            minLength: 1,
        },
        optionExamples: [true, [true, "rxjs", "lodash"]],
        type: "functionality",
        typescriptOnly: false,
    };

    public static FAILURE_STRING = "This import is blacklisted, import a submodule instead";

    public isEnabled(): boolean {
        return super.isEnabled() && this.ruleArguments.length > 0;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new ImportBlacklistWalker(sourceFile, this.ruleName, this.ruleArguments));
    }
}

class ImportBlacklistWalker extends Lint.AbstractWalker<string[]> {
    public walk(sourceFile: ts.SourceFile) {
        const findRequire = (node: ts.Node): void => {
            if (isCallExpression(node) && node.arguments.length === 1 &&
                isIdentifier(node.expression) && node.expression.text === "require") {
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
        if (isTextualLiteral(expression) && this.options.indexOf(expression.text) !== -1) {
            this.addFailure(expression.getStart(this.sourceFile) + 1, expression.end - 1, Rule.FAILURE_STRING);
        }
    }
}
