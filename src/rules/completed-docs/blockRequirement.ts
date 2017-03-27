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

import * as Lint from "../../index";
import { ALL, Visibility, VISIBILITY_EXPORTED, VISIBILITY_INTERNAL } from "../completedDocsRule";
import { Requirement } from "./requirement";

export interface IBlockRequirementDescriptor {
    visibilities?: Visibility[];
}

export class BlockRequirement extends Requirement<IBlockRequirementDescriptor> {
    public readonly visibilities: Set<Visibility> = this.createSet(this.descriptor.visibilities);

    public shouldNodeBeDocumented(node: ts.Declaration): boolean {
        if (this.visibilities.has(ALL)) {
            return true;
        }

        if (Lint.hasModifier(node.modifiers, ts.SyntaxKind.ExportKeyword)) {
            return this.visibilities.has(VISIBILITY_EXPORTED);
        }

        return this.visibilities.has(VISIBILITY_INTERNAL);
    }
}
