/// <reference path="../typings/node.d.ts" />
/// <reference path="../typings/typescriptServices.d.ts" />
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
        visitAnyKeyword(node: ts.Node): void;
        visitBinaryExpression(node: ts.BinaryExpression): void;
        visitBreakStatement(node: ts.BreakOrContinueStatement): void;
        visitCallExpression(node: ts.CallExpression): void;
        visitClassDeclaration(node: ts.ClassDeclaration): void;
        visitConstructorDeclaration(node: ts.ConstructorDeclaration): void;
        visitContinueStatement(node: ts.BreakOrContinueStatement): void;
        visitDebuggerStatement(node: ts.Statement): void;
        visitDoStatement(node: ts.DoStatement): void;
        visitExpressionStatement(node: ts.ExpressionStatement): void;
        visitForStatement(node: ts.ForStatement): void;
        visitForInStatement(node: ts.ForInStatement): void;
        visitIfStatement(node: ts.IfStatement): void;
        visitImportDeclaration(node: ts.ImportDeclaration): void;
        visitInterfaceDeclaration(node: ts.InterfaceDeclaration): void;
        visitLabeledStatement(node: ts.LabeledStatement): void;
        visitMethodDeclaration(node: ts.MethodDeclaration): void;
        visitNewExpression(node: ts.NewExpression): void;
        visitPrefixUnaryExpression(node: ts.PrefixUnaryExpression): void;
        visitPropertyAccessExpression(node: ts.PropertyAccessExpression): void;
        visitPropertyDeclaration(node: ts.PropertyDeclaration): void;
        visitReturnStatement(node: ts.ReturnStatement): void;
        visitThrowStatement(node: ts.ThrowStatement): void;
        visitVariableStatement(node: ts.VariableStatement): void;
        visitWhileStatement(node: ts.WhileStatement): void;
        walk(node: ts.Node): void;
        walkChildren(node: ts.Node): void;
        visitNode(node: ts.Node): void;
    }
}
declare module Lint {
    function getSourceFile(fileName: string, source: string): ts.SourceFile;
    function createCompilerOptions(): ts.CompilerOptions;
    function doesIntersect(failure: RuleFailure, disabledIntervals: Lint.IDisabledInterval[]): boolean;
    function abstract(): string;
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
    function createLanguageServiceHost(fileName: string, source: string): ts.LanguageServiceHost;
}
declare module TypeScript {
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
        visitNode(node: ts.Node): void;
        createScope(): T;
        getCurrentScope(): T;
        getCurrentDepth(): number;
        onScopeStart(): void;
        onScopeEnd(): void;
        private isScopeBoundary(node);
    }
}
declare module Lint {
    interface RuleWalkerState {
        position: number;
        token: ts.Node;
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
