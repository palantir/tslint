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

import { lt } from "semver";
import {
    isEnumMember,
    isExportDeclaration,
    isExpressionStatement,
    isImportDeclaration,
    isIndexedAccessTypeNode,
    isLiteralTypeNode,
    isNoSubstitutionTemplateLiteral,
    isSameLine,
    isStringLiteral,
} from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";
import { getNormalizedTypescriptVersion } from "../verify/parse";

const OPTION_SINGLE = "single";
const OPTION_DOUBLE = "double";
const OPTION_BACKTICK = "backtick";
const OPTION_JSX_SINGLE = "jsx-single";
const OPTION_JSX_DOUBLE = "jsx-double";
const OPTION_AVOID_TEMPLATE = "avoid-template";
const OPTION_AVOID_ESCAPE = "avoid-escape";

type QUOTEMARK = "'" | '"' | "`";
type JSX_QUOTEMARK = "'" | '"';
type StringLiteralLike = ts.StringLiteral | ts.NoSubstitutionTemplateLiteral;

interface Options {
    quotemark: QUOTEMARK;
    jsxQuotemark: JSX_QUOTEMARK;
    avoidEscape: boolean;
    avoidTemplate: boolean;
}

function isQuoteMark(value: string): value is QUOTEMARK {
    return ["'", '"', "`"].indexOf(value) > -1;
}

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "quotemark",
        description: "Enforces quote character for string literals.",
        hasFix: true,
        optionsDescription: Lint.Utils.dedent`
            Five arguments may be optionally provided:

            * \`"${OPTION_SINGLE}"\` enforces single quotes.
            * \`"${OPTION_DOUBLE}"\` enforces double quotes.
            * \`"${OPTION_BACKTICK}"\` enforces backticks.
            * \`"${OPTION_JSX_SINGLE}"\` enforces single quotes for JSX attributes.
            * \`"${OPTION_JSX_DOUBLE}"\` enforces double quotes for JSX attributes.
            * \`"${OPTION_AVOID_TEMPLATE}"\` forbids single-line untagged template strings that do not contain string interpolations.
                Note that backticks may still be used if \`"${OPTION_AVOID_ESCAPE}"\` is enabled and both single and double quotes are
                present in the string (the latter option takes precedence).
            * \`"${OPTION_AVOID_ESCAPE}"\` allows you to use the "other" quotemark in cases where escaping would normally be required.
                For example, \`[true, "${OPTION_DOUBLE}", "${OPTION_AVOID_ESCAPE}"]\` would not report a failure on the string literal
                \`'Hello "World"'\`.`,
        options: {
            type: "array",
            items: {
                type: "string",
                enum: [
                    OPTION_SINGLE,
                    OPTION_DOUBLE,
                    OPTION_BACKTICK,
                    OPTION_JSX_SINGLE,
                    OPTION_JSX_DOUBLE,
                    OPTION_AVOID_ESCAPE,
                    OPTION_AVOID_TEMPLATE,
                ],
            },
            minLength: 0,
            maxLength: 5,
        },
        optionExamples: [
            [true, OPTION_SINGLE, OPTION_AVOID_ESCAPE, OPTION_AVOID_TEMPLATE],
            [true, OPTION_SINGLE, OPTION_JSX_DOUBLE],
        ],
        type: "formatting",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING(actual: string, expected: string) {
        return `${actual} should be ${expected}`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const args = this.ruleArguments;
        const quotemark = getQuotemarkPreference(args);
        const jsxQuotemark = getJSXQuotemarkPreference(args, quotemark);

        return this.applyWithFunction(sourceFile, walk, {
            avoidEscape: hasArg(OPTION_AVOID_ESCAPE),
            avoidTemplate: hasArg(OPTION_AVOID_TEMPLATE),
            jsxQuotemark,
            quotemark,
        });

        function hasArg(name: string): boolean {
            return args.indexOf(name) !== -1;
        }
    }
}

