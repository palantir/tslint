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

import * as ts from "typescript";

import { All, ALL } from "../completedDocsRule";

import { ExclusionDescriptor } from "./exclusionDescriptors";

export abstract class Exclusion<TDescriptor extends ExclusionDescriptor> {
    public constructor(protected readonly descriptor: Partial<TDescriptor> = {}) {}

    public abstract excludes(node: ts.Node): boolean;

    protected createSet<T extends All | string>(values?: T[]): Set<T> {
        if (values === undefined || values.length === 0) {
            values = [ALL as T];
        }

        return new Set(values);
    }
}
