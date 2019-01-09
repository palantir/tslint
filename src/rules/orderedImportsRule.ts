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

import {
    isExternalModuleReference,
    isImportDeclaration,
    isImportEqualsDeclaration,
    isModuleDeclaration,
    isNamedImports,
    isStringLiteral,
} from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "ordered-imports",
        description: "Requires that import statements be alphabetized and grouped.",
        descriptionDetails: Lint.Utils.dedent`
            Enforce a consistent ordering for ES6 imports:
            - Named imports must be alphabetized (i.e. "import {A, B, C} from "foo";")
                - The exact ordering can be controlled by the named-imports-order option.
                - "longName as name" imports are ordered by "longName".
            - Import sources must be alphabetized within groups, i.e.:
                    import * as foo from "a";
                    import * as bar from "b";
            - Groups of imports are delineated by blank lines. You can use these to group imports
                however you like, e.g. by first- vs. third-party or thematically or you can
                enforce a grouping of third-party, parent directories and the current directory.`,
        hasFix: true,
        optionsDescription: Lint.Utils.dedent`
            You may set the \`"import-sources-order"\` option to control the ordering of source
            imports (the \`"foo"\` in \`import {A, B, C} from "foo"\`).

            Possible values for \`"import-sources-order"\` are:

            * \`"case-insensitive'\`: Correct order is \`"Bar"\`, \`"baz"\`, \`"Foo"\`. (This is the default.)
            * \`"lowercase-first"\`: Correct order is \`"baz"\`, \`"Bar"\`, \`"Foo"\`.
            * \`"lowercase-last"\`: Correct order is \`"Bar"\`, \`"Foo"\`, \`"baz"\`.
            * \`"any"\`: Allow any order.

            You may set the \`"grouped-imports"\` option to control the grouping of source
            imports (the \`"foo"\` in \`import {A, B, C} from "foo"\`).

            Possible values for \`"grouped-imports"\` are:

            * \`false\`: Do not enforce grouping. (This is the default.)
            * \`true\`: Group source imports by \`"bar"\`, \`"../baz"\`, \`"./foo"\`.

            You may set the \`"named-imports-order"\` option to control the ordering of named
            imports (the \`{A, B, C}\` in \`import {A, B, C} from "foo"\`).

            Possible values for \`"named-imports-order"\` are:

            * \`"case-insensitive'\`: Correct order is \`{A, b, C}\`. (This is the default.)
            * \`"lowercase-first"\`: Correct order is \`{b, A, C}\`.
            * \`"lowercase-last"\`: Correct order is \`{A, C, b}\`.
            * \`"any"\`: Allow any order.

            You may set the \`"module-source-path"\` option to control the ordering of imports based full path
            or just the module name

            Possible values for \`"module-source-path"\` are:

            * \`"full'\`: Correct order is  \`"./a/Foo"\`, \`"./b/baz"\`, \`"./c/Bar"\`. (This is the default.)
            * \`"basename"\`: Correct order is \`"./c/Bar"\`, \`"./b/baz"\`, \`"./a/Foo"\`.

        `,
        options: {
            type: "object",
            properties: {
                "grouped-imports": {
                    type: "boolean",
                },
                "import-sources-order": {
                    type: "string",
                    enum: ["case-insensitive", "lowercase-first", "lowercase-last", "any"],
                },
                "named-imports-order": {
                    type: "string",
                    enum: ["case-insensitive", "lowercase-first", "lowercase-last", "any"],
                },
                "module-source-path": {
                    type: "string",
                    enum: ["full", "basename"],
                },
            },
            additionalProperties: false,
        },
        optionExamples: [
            true,
            [
                true,
                {
                    "import-sources-order": "lowercase-last",
                    "named-imports-order": "lowercase-first",
                },
            ],
        ],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static IMPORT_SOURCES_NOT_GROUPED =
        "Import sources of different groups must be sorted by: libraries, parent directories, current directory.";
    public static IMPORT_SOURCES_UNORDERED = "Import sources within a group must be alphabetized.";
    public static NAMED_IMPORTS_UNORDERED = "Named imports must be alphabetized.";
    public static IMPORT_SOURCES_OF_SAME_TYPE_NOT_IN_ONE_GROUP =
        "Import sources of the same type (package, same folder, different folder) must be grouped together.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(
            new Walker(sourceFile, this.ruleName, parseOptions(this.ruleArguments)),
        );
    }
}

