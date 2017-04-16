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

import findup = require("findup-sync");
import * as fs from "fs";
import * as path from "path";
import * as resolve from "resolve";
import { FatalError } from "./error";

import { IOptions, RuleSeverity } from "./language/rule/rule";
import { arrayify, objectify, stripComments } from "./utils";

export interface IConfigurationFile {
    /**
     * The severity that is applied to rules in _this_ config with `severity === "default"`.
     * Not inherited.
     */
    defaultSeverity?: RuleSeverity;

    /**
     * An array of config files whose rules are inherited by this config file.
     */
    extends: string[];

    /**
     * Rules that are used to lint to JavaScript files.
     */
    jsRules: Map<string, Partial<IOptions>>;

    /**
     * Other linter options, currently for testing. Not publicly supported.
     */
    linterOptions?: {
        typeCheck?: boolean,
    };

    /**
     * Directories containing custom rules. Resolved using node module semantics.
     */
    rulesDirectory: string[];

    /**
     * Rules that are used to lint TypeScript files.
     */
    rules: Map<string, Partial<IOptions>>;
}

export interface IConfigurationLoadResult {
    path?: string;
    results?: IConfigurationFile;
}

export const CONFIG_FILENAME = "tslint.json";

export const DEFAULT_CONFIG: IConfigurationFile = {
    defaultSeverity: "error",
    extends: ["tslint:recommended"],
    jsRules: new Map<string, Partial<IOptions>>(),
    rules: new Map<string, Partial<IOptions>>(),
    rulesDirectory: [],
};

export const EMPTY_CONFIG: IConfigurationFile = {
    defaultSeverity: "error",
    extends: [],
    jsRules: new Map<string, Partial<IOptions>>(),
    rules: new Map<string, Partial<IOptions>>(),
    rulesDirectory: [],
};

const BUILT_IN_CONFIG = /^tslint:(.*)$/;

/**
 * Searches for a TSLint configuration and returns the data from the config.
 * @param configFile A path to a config file, this can be null if the location of a config is not known
 * @param inputFileLocation A path to the current file being linted. This is the starting location
 * of the search for a configuration.
 * @returns Load status for a TSLint configuration object
 */
export function findConfiguration(configFile: string | null, inputFilePath: string): IConfigurationLoadResult {
    const path = findConfigurationPath(configFile, inputFilePath);
    const loadResult: IConfigurationLoadResult = { path };

    try {
        loadResult.results = loadConfigurationFromPath(path);
        return loadResult;
    } catch (error) {
        throw new FatalError(`Failed to load ${path}: ${error.message}`, error);
    }
}

/**
 * Searches for a TSLint configuration and returns the path to it.
 * Could return undefined if not configuration is found.
 * @param suppliedConfigFilePath A path to an known config file supplied by a user. Pass null here if
 * the location of the config file is not known and you want to search for one.
 * @param inputFilePath A path to the current file being linted. This is the starting location
 * of the search for a configuration.
 * @returns An absolute path to a tslint.json file
 * or undefined if neither can be found.
 */
export function findConfigurationPath(suppliedConfigFilePath: string | null, inputFilePath: string) {
    if (suppliedConfigFilePath != null) {
        if (!fs.existsSync(suppliedConfigFilePath)) {
            throw new Error(`Could not find config file at: ${path.resolve(suppliedConfigFilePath)}`);
        } else {
            return path.resolve(suppliedConfigFilePath);
        }
    } else {
        // search for tslint.json from input file location
        let configFilePath = findup(CONFIG_FILENAME, { cwd: inputFilePath, nocase: true });
        if (configFilePath != null && fs.existsSync(configFilePath)) {
            return path.resolve(configFilePath);
        }

        // search for tslint.json in home directory
        const homeDir = getHomeDir();
        if (homeDir != null) {
            configFilePath = path.join(homeDir, CONFIG_FILENAME);
            if (fs.existsSync(configFilePath)) {
                return path.resolve(configFilePath);
            }
        }

        // no path could be found
        return undefined;
    }
}

/**
 * Used Node semantics to load a configuration file given configFilePath.
 * For example:
 * '/path/to/config' will be treated as an absolute path
 * './path/to/config' will be treated as a relative path
 * 'path/to/config' will attempt to load a to/config file inside a node module named path
 * @returns a configuration object for TSLint loaded from the file at configFilePath
 */
