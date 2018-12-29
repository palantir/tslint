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

import * as ts from "typescript";

import { IWalker, WalkContext } from "../walker";

import { IOptions, IRule, IRuleMetadata, RuleFailure, RuleSeverity } from "./rule";

export type NoInfer<T> = T & { [K in keyof T]: T[K] };

export abstract class AbstractRule implements IRule {
    public static metadata: IRuleMetadata;
    protected readonly ruleArguments: any[];
    protected readonly ruleSeverity: RuleSeverity;
    public ruleName: string;

    constructor(private readonly options: IOptions) {
        this.ruleName = options.ruleName;
        this.ruleArguments = options.ruleArguments;
        this.ruleSeverity = options.ruleSeverity;
    }

    public getOptions(): IOptions {
        return this.options;
    }

    public abstract apply(sourceFile: ts.SourceFile): RuleFailure[];

    public applyWithWalker(walker: IWalker): RuleFailure[] {
        walker.walk(walker.getSourceFile());
        return walker.getFailures();
    }

    public isEnabled(): boolean {
        return this.ruleSeverity !== "off";
    }

    protected applyWithFunction(
        sourceFile: ts.SourceFile,
        walkFn: (ctx: WalkContext<void>) => void,
    ): RuleFailure[];
    protected applyWithFunction<T>(
        sourceFile: ts.SourceFile,
        walkFn: (ctx: WalkContext<T>) => void,
        options: NoInfer<T>,
    ): RuleFailure[];
    protected applyWithFunction<T, U>(
        sourceFile: ts.SourceFile,
        walkFn: (ctx: WalkContext<T>, programOrChecker: U) => void,
        options: NoInfer<T>,
        checker: NoInfer<U>,
    ): RuleFailure[];
    protected applyWithFunction<T, U>(
        sourceFile: ts.SourceFile,
        walkFn: (ctx: WalkContext<T | void>, programOrChecker?: U) => void,
        options?: T,
        programOrChecker?: U,
    ): RuleFailure[] {
        const ctx = new WalkContext(sourceFile, this.ruleName, options);
        walkFn(ctx, programOrChecker);
        return ctx.failures;
    }

    /**
     * @deprecated
     * Failures will be filtered based on `tslint:disable` comments by tslint.
     * This method now does nothing.
     */
    protected filterFailures(failures: RuleFailure[]) {
        return failures;
    }
}
