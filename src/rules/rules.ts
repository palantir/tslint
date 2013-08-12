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
/// <reference path='bitwiseRule.ts'/>
/// <reference path='classNameRule.ts'/>
/// <reference path='curlyRule.ts'/>
/// <reference path='debugRule.ts'/>
/// <reference path='dupKeyRule.ts'/>
/// <reference path='eofLineRule.ts'/>
/// <reference path='eqeqeqRule.ts'/>
/// <reference path='evilRule.ts'/>
/// <reference path='forInRule.ts'/>
/// <reference path='indentRule.ts'/>
/// <reference path='labelPosRule.ts'/>,
/// <reference path='maxLenRule.ts'/>
/// <reference path='noArgRule.ts'/>
/// <reference path='noConsoleRule.ts'/>
/// <reference path='noConstructRule.ts'/>
/// <reference path='noEmptyRule.ts' />
/// <reference path='oneLineRule.ts'/>
/// <reference path='quoteMarkRule.ts'/>
/// <reference path='radixRule.ts'/>
/// <reference path='semicolonRule.ts'/>
/// <reference path='subRule.ts'/>
/// <reference path='trailingRule.ts'/>
/// <reference path='varNameRule.ts'/>
/// <reference path='whitespaceRule.ts'/>

module Lint.Rules {

    var ALL_RULES = {
        "bitwise": BitwiseRule.prototype,
        "classname": ClassNameRule.prototype,
        "curly": CurlyRule.prototype,
        "debug": DebugRule.prototype,
        "dupkey": DupKeyRule.prototype,
        "eofline": EofLineRule.prototype,
        "eqeqeq": EqEqEqRule.prototype,
        "evil": EvilRule.prototype,
        "forin": ForInRule.prototype,
        "indent": IndentRule.prototype,
        "labelpos": LabelPosRule.prototype,
        "maxlen": MaxLenRule.prototype,
        "noarg": NoArgRule.prototype,
        "noconsole": NoConsoleRule.prototype,
        "noconstruct": NoConstructRule.prototype,
        "noempty": NoEmptyRule.prototype,
        "oneline": OneLineRule.prototype,
        "quotemark": QuoteMarkRule.prototype,
        "radix": RadixRule.prototype,
        "semicolon": SemicolonRule.prototype,
        "sub": SubRule.prototype,
        "trailing": TrailingRule.prototype,
        "varname": VarNameRule.prototype,
        "whitespace": WhitespaceRule.prototype
    };

    export function createRule(name: string, value: any): Rule {
        var rule;
        var rulePrototype = ALL_RULES[name];

        if (rulePrototype !== undefined) {
            rule = Object.create(rulePrototype);
            rule.constructor(name, value);
        }

        return rule;
    }

}
