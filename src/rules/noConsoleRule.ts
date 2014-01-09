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

/// <reference path='../../lib/tslint.d.ts' />

import BanRule = require("./banRule");

export class Rule extends BanRule.Rule {
    public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[] {
        var options = this.getOptions();
        var consoleBanWalker = new BanRule.BanFunctionWalker(syntaxTree, this.getOptions());
        options.ruleArguments.forEach((option) => {
            consoleBanWalker.addBannedFunction(["console", option]);
        });
        return this.applyWithWalker(consoleBanWalker);
    }
  }
