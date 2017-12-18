/**
 * @license
 * Copyright 2017 Palantir Technologies, Inc.
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

export const typeIsOrHasBaseType = (type: ts.Type, parentType: ts.Type) => {
    if (type.symbol === undefined || parentType.symbol === undefined) {
        return false;
    }

    const typeAndBaseTypes = [type];
    const ancestorTypes = type.getBaseTypes();

    if (ancestorTypes !== undefined) {
        typeAndBaseTypes.push(...ancestorTypes);
    }

    for (const baseType of typeAndBaseTypes) {
        if (baseType.symbol !== undefined && baseType.symbol.name === parentType.symbol.name) {
            return true;
        }
    }

    return false;
};
