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

import { getLineRanges, getTokenAtPosition, isPositionInComment } from "tsutils";
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
    const failure = Rule.FAILURE_STRING(tabs ? "tab" : size === undefined ? "space" : `${size} space`);

    for (const {pos, contentLength} of getLineRanges(sourceFile)) {
        if (contentLength === 0) { continue; }
        const line = sourceFile.text.substr(pos, contentLength);
        let indentEnd = line.search(/\S/);
        let gotError = false;
        if (size !== undefined) {
            gotError = checkIndentSize({ ctx, tabs, size, pos, indentEnd, line, sourceFile });
            if (gotError) {
                continue;
            }
        }
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

function checkIndentSize(params: {
    ctx: Lint.WalkContext<Options>;
    tabs: boolean;
    size: number;
    pos: number;
    indentEnd: number;
    line: string;
    sourceFile: ts.SourceFile;
}): boolean {
    const ctx: Lint.WalkContext<Options> = params.ctx;
    const tabs: boolean = params.tabs;
    const size: number = params.size;
    const pos: number = params.pos;
    const indentEnd: number = params.indentEnd;
    const line: string = params.line;
    const sourceFile: ts.SourceFile = params.sourceFile;

    const currentNodePos: number = pos + indentEnd;
    let currentNode: ts.Node | undefined = recursiveGetNodeAt(sourceFile, currentNodePos);
    let depth = 0;
    if (currentNode !== undefined && inTsx(sourceFile)) {
        return false;
    }
    if (currentNode !== undefined && currentNode.getStart() === currentNodePos) {
        depth = getNodeDeepth(currentNode, line);
    } else {
        currentNode = recursiveGetNodeAtEnd(sourceFile, currentNodePos);
        if (currentNode !== undefined) {
            depth = getNodeDeepth(currentNode, line);
        } else {
            return false;
        }
    }
    const expectedIndentation: string = tabs ? "\t".repeat(depth)
            : " ".repeat(size * depth);
    const actualIndentation = line.slice(0, indentEnd);
    const failure = Rule.FAILURE_STRING(tabs ? "tab" : size === undefined ? "space" : `${depth * size} space`);
    if (inStringTemplate(currentNode)) {
        return false;
    }
    if (line.trim().charAt(0) === "*") {
        return false;
    }
    if (expectedIndentation !== actualIndentation) {
        ctx.addFailureAt(
            pos,
            indentEnd,
            failure,
            createIndentSizeFix(
                pos,
                tabs,
                size,
                depth,
                indentEnd,
            ),
        );
        return true;
    }
    return false;
}

function recursiveGetNodeAt(root: ts.Node, pos: number): ts.Node | undefined {
    let result: ts.Node | undefined = root.getChildAt(pos);
    if (result === undefined) {
        ts.forEachChild(root, function cb(node: ts.Node): void {
            if (node.getFullStart() < pos && node.getEnd() >= pos) {
                result = recursiveGetNodeAt(node, pos);
            }
            ts.forEachChild(node, cb);
        });
    }
    if (result !== undefined) {
        return result;
    }
    return root;
}

function recursiveGetNodeAtEnd(root: ts.Node, pos: number): ts.Node | undefined {
    if (root.getEnd() === pos) {
        return root;
    }
    let result: ts.Node | undefined;
    ts.forEachChild(root, function cb(node: ts.Node): void {
        if (node.getFullStart() < pos && node.getEnd() >= pos) {
            result = recursiveGetNodeAt(node, pos);
        }
        ts.forEachChild(node, cb);
    });
    return result;
}

function inTsx(node: ts.SourceFile): boolean {
    return /.tsx$/.test(node.fileName);
}

function getNodeDeepth(node: ts.Node, line: string): number {
    let result = 0;
    let parent: ts.Node | undefined = node.parent;
    const blockTypes: ts.SyntaxKind[] = [
        ts.SyntaxKind.Block, // 207
        ts.SyntaxKind.Parameter, // 146
        ts.SyntaxKind.CaseBlock, // 235
        ts.SyntaxKind.EnumMember, // 264
        ts.SyntaxKind.CaseClause, // 257
        // ts.SyntaxKind.IfStatement, // Have no idea on how to check whether a node is in if paren
        ts.SyntaxKind.ModuleBlock, // 234
        ts.SyntaxKind.TemplateSpan, // 205
        ts.SyntaxKind.DefaultClause, // 258
        ts.SyntaxKind.ClassDeclaration, // 229
        ts.SyntaxKind.ArrayLiteralExpression,
        ts.SyntaxKind.ObjectLiteralExpression, // 178
    ];
    while (parent !== undefined) {
        if (blockTypes.indexOf(parent.kind) > -1) {
            result++;
        }
        parent = parent.parent;
    }
    if (nodeAtOutside(node)) {
        result--;
    }
    if (
        node.parent !== undefined
        && node.parent.kind === ts.SyntaxKind.CallExpression
        && /^\s*\./.test(line)
    ) {
        result ++;
    }
    return result;
}

function inStringTemplate(node: ts.Node | undefined): boolean {
    if (node === undefined) {
        return false;
    }
    const inTemplate = [
        ts.SyntaxKind.NoSubstitutionTemplateLiteral,
        ts.SyntaxKind.TemplateHead,
        ts.SyntaxKind.TemplateMiddle,
        ts.SyntaxKind.TemplateTail,
    ].indexOf(node.kind) > -1;
    if (inTemplate) {
        return true;
    }
    return false;
}

function nodeAtOutside(node: ts.Node): boolean {
    if (node.parent === undefined) {
        return false;
    }
    return node.kind === ts.SyntaxKind.Identifier
         && node.parent.kind === ts.SyntaxKind.ClassDeclaration;
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
        "\t".repeat(indentTimes) :
        " ".repeat(tabSize * indentTimes);
    return new Lint.Replacement(lineStart, len, replacement);
}