function walk(ctx: Lint.WalkContext<Options>) {
    const { sourceFile, options } = ctx;
    ts.forEachChild(sourceFile, function cb(node) {
        if (
            isStringLiteral(node) ||
            (options.avoidTemplate &&
                isNoSubstitutionTemplateLiteral(node) &&
                node.parent.kind !== ts.SyntaxKind.TaggedTemplateExpression &&
                isSameLine(sourceFile, node.getStart(sourceFile), node.end))
        ) {
            const expectedQuotemark =
                node.parent.kind === ts.SyntaxKind.JsxAttribute
                    ? options.jsxQuotemark
                    : options.quotemark;
            const actualQuotemark = sourceFile.text[node.end - 1];

            // Don't use backticks instead of single/double quotes when it breaks TypeScript syntax.
            if (expectedQuotemark === "`" && isNotValidToUseBackticksInNode(node, sourceFile)) {
                return;
            }

            // We already have the expected quotemark, or the quotemark is invalid. Done.
            if (actualQuotemark === expectedQuotemark || !isQuoteMark(actualQuotemark)) {
                return;
            }

            /** The quotemark we intend to use to fix this node. */
            let fixQuotemark = expectedQuotemark;

            /**
             * Whether this node needs to be escaped (because
             *   it contains the expected quotemark).
             */
            const needsToBeEscaped = node.text.includes(expectedQuotemark);

            // This string requires escapes to use the expected quote mark, but `avoid-escape` was passed
            if (needsToBeEscaped && options.avoidEscape) {
                if (node.kind === ts.SyntaxKind.StringLiteral) {
                    return;
                }

                // If we are expecting double quotes, use single quotes to avoid escaping.
                // Otherwise, just use double quotes.
                const alternativeFixQuotemark = expectedQuotemark === '"' ? "'" : '"';

                if (node.text.includes(alternativeFixQuotemark)) {
                    // It also includes the alternative fix quotemark. Let's try to use single quotes instead,
                    // unless we originally expected single quotes, in which case we will try to use backticks.
                    // This means that we may use backtick even with avoid-template in trying to avoid escaping.
                    fixQuotemark = expectedQuotemark === "'" ? "`" : "'";

                    if (fixQuotemark === actualQuotemark) {
                        // We were already using the best quote mark for this scenario
                        return;
                    } else if (node.text.includes(fixQuotemark)) {
                        // It contains all of the other kinds of quotes. Escaping is unavoidable, sadly.
                        return;
                    }
                } else {
                    fixQuotemark = alternativeFixQuotemark;
                }
            }

            const start = node.getStart(sourceFile);
            let text = sourceFile.text.substring(start + 1, node.end - 1);

            if (needsToBeEscaped) {
                text = text.replace(new RegExp(fixQuotemark, "g"), `\\${fixQuotemark}`);
            }

            text = text.replace(new RegExp(`\\\\${actualQuotemark}`, "g"), actualQuotemark);

            return ctx.addFailure(
                start,
                node.end,
                Rule.FAILURE_STRING(actualQuotemark, fixQuotemark),
                new Lint.Replacement(start, node.end - start, fixQuotemark + text + fixQuotemark),
            );
        }

        ts.forEachChild(node, cb);
    });
}

function getQuotemarkPreference(ruleArguments: any[]): QUOTEMARK {
    for (const arg of ruleArguments) {
        switch (arg) {
            case OPTION_SINGLE:
                return "'";
            case OPTION_DOUBLE:
                return '"';
            case OPTION_BACKTICK:
                return "`";
            default:
                continue;
        }
    }

    // Default to double quotes if no pref is found.
    return '"';
}

function getJSXQuotemarkPreference(
    ruleArguments: any[],
    regularQuotemarkPreference: QUOTEMARK,
): JSX_QUOTEMARK {
    for (const arg of ruleArguments) {
        switch (arg) {
            case OPTION_JSX_SINGLE:
                return "'";
            case OPTION_JSX_DOUBLE:
                return '"';
            default:
                continue;
        }
    }

    // The JSX preference was not found, so try to use the regular preference.
    //   If the regular pref is backtick, use double quotes instead.
    return regularQuotemarkPreference !== "`" ? regularQuotemarkPreference : '"';
}

function isNotValidToUseBackticksInNode(node: StringLiteralLike, sourceFile: ts.SourceFile) {
    return (
        // This captures `export blah from "package"`
        isExportDeclaration(node.parent) ||
        // This captures `import blah from "package"`
        isImportDeclaration(node.parent) ||
        // This captures quoted names in object literal keys
        isNameInAssignment(node) ||
        // This captures quoted signatures (property or method)
        isSignature(node) ||
        // This captures literal types in generic type constraints
        isTypeConstraint(node) ||
        // Older TS doesn't narrow a type when backticks are used to compare typeof
        isTypeCheckWithOldTsc(node) ||
        // Enum members can't use backticks
        isEnumMember(node.parent) ||
        // Typescript converts old octal escape sequences to just the numbers therein
        containsOctalEscapeSequence(node, sourceFile) ||
        // Use strict declarations have to be single or double quoted
        isUseStrictDeclaration(node) ||
        // Lookup type parameters must be single/double quoted
        isLookupTypeParameter(node)
    );
}

