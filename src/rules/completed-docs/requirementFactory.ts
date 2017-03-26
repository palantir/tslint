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
import { BlockRequirement } from "./blockRequirement";
import { ClassRequirement } from "./classRequirement";
import { BlockOrClassRequirement, IRequirementDescriptors } from "./requirementDescriptors";

export class RequirementFactory {
    public constructRequirements(ruleArguments: Array<DocType | IRequirementDescriptors>): Map<DocType, BlockOrClassRequirement> {
        const requirements: Map<DocType, BlockOrClassRequirement> = new Map();

        for (const ruleArgument of ruleArguments) {
            this.addRequirements(requirements, ruleArgument);
        }

        return requirements;
    }

    private addRequirements(requirements: Map<DocType, BlockOrClassRequirement>, descriptor: DocType | IRequirementDescriptors) {
        if (typeof descriptor === "string") {
            requirements.set(descriptor, new BlockRequirement());
            return;
        }

        for (const type in descriptor) {
            if (descriptor.hasOwnProperty(type)) {
                requirements.set(
                    type as DocType,
                    (type === "methods" || type === "properties")
                        ? new ClassRequirement(descriptor[type])
                        : new BlockRequirement(descriptor[type]));
            }
        }
    }
}
