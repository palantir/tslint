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

import { IConfigurationFile } from "./configuration";
import { doNonTypedLinting } from "./doLinting";
import { ILinterOptions, LintResult } from "./index";
import { Logger } from "./logger";

export type WorkerLintResult = Pick<LintResult, "output" | "errorCount">;

export interface WorkerData {
    files: string[];
    configFile: IConfigurationFile | undefined;
    linterOptions: ILinterOptions;
}

async function doLint(
    files: string[],
    configFile: IConfigurationFile | undefined,
    linterOptions: ILinterOptions,
): Promise<WorkerLintResult> {
    const logger: Logger = {
        error: () => {
            // TODO: what we need to do here?
        },
        log: () => {
            // TODO: what we need to do here?
        },
    };

    const lintResult = await doNonTypedLinting(files, configFile, linterOptions, logger);
    return {
        errorCount: lintResult.errorCount,
        output: lintResult.output,
    };
}

process.on("message", async (data: WorkerData) => {
    if (process.send === undefined) {
        console.error("Worker cannot send result. Execution is skipped");
        return;
    }

    const result = await doLint(data.files, data.configFile, data.linterOptions);
    process.send(result);
    process.exit(0);
});
