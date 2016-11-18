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
import {SyntaxWalker} from "./syntaxWalker";
import {Fix, IDisabledInterval, IOptions, Replacement, RuleLevel, RuleViolation} from "../rule/rule";

export class RuleWalker extends SyntaxWalker {
    private limit: number;
    private position: number;
    private options: any[];
    private failures: RuleViolation[];
    private disabledIntervals: IDisabledInterval[];
    private ruleLevel: RuleLevel;
    private ruleName: string;

    constructor(private sourceFile: ts.SourceFile, options: IOptions) {
        super();

        this.position = 0;
        this.failures = [];
        this.options = options.ruleArguments;
        this.limit = this.sourceFile.getFullWidth();
        this.disabledIntervals = options.disabledIntervals;
        this.ruleLevel = options.ruleLevel;
        this.ruleName = options.ruleName;
    }

    public getSourceFile(): ts.SourceFile {
        return this.sourceFile;
    }

    public getFailures(): RuleViolation[] {
        return this.failures;
    }

    public getLimit() {
        return this.limit;
    }

    public getOptions(): any {
        return this.options;
    }

    public hasOption(option: string): boolean {
        if (this.options) {
            return this.options.indexOf(option) !== -1;
        } else {
            return false;
        }
    }

    public skip(node: ts.Node) {
        this.position += node.getFullWidth();
    }

    public createFailure(start: number, width: number, failure: string, fix?: Fix): RuleViolation {
        const from = (start > this.limit) ? this.limit : start;
        const to = ((start + width) > this.limit) ? this.limit : (start + width);
        return new RuleViolation(this.sourceFile, from, to, failure, this.ruleLevel, this.ruleName, fix);
    }

    public addFailure(failure: RuleViolation) {
        // don't add failures for a rule if the failure intersects an interval where that rule is disabled
        if (!this.existsFailure(failure) && !doesIntersect(failure, this.disabledIntervals)) {
            this.failures.push(failure);
        }
    }

    public createReplacement(start: number, length: number, text: string): Replacement {
        return new Replacement(start, length, text);
    }

    public appendText(start: number, text: string): Replacement {
        return this.createReplacement(start, 0, text);
    }

    public deleteText(start: number, length: number): Replacement {
        return this.createReplacement(start, length, "");
    }

    private existsFailure(failure: RuleViolation) {
        return this.failures.some((f) => f.equals(failure));
    }
}
