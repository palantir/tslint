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
        optionExamples: ["true", '[true, "rxjs", "lodash"]'],
        type: "functionality",
        typescriptOnly: false,
    };

    public static FAILURE_STRING = "This import is blacklisted, import a submodule instead";

    public isEnabled(): boolean {
        const ruleArguments = this.getOptions().ruleArguments;
        return super.isEnabled() && ruleArguments.length > 0;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new ImportBlacklistWalker(sourceFile, this.getOptions()));
    }
}

class ImportBlacklistWalker extends Lint.RuleWalker {
    public visitCallExpression(node: ts.CallExpression) {
        if (node.expression.kind === ts.SyntaxKind.Identifier &&
            (node.expression as ts.Identifier).text === "require" &&
            node.arguments !== undefined &&
            node.arguments.length === 1) {

            this.checkForBannedImport(node.arguments[0]);
        }
        super.visitCallExpression(node);
    }

    public visitImportEqualsDeclaration(node: ts.ImportEqualsDeclaration) {
        if (isExternalModuleReference(node.moduleReference) &&
            node.moduleReference.expression !== undefined) {
            // If it's an import require and not an import alias
            this.checkForBannedImport(node.moduleReference.expression);
        }
        super.visitImportEqualsDeclaration(node);
    }

    public visitImportDeclaration(node: ts.ImportDeclaration) {
        this.checkForBannedImport(node.moduleSpecifier);
        super.visitImportDeclaration(node);
    }

    private checkForBannedImport(expression: ts.Expression) {
        if (isStringLiteral(expression) && this.hasOption(expression.text)) {
            this.addFailureFromStartToEnd(
                expression.getStart(this.getSourceFile()) + 1,
                expression.getEnd() - 1,
                Rule.FAILURE_STRING,
            );
        }
    }
}

function isStringLiteral(node: ts.Node): node is ts.LiteralExpression {
    return node.kind === ts.SyntaxKind.StringLiteral ||
        node.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral;
}

function isExternalModuleReference(node: ts.ModuleReference): node is ts.ExternalModuleReference {
    return node.kind === ts.SyntaxKind.ExternalModuleReference;
}
