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
        ruleName: "object-literal-key-quotes",
        description: "Enforces consistent object literal property quote style.",
        descriptionDetails: Lint.Utils.dedent`
            Object literal property names can be defined in two ways: using literals or using strings.
            For example, these two objects are equivalent:

            var object1 = {
                property: true
            };

            var object2 = {
                "property": true
            };

            In many cases, it doesn’t matter if you choose to use an identifier instead of a string
            or vice-versa. Even so, you might decide to enforce a consistent style in your code.

            This rules lets you enforce consistent quoting of property names. Either they should always
            be quoted (default behavior) or quoted only as needed ("as-needed").`,
        hasFix: true,
        optionsDescription: Lint.Utils.dedent`
            Possible settings are:

            * \`"always"\`: Property names should always be quoted. (This is the default.)
            * \`"as-needed"\`: Only property names which require quotes may be quoted (e.g. those with spaces in them).
            * \`"consistent"\`: Property names should either all be quoted or unquoted.
            * \`"consistent-as-needed"\`: If any property name requires quotes, then all properties must be quoted. Otherwise, no
            property names may be quoted.

            For ES6, computed property names (\`{[name]: value}\`) and methods (\`{foo() {}}\`) never need
            to be quoted.`,
        options: {
            type: "string",
            enum: ["always", "as-needed", "consistent", "consistent-as-needed"],
            // TODO: eslint supports "keywords", "unnecessary" and "numbers" options.
        },
        optionExamples: ["[true, \"as-needed\"]", "[true, \"always\"]"],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static INCONSISTENT_PROPERTY = `All property names in this object literal must be consistently quoted or unquoted.`;
    public static UNNEEDED_QUOTES = (name: string) => {
        return `Unnecessarily quoted property '${name}' found.`;
    }
    public static UNQUOTED_PROPERTY = (name: string) => {
        return `Unquoted property '${name}' found.`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const objectLiteralKeyQuotesWalker = new ObjectLiteralKeyQuotesWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(objectLiteralKeyQuotesWalker);
    }
}

type QuotesMode = "always" | "as-needed" | "consistent" | "consistent-as-needed";

class ObjectLiteralKeyQuotesWalker extends Lint.RuleWalker {
    private mode: QuotesMode;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
        this.mode = this.getOptions()[0] || "always";
    }

    public visitObjectLiteralExpression(node: ts.ObjectLiteralExpression) {
        const properties = node.properties.filter(({ kind }) =>
            kind !== ts.SyntaxKind.ShorthandPropertyAssignment && kind !== ts.SyntaxKind.SpreadAssignment);
        switch (this.mode) {
            case "always":
                this.allMustHaveQuotes(properties);
                break;
            case "as-needed":
                this.noneMayHaveQuotes(properties);
                break;
            case "consistent":
                if (quotesAreInconsistent(properties)) {
                    // No fix -- don't know if they would want to add quotes or remove them.
                    this.addFailureAt(node.getStart(), 1, Rule.INCONSISTENT_PROPERTY);
                }
                break;
            case "consistent-as-needed":
                if (properties.some(({ name }) => name !== undefined
                    && name.kind === ts.SyntaxKind.StringLiteral && propertyNeedsQuotes(name.text))) {

                    this.allMustHaveQuotes(properties);
                } else {
                    this.noneMayHaveQuotes(properties, true);
                }
                break;
            default:
                break;
        }

        super.visitObjectLiteralExpression(node);
    }

    private allMustHaveQuotes(properties: ts.ObjectLiteralElementLike[]) {
        for (const { name } of properties) {
            if (name !== undefined && name.kind !== ts.SyntaxKind.StringLiteral && name.kind !== ts.SyntaxKind.ComputedPropertyName) {
                const fix = this.createFix(this.appendText(name.getStart(), '"'), this.appendText(name.getEnd(), '"'));
                this.addFailureAtNode(name, Rule.UNQUOTED_PROPERTY(name.getText()), fix);
            }
        }
    }

    private noneMayHaveQuotes(properties: ts.ObjectLiteralElementLike[], noneNeedQuotes?: boolean) {
        for (const { name } of properties) {
            if (name !== undefined && name.kind === ts.SyntaxKind.StringLiteral && (noneNeedQuotes || !propertyNeedsQuotes(name.text))) {
                const fix = this.createFix(this.deleteText(name.getStart(), 1), this.deleteText(name.getEnd() - 1, 1));
                this.addFailureAtNode(name, Rule.UNNEEDED_QUOTES(name.text), fix);
            }
        }
    }
}

function quotesAreInconsistent(properties: ts.ObjectLiteralElementLike[]): boolean {
    let propertiesAreQuoted: boolean | undefined; // inferred on first (non-computed) property
    for (const { name } of properties) {
        if (name === undefined || name.kind === ts.SyntaxKind.ComputedPropertyName) {
            continue;
        }
        const thisOneIsQuoted = name.kind === ts.SyntaxKind.StringLiteral;
        if (propertiesAreQuoted === undefined) {
            propertiesAreQuoted = thisOneIsQuoted;
        } else if (propertiesAreQuoted !== thisOneIsQuoted) {
            return true;
        }
    }
    return false;
}

function propertyNeedsQuotes(property: string): boolean {
    return !IDENTIFIER_NAME_REGEX.test(property) && Number(property).toString() !== property;
}

// This is simplistic. See https://mothereff.in/js-properties for the gorey details.
const IDENTIFIER_NAME_REGEX = /^(?:[\$A-Z_a-z])+$/;
