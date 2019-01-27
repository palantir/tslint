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

import { ILinterOptions } from "./index";
import { IRule, isTypedRule } from "./language/rule/rule";
import { Linter } from "./linter";

export class TypedLinter extends Linter {
    public constructor(options: ILinterOptions, program: ts.Program) {
        super(options, program);
    }

    protected filterRules(rules: IRule[]): IRule[] {
        return rules.filter(isTypedRule);
    }
}

export class NonTypedLinter extends Linter {
    public constructor(options: ILinterOptions) {
        super(options);
    }

    protected filterRules(rules: IRule[]): IRule[] {
        return rules.filter((rule: IRule) => !isTypedRule(rule));
    }
}
