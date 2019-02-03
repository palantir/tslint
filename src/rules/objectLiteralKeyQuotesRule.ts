/**
 * @license
 * Copyright 2018 Palantir Technologies, Inc.
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

import { isObjectLiteralExpression, isValidPropertyName } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

const OPTION_ALWAYS = "always";
const OPTION_AS_NEEDED = "as-needed";
const OPTION_CONSISTENT = "consistent";
const OPTION_CONSISTENT_AS_NEEDED = "consistent-as-needed";
type Option =
    | typeof OPTION_ALWAYS
    | typeof OPTION_AS_NEEDED
    | typeof OPTION_CONSISTENT
    | typeof OPTION_CONSISTENT_AS_NEEDED;

interface Options {
    option: Option;
}

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

            * \`"${OPTION_ALWAYS}"\`: Property names should always be quoted. (This is the default.)
            * \`"${OPTION_AS_NEEDED}"\`: Only property names which require quotes may be quoted (e.g. those with spaces in them).
            * \`"${OPTION_CONSISTENT}"\`: Property names should either all be quoted or unquoted.
            * \`"${OPTION_CONSISTENT_AS_NEEDED}"\`: If any property name requires quotes, then all properties must be quoted. Otherwise, no
            property names may be quoted.

            For ES6, computed property names (\`{[name]: value}\`) and methods (\`{foo() {}}\`) never need
            to be quoted.`,
        options: {
            type: "string",
            enum: [OPTION_ALWAYS, OPTION_AS_NEEDED, OPTION_CONSISTENT, OPTION_CONSISTENT_AS_NEEDED],
            // TODO: eslint supports "keywords", "unnecessary" and "numbers" options.
        },
        optionExamples: [[true, OPTION_AS_NEEDED], [true, OPTION_ALWAYS]],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static INCONSISTENT_PROPERTY =
        "All property names in this object literal must be consistently quoted or unquoted.";
    public static UNNEEDED_QUOTES(name: string) {
        return `Unnecessarily quoted property '${name}' found.`;
    }
    public static UNQUOTED_PROPERTY(name: string) {
        return `Unquoted property '${name}' found.`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(
            new ObjectLiteralKeyQuotesWalker(sourceFile, this.ruleName, {
                option:
                    this.ruleArguments.length === 0 ? "always" : (this.ruleArguments[0] as Option),
            }),
        );
    }
}

class ObjectLiteralKeyQuotesWalker extends Lint.AbstractWalker<Options> {
    public walk(sourceFile: ts.SourceFile) {
        const cb = (node: ts.Node): void => {
            if (isObjectLiteralExpression(node)) {
                const propertyNames = Lint.Utils.mapDefined(node.properties, mapPropertyName);
                outer: switch (this.options.option) {
                    case "always":
                        for (const name of propertyNames) {
                            if (name.kind !== ts.SyntaxKind.StringLiteral) {
                                this.reportMissing(name);
                            }
                        }
                        break;
                    case "as-needed":
                        for (const name of propertyNames) {
                            if (
                                name.kind === ts.SyntaxKind.StringLiteral &&
                                isValidPropertyName(name.text)
                            ) {
                                this.reportUnnecessary(name);
                            }
                        }
                        break;
                    case "consistent":
                        if (hasInconsistentQuotes(propertyNames)) {
                            // No fix -- don't know if they would want to add quotes or remove them.
                            this.addFailureAt(
                                node.getStart(this.sourceFile),
                                1,
                                Rule.INCONSISTENT_PROPERTY,
                            );
                        }
                        break;
                    case "consistent-as-needed":
                        for (const name of propertyNames) {
                            if (
                                name.kind === ts.SyntaxKind.StringLiteral &&
                                !isValidPropertyName(name.text)
                            ) {
                                for (const propertyName of propertyNames) {
                                    if (propertyName.kind !== ts.SyntaxKind.StringLiteral) {
                                        this.reportMissing(propertyName);
                                    }
                                }
                                break outer;
                            }
                        }
                        for (const name of propertyNames) {
                            if (name.kind === ts.SyntaxKind.StringLiteral) {
                                this.reportUnnecessary(name);
                            }
                        }
                }
            }
            return ts.forEachChild(node, cb);
        };
        return ts.forEachChild(sourceFile, cb);
    }

    private reportMissing(node: ts.NumericLiteral | ts.Identifier) {
        const start = node.getStart(this.sourceFile);
        this.addFailure(
            start,
            node.end,
            Rule.UNQUOTED_PROPERTY(node.text),
            Lint.Replacement.replaceFromTo(start, node.end, `"${node.text}"`),
        );
    }

    private reportUnnecessary(node: ts.StringLiteral) {
        this.addFailureAtNode(
            node,
            Rule.UNNEEDED_QUOTES(node.text),
            Lint.Replacement.replaceNode(node, node.text, this.sourceFile),
        );
    }
}

function mapPropertyName(
    property: ts.ObjectLiteralElementLike,
): ts.StringLiteral | ts.NumericLiteral | ts.Identifier | undefined {
    if (
        property.kind === ts.SyntaxKind.ShorthandPropertyAssignment ||
        property.kind === ts.SyntaxKind.SpreadAssignment ||
        property.name.kind === ts.SyntaxKind.ComputedPropertyName
    ) {
        return undefined;
    }
    return property.name;
}

function hasInconsistentQuotes(properties: ReadonlyArray<ts.LiteralLikeNode>) {
    if (properties.length < 2) {
        return false;
    }
    const quoted = properties[0].kind === ts.SyntaxKind.StringLiteral;
    for (let i = 1; i < properties.length; ++i) {
        if (quoted !== (properties[i].kind === ts.SyntaxKind.StringLiteral)) {
            return true;
        }
    }
    return false;
}