// Transformations to apply to produce the desired ordering of imports.
// The imports must be lexicographically sorted after applying the transform.
type Transform = (x: string) => string;
const TRANSFORMS = new Map<string, Transform>([
    ["any", () => ""],
    ["case-insensitive", x => x.toLowerCase()],
    ["lowercase-first", flipCase],
    ["lowercase-last", x => x],
    ["full", x => x],
    [
        "basename",
        x => {
            if (!ts.isExternalModuleNameRelative(x)) {
                return x;
            }

            const splitIndex = x.lastIndexOf("/");
            if (splitIndex === -1) {
                return x;
            }
            return x.substr(splitIndex + 1);
        },
    ],
]);

enum ImportType {
    LIBRARY_IMPORT = 1,
    PARENT_DIRECTORY_IMPORT = 2, // starts with "../"
    CURRENT_DIRECTORY_IMPORT = 3, // starts with "./"
}

interface Options {
    groupedImports: boolean;
    importSourcesOrderTransform: Transform;
    moduleSourcePath: Transform;
    namedImportsOrderTransform: Transform;
}

interface JsonOptions {
    "grouped-imports"?: boolean;
    "import-sources-order"?: string;
    "named-imports-order"?: string;
    "module-source-path"?: string;
}

function parseOptions(ruleArguments: any[]): Options {
    const optionSet = (ruleArguments as JsonOptions[])[0];
    const {
        "grouped-imports": isGrouped = false,
        "import-sources-order": sources = "case-insensitive",
        "named-imports-order": named = "case-insensitive",
        "module-source-path": path = "full",
    } = optionSet === undefined ? {} : optionSet;
    return {
        groupedImports: isGrouped,
        importSourcesOrderTransform: TRANSFORMS.get(sources)!,
        moduleSourcePath: TRANSFORMS.get(path)!,
        namedImportsOrderTransform: TRANSFORMS.get(named)!,
    };
}

class Walker extends Lint.AbstractWalker<Options> {
    private readonly importsBlocks = [new ImportsBlock()];
    // keep a reference to the last Fix object so when the entire block is replaced, the replacement can be added
    private lastFix: Lint.Replacement[] | undefined;
    private nextType = ImportType.LIBRARY_IMPORT;

    private get currentImportsBlock(): ImportsBlock {
        return this.importsBlocks[this.importsBlocks.length - 1];
    }

    public walk(sourceFile: ts.SourceFile): void {
        for (const statement of sourceFile.statements) {
            this.checkStatement(statement);
        }
        this.endBlock();
        if (this.options.groupedImports) {
            this.checkBlocksGrouping();
        }
    }

    private checkStatement(statement: ts.Statement): void {
        if (
            !(isImportDeclaration(statement) || isImportEqualsDeclaration(statement)) ||
            /\r?\n\r?\n/.test(
                this.sourceFile.text.slice(
                    statement.getFullStart(),
                    statement.getStart(this.sourceFile),
                ),
            )
        ) {
            this.endBlock();
        }

        if (isImportDeclaration(statement)) {
            this.checkImportDeclaration(statement);
        } else if (isImportEqualsDeclaration(statement)) {
            this.checkImportEqualsDeclaration(statement);
        } else if (isModuleDeclaration(statement)) {
            const body = moduleDeclarationBody(statement);
            if (body !== undefined) {
                for (const subStatement of body.statements) {
                    this.checkStatement(subStatement);
                }
                this.endBlock();
            }
        }
    }

    private checkImportDeclaration(node: ts.ImportDeclaration) {
        if (!isStringLiteral(node.moduleSpecifier)) {
            // Ignore grammar error
            return;
        }

        const source = removeQuotes(node.moduleSpecifier.text);
        this.checkSource(source, node);

        const { importClause } = node;
        if (
            importClause !== undefined &&
            importClause.namedBindings !== undefined &&
            isNamedImports(importClause.namedBindings)
        ) {
            this.checkNamedImports(importClause.namedBindings);
        }
    }

