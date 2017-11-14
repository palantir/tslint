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

import { getLineRanges, getTokenAtPosition, isPositionInComment, isSameLine } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

const OPTION_USE_TABS = "tabs";
const OPTION_USE_SPACES = "spaces";
const OPTION_INDENT_SIZE_2 = 2;
const OPTION_INDENT_SIZE_4 = 4;

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "indent",
        description: "Enforces indentation with tabs or spaces.",
        rationale: Lint.Utils.dedent`
            Using only one of tabs or spaces for indentation leads to more consistent editor behavior,
            cleaner diffs in version control, and easier programmatic manipulation.`,
        optionsDescription: Lint.Utils.dedent`
            One of the following arguments must be provided:

            * \`${OPTION_USE_SPACES}\` enforces consistent spaces.
            * \`${OPTION_USE_TABS}\` enforces consistent tabs.

            A second optional argument specifies indentation size:

            * \`${OPTION_INDENT_SIZE_2.toString()}\` enforces 2 space indentation.
            * \`${OPTION_INDENT_SIZE_4.toString()}\` enforces 4 space indentation.

            Indentation size is required for auto-fixing, but not for rule checking.
            `,
        options: {
            type: "array",
            items: [
                {
                    type: "string",
                    enum: [OPTION_USE_TABS, OPTION_USE_SPACES],
                },
                {
                    type: "number",
                    enum: [OPTION_INDENT_SIZE_2, OPTION_INDENT_SIZE_4],
                },
            ],
            minLength: 0,
            maxLength: 5,
        },
        optionExamples: [
            [true, OPTION_USE_SPACES],
            [true, OPTION_USE_SPACES, OPTION_INDENT_SIZE_4],
            [true, OPTION_USE_TABS, OPTION_INDENT_SIZE_2],
        ],
        type: "maintainability",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING(expected: string): string {
        return `${expected} indentation expected`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const options = parseOptions(this.ruleArguments);
        return options === undefined ? [] : this.applyWithFunction(sourceFile, walk, options);
    }
}

function parseOptions(ruleArguments: any[]): Options | undefined {
    const type = ruleArguments[0] as string;
    if (type !== OPTION_USE_TABS && type !== OPTION_USE_SPACES) { return undefined; }

    const size = ruleArguments[1] as number | undefined;
    return {
        size: size === OPTION_INDENT_SIZE_2 || size === OPTION_INDENT_SIZE_4 ? size : undefined,
        tabs: type === OPTION_USE_TABS,
    };
}

interface Options {
    readonly tabs: boolean;
    readonly size?: 2 | 4;
}

function walk(ctx: Lint.WalkContext<Options>): void {
    const { sourceFile, options: { tabs, size } } = ctx;
    const regExp = tabs ? new RegExp(" ".repeat(size === undefined ? 1 : size)) : /\t/;
    let failure = Rule.FAILURE_STRING(tabs ? "tab" : size === undefined ? "space" : `${size} space`);

    for (const {pos, contentLength} of getLineRanges(sourceFile)) {
        if (contentLength === 0) { continue; }
        const line = sourceFile.text.substr(pos, contentLength);
        let indentEnd = line.search(/\S/);
        // <check-indent-depth>
        if (size !== undefined) {
            const currentNodePos: number = pos + indentEnd;
            let currentNode: ts.Node | undefined = recursiveGetNodeAt(sourceFile, currentNodePos);
            let depth = 0;
            if (currentNode !== undefined && currentNode.getStart(sourceFile) === currentNodePos) {
                depth = getNodeDeepth(currentNode, line, sourceFile);
            } else {
                currentNode = recursiveGetNodeAt(sourceFile, currentNodePos);
                if (currentNode !== undefined) {
                    depth = getNodeDeepth(currentNode, line, sourceFile);
                }
            }
            if (currentNode !== undefined) {
                if (isInStringTemplate(currentNode)) {
                    continue;
                }
                const expectedIndentation: string = tabs ? "\t".repeat(depth)
                : " ".repeat(size * depth);
                const actualIndentation = line.slice(0, indentEnd);
                const passIndentDepthCheck = inStringTemplate(currentNode) || (isPositionInComment(sourceFile, currentNodePos));

                if (!passIndentDepthCheck && expectedIndentation !== actualIndentation) {
                    failure = Rule.FAILURE_STRING(tabs ? "tab" : `${depth * size} space`);
                    ctx.addFailureAt(
                        pos,
                        indentEnd,
                        failure,
                        createIndentSizeFix(pos, tabs, size, depth, indentEnd),
                    );
                    continue;
                }
            }
        }
        // </check-indent-depth>
        if (indentEnd === 0) { continue; }
        if (indentEnd === -1) {
            indentEnd = contentLength;
        }
        const whitespace = line.slice(0, indentEnd);
        if (!regExp.test(whitespace)) { continue; }
        const token = getTokenAtPosition(sourceFile, pos)!;
        if (token.kind !== ts.SyntaxKind.JsxText &&
            (pos >= token.getStart(sourceFile) || isPositionInComment(sourceFile, pos, token))) {
            continue;
        }
        ctx.addFailureAt(pos, indentEnd, failure, createFix(pos, whitespace, tabs, size));
    }
}

