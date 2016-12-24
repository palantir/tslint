import * as ts from "typescript";
import * as Lint from "../index";

const ALWAYS_OR_NEVER = {
    enum: ["always", "never"],
    type: "string",
};

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: Lint.IRuleMetadata = {
        description: "Require or disallow a space before function parenthesis",
        optionExamples: [
            `true`,
            `[true, "always"]`,
            `[true, "never"]`,
            `[true, {"anonymous": "always", "named": "never", "asyncArrow": "always"}]`,
        ],
        options: {
            properties: {
                anonymous: ALWAYS_OR_NEVER,
                asyncArrow: ALWAYS_OR_NEVER,
                constructor: ALWAYS_OR_NEVER,
                method: ALWAYS_OR_NEVER,
                named: ALWAYS_OR_NEVER,
            },
            type: "object",
        },
        optionsDescription: Lint.Utils.dedent`
            One argument which is an object which may contain the keys \`anonymous\`, \`named\`, and \`asyncArrow\`
            These should be set to either \`"always"\` or \`"never"\`.

            * \`"anonymous"\` checks before the opening paren in anonymous functions
            * \`"named"\` checks before the opening paren in named functions
            * \`"asyncArrow"\` checks before the opening paren in async arrow functions
            * \`"method"\` checks before the opening paren in class methods
            * \`"constructor"\` checks before the opening paren in class constructors
        `,
        ruleName: "space-before-function-paren",
        type: "style",
        typescriptOnly: false,
    };
    public static INVALID_WHITESPACE_ERROR = "Spaces before function parens are disallowed";
    public static MISSING_WHITESPACE_ERROR = "Missing whitespace before function parens";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new FunctionWalker(sourceFile, this.getOptions()));
    }
}

type OptionName = "anonymous" | "asyncArrow" | "constructor" | "method" | "named";

interface CachedOptions {
    anonymous?: string;
    asyncArrow?: string;
    constructor?: string;
    method?: string;
    named?: string;
}

class FunctionWalker extends Lint.RuleWalker {
    private scanner: ts.Scanner;
    // assign constructor now to avoid typescript assuming its a function type
    private cachedOptions: CachedOptions = {constructor: undefined};

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
        this.scanner = ts.createScanner(ts.ScriptTarget.ES5, false, ts.LanguageVariant.Standard, sourceFile.text);
        this.cacheOptions();
    }

    protected visitArrowFunction(node: ts.FunctionLikeDeclaration): void {
        const option = this.getOption("asyncArrow");
        const syntaxList = this.getChildOfType(node, ts.SyntaxKind.SyntaxList);
        const isAsyncArrow = syntaxList.getStart() === node.getStart() && syntaxList.getText() === "async";
        const openParen = isAsyncArrow ? this.getChildOfType(node, ts.SyntaxKind.OpenParenToken) : undefined;
        this.evaluateRuleAt(openParen, option);

        super.visitArrowFunction(node);
    }

    protected visitConstructorDeclaration(node: ts.ConstructorDeclaration): void {
        const option = this.getOption("constructor");
        const openParen = this.getChildOfType(node, ts.SyntaxKind.OpenParenToken);
        this.evaluateRuleAt(openParen, option);

        super.visitConstructorDeclaration(node);
    }

    protected visitFunctionDeclaration(node: ts.FunctionDeclaration): void {
        this.visitFunction(node);
        super.visitFunctionDeclaration(node);
    }

    protected visitFunctionExpression(node: ts.FunctionExpression): void {
        this.visitFunction(node);
        super.visitFunctionExpression(node);
    }

    protected visitMethodDeclaration(node: ts.MethodDeclaration): void {
        this.visitMethod(node);
        super.visitMethodDeclaration(node);
    }

    protected visitMethodSignature(node: ts.SignatureDeclaration): void {
        this.visitMethod(node);
        super.visitMethodSignature(node);
    }

    private cacheOptions(): void {
        const allOptions = this.getOptions();
        const options = allOptions[0];
        const optionNames: OptionName[] = ["anonymous", "asyncArrow", "constructor", "method", "named"];

        optionNames.forEach((optionName) => {
            switch (options) {
                case undefined:
                case "always":
                    this.cachedOptions[optionName] = "always";
                    break;

                case "never":
                    this.cachedOptions[optionName] = "never";
                    break;

                default:
                    this.cachedOptions[optionName] = options[optionName];
            }
        });
    }

    private getOption(optionName: OptionName): string | undefined {
        return this.cachedOptions[optionName];
    }

    private getChildOfType(node: ts.Node, kind: ts.SyntaxKind): ts.Node {
        const filtered = node.getChildren().filter((child: ts.Node): boolean => child.kind === kind);
        return filtered[0];
    }

    private evaluateRuleAt(openParen: ts.Node | undefined, option: string): void {
        if (openParen === undefined) {
            return;
        }

        const hasSpace = this.isSpaceAt(openParen.getStart() - 1);
        let failure: Lint.RuleFailure;

        if (hasSpace && option === "never") {
            failure = this.createInvalidWhitespaceFailure(openParen.getStart() - 1);
        } else if (!hasSpace && option === "always") {
            failure = this.createMissingWhitespaceFailure(openParen.getStart());
        }

        if (failure !== undefined) {
            this.addFailure(failure);
        }
    }

    private isSpaceAt(textPos: number): boolean {
        this.scanner.setTextPos(textPos);
        const prevTokenKind = this.scanner.scan();
        return prevTokenKind === ts.SyntaxKind.WhitespaceTrivia;
    }

    private visitFunction(node: ts.Node): void {
        const identifier = this.getChildOfType(node, ts.SyntaxKind.Identifier);
        const hasIdentifier = identifier !== undefined && (identifier.getEnd() !== identifier.getStart());
        const optionName = hasIdentifier ? "named" : "anonymous";
        const option = this.getOption(optionName);
        const openParen = this.getChildOfType(node, ts.SyntaxKind.OpenParenToken);
        this.evaluateRuleAt(openParen, option);
    }

    private visitMethod(node: ts.Node): void {
        const option = this.getOption("method");
        const openParen = this.getChildOfType(node, ts.SyntaxKind.OpenParenToken);
        this.evaluateRuleAt(openParen, option);
    }

    private createInvalidWhitespaceFailure(pos: number): Lint.RuleFailure {
        const fix = new Lint.Fix(Rule.metadata.ruleName, [
            this.deleteText(pos, 1),
        ]);
        return this.createFailure(pos, 1, Rule.INVALID_WHITESPACE_ERROR, fix);
    }

    private createMissingWhitespaceFailure(pos: number): Lint.RuleFailure {
        const fix = new Lint.Fix(Rule.metadata.ruleName, [
            this.appendText(pos, " "),
        ]);
        return this.createFailure(pos, 1, Rule.MISSING_WHITESPACE_ERROR, fix);
    }
}
