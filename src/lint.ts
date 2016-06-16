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

import * as configuration from "./configuration";
import * as formatters from "./formatters";
import * as linter from "./tslint";
import * as rules from "./rules";
import * as test from "./test";
import * as utils from "./utils";
import {RuleFailure} from "./language/rule/rule";

export * from "./language/rule/rule";
export * from "./enableDisableRules";
export * from "./formatterLoader";
export * from "./ruleLoader";
export * from "./language/utils";
export * from "./language/languageServiceHost";
export * from "./language/walker";
export * from "./language/formatter/formatter";

export var Configuration = configuration;
export var Formatters = formatters;
export var Linter = linter;
export var Rules = rules;
export var Test = test;
export var Utils = utils;

export interface LintResult {
    failureCount: number;
    failures: RuleFailure[];
    format: string;
    output: string;
}

export interface ILinterOptionsRaw {
    configuration?: any;
    formatter?: string;
    formattersDirectory?: string;
    rulesDirectory?: string | string[];
}

export interface ILinterOptions extends ILinterOptionsRaw {
    configuration: any;
    formatter: string;
    rulesDirectory: string | string[];
}