    private checkImportEqualsDeclaration(node: ts.ImportEqualsDeclaration) {
        // only allowed `import x = require('y');`

        const { moduleReference } = node;

        if (!isExternalModuleReference(moduleReference)) {
            return;
        }

        const { expression } = moduleReference;

        if (expression === undefined || !isStringLiteral(expression)) {
            return;
        }

        const source = removeQuotes(expression.text);
        this.checkSource(source, node);
    }

    private checkSource(originalSource: string, node: ImportDeclaration["node"]) {
        const type = getImportType(originalSource);
        const source = this.options.importSourcesOrderTransform(originalSource);
        const currentSource = this.options.moduleSourcePath(source);
        const previousSource = this.currentImportsBlock.getLastImportSource();
        this.currentImportsBlock.addImportDeclaration(this.sourceFile, node, currentSource, type);

        if (previousSource !== null && compare(currentSource, previousSource) === -1) {
            this.lastFix = [];
            this.addFailureAtNode(node, Rule.IMPORT_SOURCES_UNORDERED, this.lastFix);
        }
    }

    private endBlock(): void {
        if (this.lastFix !== undefined) {
            const replacement = this.currentImportsBlock.getReplacement();
            if (replacement !== undefined) {
                this.lastFix.push(replacement);
            }
            this.lastFix = undefined;
        }
        this.importsBlocks.push(new ImportsBlock());
    }

    private checkNamedImports(node: ts.NamedImports): void {
        const imports = node.elements;

        const pair = findUnsortedPair(imports, this.options.namedImportsOrderTransform);
        if (pair !== undefined) {
            const [a, b] = pair;
            const sortedDeclarations = sortByKey(imports, x =>
                this.options.namedImportsOrderTransform(x.getText()),
            ).map(x => x.getText());
            // replace in reverse order to preserve earlier offsets
            for (let i = imports.length - 1; i >= 0; i--) {
                const start = imports[i].getStart();
                const length = imports[i].getText().length;

                // replace the named imports one at a time to preserve whitespace
                this.currentImportsBlock.replaceNamedImports(start, length, sortedDeclarations[i]);
            }

            this.lastFix = [];
            this.addFailure(a.getStart(), b.getEnd(), Rule.NAMED_IMPORTS_UNORDERED, this.lastFix);
        }
    }

    private checkBlocksGrouping(): void {
        this.checkBlocksUniqueness();
        this.importsBlocks.some(this.checkBlockGroups, this);
    }

    private checkBlocksUniqueness(): void {
        const typesEncountered = new Map<ImportType, boolean>([
            [ImportType.LIBRARY_IMPORT, false],
            [ImportType.PARENT_DIRECTORY_IMPORT, false],
            [ImportType.CURRENT_DIRECTORY_IMPORT, false],
        ]);

        const nonEmptyBlocks = this.importsBlocks.filter(
            block => block.getImportDeclarations().length > 0,
        );
        nonEmptyBlocks.forEach(block => {
            // assume the whole block is of the same type, hence use the first one as the representing one
            const firstInBlock = block.getImportDeclarations()[0];
            if (typesEncountered.get(firstInBlock.type)) {
                this.addFailureAtNode(
                    firstInBlock.node,
                    Rule.IMPORT_SOURCES_OF_SAME_TYPE_NOT_IN_ONE_GROUP,
                );
            } else {
                typesEncountered.set(firstInBlock.type, true);
            }
        });
    }

    private checkBlockGroups(importsBlock: ImportsBlock): boolean {
        const oddImportDeclaration = this.getOddImportDeclaration(importsBlock);
        if (oddImportDeclaration !== undefined) {
            this.addFailureAtNode(
                oddImportDeclaration.node,
                Rule.IMPORT_SOURCES_NOT_GROUPED,
                this.getReplacements(),
            );
            return true;
        }
        return false;
    }

    private getOddImportDeclaration(importsBlock: ImportsBlock): ImportDeclaration | undefined {
        const importDeclarations = importsBlock.getImportDeclarations();
        if (importDeclarations.length === 0) {
            return undefined;
        }
        const type = importDeclarations[0].type;
        if (type < this.nextType) {
            return importDeclarations[0];
        } else {
            this.nextType = type;
            return importDeclarations.find(importDeclaration => importDeclaration.type !== type);
        }
    }

