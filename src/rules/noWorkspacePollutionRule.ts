/**
 * @license
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

import { findImports, ImportKind } from "tsutils";
import * as ts from "typescript";
import * as Lint from "../index";

const ruleName = "no-workspace-pollution";

interface IWorkspaceOption {
    workspaceName: string;
    workspaceEntryPoint: string;
}

function throwIfNotIWorkspaceOption(input: any): input is IWorkspaceOption {
    if (!input || typeof input != "object") {
        throw new Error(`An option must be an object in the ${ruleName} rule.`);
    }
    const assumeItToBeTrue: Partial<IWorkspaceOption> = input;
    if (!assumeItToBeTrue.workspaceName || typeof assumeItToBeTrue.workspaceName !== "string") {
        throw new Error(`Missing the workspaceName string property in the ${ruleName} rule.`);
    }
    if (
        !assumeItToBeTrue.workspaceEntryPoint ||
        typeof assumeItToBeTrue.workspaceEntryPoint !== "string"
    ) {
        throw new Error(`Missing the workspaceEntryPoint string property in the ${ruleName} rule.`);
    }
    return true;
}
function throwIfPathRelationshipsAreIncorrect(workspaceNumOneDefinition: IWorkspaceOption): void {
    if (
        workspaceNumOneDefinition.workspaceName.includes("/") ||
        workspaceNumOneDefinition.workspaceName.includes("\\")
    ) {
        throw new Error(
            `workspaceName must be the name of a folder without a path (i.e. no relative paths) in the ${ruleName} rule. Please correct this: ${
                workspaceNumOneDefinition.workspaceName
            }`,
        );
    }
    if (
        workspaceNumOneDefinition.workspaceEntryPoint.includes("/") ||
        workspaceNumOneDefinition.workspaceEntryPoint.includes("\\")
    ) {
        throw new Error(
            `workspaceEntryPoint must be the name of a file without a path (i.e. no relative paths) in the ${ruleName} rule. Please correct this: ${
                workspaceNumOneDefinition.workspaceEntryPoint
            }`,
        );
    }
}

export class Rule extends Lint.Rules.AbstractRule {
    private static optionExamples: Array<true | IWorkspaceOption> = [
        true,
        {
            workspaceName: "workspaceNumOne",
            workspaceEntryPoint: "entrypoint.ts",
        },
        {
            workspaceName: "workspaceNumTwo",
            workspaceEntryPoint: "entrypoint.ts",
        },
    ];

    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: ruleName,
        description: Lint.Utils.dedent`
            Disallows importing sub modules of workspaces via \`import\` and \`require\`.
            Instead only the entrypoint (as defined in the options/configuration) can be included.`,
        rationale: Lint.Utils.dedent`
            When utilizing a monorepo, you want the convenience of having access to the various workspaces in the repo.
            However, it is not good practice to let workspaces import nested modules of the sibling workspaces as this would create a monolith that would be difficult to separate later.`,
        optionsDescription: "A list of workspace definitions.",
        options: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    workspaceName: {
                        type: "string",
                    },
                    workspaceEntryPoint: {
                        type: "string",
                    },
                },
                required: ["workspaceName", "workspaceEntryPoint"],
            },
            minLength: 1,
        },
        optionExamples: [true, Rule.optionExamples],
        type: "functionality",
        typescriptOnly: false,
    };

    public static FAILURE_STRING =
        "Only the entrypoint defined as workspaceEntryPoint is public. Importing nested files would break separation of concerns. Do not include this, or expose it via it's public entrypoint:";

    public isEnabled(): boolean {
        return super.isEnabled() && this.ruleArguments.length > 0;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, this.ruleArguments);
    }
}

function walk(ctx: Lint.WalkContext<IWorkspaceOption[]>) {
    // const errorStrArray : string[] = [];  // TODO: remove this
    const workspaceDefinitions = ctx.options;
    for (const workspaceNumOneDefinition of workspaceDefinitions) {
        throwIfNotIWorkspaceOption(workspaceNumOneDefinition);
        throwIfPathRelationshipsAreIncorrect(workspaceNumOneDefinition);
    }
    for (const anImport of findImports(ctx.sourceFile, ImportKind.All)) {
        // errorStrArray.push(`${name.text} fom within... ${ctx.sourceFile.fileName}`); // TODO: remove this

        if (isAnInternalImport(anImport.text)) {
            // If this is a sub import
            // If this is a sub import for a different workspace
            // Then ctx.addFailure
            // else (i.e. this this import is within the same workspace)
            // Then allow it becauses a workspace should have access to it's own private functions
            // Else, allow any non-nested imports of workspaces in any workspace

            const aPollutedWorkspace = getOffendingCrossWorkspaceUsage(
                anImport,
                ctx.sourceFile,
                workspaceDefinitions,
            );
            if (aPollutedWorkspace) {
                ctx.addFailure(
                    anImport.getStart(ctx.sourceFile) + 1,
                    anImport.end - 1,
                    `${Rule.FAILURE_STRING} ${aPollutedWorkspace.workspaceName}/${
                        aPollutedWorkspace.workspaceEntryPoint
                    }`,
                );
            }
        }
        if (isLernaStyledInternalWorkspace(anImport.text, workspaceDefinitions)) {
            // Do not allow sub includes from workspaces since that would be an inclusion of "private" capabilities.
            if (anImport.text.includes("/")) {
                ctx.addFailure(
                    anImport.getStart(ctx.sourceFile) + 1,
                    anImport.end - 1,
                    Rule.FAILURE_STRING,
                );
            }
        }
    }
    // throw new Error(errorStrArray.join(".\n")); // TODO: remove this
}

function isAnInternalImport(importStr: string): boolean {
    return importStr.startsWith(".") && !importStr.includes("node_modules");
}

function isLernaStyledInternalWorkspace(
    importStr: string,
    knownWorkspaces: IWorkspaceOption[],
): boolean {
    return (
        !isAnInternalImport(importStr) &&
        knownWorkspaces.some(w => importStr.includes(w.workspaceName))
    );
}

function getOffendingCrossWorkspaceUsage(
    importStr: ts.LiteralExpression,
    fileWhereTheImportOccurred: ts.SourceFile,
    knownWorkspaces: IWorkspaceOption[],
): IWorkspaceOption | null {
    // We don't know what workspace this file is in, but we can make a guess by analyzing the path of the file
    const potentialWorkspaceOfThisFile = fileWhereTheImportOccurred.fileName
        .split("/")
        .filter(aStr => !aStr.startsWith("."));
    // remove any workspaces that have been defined that might be the workspace that this file is already in.
    //      this is to allow a file to include any file within it's own workspace
    const knownWorkspacesOutsideOfThisFile = knownWorkspaces.filter(
        knownW =>
            !potentialWorkspaceOfThisFile.some(
                oneFromImport => oneFromImport === knownW.workspaceName,
            ),
    );

    const potentialMatches = knownWorkspacesOutsideOfThisFile.filter(
        (w: Readonly<IWorkspaceOption>) => {
            const entrypointMinusExtension = w.workspaceEntryPoint.substring(
                0,
                w.workspaceEntryPoint.indexOf(".ts"),
            );
            const isUsingNonPublicOfAWorkspace =
                importStr.text.includes(w.workspaceName) &&
                // but you have to still let them include the public entrypoint
                !importStr.text.endsWith(`${w.workspaceName}/${entrypointMinusExtension}`);

            return isUsingNonPublicOfAWorkspace;
        },
    );
    if (potentialMatches.length > 0) {
        // then return the first
        return potentialMatches[0];
    } else {
        return null;
    }
}
