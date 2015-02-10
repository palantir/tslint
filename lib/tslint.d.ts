/// <reference path="../typings/typescriptServices.d.ts" />
/// <reference path="../typings/node.d.ts" />
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
            position: number;
            line: number;
            character: number;
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
        getStartPosition(): Lint.RuleFailurePosition;
        getEndPosition(): Lint.RuleFailurePosition;
        getFailure(): string;
        toJson(): any;
        equals(ruleFailure: RuleFailure): boolean;
        private createFailurePosition(position);
    }
}
declare module Lint {
    class SyntaxWalker {
        walk(node: ts.Node): void;
        protected visitAnyKeyword(node: ts.Node): void;
        protected visitArrowFunction(node: ts.FunctionLikeDeclaration): void;
        protected visitBinaryExpression(node: ts.BinaryExpression): void;
        protected visitBlock(node: ts.Block): void;
        protected visitBreakStatement(node: ts.BreakOrContinueStatement): void;
        protected visitCallExpression(node: ts.CallExpression): void;
        protected visitCaseClause(node: ts.CaseClause): void;
        protected visitClassDeclaration(node: ts.ClassDeclaration): void;
        protected visitCatchClause(node: ts.CatchClause): void;
        protected visitConditionalExpression(node: ts.ConditionalExpression): void;
        protected visitConstructorDeclaration(node: ts.ConstructorDeclaration): void;
        protected visitConstructorType(node: ts.Node): void;
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
        protected visitFunctionDeclaration(node: ts.FunctionDeclaration): void;
        protected visitFunctionExpression(node: ts.FunctionExpression): void;
        protected visitFunctionType(node: ts.Node): void;
        protected visitGetAccessor(node: ts.AccessorDeclaration): void;
        protected visitIdentifier(node: ts.Identifier): void;
        protected visitIfStatement(node: ts.IfStatement): void;
        protected visitImportDeclaration(node: ts.ImportDeclaration): void;
        protected visitIndexSignatureDeclaration(node: ts.IndexSignatureDeclaration): void;
        protected visitInterfaceDeclaration(node: ts.InterfaceDeclaration): void;
        protected visitLabeledStatement(node: ts.LabeledStatement): void;
        protected visitMethodDeclaration(node: ts.MethodDeclaration): void;
        protected visitModuleDeclaration(node: ts.ModuleDeclaration): void;
        protected visitNewExpression(node: ts.NewExpression): void;
        protected visitObjectLiteralExpression(node: ts.ObjectLiteralExpression): void;
        protected visitParameterDeclaration(node: ts.ParameterDeclaration): void;
        protected visitPostfixUnaryExpression(node: ts.PostfixUnaryExpression): void;
        protected visitPrefixUnaryExpression(node: ts.PrefixUnaryExpression): void;
        protected visitPropertyAccessExpression(node: ts.PropertyAccessExpression): void;
        protected visitPropertyAssignment(node: ts.PropertyAssignment): void;
        protected visitPropertyDeclaration(node: ts.PropertyDeclaration): void;
        protected visitRegularExpressionLiteral(node: ts.Node): void;
        protected visitReturnStatement(node: ts.ReturnStatement): void;
        protected visitSetAccessor(node: ts.AccessorDeclaration): void;
        protected visitSourceFile(node: ts.SourceFile): void;
        protected visitSwitchStatement(node: ts.SwitchStatement): void;
        protected visitTemplateExpression(node: ts.TemplateExpression): void;
        protected visitThrowStatement(node: ts.ThrowStatement): void;
        protected visitTryBlock(node: ts.Block): void;
        protected visitTryStatement(node: ts.TryStatement): void;
        protected visitTypeAssertionExpression(node: ts.TypeAssertion): void;
        protected visitTypeLiteral(node: ts.TypeLiteralNode): void;
        protected visitVariableDeclaration(node: ts.VariableDeclaration): void;
        protected visitVariableStatement(node: ts.VariableStatement): void;
        protected visitWhileStatement(node: ts.WhileStatement): void;
        protected visitNode(node: ts.Node): void;
        private walkChildren(node);
    }
}
declare module Lint {
    function getSourceFile(fileName: string, source: string): ts.SourceFile;
    function createCompilerOptions(): ts.CompilerOptions;
    function doesIntersect(failure: RuleFailure, disabledIntervals: Lint.IDisabledInterval[]): boolean;
    function abstract(): string;
    function scanAllTokens(scanner: ts.Scanner, callback: (scanner: ts.Scanner) => void): void;
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
        createFailure(start: number, width: number, failure: string): Lint.RuleFailure;
        addFailure(failure: RuleFailure): void;
        private existsFailure(failure);
    }
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
declare module Lint.Configuration {
    function findConfiguration(configFile: string, inputFileLocation: string): any;
}
declare module Lint {
    interface IFormatter {
        format(failures: Lint.RuleFailure[]): string;
    }
}
declare module Lint {
    function findFormatter(name: string, formattersDirectory?: string): any;
}
declare module Lint {
    class EnableDisableRulesWalker extends Lint.RuleWalker {
        enableDisableRuleMap: {
            [rulename: string]: Lint.IEnableDisablePosition[];
        };
        visitSourceFile(node: ts.SourceFile): void;
        private handlePossibleTslintSwitch(commentText, startingPosition);
    }
}
declare module Lint {
    function createLanguageServiceHost(fileName: string, source: string): ts.LanguageServiceHost;
}
declare module Lint.Formatters {
    class AbstractFormatter implements Lint.IFormatter {
        format(failures: Lint.RuleFailure[]): string;
    }
}
declare module Lint.Rules {
    class AbstractRule implements Lint.IRule {
        private value;
        private options;
        constructor(ruleName: string, value: any, disabledIntervals: Lint.IDisabledInterval[]);
        getOptions(): Lint.IOptions;
        apply(sourceFile: ts.SourceFile): RuleFailure[];
        applyWithWalker(walker: Lint.RuleWalker): RuleFailure[];
        isEnabled(): boolean;
    }
}
declare module Lint {
    class ScopeAwareRuleWalker<T> extends RuleWalker {
        private scopeStack;
        constructor(sourceFile: ts.SourceFile, options?: any);
        createScope(): T;
        getCurrentScope(): T;
        getCurrentDepth(): number;
        onScopeStart(): void;
        onScopeEnd(): void;
        protected visitNode(node: ts.Node): void;
        private isScopeBoundary(node);
    }
}
declare module Lint {
    interface LintResult {
        failureCount: number;
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
        private fileName;
        private source;
        private options;
        static VERSION: string;
        constructor(fileName: string, source: string, options: ILinterOptions);
        lint(): LintResult;
        private getRelativePath(directory);
        private containsRule(rules, rule);
    }
}
