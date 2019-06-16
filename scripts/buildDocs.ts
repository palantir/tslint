/*
 * Copyright 2018 Palantir Technologies, Inc.
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

/*
 * This TS script reads the metadata from each TSLint built-in rule
 * and serializes it in a format appropriate for the docs website.
 *
 * This script expects there to be a tslint-gh-pages directory
 * parallel to the main tslint directory. The tslint-gh-pages should
 * have the gh-pages branch of the TSLint repo checked out.
 * One easy way to do this is with the following Git command:
 *
 * ```
 * git worktree add -b gh-pages ../tslint-gh-pages origin/gh-pages
 * ```
 *
 * See http://palantir.github.io/tslint/develop/docs/ for more info
 *
 */

import * as fs from "fs";
import * as glob from "glob";
import * as yaml from "js-yaml";
import stringify = require("json-stringify-pretty-compact");
import * as path from "path";
import * as rimraf from "rimraf";

import { IFormatterMetadata } from "../lib/language/formatter/formatter";
import { ICodeExample, IRuleMetadata } from "../lib/language/rule/rule";

type Metadata = IRuleMetadata | IFormatterMetadata;

interface Documented {
    metadata: Metadata;
}

interface IDocumentation {
    /**
     * File name for the json data file listing.
     */
    dataFileName: string;

    /**
     * Exported item name from each file.
     */
    exportName: string;

    /**
     * Pattern matching files to be documented.
     */
    globPattern: string;

    /**
     * Key of the item's name within the metadata object.
     */
    nameMetadataKey: string;

    /**
     * Function to generate individual documentation pages.
     */
    pageGenerator(metadata: any): string;

    /**
     * Documentation subdirectory to output to.
     */
    subDirectory: string;
}

const DOCS_DIR = "../docs";

process.chdir("./scripts");

/**
 * Documentation definition for rule modules.
 */
const ruleDocumentation: IDocumentation = {
    dataFileName: "rules.json",
    exportName: "Rule",
    globPattern: "../lib/rules/*Rule.js",
    nameMetadataKey: "ruleName",
    pageGenerator: generateRuleFile,
    subDirectory: path.join(DOCS_DIR, "rules"),
};

/**
 * Documentation definition for formatter modules.
 */
const formatterDocumentation: IDocumentation = {
    dataFileName: "formatters.json",
    exportName: "Formatter",
    globPattern: "../lib/formatters/*Formatter.js",
    nameMetadataKey: "formatterName",
    pageGenerator: generateFormatterFile,
    subDirectory: path.join(DOCS_DIR, "formatters"),
};

/**
 * Builds complete documentation.
 */
function buildDocumentation(documentation: IDocumentation) {
    // Create each module's documentation file.
    const modulePaths = glob.sync(documentation.globPattern);
    const metadataJson = modulePaths.map((modulePath: string) =>
        buildSingleModuleDocumentation(documentation, modulePath),
    );

    // Delete outdated directories
    const rulesDirs = metadataJson.map((metadata: any) => metadata[documentation.nameMetadataKey]);
    deleteOutdatedDocumentation(documentation.subDirectory, rulesDirs);

    // Create a data file with details of every module.
    buildDocumentationDataFile(documentation, metadataJson);
}

/**
 * Deletes directories which are outdated
 * @param directory Path from which outdated subdirectories have to be checked and removed
 * @param rulesDirs The names of the current and new rules documentation directories
 */
function deleteOutdatedDocumentation(directory: string, rulesDirs: string[]) {
    // find if the thing at particular location is a directory
    const isDirectory = (source: string) => fs.lstatSync(source).isDirectory();
    // get all subdirectories in source directory
    const getDirectories = (source: string) =>
        fs.readdirSync(source).filter(name => isDirectory(path.join(source, name)));

    const subDirs = getDirectories(directory);
    const outdatedDirs = subDirs.filter(dir => rulesDirs.indexOf(dir) < 0);
    outdatedDirs.forEach(outdatedDir => rimraf.sync(path.join(directory, outdatedDir)));
}

/**
 * Produces documentation for a single file/module.
 */
function buildSingleModuleDocumentation(
    documentation: IDocumentation,
    modulePath: string,
): Metadata {
    // Load the module.
    // tslint:disable-next-line:no-var-requires
    const module = require(modulePath);
    const DocumentedItem = module[documentation.exportName] as Documented;
    if (DocumentedItem !== null && DocumentedItem.metadata !== null) {
        // Build the module's page.
        const { metadata } = DocumentedItem;
        const fileData = documentation.pageGenerator(metadata);

        // Ensure a directory exists and write the module's file.
        const moduleName = (metadata as any)[documentation.nameMetadataKey];
        const fileDirectory = path.join(documentation.subDirectory, moduleName);
        if (!fs.existsSync(documentation.subDirectory)) {
            fs.mkdirSync(documentation.subDirectory);
        }
        if (!fs.existsSync(fileDirectory)) {
            fs.mkdirSync(fileDirectory);
        }
        fs.writeFileSync(path.join(fileDirectory, "index.html"), fileData);

        return metadata;
    }
}

function buildDocumentationDataFile(documentation: IDocumentation, metadataJson: any[]) {
    const dataJson = JSON.stringify(metadataJson, undefined, 2);
    fs.writeFileSync(path.join(DOCS_DIR, "_data", documentation.dataFileName), dataJson);
}

/**
 * Generates Jekyll data from any item's metadata.
 */
function generateJekyllData(metadata: any, layout: string, type: string, name: string): any {
    return {
        ...metadata,
        layout,
        title: `${type}: ${name}`,
    };
}

/**
 * Based off a rule's metadata, generates a Jekyll "HTML" file
 * that only consists of a YAML front matter block.
 */
function generateRuleFile(metadata: IRuleMetadata): string {
    if (metadata.optionExamples) {
        metadata = { ...metadata };
        metadata.optionExamples = (metadata.optionExamples as any[]).map(
            example => (typeof example === "string" ? example : stringify(example)),
        );
    }

    if (metadata.codeExamples) {
        metadata.codeExamples = metadata.codeExamples.map((example: ICodeExample) => {
            example.pass = `\`\`\`ts\n${example.pass.trim()}\n\`\`\``;
            if (example.fail) {
                example.fail = `\`\`\`ts\n${example.fail.trim()}\n\`\`\``;
            }
            example.config = `\`\`\`json\n${example.config.trim()}\n\`\`\``;
            return example;
        });
    }

    const yamlData = generateJekyllData(metadata, "rule", "Rule", metadata.ruleName);
    yamlData.optionsJSON = JSON.stringify(metadata.options, undefined, 2);
    return `---\n${yaml.safeDump(yamlData, { lineWidth: 140 } as any)}---`;
}

/**
 * Based off a formatter's metadata, generates a Jekyll "HTML" file
 * that only consists of a YAML front matter block.
 */
function generateFormatterFile(metadata: IFormatterMetadata): string {
    const yamlData = generateJekyllData(
        metadata,
        "formatter",
        "TSLint formatter",
        metadata.formatterName,
    );
    return `---\n${yaml.safeDump(yamlData, { lineWidth: 140 } as any)}---`;
}

buildDocumentation(ruleDocumentation);
buildDocumentation(formatterDocumentation);
