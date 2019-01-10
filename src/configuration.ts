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
import * as yaml from "js-yaml";
import { Minimatch } from "minimatch";
import * as os from "os";
import * as path from "path";
import { FatalError, showWarningOnce } from "./error";

import { IOptions, RuleSeverity } from "./language/rule/rule";
import { findRule } from "./ruleLoader";
import { arrayify, hasOwnProperty, stripComments, tryResolvePackage } from "./utils";

export interface IConfigurationFile {
    /**
     * @deprecated property is never set
     *
     * The severity that is applied to rules in this config file as well as rules
     * in any inherited config files which have their severity set to "default".
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
        format: string;
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

// Note: eslint prefers yaml over json, while tslint prefers json over yaml
// for backward-compatibility.
export const JSON_CONFIG_FILENAME = "tslint.json";
/** @deprecated use `JSON_CONFIG_FILENAME` or `CONFIG_FILENAMES` instead. */
export const CONFIG_FILENAME = JSON_CONFIG_FILENAME;
export const CONFIG_FILENAMES = [JSON_CONFIG_FILENAME, "tslint.yaml", "tslint.yml"];

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
export function findConfiguration(
    configFile: string | null,
    inputFilePath: string,
): IConfigurationLoadResult;
export function findConfiguration(
    configFile: string,
    inputFilePath?: string,
): IConfigurationLoadResult;
export function findConfiguration(
    configFile: string | null,
    inputFilePath?: string,
): IConfigurationLoadResult {
    const configPath = findConfigurationPath(configFile, inputFilePath!);
    const loadResult: IConfigurationLoadResult = { path: configPath };

    try {
        loadResult.results = loadConfigurationFromPath(configPath);
        return loadResult;
    } catch (error) {
        throw new FatalError(
            `Failed to load ${configPath}: ${(error as Error).message}`,
            error as Error,
        );
    }
}

/**
 * Searches for a TSLint configuration and returns the path to it.
 * Could return undefined if not configuration is found.
 * @param suppliedConfigFilePath A path to an known config file supplied by a user. Pass null here if
 * the location of the config file is not known and you want to search for one.
 * @param inputFilePath A path to the current file being linted. This is the starting location
 * of the search for a configuration.
 * @returns An absolute path to a tslint.json or tslint.yml or tslint.yaml file
 * or undefined if neither can be found.
 */
export function findConfigurationPath(
    suppliedConfigFilePath: string | null,
    inputFilePath: string,
): string | undefined;
export function findConfigurationPath(
    suppliedConfigFilePath: string,
    inputFilePath?: string,
): string | undefined;
export function findConfigurationPath(
    suppliedConfigFilePath: string | null,
    inputFilePath?: string,
): string | undefined {
    if (suppliedConfigFilePath != undefined) {
        if (!fs.existsSync(suppliedConfigFilePath)) {
            throw new FatalError(
                `Could not find config file at: ${path.resolve(suppliedConfigFilePath)}`,
            );
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
        let configFilePath = findup(CONFIG_FILENAMES, path.resolve(inputFilePath!));
        if (configFilePath !== undefined) {
            return configFilePath;
        }

        // search for tslint.json in home directory
        const homeDir = os.homedir();
        for (const configFilename of CONFIG_FILENAMES) {
            configFilePath = path.join(homeDir, configFilename);
            if (fs.existsSync(configFilePath)) {
                return path.resolve(configFilePath);
            }
        }
        // no path could be found
        return undefined;
    }
}

/**
 * Find a file by names in a directory or any ancestor directory.
 * Will try each filename in filenames before recursing to a parent directory.
 * This is case-insensitive, so it can find 'TsLiNt.JsOn' when searching for 'tslint.json'.
 */
function findup(filenames: string[], directory: string): string | undefined {
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
        const dirFiles = fs.readdirSync(cwd);
        for (const filename of filenames) {
            const index = dirFiles.indexOf(filename);
            if (index > -1) {
                return filename;
            }
            // TODO: remove in v6.0.0
            // Try reading in the entire directory and looking for a file with different casing.
            const result = dirFiles.find(entry => entry.toLowerCase() === filename);
            if (result !== undefined) {
                showWarningOnce(
                    `Using mixed case ${filename} is deprecated. Found: ${path.join(cwd, result)}`,
                );
                return result;
            }
        }
        return undefined;
    }
}

/**
 * Used Node semantics to load a configuration file given configFilePath.
 * For example:
 * '/path/to/config' will be treated as an absolute path
 * './path/to/config' will be treated as a relative path
 * 'path/to/config' will attempt to load a to/config file inside a node module named path
 * @param configFilePath The configuration to load
 * @param originalFilePath (deprecated) The entry point configuration file
 * @returns a configuration object for TSLint loaded from the file at configFilePath
 */
export function loadConfigurationFromPath(configFilePath?: string, _originalFilePath?: string) {
    if (configFilePath == undefined) {
        return DEFAULT_CONFIG;
    } else {
        const resolvedConfigFilePath = resolveConfigurationPath(configFilePath);
        const rawConfigFile = readConfigurationFile(resolvedConfigFilePath);

        return parseConfigFile(
            rawConfigFile,
            path.dirname(resolvedConfigFilePath),
            readConfigurationFile,
        );
    }
}

/** Reads the configuration file from disk and parses it as raw JSON, YAML or JS depending on the extension. */
export function readConfigurationFile(filepath: string): RawConfigFile {
    const resolvedConfigFileExt = path.extname(filepath);
    if (/\.(json|ya?ml)/.test(resolvedConfigFileExt)) {
        const fileContent = fs.readFileSync(filepath, "utf8").replace(/^\uFEFF/, "");
        try {
            if (resolvedConfigFileExt === ".json") {
                return JSON.parse(stripComments(fileContent)) as RawConfigFile;
            } else {
                return yaml.safeLoad(fileContent) as RawConfigFile;
            }
        } catch (e) {
            const error = e as Error;
            // include the configuration file being parsed in the error since it may differ from the directly referenced config
            throw new Error(`${error.message} in ${filepath}`);
        }
    } else {
        const rawConfigFile = require(filepath) as RawConfigFile;
        // tslint:disable-next-line no-dynamic-delete
        delete (require.cache as { [key: string]: any })[filepath];
        return rawConfigFile;
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
            throw new Error(
                `${filePath} is not a built-in config, try "tslint:recommended" instead.`,
            );
        }
    }

