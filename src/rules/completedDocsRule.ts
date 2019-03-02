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

import * as tsutils from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

import { IInputExclusionDescriptors } from "./completed-docs/exclusionDescriptors";
import { constructExclusionsMap, ExclusionsMap } from "./completed-docs/exclusionFactory";

export const ALL = "all";

export const ARGUMENT_CLASSES = "classes";
export const ARGUMENT_ENUMS = "enums";
export const ARGUMENT_ENUM_MEMBERS = "enum-members";
export const ARGUMENT_FUNCTIONS = "functions";
export const ARGUMENT_INTERFACES = "interfaces";
export const ARGUMENT_METHODS = "methods";
export const ARGUMENT_NAMESPACES = "namespaces";
export const ARGUMENT_PROPERTIES = "properties";
export const ARGUMENT_TYPES = "types";
export const ARGUMENT_VARIABLES = "variables";

export const DESCRIPTOR_TAGS = "tags";
export const DESCRIPTOR_LOCATIONS = "locations";
export const DESCRIPTOR_OVERLOADS_SEPARATE_DOCS = "overloads-separate-docs";
export const DESCRIPTOR_PRIVACIES = "privacies";
export const DESCRIPTOR_VISIBILITIES = "visibilities";

export const LOCATION_INSTANCE = "instance";
export const LOCATION_STATIC = "static";

export const PRIVACY_PRIVATE = "private";
export const PRIVACY_PROTECTED = "protected";
export const PRIVACY_PUBLIC = "public";

export const TAGS_FOR_CONTENT = "content";
export const TAGS_FOR_EXISTENCE = "existence";

export const VISIBILITY_EXPORTED = "exported";
export const VISIBILITY_INTERNAL = "internal";

export type All = typeof ALL;

export type DocType =
    | All
    | typeof ARGUMENT_CLASSES
    | typeof ARGUMENT_ENUMS
    | typeof ARGUMENT_ENUM_MEMBERS
    | typeof ARGUMENT_FUNCTIONS
    | typeof ARGUMENT_INTERFACES
    | typeof ARGUMENT_METHODS
    | typeof ARGUMENT_NAMESPACES
    | typeof ARGUMENT_PROPERTIES
    | typeof ARGUMENT_TYPES
    | typeof ARGUMENT_VARIABLES;

export type Location = All | typeof LOCATION_INSTANCE | typeof LOCATION_STATIC;

export type Privacy =
    | All
    | typeof PRIVACY_PRIVATE
    | typeof PRIVACY_PROTECTED
    | typeof PRIVACY_PUBLIC;

