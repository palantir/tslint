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

import { Fix, RuleFailure } from "../rule/rule";

export class WalkContext<T> {
    public readonly failures: RuleFailure[] = [];

    constructor(
        public readonly sourceFile: ts.SourceFile,
        public readonly ruleName: string,
        public readonly options: T
    ) {}

    /** Add a failure with any arbitrary span. Prefer `addFailureAtNode` if possible. */
    public addFailureAt(start: number, width: number, failure: string, fix?: Fix) {
        this.addFailure(start, start + width, failure, fix);
    }

    public addFailure(start: number, end: number, failure: string, fix?: Fix) {
        const fileLength = this.sourceFile.end;
        this.failures.push(
            new RuleFailure(
                this.sourceFile,
                Math.min(start, fileLength),
                Math.min(end, fileLength),
                failure,
                this.ruleName,
                fix
            )
        );
    }

    /** Add a failure using a node's span. */
    public addFailureAtNode(node: ts.Node, failure: string, fix?: Fix) {
        this.addFailure(node.getStart(this.sourceFile), node.getEnd(), failure, fix);
    }
}
