/**
 * @license
 * Copyright 2019 Palantir Technologies, Inc.
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

import { hasModifier } from "tsutils";
import * as ts from "typescript";

import {
    ALL,
    Privacy,
    PRIVACY_PRIVATE,
    PRIVACY_PROTECTED,
    PRIVACY_PUBLIC,
} from "../completedDocsRule";

import { Exclusion } from "./exclusion";

export interface IConstructorExclusionDescriptor {
    privacies?: Privacy[];
}

export class ConstructorExclusion extends Exclusion<IConstructorExclusionDescriptor> {
    public readonly privacies: Set<Privacy> = this.createSet(this.descriptor.privacies);

    public excludes(node: ts.Node) {
        return !this.shouldPrivacyBeDocumented(node);
    }

    private shouldPrivacyBeDocumented(node: ts.Node) {
        if (this.privacies.has(ALL)) {
            return true;
        }

        if (hasModifier(node.modifiers, ts.SyntaxKind.PrivateKeyword)) {
            return this.privacies.has(PRIVACY_PRIVATE);
        }

        if (hasModifier(node.modifiers, ts.SyntaxKind.ProtectedKeyword)) {
            return this.privacies.has(PRIVACY_PROTECTED);
        }

        return this.privacies.has(PRIVACY_PUBLIC);
    }
}
