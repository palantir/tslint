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

import * as Lint from "../index";

import { IInputExclusionDescriptors } from "./completed-docs/exclusionDescriptors";
import { ExclusionFactory, ExclusionsMap } from "./completed-docs/exclusionFactory";

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

export class Rule extends Lint.Rules.TypedRule {
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
                            [ARGUMENT_FUNCTIONS]: Rule.ARGUMENT_DESCRIPTOR_BLOCK,
                            [ARGUMENT_INTERFACES]: Rule.ARGUMENT_DESCRIPTOR_BLOCK,
                            [ARGUMENT_METHODS]: Rule.ARGUMENT_DESCRIPTOR_CLASS,
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

            Note: use this rule sparingly. It's better to have self-documenting names on components with single, consice responsibilities.
            Comments that only restate the names of variables add nothing to code, and can easily become outdated.
        `,
        type: "style",
        typescriptOnly: false,
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    private readonly exclusionFactory = new ExclusionFactory();

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        const options = this.getOptions();
        const exclusionsMap = this.getExclusionsMap(options.ruleArguments);

        return this.applyWithFunction(sourceFile, walk, exclusionsMap, program.getTypeChecker());
    }

    private getExclusionsMap(
        ruleArguments: Array<DocType | IInputExclusionDescriptors>,
    ): ExclusionsMap {
        if (ruleArguments.length === 0) {
            ruleArguments = [Rule.defaultArguments];
        }

        return this.exclusionFactory.constructExclusionsMap(ruleArguments);
    }
}

const modifierAliases: { [i: string]: string } = {
    export: "exported",
};

function walk(context: Lint.WalkContext<ExclusionsMap>, typeChecker: ts.TypeChecker) {
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
                    checkNode(node as ts.AccessorDeclaration, ARGUMENT_PROPERTIES);
                }
        }

        return ts.forEachChild(node, cb);
    }

    function checkNode(
        node: ts.NamedDeclaration,
        nodeType: DocType,
        requirementNode: ts.Node = node,
    ): void {
        const { name } = node;
        if (name === undefined) {
            return;
        }

        const exclusions = context.options.get(nodeType);
        if (exclusions === undefined) {
            return;
        }

        for (const exclusion of exclusions) {
            if (exclusion.excludes(requirementNode)) {
                return;
            }
        }

        const symbol = typeChecker.getSymbolAtLocation(name);
        if (symbol === undefined) {
            return;
        }

        const comments = symbol.getDocumentationComment(typeChecker);
        checkComments(node, describeNode(nodeType), comments, requirementNode);
    }

    function checkComments(
        node: ts.Node,
        nodeDescriptor: string,
        comments: ts.SymbolDisplayPart[],
        requirementNode: ts.Node,
    ) {
        if (
            comments
                .map((comment: ts.SymbolDisplayPart) => comment.text)
                .join("")
                .trim() === ""
        ) {
            addDocumentationFailure(node, nodeDescriptor, requirementNode);
        }
    }

    function addDocumentationFailure(
        node: ts.Node,
        nodeType: string,
        requirementNode: ts.Node,
    ): void {
        const start = node.getStart();
        const width = node.getText().split(/\r|\n/g)[0].length;
        const description = describeDocumentationFailure(requirementNode, nodeType);

        context.addFailureAt(start, width, description);
    }
}

function describeDocumentationFailure(node: ts.Node, nodeType: string): string {
    let description = Rule.FAILURE_STRING_EXIST;

    if (node.modifiers !== undefined) {
        description += `${node.modifiers
            .map(modifier => describeModifier(modifier.kind))
            .join(" ")} `;
    }

    return `${description}${nodeType}.`;
}

function describeModifier(kind: ts.SyntaxKind) {
    const description = ts.SyntaxKind[kind].toLowerCase().split("keyword")[0];
    const alias = modifierAliases[description];
    return alias !== undefined ? alias : description;
}

function describeNode(nodeType: DocType): string {
    return nodeType.replace("-", " ");
}
