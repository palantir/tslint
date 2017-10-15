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
}

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-implicit-dependencies",
        description: "Disallows importing dependencies that are not specified in package.json",
        rationale: "bla bla",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_FACTORY(module: string) {
        return `Add ${module} to your package.json`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, {
            dev: this.ruleArguments[0] === "dev",
        });
    }
}

function walk(ctx: Lint.WalkContext<Options>) {
    let dependencies: Set<string> | undefined;
    for (const name of findImports(ctx.sourceFile, ImportKind.All)) {
        if (!ts.isExternalModuleNameRelative(name.text)) {
            const packageName = getPackageName(name.text);
            if (builtins.indexOf(packageName) === -1 && !hasDependency(packageName)) {
                ctx.addFailureAtNode(name, Rule.FAILURE_STRING_FACTORY(name.text));
            }
        }
    }

    function hasDependency(module: string): boolean {
        if (dependencies === undefined) {
            dependencies = getDependencies(ctx.sourceFile.fileName, ctx.options.dev);
        }
        return dependencies.has(module);
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
}

function getDependencies(fileName: string, dev: boolean): Set<string> {
    const result = new Set<string>();
    const packageJsonPath = findPackageJson(path.resolve(path.dirname(fileName)));
    if (packageJsonPath !== undefined) {
        const content = JSON.parse(fs.readFileSync(packageJsonPath, "utf8")) as PackageJson;
        if (content.dependencies !== undefined) {
            addDependencies(result, content.dependencies);
        }
        if (!dev && content.peerDependencies !== undefined) {
            addDependencies(result, content.peerDependencies);
        }
        if (dev && content.devDependencies !== undefined) {
            addDependencies(result, content.devDependencies);
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
