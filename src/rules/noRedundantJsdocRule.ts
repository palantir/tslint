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

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-redundant-jsdoc",
        description: "Forbids JSDoc which duplicates TypeScript functionality.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "style",
        typescriptOnly: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_REDUNDANT_TYPE =
        "Type annotation in JSDoc is redundant in TypeScript code.";
    public static FAILURE_STRING_REDUNDANT_TAG(tagName: string): string {
        return `JSDoc tag '@${tagName}' is redundant in TypeScript code.`;
    }
    public static FAILURE_STRING_NO_COMMENT(tagName: string): string {
        return `'@${tagName}' is redundant in TypeScript code if it has no description.`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>): void {
    ts.forEachChild(ctx.sourceFile, function cb(node) {
        if (node.jsDoc !== undefined) {
            for (const { tags } of node.jsDoc) {
                if (tags !== undefined) {
                    for (const tag of tags) {
                        checkTag(tag);
                    }
                }
            }
        }
        ts.forEachChild(node, cb);
    });

    function checkTag(tag: ts.JSDocTag): void {
        switch (tag.kind) {
            case ts.SyntaxKind.JSDocTag:
                if (isRedundantTag(tag.tagName.text)) {
                    ctx.addFailureAtNode(tag.tagName, Rule.FAILURE_STRING_REDUNDANT_TAG(tag.tagName.text));
                }
                break;

            case ts.SyntaxKind.JSDocAugmentsTag:
                // OK
                break;

            case ts.SyntaxKind.JSDocTemplateTag:
            case ts.SyntaxKind.JSDocTypeTag:
            case ts.SyntaxKind.JSDocTypedefTag:
            case ts.SyntaxKind.JSDocPropertyTag:
                // Always redundant
                ctx.addFailureAtNode(tag.tagName, Rule.FAILURE_STRING_REDUNDANT_TAG(tag.tagName.text));
                break;

            case ts.SyntaxKind.JSDocReturnTag:
            case ts.SyntaxKind.JSDocParameterTag: {
                const { typeExpression, comment } = tag as ts.JSDocReturnTag | ts.JSDocParameterTag;
                if (typeExpression !== undefined) {
                    ctx.addFailureAtNode(typeExpression, Rule.FAILURE_STRING_REDUNDANT_TYPE);
                }
                if (comment === "") {
                    // Redundant if no documentation
                    ctx.addFailureAtNode(tag.tagName, Rule.FAILURE_STRING_NO_COMMENT(tag.tagName.text));
                }
                break;
            }

            default:
                throw new Error(`Unexpected tag kind: ${ts.SyntaxKind[tag.kind]}`);
        }
    }
}

function isRedundantTag(tagName: string): boolean {
    switch (tagName) {
        case "abstract":
        case "access":
        case "class":
        case "constant":
        case "constructs":
        case "default":
        case "enum":
        case "exports":
        case "function":
        case "global":
        case "implements":
        case "interface":
        case "instance":
        case "member":
        case "memberof":
        case "mixes":
        case "mixin":
        case "module":
        case "name":
        case "namespace":
        case "override":
        case "private":
        case "property":
        case "protected":
        case "public":
        case "readonly":
        case "requires":
        case "static":
        case "this":
            return true;
        default:
            return false;
    }
}

declare module "typescript" {
    interface Node {
        jsDoc?: ts.JSDoc[];
    }
}