export function loadConfigurationFromPath(configFilePath?: string): IConfigurationFile {
    if (configFilePath == null) {
        return DEFAULT_CONFIG;
    } else {
        const resolvedConfigFilePath = resolveConfigurationPath(configFilePath);
        let rawConfigFile: any;
        if (path.extname(resolvedConfigFilePath) === ".json") {
            const fileContent = stripComments(fs.readFileSync(resolvedConfigFilePath)
            .toString()
            .replace(/^\uFEFF/, ""));
            rawConfigFile = JSON.parse(fileContent);
        } else {
            rawConfigFile = require(resolvedConfigFilePath);
            delete require.cache[resolvedConfigFilePath];
        }

        const configFileDir = path.dirname(resolvedConfigFilePath);
        const configFile = parseConfigFile(rawConfigFile, configFileDir);

        // load configurations, in order, using their identifiers or relative paths
        // apply the current configuration last by placing it last in this array
        const configs = configFile.extends.map((name) => {
            const nextConfigFilePath = resolveConfigurationPath(name, configFileDir);
            return loadConfigurationFromPath(nextConfigFilePath);
        }).concat([configFile]);

        return configs.reduce(extendConfigurationFile, EMPTY_CONFIG);
    }
}

/**
 * Resolve configuration file path or node_module reference
 * @param filePath Relative ("./path"), absolute ("/path"), node module ("path"), or built-in ("tslint:path")
 */
function resolveConfigurationPath(filePath: string, relativeTo?: string) {
    const matches = filePath.match(BUILT_IN_CONFIG);
    const isBuiltInConfig = matches != null && matches.length > 0;
    if (isBuiltInConfig) {
        const configName = matches![1];
        try {
            return require.resolve(`./configs/${configName}`);
        } catch (err) {
            throw new Error(`${filePath} is not a built-in config, try "tslint:recommended" instead.`);
        }
    }

    const basedir = relativeTo || process.cwd();
    try {
        return resolve.sync(filePath, { basedir });
    } catch (err) {
        try {
            return require.resolve(filePath);
        } catch (err) {
            throw new Error(`Invalid "extends" configuration value - could not require "${filePath}". ` +
                "Review the Node lookup algorithm (https://nodejs.org/api/modules.html#modules_all_together) " +
                "for the approximate method TSLint uses to find the referenced configuration file.");
        }
    }
}

export function extendConfigurationFile(targetConfig: IConfigurationFile,
                                        nextConfigSource: IConfigurationFile): IConfigurationFile {

    const combineProperties = (targetProperty: any, nextProperty: any) => {
        const combinedProperty: any = {};
        for (const name of Object.keys(objectify(targetProperty))) {
            combinedProperty[name] = targetProperty[name];
        }
        // next config source overwrites the target config object
        for (const name of Object.keys(objectify(nextProperty))) {
            combinedProperty[name] = nextProperty[name];
        }
        return combinedProperty;
    };

    const combineMaps = (target: Map<string, Partial<IOptions>>, next: Map<string, Partial<IOptions>>) => {
        const combined = new Map<string, Partial<IOptions>>();
        target.forEach((options, ruleName) => {
            combined.set(ruleName, options);
        });
        next.forEach((options, ruleName) => {
            const combinedRule = combined.get(ruleName);
            if (combinedRule != null) {
                combined.set(ruleName, combineProperties(combinedRule, options));
            } else {
                combined.set(ruleName, options);
            }
        });
        return combined;
    };

    const combinedRulesDirs = targetConfig.rulesDirectory.concat(nextConfigSource.rulesDirectory);
    const dedupedRulesDirs = Array.from(new Set(combinedRulesDirs));

    return {
        extends: [],
        jsRules: combineMaps(targetConfig.jsRules, nextConfigSource.jsRules),
        linterOptions: combineProperties(targetConfig.linterOptions, nextConfigSource.linterOptions),
        rules: combineMaps(targetConfig.rules, nextConfigSource.rules),
        rulesDirectory: dedupedRulesDirs,
    };
}

function getHomeDir() {
    const environment = global.process.env;
    const paths = [
        environment.USERPROFILE,
        environment.HOME,
        environment.HOMEPATH,
        environment.HOMEDRIVE + environment.HOMEPATH,
    ];

    for (const homePath of paths) {
        if (homePath != null && fs.existsSync(homePath)) {
            return homePath;
        }
    }
}

// returns the absolute path (contrary to what the name implies)
export function getRelativePath(directory?: string | null, relativeTo?: string) {
    if (directory != null) {
        const basePath = relativeTo || process.cwd();
        return path.resolve(basePath, directory);
    }
    return undefined;
}

// check if directory should be used as path or if it should be resolved like a module
// matches if directory starts with '/', './', '../', 'node_modules/' or equals '.' or '..'
export function useAsPath(directory: string) {
    return /^(?:\.?\.?(?:\/|$)|node_modules\/)/.test(directory);
}

/**
 * @param directories A path(s) to a directory of custom rules
 * @param relativeTo A path that directories provided are relative to.
 * For example, if the directories come from a tslint.json file, this path
 * should be the path to the tslint.json file.
 * @return An array of absolute paths to directories potentially containing rules
 */
