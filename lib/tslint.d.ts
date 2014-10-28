/// <reference path="../typings/node.d.ts" />
/// <reference path="../typings/typescriptServices.d.ts" />
declare module Lint {
    interface IOptions {
        ruleArguments?: any[];
        ruleName: string;
        disabledIntervals: IDisabledInterval[];
    }
    interface IDisabledInterval {
        startPosition: number;
        endPosition: number;
    }
    interface IRule {
        getOptions(): IOptions;
        isEnabled(): boolean;
        apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[];
        applyWithWalker(walker: RuleWalker): RuleFailure[];
    }
    class RuleFailurePosition {
        private position;
        private lineAndCharacter;
        constructor(position: number, lineAndCharacter: TypeScript.LineAndCharacter);
        getPosition(): number;
        getLineAndCharacter(): TypeScript.LineAndCharacter;
        toJson(): {
            position: number;
            line: number;
            character: number;
        };
        equals(ruleFailurePosition: RuleFailurePosition): boolean;
    }
    class RuleFailure {
        private fileName;
        private startPosition;
        private endPosition;
        private failure;
        private ruleName;
        constructor(syntaxTree: TypeScript.SyntaxTree, start: number, end: number, failure: string, ruleName: string);
        getFileName(): string;
        getRuleName(): string;
        getStartPosition(): RuleFailurePosition;
        getEndPosition(): RuleFailurePosition;
        getFailure(): string;
        toJson(): any;
        equals(ruleFailure: RuleFailure): boolean;
        private createFailurePosition(syntaxTree, position);
    }
}
declare module Lint {
    function getSyntaxTree(fileName: string, source: string): TypeScript.SyntaxTree;
    function createCompilerOptions(): ts.CompilerOptions;
    function doesIntersect(failure: RuleFailure, disabledIntervals: IDisabledInterval[]): boolean;
}
declare module Lint {
    class RuleWalker extends TypeScript.SyntaxWalker {
        private limit;
        private position;
        private options;
        private failures;
        private syntaxTree;
        private disabledIntervals;
        private ruleName;
        constructor(syntaxTree: TypeScript.SyntaxTree, options: IOptions);
        getSyntaxTree(): TypeScript.SyntaxTree;
        getFailures(): RuleFailure[];
        getPosition(): number;
        getLimit(): number;
        positionAfter(...elements: TypeScript.ISyntaxElement[]): number;
        getOptions(): any;
        hasOption(option: string): boolean;
        skip(element: TypeScript.ISyntaxElement): void;
        visitToken(token: TypeScript.ISyntaxToken): void;
        createFailure(start: number, width: number, failure: string): RuleFailure;
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
        [x: string]: any;
    }, enableDisableRuleMap: {
        [x: string]: IEnableDisablePosition[];
    }, rulesDirectory?: string): IRule[];
    function findRule(name: string, rulesDirectory?: string): any;
}
declare module Lint.Configuration {
    function findConfiguration(configFile: string, inputFileLocation: string): any;
}
declare module Lint {
    interface IFormatter {
        format(failures: RuleFailure[]): string;
    }
}
declare module Lint {
    function findFormatter(name: string, formattersDirectory?: string): any;
}
declare module Lint {
    class EnableDisableRulesWalker extends RuleWalker {
        enableDisableRuleMap: {
            [x: string]: IEnableDisablePosition[];
        };
        visitToken(token: TypeScript.ISyntaxToken): void;
        private findSwitchesInTrivia(triviaList, startingPosition);
    }
}
declare module Lint {
    class LanguageServiceHost extends TypeScript.NullLogger implements ts.LanguageServiceHost {
        private syntaxTree;
        private source;
        constructor(syntaxTree: TypeScript.SyntaxTree, source: string);
        getCompilationSettings(): ts.CompilerOptions;
        getCurrentDirectory(): string;
        getDefaultLibFilename(): string;
        getScriptFileNames(): string[];
        getScriptVersion(fileName: string): string;
        getScriptIsOpen(fileName: string): boolean;
        getScriptSnapshot(fileName: string): TypeScript.IScriptSnapshot;
        getLocalizedDiagnosticMessages(): string;
        getCancellationToken(): {
            isCancellationRequested: () => boolean;
        };
    }
}
declare module TypeScript {
    function leadingTrivia(element: ISyntaxElement, text?: ISimpleText): ISyntaxTriviaList;
    function trailingTrivia(element: ISyntaxElement, text?: ISimpleText): ISyntaxTriviaList;
}
declare module Lint.Formatters {
    class AbstractFormatter implements IFormatter {
        format(failures: RuleFailure[]): string;
    }
}
declare module Lint.Rules {
    class AbstractRule implements IRule {
        private value;
        private options;
        constructor(ruleName: string, value: any, disabledIntervals: IDisabledInterval[]);
        getOptions(): IOptions;
        apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[];
        applyWithWalker(walker: RuleWalker): RuleFailure[];
        isEnabled(): boolean;
    }
}
declare module Lint {
    class ScopeAwareRuleWalker<T> extends RuleWalker {
        private scopeStack;
        constructor(syntaxTree: TypeScript.SyntaxTree, options?: any);
        visitNode(node: TypeScript.SyntaxNode): void;
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
        token: TypeScript.ISyntaxToken;
    }
    class StateAwareRuleWalker extends RuleWalker {
        private lastState;
        visitToken(token: TypeScript.ISyntaxToken): void;
        getLastState(): RuleWalkerState;
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