    private getReplacements(): Lint.Replacement[] {
        const importDeclarationsList = this.importsBlocks
            .map(block => block.getImportDeclarations())
            .filter(imports => imports.length > 0);
        const allImportDeclarations = ([] as ImportDeclaration[]).concat(...importDeclarationsList);
        const replacements = this.getReplacementsForExistingImports(importDeclarationsList);
        const startOffset =
            allImportDeclarations.length === 0 ? 0 : allImportDeclarations[0].nodeStartOffset;
        replacements.push(
            Lint.Replacement.appendText(startOffset, this.getGroupedImports(allImportDeclarations)),
        );
        return replacements;
    }

    private getReplacementsForExistingImports(
        importDeclarationsList: ImportDeclaration[][],
    ): Lint.Replacement[] {
        return importDeclarationsList.map((items, index) => {
            let start = items[0].nodeStartOffset;
            if (index > 0) {
                const prevItems = importDeclarationsList[index - 1];
                const last = prevItems[prevItems.length - 1];
                if (/[\r\n]+/.test(this.sourceFile.text.slice(last.nodeEndOffset, start))) {
                    // remove whitespace between blocks
                    start = last.nodeEndOffset;
                }
            }
            return Lint.Replacement.deleteFromTo(start, items[items.length - 1].nodeEndOffset);
        });
    }

    private getGroupedImports(importDeclarations: ImportDeclaration[]): string {
        return [
            ImportType.LIBRARY_IMPORT,
            ImportType.PARENT_DIRECTORY_IMPORT,
            ImportType.CURRENT_DIRECTORY_IMPORT,
        ]
            .map(type => {
                const imports = importDeclarations.filter(
                    importDeclaration => importDeclaration.type === type,
                );
                return getSortedImportDeclarationsAsText(imports);
            })
            .filter(text => text.length > 0)
            .join(this.getEolChar());
    }

    private getEolChar(): string {
        const lineEnd = this.sourceFile.getLineEndOfPosition(0);
        let newLine;
        if (lineEnd > 0) {
            if (lineEnd > 1 && this.sourceFile.text[lineEnd - 1] === "\r") {
                newLine = "\r\n";
            } else if (this.sourceFile.text[lineEnd] === "\n") {
                newLine = "\n";
            }
        }
        return newLine === undefined ? ts.sys.newLine : newLine;
    }
}

interface ImportDeclaration {
    node: ts.ImportDeclaration | ts.ImportEqualsDeclaration;
    nodeEndOffset: number; // end position of node within source file
    nodeStartOffset: number; // start position of node within source file
    text: string; // initialized with original import text; modified if the named imports are reordered
    sourcePath: string;
    type: ImportType;
}

class ImportsBlock {
    private importDeclarations: ImportDeclaration[] = [];

    public addImportDeclaration(
        sourceFile: ts.SourceFile,
        node: ImportDeclaration["node"],
        sourcePath: string,
        type: ImportType,
    ) {
        const start = this.getStartOffset(node);
        const end = this.getEndOffset(sourceFile, node);
        const text = sourceFile.text.substring(start, end);

        if (start > node.getStart() || end === 0) {
            // skip block if any statements don't end with a newline to simplify implementation
            this.importDeclarations = [];
            return;
        }

        this.importDeclarations.push({
            node,
            nodeEndOffset: end,
            nodeStartOffset: start,
            sourcePath,
            text,
            type,
        });
    }

    public getImportDeclarations(): ImportDeclaration[] {
        return this.importDeclarations;
    }

    // replaces the named imports on the most recent import declaration
    public replaceNamedImports(fileOffset: number, length: number, replacement: string) {
        const importDeclaration = this.getLastImportDeclaration();
        if (importDeclaration === undefined) {
            // nothing to replace. This can happen if the block is skipped
            return;
        }

        const start = fileOffset - importDeclaration.nodeStartOffset;
        if (start < 0 || start + length > importDeclaration.node.getEnd()) {
            throw new Error("Unexpected named import position");
        }

        const initialText = importDeclaration.text;
        importDeclaration.text =
            initialText.substring(0, start) + replacement + initialText.substring(start + length);
    }

