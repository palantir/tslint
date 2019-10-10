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

import { DESCRIPTOR_OVERLOADS, DocType } from "../completedDocsRule";

import { BlockExclusion, IBlockExclusionDescriptor } from "./blockExclusion";
import { ClassExclusion, IClassExclusionDescriptor } from "./classExclusion";
import { ConstructorExclusion, IConstructorExclusionDescriptor } from "./constructorExclusion";
import { Exclusion } from "./exclusion";
import { IInputExclusionDescriptors, InputExclusionDescriptor } from "./exclusionDescriptors";
import { ITagExclusionDescriptor, TagExclusion } from "./tagExclusion";

export type ExclusionsMap = Map<DocType, DocTypeExclusions>;

export interface DocTypeExclusions {
    overloadsSeparateDocs?: boolean;
    requirements: Array<Exclusion<any>>;
}

export const constructExclusionsMap = (
    ruleArguments: IInputExclusionDescriptors[],
): ExclusionsMap => {
    const exclusions: ExclusionsMap = new Map();

    for (const ruleArgument of ruleArguments) {
        addRequirements(exclusions, ruleArgument);
    }

    return exclusions;
};

const addRequirements = (exclusionsMap: ExclusionsMap, descriptors: IInputExclusionDescriptors) => {
    if (typeof descriptors === "string") {
        exclusionsMap.set(descriptors, createRequirementsForDocType(descriptors, {}));
        return;
    }

    for (const docType of Object.keys(descriptors)) {
        exclusionsMap.set(
            docType as DocType,
            createRequirementsForDocType(docType as DocType, descriptors[docType]),
        );
    }
};

const createRequirementsForDocType = (docType: DocType, descriptor: InputExclusionDescriptor) => {
    const requirements = [];
    let overloadsSeparateDocs = false;

    if (typeof descriptor === "object" && DESCRIPTOR_OVERLOADS in descriptor) {
        overloadsSeparateDocs = !!(descriptor as any)[DESCRIPTOR_OVERLOADS];
    }

    switch (docType) {
        case "constructors":
            requirements.push(
                new ConstructorExclusion(descriptor as IConstructorExclusionDescriptor),
            );
            break;
        case "methods":
        case "properties":
            requirements.push(new ClassExclusion(descriptor as IClassExclusionDescriptor));
            break;
        default:
            requirements.push(new BlockExclusion(descriptor as IBlockExclusionDescriptor));
    }

    if ((descriptor as ITagExclusionDescriptor).tags !== undefined) {
        requirements.push(new TagExclusion(descriptor as ITagExclusionDescriptor));
    }

    return {
        overloadsSeparateDocs,
        requirements,
    };
};