export type Visibility = All | typeof VISIBILITY_EXPORTED | typeof VISIBILITY_INTERNAL;

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING_EXIST = "Documentation must exist for ";

    public static defaultArguments: IInputExclusionDescriptors = {
        [ARGUMENT_CLASSES]: true,
        [ARGUMENT_FUNCTIONS]: true,
        [ARGUMENT_METHODS]: {
            [DESCRIPTOR_TAGS]: {
                [TAGS_FOR_CONTENT]: {
                    see: ".*",
                },
                [TAGS_FOR_EXISTENCE]: ["deprecated", "inheritdoc"],
            },
        },
        [ARGUMENT_PROPERTIES]: {
            [DESCRIPTOR_TAGS]: {
                [TAGS_FOR_CONTENT]: {
                    see: ".*",
                },
                [TAGS_FOR_EXISTENCE]: ["deprecated", "inheritdoc"],
            },
        },
    };

    public static ARGUMENT_DESCRIPTOR_BLOCK = {
        properties: {
            [DESCRIPTOR_TAGS]: {
                properties: {
                    [TAGS_FOR_CONTENT]: {
                        items: {
                            type: "string",
                        },
                        type: "object",
                    },
                    [TAGS_FOR_EXISTENCE]: {
                        items: {
                            type: "string",
                        },
                        type: "array",
                    },
                },
            },
            [DESCRIPTOR_VISIBILITIES]: {
                enum: [ALL, VISIBILITY_EXPORTED, VISIBILITY_INTERNAL],
                type: "string",
            },
        },
        type: "object",
    };

    public static ARGUMENT_DESCRIPTOR_CLASS = {
        properties: {
            [DESCRIPTOR_TAGS]: {
                properties: {
                    [TAGS_FOR_CONTENT]: {
                        items: {
                            type: "string",
                        },
                        type: "object",
                    },
                    [TAGS_FOR_EXISTENCE]: {
                        items: {
                            type: "string",
                        },
                        type: "array",
                    },
                },
            },
            [DESCRIPTOR_LOCATIONS]: {
                enum: [ALL, LOCATION_INSTANCE, LOCATION_STATIC],
                type: "string",
            },
            [DESCRIPTOR_PRIVACIES]: {
                enum: [ALL, PRIVACY_PRIVATE, PRIVACY_PROTECTED, PRIVACY_PUBLIC],
                type: "string",
            },
        },
        type: "object",
    };

    public static ARGUMENT_DESCRIPTOR_FUNCTION = {
        properties: {
            ...Rule.ARGUMENT_DESCRIPTOR_BLOCK.properties,
            [DESCRIPTOR_OVERLOADS_SEPARATE_DOCS]: {
                type: "boolean",
            },
        },
        type: "object",
    };

    public static ARGUMENT_DESCRIPTOR_METHOD = {
        properties: {
            ...Rule.ARGUMENT_DESCRIPTOR_CLASS.properties,
            [DESCRIPTOR_OVERLOADS_SEPARATE_DOCS]: {
                type: "boolean",
            },
        },
        type: "object",
    };

    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "completed-docs",
        description: "Enforces JSDoc comments for important items be filled out.",
        optionsDescription: Lint.Utils.dedent`
            \`true\` to enable for \`[${Object.keys(Rule.defaultArguments).join(", ")}]\`,
            or an array with each item in one of two formats:

            * \`string\` to enable for that type
            * \`object\` keying types to when their documentation is required:
                * \`"${ARGUMENT_METHODS}"\` and \`"${ARGUMENT_PROPERTIES}"\` may specify:
                    * \`"${DESCRIPTOR_PRIVACIES}"\`:
                        * \`"${ALL}"\`
                        * \`"${PRIVACY_PRIVATE}"\`
                        * \`"${PRIVACY_PROTECTED}"\`
                        * \`"${PRIVACY_PUBLIC}"\`
                    * \`"${DESCRIPTOR_LOCATIONS}"\`:
                        * \`"${ALL}"\`
                        * \`"${LOCATION_INSTANCE}"\`
                        * \`"${LOCATION_STATIC}"\`
                * Other types may specify \`"${DESCRIPTOR_VISIBILITIES}"\`:
                    * \`"${ALL}"\`
                    * \`"${VISIBILITY_EXPORTED}"\`
                    * \`"${VISIBILITY_INTERNAL}"\`
                * \`"${ARGUMENT_FUNCTIONS}"\` \`"${ARGUMENT_METHODS}"\` may also specify \`"${DESCRIPTOR_OVERLOADS_SEPARATE_DOCS}"\`
                  to indicate that each overload should have its own documentation, which is \`false\` by default.
                * All types may also provide \`"${DESCRIPTOR_TAGS}"\`
                  with members specifying tags that allow the docs to not have a body.
                    * \`"${TAGS_FOR_CONTENT}"\`: Object mapping tags to \`RegExp\` bodies content allowed to count as complete docs.
                    * \`"${TAGS_FOR_EXISTENCE}"\`: Array of tags that must only exist to count as complete docs.

            Types that may be enabled are:

            * \`"${ARGUMENT_CLASSES}"\`
            * \`"${ARGUMENT_ENUMS}"\`
            * \`"${ARGUMENT_ENUM_MEMBERS}"\`
            * \`"${ARGUMENT_FUNCTIONS}"\`
            * \`"${ARGUMENT_INTERFACES}"\`
            * \`"${ARGUMENT_METHODS}"\`
            * \`"${ARGUMENT_NAMESPACES}"\`
            * \`"${ARGUMENT_PROPERTIES}"\`
            * \`"${ARGUMENT_TYPES}"\`
            * \`"${ARGUMENT_VARIABLES}"\``,
        options: {
            type: "array",
            items: {
                anyOf: [
                    {
                        options: [
                            ARGUMENT_CLASSES,
                            ARGUMENT_ENUMS,
                            ARGUMENT_FUNCTIONS,
                            ARGUMENT_INTERFACES,
                            ARGUMENT_METHODS,
                            ARGUMENT_NAMESPACES,
                            ARGUMENT_PROPERTIES,
                            ARGUMENT_TYPES,
                            ARGUMENT_VARIABLES,
                        ],
                        type: "string",
                    },
                    {
                        type: "object",
                        properties: {
                            [ARGUMENT_CLASSES]: Rule.ARGUMENT_DESCRIPTOR_BLOCK,
                            [ARGUMENT_ENUMS]: Rule.ARGUMENT_DESCRIPTOR_BLOCK,
                            [ARGUMENT_ENUM_MEMBERS]: Rule.ARGUMENT_DESCRIPTOR_BLOCK,
                            [ARGUMENT_FUNCTIONS]: Rule.ARGUMENT_DESCRIPTOR_FUNCTION,
                            [ARGUMENT_INTERFACES]: Rule.ARGUMENT_DESCRIPTOR_BLOCK,
                            [ARGUMENT_METHODS]: Rule.ARGUMENT_DESCRIPTOR_METHOD,
                            [ARGUMENT_NAMESPACES]: Rule.ARGUMENT_DESCRIPTOR_BLOCK,
                            [ARGUMENT_PROPERTIES]: Rule.ARGUMENT_DESCRIPTOR_CLASS,
                            [ARGUMENT_TYPES]: Rule.ARGUMENT_DESCRIPTOR_BLOCK,
                            [ARGUMENT_VARIABLES]: Rule.ARGUMENT_DESCRIPTOR_BLOCK,
                        },
                    },
                ],
            },
        },
        optionExamples: [
            true,
            [true, ARGUMENT_ENUMS, ARGUMENT_FUNCTIONS, ARGUMENT_METHODS],
            [
                true,
                {
                    [ARGUMENT_ENUMS]: true,
                    [ARGUMENT_FUNCTIONS]: {
                        [DESCRIPTOR_VISIBILITIES]: [VISIBILITY_EXPORTED],
                    },
                    [ARGUMENT_METHODS]: {
                        [DESCRIPTOR_LOCATIONS]: LOCATION_INSTANCE,
                        [DESCRIPTOR_PRIVACIES]: [PRIVACY_PUBLIC, PRIVACY_PROTECTED],
                    },
                    [ARGUMENT_PROPERTIES]: {
                        [DESCRIPTOR_TAGS]: {
                            [TAGS_FOR_CONTENT]: {
                                see: ["#.*"],
                            },
                            [TAGS_FOR_EXISTENCE]: ["inheritdoc"],
                        },
                    },
                },
            ],
        ],
        rationale: Lint.Utils.dedent`
            Helps ensure important components are documented.

            Note: use this rule sparingly. It's better to have self-documenting names on components with single, concise responsibilities.
            Comments that only restate the names of variables add nothing to code, and can easily become outdated.
        `,
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const options = this.getOptions();
        const exclusionsMap = this.getExclusionsMap(options.ruleArguments);

        return this.applyWithFunction(sourceFile, walk, exclusionsMap);
    }

    private getExclusionsMap(
        ruleArguments: Array<DocType | IInputExclusionDescriptors>,
    ): ExclusionsMap {
        if (ruleArguments.length === 0) {
            ruleArguments = [Rule.defaultArguments];
        }

        return constructExclusionsMap(ruleArguments);
    }
}