function isInStringTemplate(node: ts.Node): boolean {
    if (node.parent === undefined) {
        return false;
    }
    while (node.parent !== undefined) {
        if (node.parent.kind === ts.SyntaxKind.TemplateExpression) {
            return true;
        }
        node = node.parent;
    }
    return false;
}

function recursiveGetNodeAt(root: ts.Node, pos: number): ts.Node | undefined {
    let result: ts.Node | undefined;
    ts.forEachChild(root, function cb(node: ts.Node): void {
        if (node.getFullStart() < pos && node.getEnd() >= pos) {
            const child = node.getChildAt(pos);
            result = child !== undefined ? child : node;
        }
        ts.forEachChild(node, cb);
    });
    return result;
}

function getNodeDeepth(node: ts.Node, line: string, root: ts.SourceFile): number {
    let result = 0;
    let parent: ts.Node | undefined = node.parent;
    const blockTypes: ts.SyntaxKind[] = [
        ts.SyntaxKind.Block,
        ts.SyntaxKind.CaseBlock,
        ts.SyntaxKind.EnumMember,
        ts.SyntaxKind.CaseClause,
        ts.SyntaxKind.JsxElement,
        ts.SyntaxKind.ModuleBlock,
        ts.SyntaxKind.DefaultClause,
        ts.SyntaxKind.ClassDeclaration,
        ts.SyntaxKind.InterfaceDeclaration,
        ts.SyntaxKind.ConditionalExpression,
        ts.SyntaxKind.ArrayLiteralExpression,
        ts.SyntaxKind.ObjectLiteralExpression,
        ts.SyntaxKind.NamedImports,
        ts.SyntaxKind.NamedExports,
        ts.SyntaxKind.TypeLiteral,
    ];
    if (isCloseElement(node, line)) {
        result --;
    }
    if (isCloseParen(node, line) && !isArrowFunctionWithBlock(node)) {
        result ++;
    }
    if (inStatementParen(node)) {
        result ++;
    } else if (isInParen(node, root)) {
        result ++;
    }
    if (leadingWithBinaryOperator(node)) {
        result ++;
    }
    if (isIdentifierInDeclarationList(node)) {
        result ++;
    }
    if (isExportInNamespace(node)) {
        result --;
    }
    while (parent !== undefined) {
        if (blockTypes.indexOf(parent.kind) > -1) {
            result++;
        }
        if (isArrowFunctionWithoutBlock(parent)) {
            result ++;
        }
        if (inStatementParen(parent)) {
            if (!leadingWithBinaryOperator(node) && !isElseIf(parent)) {
                result ++;
            }
        } else if (isInParen(parent, root) && !isSameLineWithParent(parent, root)) {
            result ++;
        }
        parent = parent.parent;
    }
    if (nodeAtOutside(node)) {
        result--;
    }
    /*
     * Check for property access (includes chaining function call) just like this:
        foo()
        .then()
        In this case, `.then` should have one more indent.
        Maybe this should depend on a configuration.
     */
    if (
        node.parent !== undefined
        && node.kind === ts.SyntaxKind.PropertyAccessExpression
        && /^\s*\./.test(line)
    ) {
        result ++;
    }
    return result;
}

function isElseIf(node: ts.Node): boolean {
    if (node.parent === undefined) {
        return false;
    }
    return node.kind === ts.SyntaxKind.IfStatement
         && node.parent.kind === ts.SyntaxKind.IfStatement;
}

function isArrowFunctionWithBlock(node: ts.Node): boolean {
    if (node.parent === undefined) {
        return false;
    }
    return node.kind === ts.SyntaxKind.Block
     && node.parent.kind === ts.SyntaxKind.ArrowFunction;
}

function isArrowFunctionWithoutBlock(node: ts.Node): boolean {
    if (node.parent === undefined) {
        return false;
    }
    return node.kind !== ts.SyntaxKind.Block
     && node.parent.kind === ts.SyntaxKind.ArrowFunction;
}

