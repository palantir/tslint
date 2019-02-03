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

import { Fix, IOptions, Replacement, RuleFailure } from "../rule/rule";

import { SyntaxWalker } from "./syntaxWalker";
import { IWalker } from "./walker";

export class RuleWalker extends SyntaxWalker implements IWalker {
    private readonly limit: number;
    private readonly options?: any[];
    private readonly failures: RuleFailure[];
    private readonly ruleName: string;

    constructor(private readonly sourceFile: ts.SourceFile, options: IOptions) {
        super();

        this.failures = [];
        this.options = options.ruleArguments;
        this.limit = this.sourceFile.getFullWidth();
        this.ruleName = options.ruleName;
    }

    public getSourceFile(): ts.SourceFile {
        return this.sourceFile;
    }

    public getLineAndCharacterOfPosition(position: number): ts.LineAndCharacter {
        return this.sourceFile.getLineAndCharacterOfPosition(position);
    }

    public getFailures(): RuleFailure[] {
        return this.failures;
    }

    public getLimit() {
        return this.limit;
    }

    public getOptions(): any {
        return this.options;
    }

    public hasOption(option: string): boolean {
        if (this.options !== undefined) {
            return this.options.indexOf(option) !== -1;
        } else {
            return false;
        }
    }

    /** @deprecated Prefer `addFailureAt` and its variants. */
    public createFailure(start: number, width: number, failure: string, fix?: Fix): RuleFailure {
        const from = start > this.limit ? this.limit : start;
        const to = start + width > this.limit ? this.limit : start + width;
        return new RuleFailure(this.sourceFile, from, to, failure, this.ruleName, fix);
    }

    /** @deprecated Prefer `addFailureAt` and its variants. */
    public addFailure(failure: RuleFailure) {
        this.failures.push(failure);
    }

    /** Add a failure with any arbitrary span. Prefer `addFailureAtNode` if possible. */
    public addFailureAt(start: number, width: number, failure: string, fix?: Fix) {
        // tslint:disable-next-line deprecation
        this.addFailure(this.createFailure(start, width, failure, fix));
    }

    /** Like `addFailureAt` but uses start and end instead of start and width. */
    public addFailureFromStartToEnd(start: number, end: number, failure: string, fix?: Fix) {
        this.addFailureAt(start, end - start, failure, fix);
    }

    /** Add a failure using a node's span. */
    public addFailureAtNode(node: ts.Node, failure: string, fix?: Fix) {
        this.addFailureAt(
            node.getStart(this.sourceFile),
            node.getWidth(this.sourceFile),
            failure,
            fix,
        );
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

    public deleteFromTo(start: number, end: number): Replacement {
        return this.createReplacement(start, end - start, "");
    }

    public getRuleName(): string {
        return this.ruleName;
    }
}