const modifierAliases: { [i: string]: string } = {
    export: "exported",
};

function walk(context: Lint.WalkContext<ExclusionsMap>) {
    return ts.forEachChild(context.sourceFile, cb);

    function cb(node: ts.Node): void {
        switch (node.kind) {
            case ts.SyntaxKind.ClassDeclaration:
                checkNode(node as ts.ClassDeclaration, ARGUMENT_CLASSES);
                break;

            case ts.SyntaxKind.EnumDeclaration:
                checkNode(node as ts.EnumDeclaration, ARGUMENT_ENUMS);
                for (const member of (node as ts.EnumDeclaration).members) {
                    // Enum members don't have modifiers, so use the parent
                    // enum declaration when checking the requirements.
                    checkNode(member, ARGUMENT_ENUM_MEMBERS, node);
                }
                break;

            case ts.SyntaxKind.FunctionDeclaration:
                checkNode(node as ts.FunctionDeclaration, ARGUMENT_FUNCTIONS);
                break;

            case ts.SyntaxKind.InterfaceDeclaration:
                checkNode(node as ts.InterfaceDeclaration, ARGUMENT_INTERFACES);
                break;

            case ts.SyntaxKind.MethodSignature:
                checkNode(node as ts.MethodSignature, ARGUMENT_METHODS);
                break;

            case ts.SyntaxKind.MethodDeclaration:
                if (node.parent.kind !== ts.SyntaxKind.ObjectLiteralExpression) {
                    checkNode(node as ts.MethodDeclaration, ARGUMENT_METHODS);
                }
                break;

            case ts.SyntaxKind.ModuleDeclaration:
                checkNode(node as ts.ModuleDeclaration, ARGUMENT_NAMESPACES);
                break;

            case ts.SyntaxKind.PropertySignature:
                checkNode(node as ts.PropertySignature, ARGUMENT_PROPERTIES);
                break;

            case ts.SyntaxKind.PropertyDeclaration:
                checkNode(node as ts.PropertyDeclaration, ARGUMENT_PROPERTIES);
                break;

            case ts.SyntaxKind.TypeAliasDeclaration:
                checkNode(node as ts.TypeAliasDeclaration, ARGUMENT_TYPES);
                break;

            case ts.SyntaxKind.VariableStatement:
                // Only check variables at the namespace/module-level or file-level
                // and not variables declared inside functions and other things.
                switch (node.parent.kind) {
                    case ts.SyntaxKind.SourceFile:
                    case ts.SyntaxKind.ModuleBlock:
                        for (const declaration of (node as ts.VariableStatement).declarationList
                            .declarations) {
                            checkNode(declaration, ARGUMENT_VARIABLES, node);
                        }
                }
                break;

            case ts.SyntaxKind.GetAccessor:
            case ts.SyntaxKind.SetAccessor:
                if (node.parent.kind !== ts.SyntaxKind.ObjectLiteralExpression) {
                    checkAccessorNode(node as ts.AccessorDeclaration, ARGUMENT_PROPERTIES);
                }
        }

        return ts.forEachChild(node, cb);
    }

    function checkNode(
        node: ts.NamedDeclaration,
        docType: DocType,
        requirementNode: ts.Node = node,
    ): void {
        if (!nodeIsExcluded(node, docType, requirementNode) && !nodeHasDocs(node, docType)) {
            addDocumentationFailure(node, describeDocType(docType), requirementNode);
        }
    }

    function checkAccessorNode(node: ts.AccessorDeclaration, docType: DocType): void {
        if (nodeIsExcluded(node, ARGUMENT_PROPERTIES, node) || nodeHasDocs(node, docType)) {
            return;
        }

        const correspondingAccessor = getCorrespondingAccessor(node);

        if (correspondingAccessor === undefined || !nodeHasDocs(correspondingAccessor, docType)) {
            addDocumentationFailure(node, ARGUMENT_PROPERTIES, node);
        }
    }

    function nodeIsExcluded(
        node: ts.NamedDeclaration,
        docType: DocType,
        requirementNode: ts.Node,
    ): boolean {
        const { name } = node;
        if (name === undefined) {
            return true;
        }

        const exclusions = context.options.get(docType);
        if (exclusions === undefined) {
            return true;
        }

        for (const requirement of exclusions.requirements) {
            if (requirement.excludes(requirementNode)) {
                return true;
            }
        }

        return false;
    }

    function nodeHasDocs(node: ts.Node, docType: DocType): boolean {
        const docs = getApparentJsDoc(node, docType, context.sourceFile);
        if (docs === undefined) {
            return false;
        }

        const comments = docs
            .map(doc => doc.comment)
            .filter(comment => comment !== undefined && comment.trim() !== "");

        return comments.length !== 0;
    }

    /**
     * @see https://github.com/ajafff/tsutils/issues/16
     */
    function getApparentJsDoc(
        node: ts.Node,
        docType: DocType,
        sourceFile: ts.SourceFile,
    ): ts.JSDoc[] | undefined {
        if (ts.isVariableDeclaration(node)) {
            if (variableIsAfterFirstInDeclarationList(node)) {
                return undefined;
            }

            node = node.parent;
        }

        if (ts.isVariableDeclarationList(node)) {
            node = node.parent;
        }

        const equivalentNodesForDocs: ts.Node[] = getEquivalentNodesForDocs(node, docType);

        return equivalentNodesForDocs
            .map(docsNode => tsutils.getJsDoc(docsNode, sourceFile))
            .filter(nodeDocs => nodeDocs !== undefined)
            .reduce((docs, moreDocs) => [...docs, ...moreDocs], []);
    }

    /**
     * @see https://github.com/palantir/tslint/issues/4416
     */
    function getEquivalentNodesForDocs(node: ts.Node, docType: DocType): ts.Node[] {
        const exclusions = context.options.get(docType);
        if (exclusions === undefined || exclusions.overloadsSeparateDocs) {
            return [node];
        }

        if (tsutils.isFunctionDeclaration(node) && node.name !== undefined) {
            const functionName = node.name.text;

            return getSiblings(node).filter(
                child =>
                    tsutils.isFunctionDeclaration(child) &&
                    child.name !== undefined &&
                    child.name.text === functionName,
            );
        }

        if (
            tsutils.isMethodDeclaration(node) &&
            tsutils.isIdentifier(node.name) &&
            tsutils.isClassDeclaration(node.parent)
        ) {
            const methodName = node.name.text;

            return node.parent.members.filter(
                member =>
                    tsutils.isMethodDeclaration(member) &&
                    tsutils.isIdentifier(member.name) &&
                    member.name.text === methodName,
            );
        }

        return [node];
    }

    function addDocumentationFailure(
        node: ts.Node,
        docType: string,
        requirementNode: ts.Node,
    ): void {
        const start = node.getStart();
        const width = node.getText().split(/\r|\n/g)[0].length;
        const description = describeDocumentationFailure(requirementNode, docType);

        context.addFailureAt(start, width, description);
    }
}

