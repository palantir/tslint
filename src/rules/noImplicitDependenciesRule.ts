/**
 * @license
 * Copyright 2017 Palantir Technologies, Inc.
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

import * as builtins from "builtin-modules";
import * as fs from "fs";
import * as path from "path";
import { findImports, ImportKind } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

interface Options {
    dev: boolean;
    optional: boolean;
}

const OPTION_DEV = "dev";
const OPTION_OPTIONAL = "optional";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-implicit-dependencies",
        description: "Disallows importing modules that are not listed as dependency in the project's package.json",
        descriptionDetails: Lint.Utils.dedent`
            Disallows importing transient dependencies and modules installed above your package's root directory.
        `,
        optionsDescription: Lint.Utils.dedent`
            By default the rule looks at \`"dependencies"\` and \`"peerDependencies"\`.
            By adding the \`"${OPTION_DEV}"\` option the rule looks at \`"devDependencies"\` instead of \`"peerDependencies"\`.
            By adding the \`"${OPTION_OPTIONAL}"\` option the rule also looks at \`"optionalDependencies"\`.
        `,
        options: {
            type: "array",
            items: {
                type: "string",
                enum: [OPTION_DEV, OPTION_OPTIONAL],
            },
            minItems: 0,
            maxItems: 2,
        },
        optionExamples: [true, [true, OPTION_DEV], [true, OPTION_OPTIONAL]],
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_FACTORY(module: string, similarPackage?: string) {
        return similarPackage
            ? `Module '${module}' is not listed as dependency in package.json. Did you mean '${similarPackage}'?`
            : `Module '${module}' is not listed as dependency in package.json`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, {
            dev: this.ruleArguments.indexOf(OPTION_DEV) !== - 1,
            optional: this.ruleArguments.indexOf(OPTION_OPTIONAL) !== -1,
        });
    }
}

function walk(ctx: Lint.WalkContext<Options>) {
    const { options } = ctx;
    let dependencies: Set<string> | undefined;
    for (const name of findImports(ctx.sourceFile, ImportKind.All)) {
        if (!ts.isExternalModuleNameRelative(name.text)) {
            const packageName = getPackageName(name.text);
            if (builtins.indexOf(packageName) === -1 && !hasDependency(packageName)) {
                ctx.addFailureAtNode(name, Rule.FAILURE_STRING_FACTORY(packageName, findSimilarPackage(packageName)));
            }
        }
    }

    function hasDependency(module: string): boolean {
        if (dependencies === undefined) {
            dependencies = getDependencies(ctx.sourceFile.fileName, options);
        }
        return dependencies.has(module);
    }

    function findSimilarPackage(module: string): string | undefined {
        let minDifference = 2;
        let similarPackageName;
        dependencies!.forEach((dependency) => {
            const difference = sift4(module.toLowerCase(), dependency);
            if (difference <= minDifference) {
                minDifference = difference;
                similarPackageName = dependency;
            }
        });

        return similarPackageName;
    }

    // Shift4 algorithm (common version) by Costin Manda (siderite)
    // for implementation details see: https://siderite.blogspot.com/2014/11/super-fast-and-accurate-string-distance.html
    function sift4(s1: string, s2: string) {
        const maxOffset = 2;
        const l1 = s1.length;
        const l2 = s2.length;

        let c1 = 0;
        let c2 = 0;
        let lcss = 0;
        let localCs = 0;

        while ((c1 < l1) && (c2 < l2)) {
            if (s1.charAt(c1) === s2.charAt(c2)) {
                localCs++;
            } else {
                lcss += localCs;
                localCs = 0;
                if (c1 !== c2) {
                    c1 = c2 = Math.max(c1, c2);
                }
                for (let i = 0; i < maxOffset && (c1 + i < l1 || c2 + i < l2); i++) {
                    if ((c1 + i < l1) && (s1.charAt(c1 + i) === s2.charAt(c2))) {
                        c1 += i;
                        localCs++;
                        break;
                    }
                    if ((c2 + i < l2) && (s1.charAt(c1) === s2.charAt(c2 + i))) {
                        c2 += i;
                        localCs++;
                        break;
                    }
                }
            }
            c1++;
            c2++;
        }
        lcss += localCs;
        return Math.round(Math.max(l1, l2) - lcss);
    }
}

function getPackageName(name: string): string {
    const parts = name.split(/\//g);
    if (name[0] !== "@") {
        return parts[0];
    }
    return `${parts[0]}/${parts[1]}`;
}

interface Dependencies extends Object {
    [name: string]: any;
}

interface PackageJson {
    dependencies?: Dependencies;
    devDependencies?: Dependencies;
    peerDependencies?: Dependencies;
    optionalDependencies?: Dependencies;
}

function getDependencies(fileName: string, options: Options): Set<string> {
    const result = new Set<string>();
    const packageJsonPath = findPackageJson(path.resolve(path.dirname(fileName)));
    if (packageJsonPath !== undefined) {
        try {
            // don't use require here to avoid caching
            // remove BOM from file content before parsing
            const content = JSON.parse(fs.readFileSync(packageJsonPath, "utf8").replace(/^\uFEFF/, "")) as PackageJson;
            if (content.dependencies !== undefined) {
                addDependencies(result, content.dependencies);
            }
            if (!options.dev && content.peerDependencies !== undefined) {
                addDependencies(result, content.peerDependencies);
            }
            if (options.dev && content.devDependencies !== undefined) {
                addDependencies(result, content.devDependencies);
            }
            if (options.optional && content.optionalDependencies !== undefined) {
                addDependencies(result, content.optionalDependencies);
            }
        } catch {
            // treat malformed package.json files as empty
        }
    }

    return result;
}

function addDependencies(result: Set<string>, dependencies: Dependencies) {
    for (const name in dependencies) {
        if (dependencies.hasOwnProperty(name)) {
            result.add(name);
        }
    }
}

function findPackageJson(current: string): string | undefined {
    let prev: string;
    do {
        const fileName = path.join(current, "package.json");
        if (fs.existsSync(fileName)) {
            return fileName;
        }
        prev = current;
        current = path.dirname(current);
    } while (prev !== current);
    return undefined;
}
