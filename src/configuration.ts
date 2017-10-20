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

import * as fs from "fs";
import * as path from "path";
import * as resolve from "resolve";
import { FatalError, showWarningOnce } from "./error";

import { IOptions, RuleSeverity } from "./language/rule/rule";
import { arrayify, hasOwnProperty, stripComments } from "./utils";

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
     * A subset of the CLI options.
     */
    linterOptions?: Partial<{
        exclude: string[];
    }>;

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
 * @param inputFilePath A path containing the current file being linted. This is the starting location
 * of the search for a configuration.
 * @returns Load status for a TSLint configuration object
 */
export function findConfiguration(configFile: string | null, inputFilePath: string): IConfigurationLoadResult;
export function findConfiguration(configFile: string, inputFilePath?: string): IConfigurationLoadResult;
export function findConfiguration(configFile: string | null, inputFilePath?: string): IConfigurationLoadResult {
    const configPath = findConfigurationPath(configFile, inputFilePath!);
    const loadResult: IConfigurationLoadResult = { path: configPath };

    try {
        loadResult.results = loadConfigurationFromPath(configPath);
        return loadResult;
    } catch (error) {
        throw new FatalError(`Failed to load ${configPath}: ${(error as Error).message}`, error as Error);
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
export function findConfigurationPath(suppliedConfigFilePath: string | null, inputFilePath: string): string | undefined;
export function findConfigurationPath(suppliedConfigFilePath: string, inputFilePath?: string): string | undefined;
export function findConfigurationPath(suppliedConfigFilePath: string | null, inputFilePath?: string): string | undefined {
    if (suppliedConfigFilePath != undefined) {
        if (!fs.existsSync(suppliedConfigFilePath)) {
            throw new FatalError(`Could not find config file at: ${path.resolve(suppliedConfigFilePath)}`);
        } else {
            return path.resolve(suppliedConfigFilePath);
        }
    } else {
        // convert to dir if it's a file or doesn't exist
        let useDirName = false;
        try {
            const stats = fs.statSync(inputFilePath!);
            if (stats.isFile()) {
                useDirName = true;
            }
        } catch (e) {
            // throws if file doesn't exist
            useDirName = true;
        }
        if (useDirName) {
            inputFilePath = path.dirname(inputFilePath!);
        }

        // search for tslint.json from input file location
        let configFilePath = findup(CONFIG_FILENAME, path.resolve(inputFilePath!));
        if (configFilePath !== undefined) {
            return configFilePath;
        }

        // search for tslint.json in home directory
        const homeDir = getHomeDir();
        if (homeDir != undefined) {
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
 * Find a file by name in a directory or any ancestory directory.
 * This is case-insensitive, so it can find 'TsLiNt.JsOn' when searching for 'tslint.json'.
 */
function findup(filename: string, directory: string): string | undefined {
    while (true) {
        const res = findFile(directory);
        if (res !== undefined) {
            return path.join(directory, res);
        }

        const parent = path.dirname(directory);
        if (parent === directory) {
            return undefined;
        }
        directory = parent;
    }

    function findFile(cwd: string): string | undefined {
        if (fs.existsSync(path.join(cwd, filename))) {
            return filename;
        }

        // TODO: remove in v6.0.0
        // Try reading in the entire directory and looking for a file with different casing.
        const filenameLower = filename.toLowerCase();
        const result = fs.readdirSync(cwd).find((entry) => entry.toLowerCase() === filenameLower);
        if (result !== undefined) {
            showWarningOnce(`Using mixed case tslint.json is deprecated. Found: ${path.join(cwd, result)}`);
        }
        return result;
    }
}

/**
 * Used Node semantics to load a configuration file given configFilePath.
 * For example:
 * '/path/to/config' will be treated as an absolute path
 * './path/to/config' will be treated as a relative path
 * 'path/to/config' will attempt to load a to/config file inside a node module named path
 * @param configFilePath The configuration to load
 * @param originalFilePath The entry point configuration file
 * @returns a configuration object for TSLint loaded from the file at configFilePath
 */
export function loadConfigurationFromPath(configFilePath?: string, originalFilePath = configFilePath) {
    if (configFilePath == undefined) {
        return DEFAULT_CONFIG;
    } else {
        const resolvedConfigFilePath = resolveConfigurationPath(configFilePath);
        let rawConfigFile: RawConfigFile;
        if (path.extname(resolvedConfigFilePath) === ".json") {
            const fileContent = stripComments(fs.readFileSync(resolvedConfigFilePath)
                .toString()
                .replace(/^\uFEFF/, ""));
            try {
                rawConfigFile = JSON.parse(fileContent) as RawConfigFile;
            } catch (e) {
                const error = e as Error;
                // include the configuration file being parsed in the error since it may differ from the directly referenced config
                throw configFilePath === originalFilePath ? error : new Error(`${error.message} in ${configFilePath}`);
            }
        } else {
            rawConfigFile = require(resolvedConfigFilePath) as RawConfigFile;
            delete (require.cache as { [key: string]: any })[resolvedConfigFilePath];
        }

        const configFileDir = path.dirname(resolvedConfigFilePath);
        const configFile = parseConfigFile(rawConfigFile, configFileDir);

        // load configurations, in order, using their identifiers or relative paths
        // apply the current configuration last by placing it last in this array
        const configs: IConfigurationFile[] = configFile.extends.map((name) => {
            const nextConfigFilePath = resolveConfigurationPath(name, configFileDir);
            return loadConfigurationFromPath(nextConfigFilePath, originalFilePath);
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
    const isBuiltInConfig = matches !== null && matches.length > 0;
    if (isBuiltInConfig) {
        const configName = matches![1];
        try {
            return require.resolve(`./configs/${configName}`);
        } catch (err) {
            throw new Error(`${filePath} is not a built-in config, try "tslint:recommended" instead.`);
        }
    }

    const basedir = relativeTo !== undefined ? relativeTo : process.cwd();
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

    function combineProperties<T>(targetProperty: T | undefined, nextProperty: T | undefined): T {
        const combinedProperty: { [key: string]: any } = {};
        add(targetProperty);
        // next config source overwrites the target config object
        add(nextProperty);
        return combinedProperty as T;

        function add(property: T | undefined): void {
            if (property !== undefined) {
                for (const name in property) {
                    if (hasOwnProperty(property, name)) {
                        combinedProperty[name] = property[name];
                    }
                }
            }

        }
    }

    function combineMaps(target: Map<string, Partial<IOptions>>, next: Map<string, Partial<IOptions>>) {
        const combined = new Map<string, Partial<IOptions>>();
        target.forEach((options, ruleName) => {
            combined.set(ruleName, options);
        });
        next.forEach((options, ruleName) => {
            const combinedRule = combined.get(ruleName);
            if (combinedRule !== undefined) {
                combined.set(ruleName, combineProperties(combinedRule, options));
            } else {
                combined.set(ruleName, options);
            }
        });
        return combined;
    }

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

function getHomeDir(): string | undefined {
    const environment = global.process.env as { [key: string]: string };
    const paths: string[] = [
        environment.USERPROFILE,
        environment.HOME,
        environment.HOMEPATH,
        environment.HOMEDRIVE + environment.HOMEPATH,
    ];

    for (const homePath of paths) {
        if (homePath !== undefined && fs.existsSync(homePath)) {
            return homePath;
        }
    }

    return undefined;
}

// returns the absolute path (contrary to what the name implies)
export function getRelativePath(directory?: string | null, relativeTo?: string) {
    if (directory != undefined) {
        const basePath = relativeTo !== undefined ? relativeTo : process.cwd();
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
            if (absolutePath !== undefined) {
                if (!fs.existsSync(absolutePath)) {
                    throw new FatalError(`Could not find custom rule directory: ${dir}`);
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
function parseRuleOptions(ruleConfigValue: RawRuleConfig, rawDefaultRuleSeverity: string | undefined): Partial<IOptions> {
    let ruleArguments: any[] | undefined;
    let defaultRuleSeverity: RuleSeverity = "error";

    if (rawDefaultRuleSeverity !== undefined) {
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

    let ruleSeverity = defaultRuleSeverity;

    if (ruleConfigValue == undefined) {
        ruleArguments = [];
        ruleSeverity = "off";
    } else if (Array.isArray(ruleConfigValue)) {
        if (ruleConfigValue.length > 0) {
            // old style: array
            ruleArguments = ruleConfigValue.slice(1);
            ruleSeverity = ruleConfigValue[0] === true ? defaultRuleSeverity : "off";
        }
    } else if (typeof ruleConfigValue === "boolean") {
        // old style: boolean
        ruleArguments = [];
        ruleSeverity = ruleConfigValue ? defaultRuleSeverity : "off";
    } else if (typeof ruleConfigValue === "object") {
        if (ruleConfigValue.severity !== undefined) {
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
        }
        if (ruleConfigValue.options != undefined) {
            ruleArguments = arrayify(ruleConfigValue.options);
        }
    }

    return {
        ruleArguments,
        ruleSeverity,
    };
}

export interface RawConfigFile {
    extends?: string | string[];
    linterOptions?: IConfigurationFile["linterOptions"];
    rulesDirectory?: string | string[];
    defaultSeverity?: string;
    rules?: RawRulesConfig;
    jsRules?: RawRulesConfig;
}
export interface RawRulesConfig {
    [key: string]: RawRuleConfig;
}
export type RawRuleConfig = null | undefined | boolean | any[] | {
    severity?: RuleSeverity | "warn" | "none" | "default";
    options?: any;
};

/**
 * Parses a config file and normalizes legacy config settings
 *
 * @param configFile The raw object read from the JSON of a config file
 * @param configFileDir The directory of the config file
 */
export function parseConfigFile(configFile: RawConfigFile, configFileDir?: string): IConfigurationFile {
    return {
        extends: arrayify(configFile.extends),
        jsRules: parseRules(configFile.jsRules),
        linterOptions: parseLinterOptions(configFile.linterOptions),
        rules: parseRules(configFile.rules),
        rulesDirectory: getRulesDirectories(configFile.rulesDirectory, configFileDir),
    };

    function parseRules(config: RawRulesConfig | undefined): Map<string, Partial<IOptions>> {
        const map = new Map<string, Partial<IOptions>>();
        if (config !== undefined) {
            for (const ruleName in config) {
                if (hasOwnProperty(config, ruleName)) {
                    map.set(ruleName, parseRuleOptions(config[ruleName], configFile.defaultSeverity));
                }
            }
        }
        return map;
    }

    function parseLinterOptions(raw: RawConfigFile["linterOptions"]): IConfigurationFile["linterOptions"] {
        if (raw === undefined || raw.exclude === undefined) {
            return {};
        }
        return {
            exclude: arrayify(raw.exclude).map(
                (pattern) => configFileDir === undefined ? path.resolve(pattern) : path.resolve(configFileDir, pattern),
            ),
        };
    }
}

/**
 * Fills in default values for `IOption` properties and outputs an array of `IOption`
 */
export function convertRuleOptions(ruleConfiguration: Map<string, Partial<IOptions>>): IOptions[] {
    const output: IOptions[] = [];
    ruleConfiguration.forEach(({ ruleArguments, ruleSeverity }, ruleName) => {
        const options: IOptions = {
            disabledIntervals: [], // deprecated, so just provide an empty array.
            ruleArguments: ruleArguments != undefined ? ruleArguments : [],
            ruleName,
            ruleSeverity: ruleSeverity != undefined ? ruleSeverity : "error",
        };
        output.push(options);
    });
    return output;
}