function inStatementParen(node: ts.Node): boolean {
    if (node.parent === undefined) {
        return false;
    }
    const parentInStatement = [
        ts.SyntaxKind.IfStatement,
        ts.SyntaxKind.WhileStatement,
        ts.SyntaxKind.ForStatement,
        ts.SyntaxKind.ForOfStatement,
        ts.SyntaxKind.DoStatement,
        ts.SyntaxKind.WithStatement,
    ].indexOf(node.parent.kind) >= 0;
    return node.kind !== ts.SyntaxKind.Block && parentInStatement;
}

function isInParen(node: ts.Node, root: ts.SourceFile): boolean {
    const preChild: ts.Node | undefined = getPreChild(node, root);
    if (preChild === undefined) {
        return false;
    }
    return preChild.kind === ts.SyntaxKind.OpenParenToken;
}

function isSameLineWithParent(node: ts.Node, root: ts.SourceFile): boolean {
    const preChild: ts.Node | undefined = getPreChild(node, root);
    if (preChild === undefined) {
        return false;
    }
    if (preChild.getText().trim() !== "(") {
        return false;
    }
    return isSameLine(root, node.getStart(), preChild.getEnd());
}

function getPreChild(node: ts.Node, root: ts.SourceFile): ts.Node | undefined {
    let preChild: ts.Node | undefined;
    const parent = node.parent;
    if (parent === undefined) {
        return undefined;
    }
    const children = parent.getChildren(root);
    if (!children.length) {
        return undefined;
    }
    children.forEach((child) => {
        if (child.getEnd() <= node.getFullStart() && child.getText().length > 0) {
            preChild = child;
        }
    });
    return preChild;
}

function isCloseParen(node: ts.Node, line: string): boolean {
    if (node.kind !== ts.SyntaxKind.Block) {
        return false;
    }
    return /^\s*\)/.test(line);
}

function isCloseElement(node: ts.Node, line: string): boolean {
    if (node.parent === undefined) {
        return false;
    }
    return node.parent.kind === ts.SyntaxKind.JsxElement
        && /^\s*<\//.test(line);
}

function leadingWithBinaryOperator(node: ts.Node): boolean {
    return [
        ts.SyntaxKind.PlusToken,
        ts.SyntaxKind.MinusToken,
        ts.SyntaxKind.AsteriskToken,
        ts.SyntaxKind.SlashToken,
        ts.SyntaxKind.AmpersandAmpersandToken,
        ts.SyntaxKind.BarBarToken,
    ].indexOf(node.kind) > -1;
}
function inStringTemplate(node: ts.Node): boolean {
    return node.kind >= ts.SyntaxKind.FirstTemplateToken
        && node.kind <= ts.SyntaxKind.LastTemplateToken;
}

function isExportInNamespace(node: ts.Node): boolean {
    if (node.parent === undefined) {
        return false;
    }
    if (node.kind !== ts.SyntaxKind.ExportKeyword) {
        return false;
    }
    return node.parent.kind === ts.SyntaxKind.InterfaceDeclaration
        || node.parent.kind === ts.SyntaxKind.ClassDeclaration;
}
/**
 *  To check a class declaration broken to two lines, like this:
 *  class
 *  Foo {
 *      // xxx
 *  }
 *  In this case, the `Foo` is regarded as should have the same indent depth with `class`.
 *  Should it have one more depth? I'm not sure.
 */
function nodeAtOutside(node: ts.Node): boolean {
    if (node.parent === undefined) {
        return false;
    }
    return node.kind === ts.SyntaxKind.Identifier
         && node.parent.kind === ts.SyntaxKind.ClassDeclaration;
}

function isIdentifierInDeclarationList(node: ts.Node): boolean {
    if (node.parent === undefined || node.parent.parent == undefined) {
        return false;
    }
    return node.kind === ts.SyntaxKind.Identifier
        && node.parent.parent.kind === ts.SyntaxKind.VariableDeclarationList;
}

function createFix(lineStart: number, fullLeadingWhitespace: string, tabs: boolean, size?: number): Lint.Fix | undefined {
    if (size === undefined) { return undefined; }
    const replaceRegExp = tabs
        // we want to find every group of `size` spaces, plus up to one 'incomplete' group
        ? new RegExp(`^( {${size}})+( {1,${size - 1}})?`, "g")
        : /\t/g;
    const replacement = fullLeadingWhitespace.replace(replaceRegExp, (match) =>
        (tabs ? "\t" : " ".repeat(size)).repeat(Math.ceil(match.length / size)));
    return new Lint.Replacement(lineStart, fullLeadingWhitespace.length, replacement);
}

function createIndentSizeFix(
    lineStart: number,
    useTab: boolean,
    tabSize: number,
    indentTimes: number,
    len: number,
): Lint.Fix {
    const replacement = useTab ?
        "\t".repeat(indentTimes) : " ".repeat(tabSize * indentTimes);
    return new Lint.Replacement(lineStart, len, replacement);
}