export function getRulesDirectories(directories?: string | string[], relativeTo?: string): string[] {
    return arrayify(directories)
        .map((dir) => {
            if (!useAsPath(dir)) {
                try {
                    return path.dirname(resolve.sync(dir, { basedir: relativeTo }));
                } catch (err) {
                    // swallow error and fallback to using directory as path
                }
            }

            const absolutePath = getRelativePath(dir, relativeTo);
            if (absolutePath != null) {
                if (!fs.existsSync(absolutePath)) {
                    throw new Error(`Could not find custom rule directory: ${dir}`);
                }
            }
            return absolutePath;
        })
        .filter((dir) => dir !== undefined) as string[];
}

/**
 * Parses the options of a single rule and upgrades legacy settings such as `true`, `[true, "option"]`
 *
 * @param ruleConfigValue The raw option setting of a rule
 */
function parseRuleOptions(ruleConfigValue: any, rawDefaultRuleSeverity: string): Partial<IOptions> {
    let ruleArguments: any[] | undefined;
    let ruleSeverity: RuleSeverity;
    let defaultRuleSeverity: RuleSeverity = "error";

    if (rawDefaultRuleSeverity) {
        switch (rawDefaultRuleSeverity.toLowerCase()) {
            case "warn":
            case "warning":
                defaultRuleSeverity = "warning";
                break;
            case "off":
            case "none":
                defaultRuleSeverity = "off";
                break;
            default:
                defaultRuleSeverity = "error";
        }
    }

    if (ruleConfigValue == null) {
        ruleArguments = [];
        ruleSeverity = "off";
    } else if (Array.isArray(ruleConfigValue) && ruleConfigValue.length > 0) {
        // old style: array
        ruleArguments = ruleConfigValue.slice(1);
        ruleSeverity = ruleConfigValue[0] === true ? defaultRuleSeverity : "off";
    } else if (typeof ruleConfigValue === "boolean") {
        // old style: boolean
        ruleArguments = [];
        ruleSeverity = ruleConfigValue === true ? defaultRuleSeverity : "off";
    } else if (ruleConfigValue.severity) {
        switch (ruleConfigValue.severity.toLowerCase()) {
            case "default":
                ruleSeverity = defaultRuleSeverity;
                break;
            case "error":
                ruleSeverity = "error";
                break;
            case "warn":
            case "warning":
                ruleSeverity = "warning";
                break;
            case "off":
            case "none":
                ruleSeverity = "off";
                break;
            default:
                console.warn(`Invalid severity level: ${ruleConfigValue.severity}`);
                ruleSeverity = defaultRuleSeverity;
        }
    } else {
        ruleSeverity = defaultRuleSeverity;
    }

    if (ruleConfigValue && ruleConfigValue.options) {
        ruleArguments = arrayify(ruleConfigValue.options);
    }

    return {
        ruleArguments,
        ruleSeverity,
    };
}

/**
 * Parses a config file and normalizes legacy config settings
 *
 * @param configFile The raw object read from the JSON of a config file
 * @param configFileDir The directory of the config file
 */
export function parseConfigFile(configFile: any, configFileDir?: string): IConfigurationFile {
    const rules = new Map<string, Partial<IOptions>>();
    const jsRules = new Map<string, Partial<IOptions>>();

    if (configFile.rules) {
        for (const ruleName in configFile.rules) {
            if (configFile.rules.hasOwnProperty(ruleName)) {
                rules.set(ruleName, parseRuleOptions(configFile.rules[ruleName], configFile.defaultSeverity));
            }
        }
    }

    if (configFile.jsRules) {
        for (const ruleName in configFile.jsRules) {
            if (configFile.jsRules.hasOwnProperty(ruleName)) {
                jsRules.set(ruleName, parseRuleOptions(configFile.jsRules[ruleName], configFile.defaultSeverity));
            }
        }
    }

    return {
        extends: arrayify(configFile.extends),
        jsRules,
        linterOptions: configFile.linterOptions || {},
        rulesDirectory: getRulesDirectories(configFile.rulesDirectory, configFileDir),
        rules,
    };
}

/**
 * Fills in default values for `IOption` properties and outputs an array of `IOption`
 */
export function convertRuleOptions(ruleConfiguration: Map<string, Partial<IOptions>>): IOptions[] {
    const output: IOptions[] = [];
    ruleConfiguration.forEach((partialOptions, ruleName) => {
        const options: IOptions = {
            disabledIntervals: [],
            ruleArguments: partialOptions.ruleArguments || [],
            ruleName,
            ruleSeverity: partialOptions.ruleSeverity || "error",
        };
        output.push(options);
    });
    return output;
}