function getCorrespondingAccessor(node: ts.AccessorDeclaration) {
    const propertyName = tsutils.getPropertyName(node.name);
    if (propertyName === undefined) {
        return undefined;
    }

    const parent = node.parent as ts.ClassDeclaration | ts.ClassExpression;
    const correspondingKindCheck =
        node.kind === ts.SyntaxKind.GetAccessor ? isSetAccessor : isGetAccessor;

    for (const member of parent.members) {
        if (!correspondingKindCheck(member)) {
            continue;
        }

        if (tsutils.getPropertyName(member.name) === propertyName) {
            return member;
        }
    }

    return undefined;
}

function variableIsAfterFirstInDeclarationList(node: ts.VariableDeclaration): boolean {
    const parent = node.parent;
    if (parent === undefined) {
        return false;
    }

    return ts.isVariableDeclarationList(parent) && node !== parent.declarations[0];
}

function describeDocumentationFailure(node: ts.Node, docType: string): string {
    let description = Rule.FAILURE_STRING_EXIST;

    if (node.modifiers !== undefined) {
        description += `${node.modifiers
            .map(modifier => describeModifier(modifier.kind))
            .join(" ")} `;
    }

    return `${description}${docType}.`;
}

function describeModifier(kind: ts.SyntaxKind) {
    const description = ts.SyntaxKind[kind].toLowerCase().split("keyword")[0];
    const alias = modifierAliases[description];
    return alias !== undefined ? alias : description;
}

function describeDocType(docType: DocType): string {
    return docType.replace("-", " ");
}

function getSiblings(node: ts.Node) {
    const { parent } = node;

    // Source files nest their statements within a node for getChildren()
    if (ts.isSourceFile(parent)) {
        return [...parent.statements];
    }

    return parent.getChildren()!;
}

function isGetAccessor(node: ts.Node): node is ts.GetAccessorDeclaration {
    return node.kind === ts.SyntaxKind.GetAccessor;
}

function isSetAccessor(node: ts.Node): node is ts.SetAccessorDeclaration {
    return node.kind === ts.SyntaxKind.SetAccessor;
}
