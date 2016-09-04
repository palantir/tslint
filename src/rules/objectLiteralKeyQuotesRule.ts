import * as Lint from "../lint";
import * as ts from "typescript";

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

            For ES6, computed property names (\`{[name]: value}\`) and methods (\`{foo() {}}\`) never need
            to be quoted.`,
        options: {
            type: "string",
            enum: ["always", "as-needed"],
            // TODO: eslint also supports "consistent", "consistent-as-needed" modes.
            // TODO: eslint supports "keywords", "unnecessary" and "numbers" options.
        },
        optionExamples: ["[true, \"as-needed\"]", "[true, \"always\"]"],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static UNNEEDED_QUOTES = (name: string) => `Unnecessarily quoted property '${name}' found.`;
    public static UNQUOTED_PROPERTY = (name: string) => `Unquoted property '${name}' found.`;

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const objectLiteralKeyQuotesWalker = new ObjectLiteralKeyQuotesWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(objectLiteralKeyQuotesWalker);
    }
}

// This is simplistic. See https://mothereff.in/js-properties for the gorey details.
const IDENTIFIER_NAME_REGEX = /^(?:[\$A-Z_a-z])*$/;

const NUMBER_REGEX = /^[0-9]+$/;

type QuotesMode = "always" | "as-needed";

class ObjectLiteralKeyQuotesWalker extends Lint.RuleWalker {
    private mode: QuotesMode;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);

        this.mode = this.getOptions()[0] || "always";
    }

    public visitPropertyAssignment(node: ts.PropertyAssignment) {
        const name = node.name;
        if (this.mode === "always") {
            if (name.kind !== ts.SyntaxKind.StringLiteral &&
                name.kind !== ts.SyntaxKind.ComputedPropertyName) {
                this.addFailure(this.createFailure(name.getStart(), name.getWidth(),
                                                   Rule.UNQUOTED_PROPERTY(name.getText())));
            }
        } else if (this.mode === "as-needed") {
            if (name.kind === ts.SyntaxKind.StringLiteral) {
                // Check if the quoting is necessary.
                const stringNode = name as ts.StringLiteral;
                const property = stringNode.text;

                const isIdentifier = IDENTIFIER_NAME_REGEX.test(property);
                const isNumber = NUMBER_REGEX.test(property);
                if (isIdentifier || (isNumber && Number(property).toString() === property)) {
                    this.addFailure(this.createFailure(stringNode.getStart(), stringNode.getWidth(),
                                                    Rule.UNNEEDED_QUOTES(property)));
                }
            }
        }

        super.visitPropertyAssignment(node);
    }
}
