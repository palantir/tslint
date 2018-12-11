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

import { RuleFailure } from "../rule/rule";

export interface IFormatterMetadata {
    /**
     * The name of the formatter.
     */
    formatterName: string;

    /**
     * A short, one line description of what the formatter does.
     */
    description: string;

    /**
     * More elaborate details about the formatter.
     */
    descriptionDetails?: string;

    /**
     * Sample output from the formatter.
     */
    sample: string;

    /**
     * Sample output from the formatter.
     */
    consumer: ConsumerType;
}

export type ConsumerType = "human" | "machine";

// See https://github.com/palantir/tslint/issues/4364
// TODO: Enable the `callable-types` rule below. Currently, it
// produces a lint error in several locations complaining about the
// `no-inferred-empty-object-type` rule.
export interface FormatterConstructor {
    // tslint:disable-next-line:callable-types
    new (): IFormatter;
}

export interface IFormatter {
    /**
     * Formats linter results
     * @param failures Linter failures that were not fixed
     * @param fixes Fixed linter failures. Available when the `--fix` argument is used on the command line
     */
    format(failures: RuleFailure[], fixes?: RuleFailure[]): string;
}