    const basedir = relativeTo !== undefined ? relativeTo : process.cwd();
    try {
        let resolvedPackagePath: string | undefined = tryResolvePackage(filePath, basedir);
        if (resolvedPackagePath === undefined) {
            resolvedPackagePath = require.resolve(filePath);
        }

        return resolvedPackagePath;
    } catch (err) {
        throw new Error(
            `Invalid "extends" configuration value - could not require "${filePath}". ` +
                "Review the Node lookup algorithm (https://nodejs.org/api/modules.html#modules_all_together) " +
                "for the approximate method TSLint uses to find the referenced configuration file.",
        );
    }
}

export function extendConfigurationFile(
    targetConfig: IConfigurationFile,
    nextConfigSource: IConfigurationFile,
): IConfigurationFile {
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

    function combineMaps(
        target: Map<string, Partial<IOptions>>,
        next: Map<string, Partial<IOptions>>,
    ) {
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
        linterOptions: combineProperties(
            targetConfig.linterOptions,
            nextConfigSource.linterOptions,
        ),
        rules: combineMaps(targetConfig.rules, nextConfigSource.rules),
        rulesDirectory: dedupedRulesDirs,
    };
}

/**
 * returns the absolute path (contrary to what the name implies)
 *
 * @deprecated use `path.resolve` instead
 */
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
export function getRulesDirectories(
    directories?: string | string[],
    relativeTo?: string,
): string[] {
    return arrayify(directories).map(dir => {
        if (!useAsPath(dir)) {
            const resolvedPackagePath: string | undefined = tryResolvePackage(dir, relativeTo);
            if (resolvedPackagePath !== undefined) {
                return path.dirname(resolvedPackagePath);
            }
        }

        const absolutePath =
            relativeTo === undefined ? path.resolve(dir) : path.resolve(relativeTo, dir);
        if (absolutePath !== undefined) {
            if (!fs.existsSync(absolutePath)) {
                throw new FatalError(`Could not find custom rule directory: ${dir}`);
            }
        }
        return absolutePath;
    });
}

/**
 * Parses the options of a single rule and upgrades legacy settings such as `true`, `[true, "option"]`
 *
 * @param ruleConfigValue The raw option setting of a rule
 */
