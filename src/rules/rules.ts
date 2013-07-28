/*
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

/// <reference path='rule.ts'/>
/// <reference path='argumentsRule.ts'/>
/// <reference path='bitwiseOperatorRule.ts'/>
/// <reference path='classNameRule.ts'/>
/// <reference path='curlyRule.ts'/>
/// <reference path='debugRule.ts'/>
/// <reference path='newLineRule.ts'/>
/// <reference path='forInRule.ts'/>
/// <reference path='evalRule.ts'/>
/// <reference path='maxLineLengthRule.ts'/>
/// <reference path='quoteStyleRule.ts'/>
/// <reference path='oneLineRule.ts'/>
/// <reference path='semicolonRule.ts'/>
/// <reference path='subRule.ts'/>
/// <reference path='tabWidthRule.ts'/>
/// <reference path='trailingWhitespaceRule.ts'/>
/// <reference path='tripleComparisonRule.ts'/>
/// <reference path='variableNameRule.ts'/>
/// <reference path='whitespaceRule.ts'/>

module Lint.Rules {

    var ALL_RULES: Rule[] = [];

    export function createAllRules() {
        ALL_RULES.push(new ArgumentsRule());
        ALL_RULES.push(new BitwiseOperatorRule());
        ALL_RULES.push(new ClassNameRule());
        ALL_RULES.push(new CurlyRule());
        ALL_RULES.push(new DebugRule());
        ALL_RULES.push(new EvalRule());
        ALL_RULES.push(new NewLineRule());
        ALL_RULES.push(new ForInRule());
        ALL_RULES.push(new MaxLineLengthRule());
        ALL_RULES.push(new QuoteStyleRule());
        ALL_RULES.push(new OneLineRule());
        ALL_RULES.push(new SemicolonRule());
        ALL_RULES.push(new SubRule());
        ALL_RULES.push(new TabWidthRule());
        ALL_RULES.push(new TrailingWhitespaceRule());
        ALL_RULES.push(new TripleComparisonRule());
        ALL_RULES.push(new VariableNameRule());
        ALL_RULES.push(new WhitespaceRule());
    }

    export function getRuleForName(name: string): Rule {
        var filteredRules = ALL_RULES.filter(function(rule) {
            return rule.getName() === name;
        });

        if (filteredRules.length > 0) {
            return filteredRules[0];
        } else {
            return undefined;
        }
    }

}
