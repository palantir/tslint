/**
 * @license
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

import {
    findImports,
    ImportKind,
    isExportDeclaration,
    isImportDeclaration,
    isNamedImports,
} from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "import-blacklist",
        description: Lint.Utils.dedent`
            Disallows importing the specified modules via \`import\` and \`require\`,
            or importing specific named exports of the specified modules,
            or using imports matching specified regular expression patterns.`,
        rationale: Lint.Utils.dedent`
            For some libraries, importing the library directly can cause unused
            submodules to be loaded, so you may want to block these imports and
            require that users directly import only the submodules they need.
            In other cases, you may simply want to ban an import because using
            it is undesirable or unsafe.`,
        optionsDescription:
            "A list of blacklisted modules, named imports, or regular expression patterns.",
        options: {
            type: "array",
            items: {
                oneOf: [
                    {
                        type: "string",
                        minLength: 1,
                    },
                    {
                        type: "object",
                        additionalProperties: {
                            type: "array",
                            minItems: 1,
                            items: {
                                type: "string",
                                minLength: 1,
                            },
                        },
                    },
                    {
                        type: "array",
                        items: {
                            type: "string",
                        },
                        minLength: 1,
                    },
                ],
            },
        },
        optionExamples: [
            true,
            [true, "rxjs", "lodash"],
            [true, "lodash", { lodash: ["pull", "pullAll"] }],
            [true, "rxjs", { lodash: ["pull", "pullAll"] }, [".*\\.temp$", ".*\\.tmp$"]],
        ],
        type: "functionality",
        typescriptOnly: false,
    };

    public static WHOLE_MODULE_FAILURE_STRING =
        "Importing this module is blacklisted. Try importing a submodule instead.";

    public static IMPLICIT_NAMED_IMPORT_FAILURE_STRING =
        "Some named exports from this module are blacklisted for importing " +
        "(or re-exporting). Import/re-export only the specific values you want, " +
        "instead of the whole module.";

    public static FAILURE_STRING_REGEX = "This import is blacklisted by ";

    public static MAKE_NAMED_IMPORT_FAILURE_STRING(importName: string) {
        return importName === "default"
            ? "Importing (or re-exporting) the default export is blacklisted."
            : `The export "${importName}" is blacklisted.`;
    }

    public isEnabled(): boolean {
        return super.isEnabled() && this.ruleArguments.length > 0;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, this.ruleArguments);
    }
}

type Options = Array<string | { [moduleName: string]: string[] } | string[]>;

function walk(ctx: Lint.WalkContext<Options>) {
    interface BannedImports {
        [moduleName: string]: true | Set<string>;
    }

    // Merge/normalize options.
    // E.g., ["a", { "b": ["c"], "d": ["e", "e"] }, "f", { "f": ["g"] }]
    // becomes { "a": true, "b": Set(["c"]), "d": Set(["e"]), "f": true }.
    const bannedImports = ctx.options.reduce<BannedImports>(
        (acc, it) => {
            if (typeof it === "string") {
                acc[it] = true;
            } else if (!Array.isArray(it)) {
                Object.keys(it).forEach(moduleName => {
                    if (acc[moduleName] instanceof Set) {
                        it[moduleName].forEach(bannedImport => {
                            (acc[moduleName] as Set<string>).add(bannedImport);
                        });
                    } else if (acc[moduleName] !== true) {
                        acc[moduleName] = new Set(it[moduleName]);
                    }
                });
            }
            return acc;
        },
        Object.create(null) as BannedImports,
    );

    const regexOptions = [];
    for (const option of ctx.options) {
        if (Array.isArray(option)) {
            for (const pattern of option) {
                regexOptions.push(RegExp(pattern));
            }
        }
    }

    for (const name of findImports(ctx.sourceFile, ImportKind.All)) {
        // TODO #3963: Resolve/normalize relative file imports to a canonical path?
        const importedModule = name.text;
        const bansForModule = bannedImports[importedModule];

        // Check if at least some imports from this module are banned.
        if (bansForModule !== undefined) {
            // If importing this module is totally banned, we can error now,
            // without determining whether the user is importing the whole
            // module or named exports.
            if (bansForModule === true) {
                ctx.addFailure(
                    name.getStart(ctx.sourceFile) + 1,
                    name.end - 1,
                    Rule.WHOLE_MODULE_FAILURE_STRING,
                );
                continue;
            }

            // Otherwise, find the named imports, if any, and fail if the
            // user tried to import any of them. We don't have named imports
            // when the user is importing the whole module, which includes:
            //
            // - ImportKind.Require (i.e., `require('module-specifier')`),
            // - ImportKind.DynamicImport (i.e., `import("module-specifier")`),
            // - ImportKind.ImportEquals (i.e., `import x = require()`),
            // - and ImportKind.ImportDeclaration, where there's a full namespace
            //   import (i.e. `import * as x from "module-specifier"`)
            //
            // However, namedImports will be an array when we have one of the
            // various permutations of `import x, { a, b as c } from "y"`.
            //
            // We treat re-exports from other modules the same as attempting to
            // import the re-exported binding(s), as the re-export is essentially
            // an import followed by an export, and not treating these as an
            // import would allow backdoor imports of the banned bindings. So,
            // our last case is `ImportKind.ExportFrom`, and for that:
            //
            // - `export nameForDefault from "module"` isn't part of the ESM
            // syntax (yet), so we only have to handle two cases below:
            // `export { x } from "y"` and `export * from "specifier"`.
            const parentNode = name.parent;

            // Disable strict-boolean-expressions for the next few lines so our &&
            // checks can help type inference figure out if when don't have undefined.
            // tslint:disable strict-boolean-expressions

            const importClause =
                parentNode && isImportDeclaration(parentNode) ? parentNode.importClause : undefined;

            const importsDefaultExport = importClause && Boolean(importClause.name);

            // Below, check isNamedImports to rule out the
            // `import * as ns from "..."` case.
            const importsSpecificNamedExports =
                importClause &&
                importClause.namedBindings &&
                isNamedImports(importClause.namedBindings);

            // If parentNode is an ExportDeclaration, it must represent an
            // `export from`, as findImports verifies that. Then, if exportClause
            // is undefined, we're dealing with `export * from ...`.
            const reExportsSpecificNamedExports =
                parentNode && isExportDeclaration(parentNode) && Boolean(parentNode.exportClause);

            // tslint:enable strict-boolean-expressions

            if (
                importsDefaultExport ||
                importsSpecificNamedExports ||
                reExportsSpecificNamedExports
            ) {
                // Add an import for the default import and any named bindings.
                // For the named bindings, we use the name of the export from the
                // module (i.e., .propertyName) over its alias in the import when
                // the two diverge.
                const toExportName = (it: ts.ImportSpecifier | ts.ExportSpecifier) =>
                    (it.propertyName || it.name).text; // tslint:disable-line strict-boolean-expressions

                const exportClause = reExportsSpecificNamedExports
                    ? (parentNode as ts.ExportDeclaration).exportClause!
                    : undefined;

                const namedImportsOrReExports = [
                    ...(importsDefaultExport ? ["default"] : []),
                    ...(importsSpecificNamedExports
                        ? (importClause!.namedBindings as ts.NamedImports).elements.map(
                              toExportName,
                          )
                        : []),
                    ...(exportClause !== undefined ? exportClause.elements.map(toExportName) : []),
                ];

                for (const importName of namedImportsOrReExports) {
                    if (bansForModule.has(importName)) {
                        ctx.addFailureAtNode(
                            exportClause !== undefined ? exportClause : importClause!,
                            Rule.MAKE_NAMED_IMPORT_FAILURE_STRING(importName),
                        );
                    }
                }
            } else {
                // If we're here, the user tried to import/re-export the whole module
                ctx.addFailure(
                    name.getStart(ctx.sourceFile) + 1,
                    name.end - 1,
                    Rule.IMPLICIT_NAMED_IMPORT_FAILURE_STRING,
                );
            }
        }

        for (const regex of regexOptions) {
            if (regex.test(name.text)) {
                ctx.addFailure(
                    name.getStart(ctx.sourceFile) + 1,
                    name.end - 1,
                    Rule.FAILURE_STRING_REGEX + regex.toString(),
                );
            }
        }
    }
}
