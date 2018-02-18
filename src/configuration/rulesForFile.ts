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

import { IOptions, RuleSeverity } from "../index";
import { IConfigurationFile } from "./configurationFile";
const IS_JS = /\.jsx?$/i;

/**
 * A file to lint. Stores the isJS property to avoid extra regex tests.
 */
interface SourceFile {
    path: string;
    isJS: boolean;
}

export function rulesForFile(config: IConfigurationFile, filePath: string): IOptions[] {
    const file = { isJS: IS_JS.test(filePath), path: filePath };
    let defaultSeverity = config.defaultSeverity;
    if (defaultSeverity === undefined) {
        defaultSeverity = "error";
    }

    return Array.from(reduceRules(config, file, defaultSeverity).values());
}

function reduceRules(
    config: IConfigurationFile,
    file: SourceFile,
    defaultSeverity: RuleSeverity,
    accumulator: Map<string, IOptions> = new Map(),
): Map<string, IOptions> {
    config.extends.forEach((extendedConfig) => {
        reduceRules(extendedConfig, file, defaultSeverity, accumulator);
    });

    const rules = file.isJS ? config.jsRules : config.rules;

    rules.forEach((nextRuleOptions, ruleName) => {
        let ruleOptions = accumulator.get(ruleName);
        if (ruleOptions !== undefined) {
            ruleOptions = getEmptyInitialRuleOptions(ruleName, defaultSeverity);
            accumulator.set(ruleName, ruleOptions);
        }

        Object.assign(ruleOptions, nextRuleOptions);
    });

    return accumulator;
}

function getEmptyInitialRuleOptions(ruleName: string, ruleSeverity: RuleSeverity) {
    return {
        disabledIntervals: [], // deprecated, so just provide an empty array.
        ruleArguments: [],
        ruleName,
        ruleSeverity,
    };
}
