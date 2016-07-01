import * as Lint from "../lint";
import * as ts from "typescript";

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
            You may set the \`"named-imports-order"\` option to control the ordering of named
            imports (the \`{A, B, C}\` in \'import {A, B, C} from "foo"\`.)

            Possible values for \`"named-imports-order"\` are:

            * \`"case-insensitive'\`: Correct order is \`{A, b, C}\`. (This is the default.)
            * \`"lowercase-first"\`: Correct order is \`{b, A, C}\`.
            * \`"lowercase-last"\`: Correct order is \`{A, C, b}\`.
        `,
        options: {
            type: "object",
            properties: {
                "named-imports-order": {
                    type: "string",
                    enum: ["case-insensitive", "lowercase-first", "lowercase-last"],
                },
            },
            additionalProperties: false,
        },
        optionExamples: ["true", '[true, {"named-imports-order": "lowercase-first"}]'],
        type: "style",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static NAMED_IMPORTS_UNORDERED = "Named imports must be alphabetized.";
    public static IMPORT_SOURCES_UNORDERED = "Import sources within a group must be alphabetized.";

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

// Transformations to apply to produce the desired ordering of named imports.
// The imports must be lexicographically sorted after applying the transform.
const TRANFORMS: {[ordering: string]: (x: string) => string} = {
    "case-insensitive": (x: string) => x.toLowerCase(),
    "lowercase-first": flipCase,
    "lowercase-last": (x: string) => x,
};

class OrderedImportsWalker extends Lint.RuleWalker {
    // This gets reset after every blank line.
    private lastImportSource: string = null;
    private namedImportsOrder: string = null;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);

        const optionSet = this.getOptions()[0] || {};
        this.namedImportsOrder = optionSet["named-imports-order"] || "case-insensitive";
    }

    // e.g. "import Foo from "./foo";"
    public visitImportDeclaration(node: ts.ImportDeclaration) {
        const source = node.moduleSpecifier.getText();

        if (this.lastImportSource && source < this.lastImportSource) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(),
                 Rule.IMPORT_SOURCES_UNORDERED));
        }
        this.lastImportSource = source;

        super.visitImportDeclaration(node);
    }

    // This is the "{A, B, C}" of "import {A, B, C} from "./foo";".
    // We need to make sure they're alphabetized.
    public visitNamedImports(node: ts.NamedImports) {
        const imports = node.elements;

        const pair = findUnsortedPair(imports, TRANFORMS[this.namedImportsOrder]);
        if (pair !== null) {
            const [a, b] = pair;
            this.addFailure(
                this.createFailure(
                    a.getStart(),
                    b.getEnd() - a.getStart(),
                    Rule.NAMED_IMPORTS_UNORDERED));
        }

        super.visitNamedImports(node);
    }

    // Check for a blank line, in which case we should reset the import ordering.
    public visitNode(node: ts.Node) {
        const prefixLength = node.getStart() - node.getFullStart();
        const prefix = node.getFullText().slice(0, prefixLength);

        if (prefix.indexOf("\n\n") >= 0 ||
            prefix.indexOf("\r\n\r\n") >= 0) {
            this.lastImportSource = null;
        }
        super.visitNode(node);
    }
}
