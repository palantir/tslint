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

import { DocType } from "../completedDocsRule";
import { BlockExclusion } from "./blockExclusion";
import { ClassExclusion } from "./classExclusion";
import { Exclusion } from "./exclusion";
import { ExclusionDescriptor, IExclusionDescriptors } from "./exclusionDescriptors";
import { ITagExclusionDescriptor, TagExclusion } from "./tagExclusion";

export class ExclusionFactory {
    public constructExclusionsMap(ruleArguments: Array<DocType | IExclusionDescriptors>): Map<DocType, Array<Exclusion<any>>> {
        const exclusionsMap: Map<DocType, Array<Exclusion<any>>> = new Map();

        for (const ruleArgument of ruleArguments) {
            this.addRequirements(exclusionsMap, ruleArgument);
        }

        return exclusionsMap;
    }

    private addRequirements(requirementsMap: Map<DocType, Array<Exclusion<any>>>, descriptors: DocType | IExclusionDescriptors) {
        if (typeof descriptors === "string") {
            requirementsMap.set(descriptors, this.createRequirementsForDocType(descriptors, {}));
        } else {
            for (const docType in descriptors) {
                if (descriptors.hasOwnProperty(docType)) {
                    requirementsMap.set(docType as DocType, this.createRequirementsForDocType(docType as DocType, descriptors[docType]));
                }
            }
        }
    }

    private createRequirementsForDocType(docType: DocType, descriptor: ExclusionDescriptor) {
        const requirements = [];

        if (docType === "methods" || docType === "properties") {
            requirements.push(new ClassExclusion(descriptor));
        } else {
            requirements.push(new BlockExclusion(descriptor));
        }

        if ((descriptor as ITagExclusionDescriptor).tags) {
            requirements.push(new TagExclusion(descriptor));
        }

        return requirements;
    }
}