function parseRuleOptions(
    ruleConfigValue: RawRuleConfig,
    rawDefaultRuleSeverity: string | undefined,
): Partial<IOptions> {
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
    jsRules?: RawRulesConfig | boolean;
}
export interface RawRulesConfig {
    [key: string]: RawRuleConfig;
}
export type RawRuleConfig =
    | null
    | undefined
    | boolean
    | any[]
    | {
          severity?: RuleSeverity | "warn" | "none" | "default";
          options?: any;
      };

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
    let defaultSeverity = configFile.defaultSeverity;
    if (readConfig === undefined || configFileDir === undefined) {
        return parse(configFile, configFileDir);
    }

    return loadExtendsRecursive(configFile, configFileDir)
        .map(({ dir, config }) => parse(config, dir))
        .reduce(extendConfigurationFile, EMPTY_CONFIG);

    /** Read files in order, depth first, and assign `defaultSeverity` (last config in extends wins). */
    function loadExtendsRecursive(raw: RawConfigFile, dir: string) {
        const configs: Array<{ dir: string; config: RawConfigFile }> = [];
        for (const relativePath of arrayify(raw.extends)) {
            const resolvedPath = resolveConfigurationPath(relativePath, dir);
            const extendedRaw = readConfig!(resolvedPath);
            configs.push(...loadExtendsRecursive(extendedRaw, path.dirname(resolvedPath)));
        }
        if (raw.defaultSeverity !== undefined) {
            defaultSeverity = raw.defaultSeverity;
        }
        configs.push({ dir, config: raw });
        return configs;
    }

    function parse(config: RawConfigFile, dir?: string): IConfigurationFile {
        const rulesDirectory: string | string[] = getRulesDirectories(config.rulesDirectory, dir);
        const rules = parseRules(config.rules);
        const jsRules =
            typeof config.jsRules === "boolean"
                ? filterValidJsRules(rules, config.jsRules, rulesDirectory)
                : parseRules(config.jsRules);

        return {
            extends: arrayify(config.extends),
            jsRules,
            linterOptions: parseLinterOptions(config.linterOptions, dir),
            rules,
            rulesDirectory,
        };
    }

    function parseRules(config: RawRulesConfig | undefined): Map<string, Partial<IOptions>> {
        const map = new Map<string, Partial<IOptions>>();
        if (config !== undefined) {
            for (const ruleName in config) {
                if (hasOwnProperty(config, ruleName)) {
                    map.set(ruleName, parseRuleOptions(config[ruleName], defaultSeverity));
                }
            }
        }
        return map;
    }

    function filterValidJsRules(
        rules: Map<string, Partial<IOptions>>,
        copyRulestoJsRules = false,
        rulesDirectory?: string | string[],
    ): Map<string, Partial<IOptions>> {
        const validJsRules = new Map<string, Partial<IOptions>>();
        if (copyRulestoJsRules) {
            rules.forEach((ruleOptions, ruleName) => {
                if (ruleOptions.ruleSeverity !== "off") {
                    const Rule = findRule(ruleName, rulesDirectory);
                    if (
                        Rule !== undefined &&
                        (Rule.metadata === undefined || !Rule.metadata.typescriptOnly)
                    ) {
                        validJsRules.set(ruleName, ruleOptions);
                    }
                }
            });
        }

        return validJsRules;
    }

    function parseLinterOptions(
        raw: RawConfigFile["linterOptions"],
        dir?: string,
    ): IConfigurationFile["linterOptions"] {
        if (raw === undefined) {
            return {};
        }
        return {
            ...(raw.exclude !== undefined
                ? {
                      exclude: arrayify(raw.exclude).map(
                          pattern =>
                              dir === undefined
                                  ? path.resolve(pattern)
                                  : path.resolve(dir, pattern),
                      ),
                  }
                : {}),
            ...(raw.format !== undefined
                ? {
                      format: raw.format,
                  }
                : {}),
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

export function isFileExcluded(filepath: string, configFile?: IConfigurationFile) {
    if (
        configFile === undefined ||
        configFile.linterOptions == undefined ||
        configFile.linterOptions.exclude == undefined
    ) {
        return false;
    }
    const fullPath = path.resolve(filepath);
    return configFile.linterOptions.exclude.some(pattern => new Minimatch(pattern).match(fullPath));
}
