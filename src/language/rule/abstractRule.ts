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

import {doesIntersect} from "../utils";
import {IWalker, WalkContext} from "../walker";
import { IOptions, IRule, IRuleMetadata, RuleFailure, RuleSeverity } from "./rule";

export abstract class AbstractRule implements IRule {
    public static metadata: IRuleMetadata;
    protected readonly ruleArguments: any[];
    protected readonly ruleSeverity: RuleSeverity;
    public ruleName: string;

    constructor(private options: IOptions) {
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
        return this.filterFailures(walker.getFailures());
    }

    public isEnabled(): boolean {
        return this.ruleSeverity !== "off";
    }

    protected applyWithFunction(sourceFile: ts.SourceFile, walkFn: (ctx: WalkContext<void>) => void): RuleFailure[];
    protected applyWithFunction<T>(sourceFile: ts.SourceFile, walkFn: (ctx: WalkContext<T>) => void, options: T): RuleFailure[];
    protected applyWithFunction<T>(sourceFile: ts.SourceFile, walkFn: (ctx: WalkContext<T | void>) => void, options?: T): RuleFailure[] {
        const ctx = new WalkContext(sourceFile, this.ruleName, options);
        walkFn(ctx);
        return this.filterFailures(ctx.failures);
    }

    protected filterFailures(failures: RuleFailure[]): RuleFailure[] {
        const result: RuleFailure[] = [];
        for (const failure of failures) {
            // don't add failures for a rule if the failure intersects an interval where that rule is disabled
            if (!doesIntersect(failure, this.options.disabledIntervals) && !result.some((f) => f.equals(failure))) {
                result.push(failure);
            }
        }
        return result;
    }
}
