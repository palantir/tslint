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

import { hasOwnProperty } from "../../utils";
import { DocType } from "../completedDocsRule";

import { BlockExclusion, IBlockExclusionDescriptor } from "./blockExclusion";
import { ClassExclusion, IClassExclusionDescriptor } from "./classExclusion";
import { Exclusion } from "./exclusion";
import { IInputExclusionDescriptors, InputExclusionDescriptor } from "./exclusionDescriptors";
import { ITagExclusionDescriptor, TagExclusion } from "./tagExclusion";

export type ExclusionsMap = Map<DocType, Array<Exclusion<any>>>;

export class ExclusionFactory {
    public constructExclusionsMap(ruleArguments: IInputExclusionDescriptors[]): ExclusionsMap {
        const exclusionsMap: ExclusionsMap = new Map();

        for (const ruleArgument of ruleArguments) {
            this.addRequirements(exclusionsMap, ruleArgument);
        }

        return exclusionsMap;
    }

    private addRequirements(exclusionsMap: ExclusionsMap, descriptors: IInputExclusionDescriptors) {
        if (typeof descriptors === "string") {
            exclusionsMap.set(descriptors, this.createRequirementsForDocType(descriptors, {}));
            return;
        }

        for (const docType in descriptors) {
            if (hasOwnProperty(descriptors, docType)) {
                exclusionsMap.set(
                    docType as DocType,
                    this.createRequirementsForDocType(docType as DocType, descriptors[docType]),
                );
            }
        }
    }

    private createRequirementsForDocType(docType: DocType, descriptor: InputExclusionDescriptor) {
        const requirements = [];

        if (docType === "methods" || docType === "properties") {
            requirements.push(new ClassExclusion(descriptor as IClassExclusionDescriptor));
        } else {
            requirements.push(new BlockExclusion(descriptor as IBlockExclusionDescriptor));
        }

        if ((descriptor as ITagExclusionDescriptor).tags !== undefined) {
            requirements.push(new TagExclusion(descriptor as ITagExclusionDescriptor));
        }

        return requirements;
    }
}
