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

import * as Lint from "tslint";

const OPTION_IGNORE_MODULE = "ignore-module";

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: Lint.IRuleMetadata = {
        description: "Avoid import statements with side-effect.",
        optionExamples: ["true", `[true, { "${OPTION_IGNORE_MODULE}": "(\\.html|\\.css)$" }]`],
        options: {
            items: {
                properties: {
                    "ignore-module": {
                        type: "string",
                    },
                },
                type: "object",
            },
            maxLength: 1,
            minLength: 0,
            type: "array",
        },
        optionsDescription: Lint.Utils.dedent`
            One argument may be optionally provided:

            * \`${OPTION_IGNORE_MODULE}\` allows to specify a regex and ignore modules which it matches.`,
        rationale: "Imports with side effects may have behavior which is hard for static verification.",
        ruleName: "no-import-side-effect",
        type: "typescript",
        typescriptOnly: false,
    };
    public static FAILURE_STRING = "import with explicit side-effect";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoImportSideEffectWalker(sourceFile, this.getOptions()));
    }
}

class NoImportSideEffectWalker extends Lint.SkippableTokenAwareRuleWalker {
    private scanner: ts.Scanner;
    private ignorePattern: RegExp | null;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
        const patternConfig = this.getOptions().pop();
        this.ignorePattern = patternConfig ? new RegExp(patternConfig[OPTION_IGNORE_MODULE]) : null;
        this.scanner = ts.createScanner(ts.ScriptTarget.ES5, false, ts.LanguageVariant.Standard, sourceFile.text);
    }

    public visitImportDeclaration(node: ts.ImportDeclaration) {
        const importClause = node.importClause;
        if (importClause === undefined) {
            const specifier = node.moduleSpecifier.getText();
            if (this.ignorePattern === null || !this.ignorePattern.test(specifier.substring(1, specifier.length - 1))) {
                this.addFailureAtNode(node, Rule.FAILURE_STRING);
            }
        }
        super.visitImportDeclaration(node);
    }
}
