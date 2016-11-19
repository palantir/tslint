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

// This is simplistic. See https://mothereff.in/js-properties for the gorey details.
const IDENTIFIER_NAME_REGEX = /^(?:[\$A-Z_a-z])*$/;
const NUMBER_REGEX = /^[0-9]+$/;
type QuotesMode = "always" | "as-needed" | "consistent" | "consistent-as-needed";

interface IObjectLiteralState {
    // potential failures for properties that have quotes but don't need them
    quotesNotNeededProperties: Lint.RuleFailure[];
    // potential failures for properties that don't have quotes
    unquotedProperties: Lint.RuleFailure[];
    // whether or not any of the properties require quotes
    hasQuotesNeededProperty: boolean;
}

class ObjectLiteralKeyQuotesWalker extends Lint.RuleWalker {
    private mode: QuotesMode;
    private currentState: IObjectLiteralState;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);

        this.mode = this.getOptions()[0] || "always";
    }

    public visitPropertyAssignment(node: ts.PropertyAssignment) {
        const name = node.name;
        if (name.kind !== ts.SyntaxKind.StringLiteral &&
            name.kind !== ts.SyntaxKind.ComputedPropertyName) {

            const errorText = Rule.UNQUOTED_PROPERTY(name.getText());
            this.currentState.unquotedProperties.push(this.createFailure(name.getStart(), name.getWidth(), errorText));
        }
        if (name.kind === ts.SyntaxKind.StringLiteral) {
            // Check if the quoting is necessary.
            const stringNode = name as ts.StringLiteral;
            const property = stringNode.text;

            const isIdentifier = IDENTIFIER_NAME_REGEX.test(property);
            const isNumber = NUMBER_REGEX.test(property);
            if (isIdentifier || (isNumber && Number(property).toString() === property)) {
                const errorText = Rule.UNNEEDED_QUOTES(property);
                const failure = this.createFailure(stringNode.getStart(), stringNode.getWidth(), errorText);
                this.currentState.quotesNotNeededProperties.push(failure);
            } else {
                this.currentState.hasQuotesNeededProperty = true;
            }
        }

        super.visitPropertyAssignment(node);
    }

    public visitObjectLiteralExpression(node: ts.ObjectLiteralExpression) {
        let state: IObjectLiteralState = {
            hasQuotesNeededProperty: false,
            quotesNotNeededProperties: [],
            unquotedProperties: [],
        };
        // a nested object literal should store its parent state to restore when finished
        let previousState = this.currentState;
        this.currentState = state;

        super.visitObjectLiteralExpression(node);

        if (this.mode === "always" || (this.mode === "consistent-as-needed" && state.hasQuotesNeededProperty)) {
            for (const failure of state.unquotedProperties) {
                this.addFailure(failure);
            }
        } else if (this.mode === "as-needed" || (this.mode === "consistent-as-needed" && !state.hasQuotesNeededProperty)) {
            for (const failure of state.quotesNotNeededProperties) {
                this.addFailure(failure);
            }
        } else if (this.mode === "consistent") {
            const hasQuotedProperties = state.hasQuotesNeededProperty || state.quotesNotNeededProperties.length > 0;
            const hasUnquotedProperties = state.unquotedProperties.length > 0;
            if (hasQuotedProperties && hasUnquotedProperties) {
                this.addFailure(this.createFailure(node.getStart(), 1, Rule.INCONSISTENT_PROPERTY));
            }
        }

        this.currentState = previousState;
    }
}