/**
 * Whether this node is a type constraint in a generic type.
 * @param  node The node to check
 * @return Whether this node is a type constraint
 */
function isTypeConstraint(node: StringLiteralLike) {
    let parent = node.parent.parent;

    // If this node doesn't have a grandparent, it's not a type constraint
    if (parent == undefined) {
        return false;
    }

    // Iterate through all levels of union, intersection, or parethesized types
    while (
        parent.kind === ts.SyntaxKind.UnionType ||
        parent.kind === ts.SyntaxKind.IntersectionType ||
        parent.kind === ts.SyntaxKind.ParenthesizedType
    ) {
        parent = parent.parent;
    }

    return (
        // If the next level is a type reference, the node is a type constraint
        parent.kind === ts.SyntaxKind.TypeReference ||
        // If the next level is a type parameter, the node is a type constraint
        parent.kind === ts.SyntaxKind.TypeParameter
    );
}

/**
 * Whether this node is the signature of a property or method in a type.
 * @param  node The node to check
 * @return Whether this node is a property/method signature.
 */
function isSignature(node: StringLiteralLike) {
    let parent = node.parent;

    if (hasOldTscBacktickBehavior() && node.parent.kind === ts.SyntaxKind.LastTypeNode) {
        // In older versions, there's a "LastTypeNode" here
        parent = parent.parent;
    }

    return (
        // This captures the kebab-case property names in type definitions
        parent.kind === ts.SyntaxKind.PropertySignature ||
        // This captures the kebab-case method names in type definitions
        parent.kind === ts.SyntaxKind.MethodSignature
    );
}

/**
 * Whether this node is the method or property name in an assignment/declaration.
 * @param  node The node to check
 * @return Whether this node is the name in an assignment/decleration.
 */
function isNameInAssignment(node: StringLiteralLike) {
    if (
        node.parent.kind !== ts.SyntaxKind.PropertyAssignment &&
        node.parent.kind !== ts.SyntaxKind.MethodDeclaration
    ) {
        // If the node is neither a property assignment or method declaration, it's not a name in an assignment
        return false;
    }

    return (
        // In old typescript versions, don't change values either
        hasOldTscBacktickBehavior() ||
        // If this node is not at the end of the parent
        node.end !== node.parent.end
    );
}

function isTypeCheckWithOldTsc(node: StringLiteralLike) {
    if (!hasOldTscBacktickBehavior()) {
        // This one only affects older typescript versions
        return false;
    }

    if (node.parent.kind !== ts.SyntaxKind.BinaryExpression) {
        // If this isn't in a binary expression
        return false;
    }

    // If this node has a sibling that is a TypeOf
    return node.parent.getChildren().some(n => n.kind === ts.SyntaxKind.TypeOfExpression);
}

function containsOctalEscapeSequence(node: StringLiteralLike, sourceFile: ts.SourceFile) {
    // Octal sequences can go from 1-377 (255 in octal), but let's match the prefix, which will at least be \1-\77
    // Using node.getText here strips the backslashes from the string. We also need to make sure there isn't an even
    // number of backslashes (then it would not be an escape sequence, but a literal backslash followed by numbers).
    const matches = node.getText(sourceFile).match(/(\\)+[1-7][0-7]?/g);

    if (matches != undefined) {
        for (const match of matches) {
            const numBackslashes = match.match(/\\/g)!.length;

            if (numBackslashes % 2 === 1) {
                // There was an odd number of backslashes preceeding this node – it's an octal escape sequence
                return true;
            }
        }
    }

    return false;
}

function isUseStrictDeclaration(node: StringLiteralLike) {
    return node.text === "use strict" && isExpressionStatement(node.parent);
}

function isLookupTypeParameter(node: StringLiteralLike) {
    return isLiteralTypeNode(node.parent) && isIndexedAccessTypeNode(node.parent.parent);
}

/** Versions of typescript below 2.7.1 treat backticks differently */
function hasOldTscBacktickBehavior() {
    return lt(getNormalizedTypescriptVersion(), "2.7.1");
}
