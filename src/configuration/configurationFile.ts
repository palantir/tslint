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

import { IOptions, RuleSeverity } from "../index";

export interface RawConfigFile {
    extends?: string | string[];
    linterOptions?: IConfigurationFile["linterOptions"];
    overrides?: Array<{
        files?: string | string[];
        excludedFiles?: string | string[];
        rules: RawRulesConfig;
    }>;
    rulesDirectory?: string | string[];
    defaultSeverity?: string;
    rules?: RawRulesConfig;
    jsRules?: RawRulesConfig;
}
export interface RawRulesConfig {
    [key: string]: RawRuleConfig;
}
export type RawRuleConfig = null | undefined | boolean | any[] | {
    severity?: string;
    options?: any;
};

export type RuleMap = Map<string, Partial<IOptions>>;

export interface IConfigurationFile {
    /**
     * The severity that is applied to rules in this config file as well as rules
     * in any inherited config files which have their severity set to "default".
     * Not inherited.
     */
    defaultSeverity?: RuleSeverity;

    /**
     * An array of config files whose rules are inherited by this config file.
     */
    extends: IConfigurationFile[];

    /**
     * Rules that are used to lint to JavaScript files.
     */
    jsRules: RuleMap;

    /**
     * A subset of the CLI options.
     */
    linterOptions?: Partial<{
        exclude: string[];
    }>;

    /**
     * Rules override configuration that is applied based on file paths. Only
     * the `rules` key (not `jsRules`) can be overridden. Use an appropriate
     * `files` regex to target JS files.
     */
    overrides?: Array<{
        files: string[];
        excludedFiles: string[];
        rules: RuleMap;
    }>;

    /**
     * Directories containing custom rules. Resolved using node module semantics.
     */
    rulesDirectory: string[];

    /**
     * Rules that are used to lint TypeScript files.
     */
    rules: RuleMap;
}

export const EMPTY_CONFIG: IConfigurationFile = {
    defaultSeverity: "error",
    extends: [],
    jsRules: new Map(),
    rules: new Map(),
    rulesDirectory: [],
};

export const DEFAULT_CONFIG: RawConfigFile = {
    defaultSeverity: "error",
    extends: ["tslint:recommended"],
    jsRules: {},
    rules: {},
    rulesDirectory: [],
};
