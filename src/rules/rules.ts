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

    var ALL_RULES = {
        "bitwise": BitwiseOperatorRule.prototype,
        "classname": ClassNameRule.prototype,
        "curly": CurlyRule.prototype,
        "debug": DebugRule.prototype,
        "eofline": NewLineRule.prototype,
        "eqeqeq": TripleComparisonRule.prototype,
        "evil": EvalRule.prototype,
        "forin": ForInRule.prototype,
        "indent": TabWidthRule.prototype,
        "maxlen": MaxLineLengthRule.prototype,
        "noarg": ArgumentsRule.prototype,
        "oneline": OneLineRule.prototype,
        "quotemark": QuoteStyleRule.prototype,
        "semicolon": SemicolonRule.prototype,
        "sub": SubRule.prototype,
        "trailing": TrailingWhitespaceRule.prototype,
        "varname": VariableNameRule.prototype,
        "whitespace": WhitespaceRule.prototype
    }

    export function getRuleForName(name: string): Rule {
        var rulePrototype = ALL_RULES[name];
        if(rulePrototype === undefined) {
            return rulePrototype;
        }

        var rule = Object.create(rulePrototype);
        rule.constructor(name);

        return rule;
    }

}
