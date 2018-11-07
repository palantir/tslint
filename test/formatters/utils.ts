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
import { Fix, RuleFailure, RuleSeverity } from "../../src/language/rule/rule";

export function createFailure(
    sourceFile: ts.SourceFile,
    start: number,
    end: number,
    failure: string,
    ruleName: string,
    fix?: Fix,
    ruleSeverity: RuleSeverity = "warning",
) {
    const rule = new RuleFailure(sourceFile, start, end, failure, ruleName, fix);
    rule.setRuleSeverity(ruleSeverity);
    return rule;
}
