/**
 * @license
 * Copyright 2018 Palantir Technologies, Inc.
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

import assert = require("assert");
import * as ts from "typescript";

import { ancestorWhere, getEqualsKind } from "../..";

export const enum EnumUse {
    // tslint:disable no-bitwise
    None = 0,
    Tested = 1 << 0,
    UsedInExpression = 1 << 1,
    // tslint:enable no-bitwise
}

export function hasEnumUse(a: EnumUse, b: EnumUse): boolean {
    return (a & b) !== EnumUse.None; // tslint:disable-line no-bitwise
}

export function getEnumUse(node: ts.Identifier): EnumUse {
    const parent = node.parent!;
    if (ts.isPropertyAccessExpression(parent)) {
        return flagsForPropertyAccess(parent.parent!);
    } else {
        // The only place where an enum member can appear unqualified is inside the enum itself.
        // Don't count uses inside the enum itself as uses because that implies that the individual flag is never used.
        assert(ts.isEnumMember(parent) || ts.isQualifiedName(parent) || ancestorWhere(parent, ts.isEnumMember) !== undefined);
        return EnumUse.None;
    }
}

function flagsForPropertyAccess(parent: ts.Node): EnumUse {
    switch (parent.kind) {
        case ts.SyntaxKind.CaseClause:
            return EnumUse.Tested;
        case ts.SyntaxKind.BinaryExpression:
            return getEqualsKind((parent as ts.BinaryExpression).operatorToken) !== undefined
                ? EnumUse.Tested
                : EnumUse.UsedInExpression;
        default:
            return EnumUse.UsedInExpression;
    }
}
