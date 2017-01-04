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
        const options = this.getOptions();
        return this.applyWithWalker(
            new NoRequireFullLibraryWalker(sourceFile, options, options.ruleArguments),
        );
    }
}

class NoRequireFullLibraryWalker extends Lint.RuleWalker {
    private blacklist: string[];
    constructor (sourceFile: ts.SourceFile, options: Lint.IOptions, blacklist: string[]) {
        super(sourceFile, options);
        this.blacklist = blacklist;
    }

    public visitCallExpression(node: ts.CallExpression) {
        if (
            node.expression.getText() === "require" &&
            node.arguments &&
            node.arguments[0] &&
            this.isModuleBlacklisted(node.arguments[0].getText())
        ) {
            this.reportFailure(node.arguments[0]);
        }
        super.visitCallExpression(node);
    }

    public visitImportEqualsDeclaration(node: ts.ImportEqualsDeclaration) {
        const moduleReference = node.moduleReference as ts.ExternalModuleReference;
        // If it's an import require and not an import alias
        if (moduleReference.expression) {
            if (this.isModuleBlacklisted(moduleReference.expression.getText())) {
                this.reportFailure(moduleReference.expression);
            }
        }
        super.visitImportEqualsDeclaration(node);
    }

    public visitImportDeclaration(node: ts.ImportDeclaration) {
        if (this.isModuleBlacklisted(node.moduleSpecifier.getText())) {
            this.reportFailure(node.moduleSpecifier);
        }
        super.visitImportDeclaration(node);
    }

    private isModuleBlacklisted(text: string): boolean {
        return this.blacklist.some((entry) => {
            return text.substring(1, text.length - 1) === entry;
        });
    }

    private reportFailure (node: ts.Expression): void {
        this.addFailureAt(
            node.getStart() + 1, // take quotes into account
            node.getWidth() - 2,
            Rule.FAILURE_STRING,
        );
    }
}
