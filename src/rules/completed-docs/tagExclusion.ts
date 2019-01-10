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

import { Exclusion } from "./exclusion";

export interface ITagExclusionDescriptor {
    tags?: {
        content: IContentTags;
        existence: string[];
    };
}

export interface IContentTags {
    [i: string]: string;
}

export class TagExclusion extends Exclusion<ITagExclusionDescriptor> {
    private readonly contentTags: IContentTags =
        this.descriptor.tags === undefined ? {} : this.descriptor.tags.content;

    private readonly existenceTags = new Set(
        this.descriptor.tags !== undefined && this.descriptor.tags.existence !== undefined
            ? this.descriptor.tags.existence
            : undefined,
    );

    public excludes(node: ts.Node) {
        const documentationNode = this.getDocumentationNode(node);
        const tagsWithContents = this.parseTagsWithContents(documentationNode.getFullText());

        for (const tagWithContent of tagsWithContents) {
            if (this.existenceTags.has(tagWithContent[0])) {
                return true;
            }

            const matcherBody = this.contentTags[tagWithContent[0]];
            if (matcherBody === undefined) {
                continue;
            }

            if (new RegExp(matcherBody).test(tagWithContent[1])) {
                return true;
            }
        }

        return false;
    }

    private getDocumentationNode(node: ts.Node) {
        if (node.kind === ts.SyntaxKind.VariableDeclaration) {
            return node.parent;
        }

        return node;
    }

    private parseTagsWithContents(nodeText: string | undefined): Array<[string, string]> {
        if (nodeText === undefined) {
            return [];
        }

        const docMatches = nodeText.match(/\/\*\*\s*\n?([^\*]*(\*[^\/])?)*\*\//);
        if (docMatches === null || docMatches.length === 0) {
            return [];
        }

        const lines = docMatches[0].match(/[\r\n\s]*\*\s*@.*[\r\n\s]/g);
        if (lines === null) {
            return [];
        }

        return lines.map(
            (line): [string, string] => {
                const body = line.substring(line.indexOf("@"));
                const firstSpaceIndex = body.search(/\s/);

                return [body.substring(1, firstSpaceIndex), body.substring(firstSpaceIndex).trim()];
            },
        );
    }
}
