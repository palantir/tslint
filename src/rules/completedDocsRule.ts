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

import { isVariableDeclarationList, isVariableStatement } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";
import { Exclusion } from "./completed-docs/exclusion";
import { IInputExclusionDescriptors } from "./completed-docs/exclusionDescriptors";
import { ExclusionFactory } from "./completed-docs/exclusionFactory";

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
export const TAGS_FOR_EXISTENCE = "exists";

export const VISIBILITY_EXPORTED = "exported";
export const VISIBILITY_INTERNAL = "internal";

export type All = typeof ALL;

export type DocType = All
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

export type Location = All
    | typeof LOCATION_INSTANCE
    | typeof LOCATION_STATIC;

export type Privacy = All
    | typeof PRIVACY_PRIVATE
    | typeof PRIVACY_PROTECTED
    | typeof PRIVACY_PUBLIC;

export type Visibility = All
    | typeof VISIBILITY_EXPORTED
    | typeof VISIBILITY_INTERNAL;

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
                [TAGS_FOR_EXISTENCE]: [
                    "deprecated",
                    "inheritdoc",
                ],
            },
        },
        [ARGUMENT_PROPERTIES]: {
            [DESCRIPTOR_TAGS]: {
                [TAGS_FOR_CONTENT]: {
                    see: ".*",
                },
                [TAGS_FOR_EXISTENCE]: [
                    "deprecated",
                    "inheritdoc",
                ],
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
                enum: [
                    ALL,
                    VISIBILITY_EXPORTED,
                    VISIBILITY_INTERNAL,
                ],
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
                enum: [
                    ALL,
                    LOCATION_INSTANCE,
                    LOCATION_STATIC,
                ],
                type: "string",
            },
            [DESCRIPTOR_PRIVACIES]: {
                enum: [
                    ALL,
                    PRIVACY_PRIVATE,
                    PRIVACY_PROTECTED,
                    PRIVACY_PUBLIC,
                ],
                type: "string",
            },
        },
        type: "object",
    };

    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "completed-docs",
        description: "Enforces documentation for important items be filled out.",
        optionsDescription: Lint.Utils.dedent`
            \`true\` to enable for [${Object.keys(Rule.defaultArguments).join(", ")}]],
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
                    [DESCRIPTOR_TAGS]: {
                        [TAGS_FOR_CONTENT]: {
                            see: ["#.*"],
                        },
                        [TAGS_FOR_EXISTENCE]: ["inheritdoc"],
                    },
                },
            ],
        ],

        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    private readonly exclusionFactory = new ExclusionFactory();

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        const options = this.getOptions();
        const completedDocsWalker = new CompletedDocsWalker(sourceFile, options, program);

        completedDocsWalker.setExclusionsMap(this.getExclusionsMap(options.ruleArguments));

        return this.applyWithWalker(completedDocsWalker);
    }

    private getExclusionsMap(ruleArguments: Array<DocType | IInputExclusionDescriptors>): Map<DocType, Array<Exclusion<any>>> {
        if (ruleArguments.length === 0) {
            ruleArguments = [Rule.defaultArguments];
        }

        return this.exclusionFactory.constructExclusionsMap(ruleArguments);
    }
}

class CompletedDocsWalker extends Lint.ProgramAwareRuleWalker {
    private static modifierAliases: { [i: string]: string } = {
        export: "exported",
    };

    private exclusionsMap: Map<DocType, Array<Exclusion<any>>>;

    public setExclusionsMap(exclusionsMap: Map<DocType, Array<Exclusion<any>>>): void {
        this.exclusionsMap = exclusionsMap;
    }

    public visitClassDeclaration(node: ts.ClassDeclaration): void {
        this.checkNode(node, ARGUMENT_CLASSES);
        super.visitClassDeclaration(node);
    }

    public visitEnumDeclaration(node: ts.EnumDeclaration): void {
        this.checkNode(node, ARGUMENT_ENUMS);
        super.visitEnumDeclaration(node);
    }

    public visitEnumMember(node: ts.EnumMember): void {
        // Enum members don't have modifiers, so use the parent
        // enum declaration when checking the requirements.
        this.checkNode(node, ARGUMENT_ENUM_MEMBERS, node.parent);
        super.visitEnumMember(node);
    }

    public visitFunctionDeclaration(node: ts.FunctionDeclaration): void {
        this.checkNode(node, ARGUMENT_FUNCTIONS);
        super.visitFunctionDeclaration(node);
    }

    public visitInterfaceDeclaration(node: ts.InterfaceDeclaration): void {
        this.checkNode(node, ARGUMENT_INTERFACES);
        super.visitInterfaceDeclaration(node);
    }

    public visitMethodDeclaration(node: ts.MethodDeclaration): void {
        this.checkNode(node, ARGUMENT_METHODS);
        super.visitMethodDeclaration(node);
    }

    public visitModuleDeclaration(node: ts.ModuleDeclaration): void {
        this.checkNode(node, ARGUMENT_NAMESPACES);
        super.visitModuleDeclaration(node);
    }

    public visitPropertyDeclaration(node: ts.PropertyDeclaration): void {
        this.checkNode(node, ARGUMENT_PROPERTIES);
        super.visitPropertyDeclaration(node);
    }

    public visitTypeAliasDeclaration(node: ts.TypeAliasDeclaration): void {
        this.checkNode(node, ARGUMENT_TYPES);
        super.visitTypeAliasDeclaration(node);
    }

    public visitVariableDeclaration(node: ts.VariableDeclaration): void {
        this.checkVariable(node);
        super.visitVariableDeclaration(node);
    }

    private checkNode(node: ts.NamedDeclaration, nodeType: DocType, requirementNode: ts.Node = node): void {
        const { name } = node;
        if (name === undefined) {
            return;
        }

        const exclusions = this.exclusionsMap.get(nodeType);
        if (exclusions === undefined) {
            return;
        }

        for (const exclusion of exclusions) {
            if (exclusion.excludes(requirementNode)) {
                return;
            }
        }

        const symbol = this.getTypeChecker().getSymbolAtLocation(name);
        if (symbol === undefined) {
            return;
        }

        const comments = symbol.getDocumentationComment();
        this.checkComments(node, this.describeNode(nodeType), comments, requirementNode);
    }

    private checkVariable(node: ts.VariableDeclaration) {
        // Only check variables in variable declaration lists
        // and not variables in catch clauses and for loops.
        const list = node.parent!;
        if (!isVariableDeclarationList(list)) {
            return;
        }

        const statement = list.parent!;
        if (!isVariableStatement(statement)) {
            return;
        }

        // Only check variables at the namespace/module-level or file-level
        // and not variables declared inside functions and other things.
        switch (statement.parent!.kind) {
            case ts.SyntaxKind.SourceFile:
            case ts.SyntaxKind.ModuleBlock:
                this.checkNode(node, ARGUMENT_VARIABLES, statement);
        }
    }

    private checkComments(node: ts.Node, nodeDescriptor: string, comments: ts.SymbolDisplayPart[], requirementNode: ts.Node) {
        if (comments.map((comment: ts.SymbolDisplayPart) => comment.text).join("").trim() === "") {
            this.addDocumentationFailure(node, nodeDescriptor, requirementNode);
        }
    }

    private addDocumentationFailure(node: ts.Node, nodeType: string, requirementNode: ts.Node): void {
        const start = node.getStart();
        const width = node.getText().split(/\r|\n/g)[0].length;
        const description = this.describeDocumentationFailure(requirementNode, nodeType);

        this.addFailureAt(start, width, description);
    }

    private describeDocumentationFailure(node: ts.Node, nodeType: string): string {
        let description = Rule.FAILURE_STRING_EXIST;

        if (node.modifiers !== undefined) {
            description += `${node.modifiers.map((modifier) => this.describeModifier(modifier.kind)).join(",")} `;
        }

        return `${description}${nodeType}.`;
    }

    private describeModifier(kind: ts.SyntaxKind) {
        const description = ts.SyntaxKind[kind].toLowerCase().split("keyword")[0];
        const alias = CompletedDocsWalker.modifierAliases[description];
        return alias !== undefined ? alias : description;
    }

    private describeNode(nodeType: DocType): string {
        return nodeType.replace("-", " ");
    }
}
