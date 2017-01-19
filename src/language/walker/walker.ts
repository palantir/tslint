/**
 * @license
 * Copyright 2017 Palantir Technologies, Inc.
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

import {Fix, IOptions, Replacement, RuleFailure} from "../rule/rule";
import {IWalker} from "./walker";

export interface IWalker {
    getSourceFile(): ts.SourceFile;
    walk(sourceFile: ts.SourceFile): void;
    getFailures(): RuleFailure[];
}

export abstract class AbstractWalker implements IWalker {
    public readonly options: ReadonlyArray<any>;
    public readonly ruleName: string;
    private limit: number;
    private failures: RuleFailure[];

    constructor(public readonly sourceFile: ts.SourceFile, options: IOptions) {
        this.failures = [];
        this.options = options.ruleArguments;
        this.limit = sourceFile.getFullWidth();
        this.ruleName = options.ruleName;
    }

    public abstract walk(sourceFile: ts.SourceFile): void;

    public getSourceFile() {
        return this.sourceFile;
    }

    public getFailures() {
        return this.failures;
    }

    public hasOption(option: any) {
        return this.options.indexOf(option) !== -1;
    }

    /** Add a failure with any arbitrary span. Prefer `addFailureAtNode` if possible. */
    public addFailureAt(start: number, width: number, failure: string, fix?: Fix) {
        this.addFailure(start, start + width, failure, fix);
    }

    public addFailure(start: number, end: number, failure: string, fix?: Fix) {
        this.failures.push(
            new RuleFailure(this.sourceFile, Math.min(start, this.limit), Math.min(end, this.limit), failure, this.ruleName, fix),
        );
    }

    /** Add a failure using a node's span. */
    public addFailureAtNode(node: ts.Node, failure: string, fix?: Fix) {
        this.addFailure(node.getStart(this.sourceFile), node.getEnd(), failure, fix);
    }

    public createFix(...replacements: Replacement[]) {
        return new Fix(this.ruleName, replacements);
    }
}
