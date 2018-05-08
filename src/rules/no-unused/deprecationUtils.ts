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

import { getDeclarationOfBindingElement, getJsDoc } from "tsutils";
import * as ts from "typescript";
import { find } from "../../utils";

export function getSymbolDeprecation(symbol: ts.Symbol): string | undefined {
    return symbol.getJsDocTags !== undefined
        ? findDeprecationTag(symbol.getJsDocTags())
        // for compatibility with typescript@<2.3.0
        : getDeprecationFromDeclarations(symbol.declarations);
}

function getDeprecationFromDeclarations(declarations?: ReadonlyArray<ts.Declaration>): string | undefined {
    if (declarations === undefined) {
        return undefined;
    }
    let declaration: ts.Node;
    for (declaration of declarations) {
        if (ts.isBindingElement(declaration)) {
            declaration = getDeclarationOfBindingElement(declaration);
        }
        if (ts.isVariableDeclaration(declaration)) {
            declaration = declaration.parent!;
        }
        if (ts.isVariableDeclarationList(declaration)) {
            declaration = declaration.parent!;
        }
        return getDeprecationFromDeclaration(declaration);
    }
    return undefined;
}

export function getDeprecationFromDeclaration(declaration: ts.Node): string | undefined {
    for (const comment of getJsDoc(declaration)) {
        if (comment.tags === undefined) {
            continue;
        }
        for (const tag of comment.tags) {
            if (tag.tagName.text === "deprecated") {
                return tag.comment === undefined ? "" : tag.comment;
            }
        }
    }
    return undefined;
}

function findDeprecationTag(tags: ReadonlyArray<ts.JSDocTagInfo>): string | undefined {
    return find(tags, (tag) => tag.name === "deprecated" ? (tag.text === undefined ? "" : tag.text) : undefined);
}

export function getSignatureDeprecation(signature: ts.Signature | undefined): string | undefined {
    if (signature === undefined) {
        return undefined;
    }
    if (signature.getJsDocTags !== undefined) {
        return findDeprecationTag(signature.getJsDocTags());
    }
    // for compatibility with typescript@<2.3.0
    return signature.declaration === undefined ? undefined : getDeprecationFromDeclaration(signature.declaration);
}
