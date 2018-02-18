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

import * as path from "path";
import { IOptions, RuleSeverity } from "../index";
import { arrayify, hasOwnProperty } from "../utils";
import { IConfigurationFile } from "./configurationFile";
import {
    getRulesDirectories,
    RawConfigFile,
    RawRuleConfig,
    RawRulesConfig,
    resolveConfigurationPath,
} from "./read";

/**
 * Parses the options of a single rule and upgrades legacy settings such as `true`, `[true, "option"]`
 *
 * @param ruleConfigValue The raw option setting of a rule
 */
function parseRuleOptions(ruleConfigValue: RawRuleConfig): Partial<IOptions> {
    const options: Partial<IOptions> = {};

    if (ruleConfigValue == undefined) {
        options.ruleSeverity = "off";
    } else if (Array.isArray(ruleConfigValue)) {
        if (ruleConfigValue.length > 0) {
            // old style: array
            const args = ruleConfigValue.slice(1);
            if (args.length > 0) {
                options.ruleArguments = args;
            }
            if (ruleConfigValue[0] !== true) {
                options.ruleSeverity = "off";
            }
        }
    } else if (typeof ruleConfigValue === "boolean") {
        // old style: boolean
        if (!ruleConfigValue) {
            options.ruleSeverity = "off";
        }
    } else if (typeof ruleConfigValue === "object") {
        if (ruleConfigValue.severity !== undefined) {
            options.ruleSeverity = parseRuleSeverity(ruleConfigValue.severity);
        }

        if (ruleConfigValue.options != undefined) {
            options.ruleArguments = arrayify(ruleConfigValue.options);
        }
    }

    return options;
}

/**
 * This portion of the configuration is gathered at parse time, before the file
 * names of linted files are known.
 */
interface EagerConfig {
    defaultSeverity?: RuleSeverity;
    linterOptions: IConfigurationFile["linterOptions"];
    rulesDirectory: string[];
}

/**
 * This is the primary parsing and extending function that turns a raw config object into
 * a normalized object to use with the Linter.
 */
export function parseConfigList(
    configFile: RawConfigFile,
    configFileDir: string,
    readConfig: (path: string, dir: string) => { config: RawConfigFile; filePath: string },
    resolveRulesDirectories: (dirs: string[], baseDir: string) => string[] = getRulesDirectories,
) {
    let defaultSeverity = parseRuleSeverity(configFile.defaultSeverity);
    if (defaultSeverity === undefined) {
        defaultSeverity = "error";
    }

    const accumulatedConfig: EagerConfig = {
        defaultSeverity,
        linterOptions: {},
        rulesDirectory: [],
    };

    const finalConfig = parseAndExtend(configFile, configFileDir);
    finalConfig.defaultSeverity = accumulatedConfig.defaultSeverity;
    finalConfig.linterOptions = accumulatedConfig.linterOptions;
    finalConfig.rulesDirectory = Array.from(new Set(accumulatedConfig.rulesDirectory));

    return finalConfig;

    function parseAndExtend(raw: RawConfigFile, dir: string): IConfigurationFile {
        const nextConfig = {
            extends: arrayify(raw.extends).map((extendPath) => {
                const { config, filePath } = readConfig(extendPath, dir);
                return parseAndExtend(config, path.dirname(filePath));
            }),
            jsRules: parseRules(raw.jsRules),
            linterOptions: {},
            rules: parseRules(raw.rules),
            rulesDirectory: [],
        };
        accumulatedConfig.rulesDirectory.push(...resolveRulesDirectories(arrayify(raw.rulesDirectory), dir));
        accumulatedConfig.linterOptions = {
            ...accumulatedConfig.linterOptions,
            ...parseLinterOptions(raw.linterOptions, dir),
        };

        if (raw.defaultSeverity !== undefined) {
            accumulatedConfig.defaultSeverity = parseRuleSeverity(raw.defaultSeverity);
        }

        return nextConfig;
    }
}

/**
 * Parses a config file and normalizes legacy config settings.
 * If `configFileDir` and `readConfig` are provided, this function will load all base configs and reduce them to the final configuration.
 *
 * @param configFile The raw object read from the JSON of a config file
 * @param configFileDir The directory of the config file
 * @param readConfig Will be used to load all base configurations while parsing. The function is called with the resolved path.
 */
export function parseConfigFile(
    configFile: RawConfigFile,
    configFileDir?: string,
    readConfig?: (path: string) => RawConfigFile,
): IConfigurationFile {
    if (readConfig === undefined || configFileDir === undefined) {
        return parseWithoutExtends(configFile, configFileDir);
    }

    return parseConfigList(configFile, configFileDir, (relativePath: string, dir: string) => {
        const resolvedPath = resolveConfigurationPath(relativePath, dir);

        return {
            config: readConfig(resolvedPath),
            filePath: resolvedPath,
        };
    });
}

function parseWithoutExtends(config: RawConfigFile, dir?: string): IConfigurationFile {
    return {
        extends: [],
        jsRules: parseRules(config.jsRules),
        linterOptions: parseLinterOptions(config.linterOptions, dir),
        rules: parseRules(config.rules),
        rulesDirectory: getRulesDirectories(arrayify(config.rulesDirectory), dir),
    };
}

function parseRules(config: RawRulesConfig | undefined): Map<string, Partial<IOptions>> {
    const map = new Map<string, Partial<IOptions>>();
    if (config !== undefined) {
        for (const ruleName in config) {
            if (hasOwnProperty(config, ruleName)) {
                map.set(ruleName, parseRuleOptions(config[ruleName]));
            }
        }
    }
    return map;
}

function parseLinterOptions(raw: RawConfigFile["linterOptions"], dir?: string): IConfigurationFile["linterOptions"] {
    if (raw === undefined || raw.exclude === undefined) {
        return {};
    }
    return {
        exclude: arrayify(raw.exclude).map(
            (pattern) => dir === undefined ? path.resolve(pattern) : path.resolve(dir, pattern),
        ),
    };
}

function parseRuleSeverity(raw?: string, fallback?: RuleSeverity): RuleSeverity | undefined {
    const defaultSeverity = fallback;

    if (typeof raw !== "string") {
        return defaultSeverity;
    }

    switch (raw.toLocaleLowerCase()) {
        case "error":
            return  "error";
        case "warn":
        case "warning":
            return "warning";
        case "off":
        case "none":
            return "off";
        case "default":
            return defaultSeverity;
        default:
            console.warn(`Invalid severity level: ${raw}`);
            return defaultSeverity;
    }
}
