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

import * as Lint from "../lint";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "ordered-imports",
        description: "Requires that import statements be alphabetized.",
        descriptionDetails: Lint.Utils.dedent`
            Enforce a consistent ordering for ES6 imports:
            - Named imports must be alphabetized (i.e. "import {A, B, C} from "foo";")
                - The exact ordering can be controled by the named-imports-order option.
                - "longName as name" imports are ordered by "longName".
            - Import sources must be alphabetized within groups, i.e.:
                    import * as foo from "a";
                    import * as bar from "b";
            - Groups of imports are delineated by blank lines. You can use these to group imports
                however you like, e.g. by first- vs. third-party or thematically.`,
        optionsDescription: Lint.Utils.dedent`
            You may set the \`"import-sources-order"\` option to control the ordering of source
            imports (the \`"foo"\` in \`import {A, B, C} from "foo"\`).

            Possible values for \`"import-sources-order"\` are:
            * \`"case-insensitive'\`: Correct order is \`"Bar"\`, \`"baz"\`, \`"Foo"\`. (This is the default.)
            * \`"lowercase-first"\`: Correct order is \`"baz"\`, \`"Bar"\`, \`"Foo"\`.
            * \`"lowercase-last"\`: Correct order is \`"Bar"\`, \`"Foo"\`, \`"baz"\`.
            * \`"any"\`: Allow any order.

            You may set the \`"named-imports-order"\` option to control the ordering of named
            imports (the \`{A, B, C}\` in \`import {A, B, C} from "foo"\`).

            Possible values for \`"named-imports-order"\` are:

            * \`"case-insensitive'\`: Correct order is \`{A, b, C}\`. (This is the default.)
            * \`"lowercase-first"\`: Correct order is \`{b, A, C}\`.
            * \`"lowercase-last"\`: Correct order is \`{A, C, b}\`.
            * \`"any"\`: Allow any order.

        `,
        options: {
            type: "object",
            properties: {
                "import-sources-order": {
                    type: "string",
                    enum: ["case-insensitive", "lowercase-first", "lowercase-last", "any"],
                },
                "named-imports-order": {
                    type: "string",
                    enum: ["case-insensitive", "lowercase-first", "lowercase-last", "any"],
                },
            },
            additionalProperties: false,
        },
        optionExamples: [
            "true",
            '[true, {"import-sources-order": "lowercase-last", "named-imports-order": "lowercase-first"}]',
        ],
        type: "style",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static IMPORT_SOURCES_UNORDERED = "Import sources within a group must be alphabetized.";
    public static NAMED_IMPORTS_UNORDERED = "Named imports must be alphabetized.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const orderedImportsWalker = new OrderedImportsWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(orderedImportsWalker);
    }
}

// Convert aBcD --> AbCd
function flipCase(x: string): string {
    return x.split("").map(char => {
        if (char >= "a" && char <= "z") {
            return char.toUpperCase();
        } else if (char >= "A" && char <= "Z") {
            return char.toLowerCase();
        }
        return char;
    }).join("");
}

// After applying a transformation, are the nodes sorted according to the text they contain?
// If not, return the pair of nodes which are out of order.
function findUnsortedPair(xs: ts.Node[], transform: (x: string) => string): [ts.Node, ts.Node] {
    for (let i = 1; i < xs.length; i++) {
        if (transform(xs[i].getText()) < transform(xs[i - 1].getText())) {
            return [xs[i - 1], xs[i]];
        }
    }
    return null;
}

function sortByKey<T>(xs: T[], getSortKey: (x: T) => string): T[] {
    return xs.sort((a, b) => {
        const transformedA = getSortKey(a);
        const transformedB = getSortKey(b);
        if (transformedA > transformedB) {
            return 1;
        } else if (transformedA < transformedB) {
            return -1;
        }
        return 0;
    });
}

// Transformations to apply to produce the desired ordering of imports.
// The imports must be lexicographically sorted after applying the transform.
const TRANSFORMS: {[ordering: string]: (x: string) => string} = {
    any: () => "",
    "case-insensitive": (x: string) => x.toLowerCase(),
    "lowercase-first": flipCase,
    "lowercase-last": (x: string) => x,
};

