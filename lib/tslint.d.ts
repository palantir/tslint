declare module Lint {
    class SyntaxWalker {
        walk(node: ts.Node): void;
        protected visitAnyKeyword(node: ts.Node): void;
        protected visitArrowFunction(node: ts.FunctionLikeDeclaration): void;
        protected visitBinaryExpression(node: ts.BinaryExpression): void;
        protected visitBindingElement(node: ts.BindingElement): void;
        protected visitBlock(node: ts.Block): void;
        protected visitBreakStatement(node: ts.BreakOrContinueStatement): void;
        protected visitCallExpression(node: ts.CallExpression): void;
        protected visitCallSignature(node: ts.SignatureDeclaration): void;
        protected visitCaseClause(node: ts.CaseClause): void;
        protected visitClassDeclaration(node: ts.ClassDeclaration): void;
        protected visitCatchClause(node: ts.CatchClause): void;
        protected visitConditionalExpression(node: ts.ConditionalExpression): void;
        protected visitConstructorDeclaration(node: ts.ConstructorDeclaration): void;
        protected visitConstructorType(node: ts.FunctionOrConstructorTypeNode): void;
        protected visitContinueStatement(node: ts.BreakOrContinueStatement): void;
        protected visitDebuggerStatement(node: ts.Statement): void;
        protected visitDefaultClause(node: ts.DefaultClause): void;
        protected visitDoStatement(node: ts.DoStatement): void;
        protected visitElementAccessExpression(node: ts.ElementAccessExpression): void;
        protected visitEnumDeclaration(node: ts.EnumDeclaration): void;
        protected visitExportAssignment(node: ts.ExportAssignment): void;
        protected visitExpressionStatement(node: ts.ExpressionStatement): void;
        protected visitForStatement(node: ts.ForStatement): void;
        protected visitForInStatement(node: ts.ForInStatement): void;
        protected visitForOfStatement(node: ts.ForOfStatement): void;
        protected visitFunctionDeclaration(node: ts.FunctionDeclaration): void;
        protected visitFunctionExpression(node: ts.FunctionExpression): void;
        protected visitFunctionType(node: ts.FunctionOrConstructorTypeNode): void;
        protected visitGetAccessor(node: ts.AccessorDeclaration): void;
        protected visitIdentifier(node: ts.Identifier): void;
        protected visitIfStatement(node: ts.IfStatement): void;
        protected visitImportDeclaration(node: ts.ImportDeclaration): void;
        protected visitImportEqualsDeclaration(node: ts.ImportEqualsDeclaration): void;
        protected visitIndexSignatureDeclaration(node: ts.IndexSignatureDeclaration): void;
        protected visitInterfaceDeclaration(node: ts.InterfaceDeclaration): void;
        protected visitJsxElement(node: ts.JsxElement): void;
        protected visitJsxSelfClosingElement(node: ts.JsxSelfClosingElement): void;
        protected visitLabeledStatement(node: ts.LabeledStatement): void;
        protected visitMethodDeclaration(node: ts.MethodDeclaration): void;
        protected visitMethodSignature(node: ts.SignatureDeclaration): void;
        protected visitModuleDeclaration(node: ts.ModuleDeclaration): void;
        protected visitNamedImports(node: ts.NamedImports): void;
        protected visitNamespaceImport(node: ts.NamespaceImport): void;
        protected visitNewExpression(node: ts.NewExpression): void;
        protected visitObjectLiteralExpression(node: ts.ObjectLiteralExpression): void;
        protected visitParameterDeclaration(node: ts.ParameterDeclaration): void;
        protected visitPostfixUnaryExpression(node: ts.PostfixUnaryExpression): void;
        protected visitPrefixUnaryExpression(node: ts.PrefixUnaryExpression): void;
        protected visitPropertyAccessExpression(node: ts.PropertyAccessExpression): void;
        protected visitPropertyAssignment(node: ts.PropertyAssignment): void;
        protected visitPropertyDeclaration(node: ts.PropertyDeclaration): void;
        protected visitPropertySignature(node: ts.Node): void;
        protected visitRegularExpressionLiteral(node: ts.Node): void;
        protected visitReturnStatement(node: ts.ReturnStatement): void;
        protected visitSetAccessor(node: ts.AccessorDeclaration): void;
        protected visitSourceFile(node: ts.SourceFile): void;
        protected visitSwitchStatement(node: ts.SwitchStatement): void;
        protected visitTemplateExpression(node: ts.TemplateExpression): void;
        protected visitThrowStatement(node: ts.ThrowStatement): void;
        protected visitTryStatement(node: ts.TryStatement): void;
        protected visitTypeAssertionExpression(node: ts.TypeAssertion): void;
        protected visitTypeLiteral(node: ts.TypeLiteralNode): void;
        protected visitVariableDeclaration(node: ts.VariableDeclaration): void;
        protected visitVariableStatement(node: ts.VariableStatement): void;
        protected visitWhileStatement(node: ts.WhileStatement): void;
        protected visitNode(node: ts.Node): void;
        protected walkChildren(node: ts.Node): void;
    }
}
declare module Lint {
    class RuleWalker extends Lint.SyntaxWalker {
        private limit;
        private position;
        private options;
        private failures;
        private sourceFile;
        private disabledIntervals;
        private ruleName;
        constructor(sourceFile: ts.SourceFile, options: Lint.IOptions);
        getSourceFile(): ts.SourceFile;
        getFailures(): RuleFailure[];
        getLimit(): number;
        getOptions(): any;
        hasOption(option: string): boolean;
        skip(node: ts.Node): void;
        createFailure(start: number, width: number, failure: string): RuleFailure;
        addFailure(failure: RuleFailure): void;
        private existsFailure(failure);
    }
}
declare module Lint {
    abstract class ScopeAwareRuleWalker<T> extends RuleWalker {
        private scopeStack;
        constructor(sourceFile: ts.SourceFile, options?: any);
        abstract createScope(): T;
        getCurrentScope(): T;
        getAllScopes(): T[];
        getCurrentDepth(): number;
        onScopeStart(): void;
        onScopeEnd(): void;
        protected visitNode(node: ts.Node): void;
        protected isScopeBoundary(node: ts.Node): boolean;
    }
}
declare module Lint.Formatters {
    abstract class AbstractFormatter implements Lint.IFormatter {
        abstract format(failures: Lint.RuleFailure[]): string;
    }
}
declare module Lint {
    interface IFormatter {
        format(failures: Lint.RuleFailure[]): string;
    }
}
declare module Lint {
    function createLanguageServiceHost(fileName: string, source: string): ts.LanguageServiceHost;
    function createLanguageService(fileName: string, source: string): ts.LanguageService;
}
declare module Lint.Rules {
    abstract class AbstractRule implements Lint.IRule {
        private value;
        private options;
        constructor(ruleName: string, value: any, disabledIntervals: Lint.IDisabledInterval[]);
        getOptions(): Lint.IOptions;
        abstract apply(sourceFile: ts.SourceFile): RuleFailure[];
        applyWithWalker(walker: Lint.RuleWalker): RuleFailure[];
        isEnabled(): boolean;
    }
}
declare module Lint {
    interface IOptions {
        ruleArguments?: any[];
        ruleName: string;
        disabledIntervals: Lint.IDisabledInterval[];
    }
    interface IDisabledInterval {
        startPosition: number;
        endPosition: number;
    }
    interface IRule {
        getOptions(): IOptions;
        isEnabled(): boolean;
        apply(sourceFile: ts.SourceFile): RuleFailure[];
        applyWithWalker(walker: Lint.RuleWalker): RuleFailure[];
    }
    class RuleFailurePosition {
        private position;
        private lineAndCharacter;
        constructor(position: number, lineAndCharacter: ts.LineAndCharacter);
        getPosition(): number;
        getLineAndCharacter(): ts.LineAndCharacter;
        toJson(): {
            character: number;
            line: number;
            position: number;
        };
        equals(ruleFailurePosition: RuleFailurePosition): boolean;
    }
    class RuleFailure {
        private sourceFile;
        private fileName;
        private startPosition;
        private endPosition;
        private failure;
        private ruleName;
        constructor(sourceFile: ts.SourceFile, start: number, end: number, failure: string, ruleName: string);
        getFileName(): string;
        getRuleName(): string;
        getStartPosition(): RuleFailurePosition;
        getEndPosition(): RuleFailurePosition;
        getFailure(): string;
        toJson(): any;
        equals(ruleFailure: RuleFailure): boolean;
        private createFailurePosition(position);
    }
}
declare module Lint {
    function getSourceFile(fileName: string, source: string): ts.SourceFile;
    function createCompilerOptions(): ts.CompilerOptions;
    function doesIntersect(failure: RuleFailure, disabledIntervals: Lint.IDisabledInterval[]): boolean;
    function abstract(): string;
    function scanAllTokens(scanner: ts.Scanner, callback: (s: ts.Scanner) => void): void;
    function hasModifier(modifiers: ts.ModifiersArray, ...modifierKinds: ts.SyntaxKind[]): boolean;
    function isBlockScopedVariable(node: ts.VariableDeclaration | ts.VariableStatement): boolean;
    function isBlockScopedBindingElement(node: ts.BindingElement): boolean;
    function isNodeFlagSet(node: ts.Node, flagToCheck: ts.NodeFlags): boolean;
}
declare module Lint {
    abstract class BlockScopeAwareRuleWalker<T, U> extends ScopeAwareRuleWalker<T> {
        private blockScopeStack;
        constructor(sourceFile: ts.SourceFile, options?: any);
        abstract createBlockScope(): U;
        getCurrentBlockScope(): U;
        onBlockScopeStart(): void;
        getCurrentBlockDepth(): number;
        onBlockScopeEnd(): void;
        protected visitNode(node: ts.Node): void;
        private isBlockScopeBoundary(node);
    }
}
declare module Lint {
    class SkippableTokenAwareRuleWalker extends RuleWalker {
        protected tokensToSkipStartEndMap: {
            [start: number]: number;
        };
        constructor(sourceFile: ts.SourceFile, options: Lint.IOptions);
        protected visitRegularExpressionLiteral(node: ts.Node): void;
        protected visitIdentifier(node: ts.Identifier): void;
        protected visitTemplateExpression(node: ts.TemplateExpression): void;
        protected addTokenToSkipFromNode(node: ts.Node): void;
    }
}
declare module Lint.Configuration {
    function findConfiguration(configFile: string, inputFileLocation: string): any;
}
declare module Lint {
    class EnableDisableRulesWalker extends Lint.SkippableTokenAwareRuleWalker {
        enableDisableRuleMap: {
            [rulename: string]: Lint.IEnableDisablePosition[];
        };
        visitSourceFile(node: ts.SourceFile): void;
        private handlePossibleTslintSwitch(commentText, startingPosition);
    }
}
declare module Lint {
    function findFormatter(name: string, formattersDirectory?: string): any;
}
declare module Lint {
    interface IEnableDisablePosition {
        isEnabled: boolean;
        position: number;
    }
    function loadRules(ruleConfiguration: {
        [name: string]: any;
    }, enableDisableRuleMap: {
        [rulename: string]: Lint.IEnableDisablePosition[];
    }, rulesDirectory?: string): IRule[];
    function findRule(name: string, rulesDirectory?: string): any;
}
declare module Lint {
    interface LintResult {
        failureCount: number;
        failures: RuleFailure[];
        format: string;
        output: string;
    }
    interface ILinterOptions {
        configuration: any;
        formatter: string;
        formattersDirectory: string;
        rulesDirectory: string;
    }
    class Linter {
        static VERSION: string;
        private fileName;
        private source;
        private options;
        constructor(fileName: string, source: string, options: ILinterOptions);
        lint(): LintResult;
        private getRelativePath(directory);
        private containsRule(rules, rule);
    }
}
declare module "tslint" {
    import Linter = Lint.Linter;
    export = Linter;
}
