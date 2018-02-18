/*
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

import { assert } from "chai";
import { IConfigurationFile } from "../../src/configuration/index";
import { IOptions } from "../lint";

export function buildConfig(overrides: Partial<IConfigurationFile> = {}): IConfigurationFile {
    return {
        extends: [],
        jsRules: new Map(),
        linterOptions: {},
        rules: new Map(),
        rulesDirectory: [],
        ...overrides,
    };
}

export function buildRuleOptions(overrides: Partial<IOptions> = {}): IOptions {
    return {
        disabledIntervals: [],
        ruleArguments: [],
        ruleName: "ruleName",
        ruleSeverity: "error",
        ...overrides,
    };

}

function demap<T>(map: Map<string, T>) {
    if (map == undefined) {
        return map;
    }
    const output: { [key: string]: T } = {};
    map.forEach((value, key) => {
        output[key] = value;
    });
    return output;
}

// this is needed since `deepEqual` doesn't go into Map object
export function assertConfigEquals(actual: IConfigurationFile, expected: IConfigurationFile) {
    assert.deepEqual(demapConfig(actual), demapConfig(expected));
}

export function demapConfig(config: IConfigurationFile) {
    // tslint:disable:no-unsafe-any
    const copy: any = { ...config };

    if (copy.jsRules) {
        copy.jsRules = demap(copy.jsRules);
    }

    if (copy.rules) {
        copy.rules = demap(copy.rules);
    }

    if (Array.isArray(copy.extends)) {
        copy.extends = copy.extends.map(demapConfig);
    }
    // tslint:enable

    return copy;
}

export function assertDeepMapEquals(actual: Map<any, any>, expected: Map<any, any>, message?: string) {
    assert.deepEqual(demap(actual), demap(expected), message);
}
