/**
 * @license
 * Copyright 2018 Palantir Technologies, Inc.
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

import { showWarningOnce } from "../../error";
import { AbstractRule } from "./abstractRule";
import { ITypedRule, RuleFailure } from "./rule";

export abstract class TypedRule extends AbstractRule implements ITypedRule {
    public apply(): RuleFailure[] {
        // if no program is given to the linter, show an error
        showWarningOnce(`Warning: The '${this.ruleName}' rule requires type information.`);
        return [];
    }

    public abstract applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): RuleFailure[];
}
