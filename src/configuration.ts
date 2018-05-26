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
import * as minimatch from "minimatch";
import * as os from "os";
import * as path from "path";
import * as resolve from "resolve";
import * as toAbsoluteGlob from "to-absolute-glob";
import { FatalError, showWarningOnce } from "./error";
import { IOptions, RuleSeverity } from "./language/rule/rule";
import { arrayify, hasOwnProperty, stripComments } from "./utils";

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

export const DEFAULT_CONFIG: RawConfigFile = {
    defaultSeverity: "error",
    extends: ["tslint:recommended"],
    jsRules: {},
    rules: {},
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
 * @returns An absolute path to a tslint.json or tslint.yml or tslint.yaml file
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
            const result = dirFiles.find((entry) => entry.toLowerCase() === filename);
            if (result !== undefined) {
                showWarningOnce(`Using mixed case ${filename} is deprecated. Found: ${path.join(cwd, result)}`);
                return result;
            }
        }
        return undefined;
    }
}

/**
 * Use Node semantics to load a configuration file given configFilePath.
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
        return parseConfigFile(DEFAULT_CONFIG);
    } else {
        const resolvedConfigFilePath = resolveConfigurationPath(configFilePath);
        const rawConfigFile = readConfigurationFile(resolvedConfigFilePath);

        return parseConfigFile(rawConfigFile, path.dirname(resolvedConfigFilePath), readConfigurationFile);
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
                return yaml.safeLoad(fileContent, {
                    // Note: yaml.LoadOptions expects a schema value of type "any",
                    // but this trips up the no-unsafe-any rule.
                    // tslint:disable-next-line:no-unsafe-any
                    schema: yaml.JSON_SCHEMA,
                    strict: true,
                }) as RawConfigFile;
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

            const absolutePath = relativeTo === undefined ? path.resolve(dir) : path.resolve(relativeTo, dir);
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
    severity?: RuleSeverity | "warn" | "none" | "default";
    options?: any;
};

export type RuleMap = Map<string, Partial<IOptions>>;

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

/**
 * This portion of the configuration is gathered at parse time, before we know
 * the linted file names.
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
            overrides: parseOverrides(raw.overrides),
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

function parseWithoutExtends(config: RawConfigFile, dir?: string): IConfigurationFile {
    return {
        extends: [],
        jsRules: parseRules(config.jsRules),
        linterOptions: parseLinterOptions(config.linterOptions, dir),
        overrides: parseOverrides(config.overrides, dir),
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

function parseOverrides(raw: RawConfigFile["overrides"], dir?: string): IConfigurationFile["overrides"] {
    if (raw === undefined) {
        return [];
    }

    if (!Array.isArray(raw)) {
        throw new Error("key 'overrides' should be an array of objects");
    }

    return raw.map((override) => ({
        excludedFiles: parsePatterns(override.excludedFiles, dir),
        files: parsePatterns(override.files, dir),
        rules: parseRules(override.rules),
    }));
}

function parsePatterns(patterns?: string | string[], dir?: string): string[] {
    return arrayify(patterns).map((pattern) => toAbsoluteGlob(pattern, { cwd: dir }));
}

/**
 * A file to lint. Stores the isJS property to avoid extra regex tests.
 */
interface SourceFile {
    path: string;
    isJS: boolean;
}

export const IS_JS = /\.jsx?$/i;

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
    assignRules(accumulator, rules, defaultSeverity);

    if (config.overrides !== undefined) {
        const fullPath = path.resolve(file.path);

        for (const override of config.overrides) {
            if (pathMatchesGlobs(fullPath, override.files, override.excludedFiles)) {
                assignRules(accumulator, override.rules, defaultSeverity);
            }
        }
    }

    return accumulator;
}

function assignRules(rules: RuleMap, nextRules: RuleMap, defaultSeverity: RuleSeverity) {
    nextRules.forEach((nextRuleOptions, ruleName) => {
        let ruleOptions = rules.get(ruleName);
        if (ruleOptions === undefined) {
            ruleOptions = getEmptyInitialRuleOptions(ruleName, defaultSeverity);
            rules.set(ruleName, ruleOptions);
        }

        Object.assign(ruleOptions, nextRuleOptions);
    });
}

function getEmptyInitialRuleOptions(ruleName: string, ruleSeverity: RuleSeverity) {
    return {
        disabledIntervals: [], // deprecated, so just provide an empty array.
        ruleArguments: [],
        ruleName,
        ruleSeverity,
    };
}

/**
 * Checks that the specified file path matches all of the supplied glob patterns.
 * @param filePath - The file path to test
 * @param includePatterns - glob patterns to match
 * @param excludedPatterns - glob patterns to avoid matching
 */
function pathMatchesGlobs(filePath: string, includedPatterns: string[], excludedPatterns: string[]): boolean {
    return includedPatterns.some((p) => minimatch(filePath, p)) &&
        !excludedPatterns.some((p) => minimatch(filePath, p));
}
