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

const BANNED_KEYWORDS = ["any", "Number", "number", "String", "string", "Boolean", "boolean", "Undefined", "undefined"];

const OPTION_LEADING_UNDERSCORE = "allow-leading-underscore";
const OPTION_TRAILING_UNDERSCORE = "allow-trailing-underscore";
const OPTION_BAN_KEYWORDS = "ban-keywords";
const OPTION_CHECK_FORMAT = "check-format";
const OPTION_ALLOW_PASCAL_CASE = "allow-pascal-case";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "variable-name",
        description: "Checks variable names for various errors.",
        optionsDescription: Lint.Utils.dedent`
            Four arguments may be optionally provided:

            * \`"check-format"\`: allows only camelCased or UPPER_CASED variable names
              * \`"allow-leading-underscore"\` allows underscores at the beginning (only has an effect if "check-format" specified)
              * \`"allow-trailing-underscore"\` allows underscores at the end. (only has an effect if "check-format" specified)
            * \`"ban-keywords"\`: disallows the use of certain TypeScript keywords (\`any\`, \`Number\`, \`number\`, \`String\`,
            \`string\`, \`Boolean\`, \`boolean\`, \`undefined\`) as variable or parameter names.`,
        options: {
            type: "list",
            listType: {
                type: "enum",
                enumValues: ["check-format", "allow-leading-underscore", "allow-trailing-underscore", "ban-keywords"],
            },
        },
        optionExamples: ['[true, "ban-keywords", "check-format", "allow-leading-underscore"]'],
        type: "style",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FORMAT_FAILURE = "variable name must be in camelcase or uppercase";
    public static KEYWORD_FAILURE = "variable name clashes with keyword/type";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const variableNameWalker = new VariableNameWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(variableNameWalker);
    }
}

class VariableNameWalker extends Lint.RuleWalker {
    private shouldBanKeywords: boolean;
    private shouldCheckFormat: boolean;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);

        this.shouldBanKeywords = this.hasOption(OPTION_BAN_KEYWORDS);
        // check variable name formatting by default if no options are specified
        this.shouldCheckFormat = !this.shouldBanKeywords || this.hasOption(OPTION_CHECK_FORMAT);
    }

    public visitBindingElement(node: ts.BindingElement) {
        if (node.name.kind === ts.SyntaxKind.Identifier) {
            const identifier = <ts.Identifier> node.name;
            this.handleVariableNameFormat(identifier);
            this.handleVariableNameKeyword(identifier);
        }
        super.visitBindingElement(node);
    }

    public visitParameterDeclaration(node: ts.ParameterDeclaration) {
        if (node.name.kind === ts.SyntaxKind.Identifier) {
            const identifier = <ts.Identifier> node.name;
            this.handleVariableNameFormat(identifier);
            this.handleVariableNameKeyword(identifier);
        }
        super.visitParameterDeclaration(node);
    }

    public visitPropertyDeclaration(node: ts.PropertyDeclaration) {
        if (node.name != null && node.name.kind === ts.SyntaxKind.Identifier) {
            const identifier = <ts.Identifier> node.name;
            this.handleVariableNameFormat(identifier);
            // do not check property declarations for keywords, they are allowed to be keywords
        }
        super.visitPropertyDeclaration(node);
    }

    public visitVariableDeclaration(node: ts.VariableDeclaration) {
        if (node.name.kind === ts.SyntaxKind.Identifier) {
            const identifier = <ts.Identifier> node.name;
            this.handleVariableNameFormat(identifier);
            this.handleVariableNameKeyword(identifier);
        }
        super.visitVariableDeclaration(node);
    }

    public visitVariableStatement(node: ts.VariableStatement) {
        // skip 'declare' keywords
        if (!Lint.hasModifier(node.modifiers, ts.SyntaxKind.DeclareKeyword)) {
            super.visitVariableStatement(node);
        }
    }

    private handleVariableNameFormat(name: ts.Identifier) {
        const variableName = name.text;

        if (this.shouldCheckFormat && !this.isCamelCase(variableName) && !isUpperCase(variableName)) {
            this.addFailure(this.createFailure(name.getStart(), name.getWidth(), Rule.FORMAT_FAILURE));
        }
    }

    private handleVariableNameKeyword(name: ts.Identifier) {
        const variableName = name.text;

        if (this.shouldBanKeywords && BANNED_KEYWORDS.indexOf(variableName) !== -1) {
            this.addFailure(this.createFailure(name.getStart(), name.getWidth(), Rule.KEYWORD_FAILURE));
        }
    }

    private isCamelCase(name: string) {
        const firstCharacter = name.charAt(0);
        const lastCharacter = name.charAt(name.length - 1);
        const middle = name.substr(1, name.length - 2);

        if (name.length <= 0) {
            return true;
        }
        if (!this.hasOption(OPTION_LEADING_UNDERSCORE) && firstCharacter === "_") {
            return false;
        }
        if (!this.hasOption(OPTION_TRAILING_UNDERSCORE) && lastCharacter === "_") {
            return false;
        }
        if (!this.hasOption(OPTION_ALLOW_PASCAL_CASE) && !isLowerCase(firstCharacter)) {
            return false;
        }
        return middle.indexOf("_") === -1;
    }
}

function isLowerCase(name: string) {
    return name === name.toLowerCase();
}

function isUpperCase(name: string) {
    return name === name.toUpperCase();
}