    public getLastImportSource() {
        if (this.importDeclarations.length === 0) {
            return null;
        }
        return this.getLastImportDeclaration()!.sourcePath;
    }

    // creates a Lint.Replacement object with ordering fixes for the entire block
    public getReplacement() {
        if (this.importDeclarations.length === 0) {
            return undefined;
        }
        const fixedText = getSortedImportDeclarationsAsText(this.importDeclarations);
        const start = this.importDeclarations[0].nodeStartOffset;
        const end = this.getLastImportDeclaration()!.nodeEndOffset;
        return new Lint.Replacement(start, end - start, fixedText);
    }

    // gets the offset immediately after the end of the previous declaration to include comment above
    private getStartOffset(node: ImportDeclaration["node"]) {
        if (this.importDeclarations.length === 0) {
            return node.getStart();
        }
        return this.getLastImportDeclaration()!.nodeEndOffset;
    }

    // gets the offset of the end of the import's line, including newline, to include comment to the right
    private getEndOffset(sourceFile: ts.SourceFile, node: ImportDeclaration["node"]) {
        return sourceFile.text.indexOf("\n", node.end) + 1;
    }

    private getLastImportDeclaration(): ImportDeclaration | undefined {
        return this.importDeclarations[this.importDeclarations.length - 1];
    }
}

function getImportType(sourcePath: string): ImportType {
    if (sourcePath.charAt(0) === ".") {
        if (sourcePath.charAt(1) === ".") {
            return ImportType.PARENT_DIRECTORY_IMPORT;
        } else {
            return ImportType.CURRENT_DIRECTORY_IMPORT;
        }
    } else {
        return ImportType.LIBRARY_IMPORT;
    }
}

// Convert aBcD --> AbCd
function flipCase(str: string): string {
    return Array.from(str)
        .map(char => {
            if (char >= "a" && char <= "z") {
                return char.toUpperCase();
            } else if (char >= "A" && char <= "Z") {
                return char.toLowerCase();
            }
            return char;
        })
        .join("");
}

// After applying a transformation, are the nodes sorted according to the text they contain?
// If not, return the pair of nodes which are out of order.
function findUnsortedPair(
    xs: ReadonlyArray<ts.Node>,
    transform: (x: string) => string,
): [ts.Node, ts.Node] | undefined {
    for (let i = 1; i < xs.length; i++) {
        if (transform(xs[i].getText()) < transform(xs[i - 1].getText())) {
            return [xs[i - 1], xs[i]];
        }
    }
    return undefined;
}

function compare(a: string, b: string): 0 | 1 | -1 {
    function isLow(value: string) {
        return value[0] === "." || value[0] === "/";
    }
    if (isLow(a) && !isLow(b)) {
        return 1;
    } else if (!isLow(a) && isLow(b)) {
        return -1;
    } else if (a > b) {
        return 1;
    } else if (a < b) {
        return -1;
    }
    return 0;
}

function removeQuotes(value: string): string {
    // strip out quotes
    if (value.length > 1 && (value[0] === "'" || value[0] === '"')) {
        value = value.substr(1, value.length - 2);
    }
    return value;
}

function getSortedImportDeclarationsAsText(importDeclarations: ImportDeclaration[]): string {
    const sortedDeclarations = sortByKey(importDeclarations.slice(), x => x.sourcePath);
    return sortedDeclarations.map(x => x.text).join("");
}

function sortByKey<T>(xs: ReadonlyArray<T>, getSortKey: (x: T) => string): T[] {
    return xs.slice().sort((a, b) => compare(getSortKey(a), getSortKey(b)));
}

function moduleDeclarationBody(node: ts.ModuleDeclaration): ts.ModuleBlock | undefined {
    let body = node.body;
    while (body !== undefined && body.kind === ts.SyntaxKind.ModuleDeclaration) {
        body = body.body;
    }
    return body !== undefined && body.kind === ts.SyntaxKind.ModuleBlock ? body : undefined;
}
