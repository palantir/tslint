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
import { IBlockExclusionDescriptor } from "./blockExclusion";
import { IClassExclusionDescriptor } from "./classExclusion";
import { ITagExclusionDescriptor } from "./tagExclusion";

export type ExclusionDescriptor =
    | IBlockExclusionDescriptor
    | IClassExclusionDescriptor
    | ITagExclusionDescriptor;

export type InputExclusionDescriptor = boolean | ExclusionDescriptor;

export interface IExclusionDescriptors {
    [type: string /* DocType */]: ExclusionDescriptor;
}

export type IInputExclusionDescriptors =
    | DocType
    | {
          [type: string /* DocType */]: InputExclusionDescriptor;
      };