class OrderedImportsWalker extends Lint.RuleWalker {
    private currentImportsBlock: ImportsBlock = new ImportsBlock();
    // keep a reference to the last Fix object so when the entire block is replaced, the replacement can be added
    private lastFix: Lint.Fix;
    private importSourcesOrderTransform: (x: string) => string = null;
    private namedImportsOrderTransform: (x: string) => string = null;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);

        const optionSet = this.getOptions()[0] || {};
        this.importSourcesOrderTransform =
            TRANSFORMS[optionSet["import-sources-order"] || "case-insensitive"];
        this.namedImportsOrderTransform =
            TRANSFORMS[optionSet["named-imports-order"] || "case-insensitive"];
    }

    // e.g. "import Foo from "./foo";"
    public visitImportDeclaration(node: ts.ImportDeclaration) {
        const source = this.importSourcesOrderTransform(node.moduleSpecifier.getText());
        const previousSource = this.currentImportsBlock.getLastImportSource();
        this.currentImportsBlock.addImportDeclaration(node, source);

        if (previousSource && source < previousSource) {
            this.lastFix = new Lint.Fix(Rule.metadata.ruleName, []);
            const ruleFailure = this.createFailure(node.getStart(), node.getWidth(), Rule.IMPORT_SOURCES_UNORDERED, this.lastFix);
            this.addFailure(ruleFailure);
        }

        super.visitImportDeclaration(node);
    }

    // This is the "{A, B, C}" of "import {A, B, C} from "./foo";".
    // We need to make sure they're alphabetized.
    public visitNamedImports(node: ts.NamedImports) {
        const imports = node.elements;

        const pair = findUnsortedPair(imports, this.namedImportsOrderTransform);
        if (pair !== null) {
            const [a, b] = pair;
            const start = imports[0].getStart();
            const end = imports[imports.length - 1].getEnd();
            const replacement = sortByKey(imports, (x) => this.namedImportsOrderTransform(x.getText())).map((x) => x.getText()).join(", ");
            this.currentImportsBlock.replaceNamedImports(start, end - start, replacement);
            this.lastFix = new Lint.Fix(Rule.metadata.ruleName, []);
            const ruleFailure = this.createFailure(
                a.getStart(),
                b.getEnd() - a.getStart(),
                Rule.NAMED_IMPORTS_UNORDERED,
                this.lastFix);
            this.addFailure(ruleFailure);
        }

        super.visitNamedImports(node);
    }

    // keep reading the block of import declarations until the block ends, then replace the entire block
    // this allows the reorder of named imports to work well with reordering lines
    public visitNode(node: ts.Node) {
        const prefixLength = node.getStart() - node.getFullStart();
        const prefix = node.getFullText().slice(0, prefixLength);
        const hasBlankLine = prefix.indexOf("\n\n") >= 0 || prefix.indexOf("\r\n\r\n") >= 0;
        const notImportDeclaration = node.parent != null
            && node.parent.kind === ts.SyntaxKind.SourceFile
            && node.kind !== ts.SyntaxKind.ImportDeclaration;

        if (hasBlankLine || notImportDeclaration) {
            // end of block
            if (this.lastFix != null) {
                const replacement = this.currentImportsBlock.getReplacement();
                if (replacement != null) {
                    this.lastFix.replacements.push(replacement);
                }
                this.lastFix = null;
            }
            this.currentImportsBlock = new ImportsBlock();
        }
        super.visitNode(node);
    }
}

interface ImportDeclaration {
    node: ts.ImportDeclaration;
    nodeStartOffset: number;    // start position of node within source file
    text: string;
    sourcePath: string;
}

class ImportsBlock {
    private importDeclarations: ImportDeclaration[] = [];

    public addImportDeclaration(node: ts.ImportDeclaration, sourcePath: string) {
        const start = this.getStartOffset(node);

        this.importDeclarations.push({
            node,
            nodeStartOffset: start,
            sourcePath,
            text: node.getSourceFile().text.substring(start, this.getEndOffset(node)),
        });
    }

    // replaces the named imports on the most recent import declaration    
    public replaceNamedImports(fileOffset: number, length: number, replacement: string) {
        const importDeclaration = this.getLastImportDeclaration();
        const start = fileOffset -  importDeclaration.nodeStartOffset;

        if (start < 0 || start + length > importDeclaration.node.getEnd()) {
            throw "Unexpected named import position";
        }

        const initialText = importDeclaration.text;
        importDeclaration.text = initialText.substring(0, start) + replacement + initialText.substring(start + length);
    }

    public getLastImportSource() {
        if (this.importDeclarations.length === 0) {
            return null;
        }
        return this.getLastImportDeclaration().sourcePath;
    }

    // creates a Lint.Replacement object with ordering fixes for the entire block    
    public getReplacement() {
        if (this.importDeclarations.length === 0) {
            return null;
        }
        const sortedDeclarations = sortByKey(this.importDeclarations.slice(), (x) => x.sourcePath);
        const fixedText = sortedDeclarations.map((x) => x.text).join("");
        const start = this.importDeclarations[0].nodeStartOffset;
        const end = this.getLastImportDeclaration().nodeStartOffset + this.getLastImportDeclaration().text.length;
        return new Lint.Replacement(start, end - start, fixedText);
    }

    // gets the offset immediately after the end of the previous declaration to include comment above  
    private getStartOffset(node: ts.ImportDeclaration) {
        if (this.importDeclarations.length === 0) {
            return node.getStart();
        }
        return this.getLastImportDeclaration().nodeStartOffset + this.getLastImportDeclaration().text.length;
    }

    // gets the offset of the end of the import's line, including newline, to include comment to the right
    private getEndOffset(node: ts.ImportDeclaration) {
        let endLineOffset = node.getSourceFile().text.indexOf("\n", node.end) + 1;
        if (endLineOffset < 0) {
            endLineOffset = node.getSourceFile().end;
        }
        return endLineOffset;
    }

    private getLastImportDeclaration() {
        return this.importDeclarations[this.importDeclarations.length - 1];
    }
}
