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
import {IOptions} from "../../lint";
import {RuleWalker} from "../walker/ruleWalker";
import {IRule, IDisabledInterval, RuleFailure} from "./rule";

export abstract class AbstractRule implements IRule {
    private value: any;
    private options: IOptions;

    constructor(ruleName: string, value: any, disabledIntervals: IDisabledInterval[]) {
        let ruleArguments: any[] = [];

        if (Array.isArray(value) && value.length > 1) {
            ruleArguments = value.slice(1);
        }

        this.value = value;
        this.options = {
            disabledIntervals: disabledIntervals,
            ruleArguments: ruleArguments,
            ruleName: ruleName
        };
    }

    public getOptions(): IOptions {
        return this.options;
    }

    public abstract apply(sourceFile: ts.SourceFile): RuleFailure[];

    public applyWithWalker(walker: RuleWalker): RuleFailure[] {
        walker.walk(walker.getSourceFile());
        return walker.getFailures();
    }

    public isEnabled(): boolean {
        const value = this.value;

        if (typeof value === "boolean") {
            return value;
        }

        if (Array.isArray(value) && value.length > 0) {
            return value[0];
        }

        return false;
    }
}
