/**
 * @license
 * Copyright 2016 Palantir Technologies, Inc.
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

import {AbstractRule} from "./abstractRule";
import {IRule, RuleViolation} from "./rule";

export abstract class TypedRule extends AbstractRule {

    public static isTypedRule(rule: IRule): rule is TypedRule {
        return "applyWithProgram" in rule;
    }

    public apply(_sourceFile: ts.SourceFile): RuleViolation[] {
        // if no program is given to the linter, throw an error
        throw new Error(`${this.getOptions().ruleName} requires type checking`);
    }

    public abstract applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): RuleViolation[];
}
