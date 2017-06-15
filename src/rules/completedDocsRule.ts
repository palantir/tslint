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
import { hasOwnProperty } from "../utils";

export interface IBlockRequirementDescriptor {
    visibilities?: Visibility[];
}

export interface IClassRequirementDescriptor {
    locations?: Location[];
    privacies?: Privacy[];
}

export type RequirementDescriptor = IBlockRequirementDescriptor | IClassRequirementDescriptor;

export interface IRequirementDescriptors {
    [type: string /* DocType */]: RequirementDescriptor;
}

export const ALL = "all";

export const ARGUMENT_CLASSES = "classes";
export const ARGUMENT_ENUMS = "enums";
export const ARGUMENT_FUNCTIONS = "functions";
export const ARGUMENT_INTERFACES = "interfaces";
export const ARGUMENT_METHODS = "methods";
export const ARGUMENT_NAMESPACES = "namespaces";
export const ARGUMENT_PROPERTIES = "properties";
export const ARGUMENT_TYPES = "types";
export const ARGUMENT_VARIABLES = "variables";

export const DESCRIPTOR_LOCATIONS = "locations";
export const DESCRIPTOR_PRIVACIES = "privacies";
export const DESCRIPTOR_VISIBILITIES = "visibilities";

export const LOCATION_INSTANCE = "instance";
export const LOCATION_STATIC = "static";

export const PRIVACY_PRIVATE = "private";
export const PRIVACY_PROTECTED = "protected";
export const PRIVACY_PUBLIC = "public";

export const VISIBILITY_EXPORTED = "exported";
export const VISIBILITY_INTERNAL = "internal";

export type All = typeof ALL;

export type DocType = All
    | typeof ARGUMENT_CLASSES
    | typeof ARGUMENT_ENUMS
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

type BlockOrClassRequirement = BlockRequirement | ClassRequirement;

export class Rule extends Lint.Rules.TypedRule {
    public static FAILURE_STRING_EXIST = "Documentation must exist for ";

    public static defaultArguments = [
        ARGUMENT_CLASSES,
        ARGUMENT_FUNCTIONS,
        ARGUMENT_METHODS,
        ARGUMENT_PROPERTIES,
    ] as DocType[];

    public static ARGUMENT_DESCRIPTOR_BLOCK = {
        properties: {
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
            \`true\` to enable for ["${ARGUMENT_CLASSES}", "${ARGUMENT_FUNCTIONS}", "${ARGUMENT_METHODS}", "${ARGUMENT_PROPERTIES}"],
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
                * All other types may specify \`"${DESCRIPTOR_VISIBILITIES}"\`:
                    * \`"${ALL}"\`
                    * \`"${VISIBILITY_EXPORTED}"\`
                    * \`"${VISIBILITY_INTERNAL}"\`

            Types that may be enabled are:

            * \`"${ARGUMENT_CLASSES}"\`
            * \`"${ARGUMENT_ENUMS}"\`
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
                        enum: Rule.defaultArguments,
                        type: "string",
                    },
                    {
                        type: "object",
                        properties: {
                            [ARGUMENT_CLASSES]: Rule.ARGUMENT_DESCRIPTOR_BLOCK,
                            [ARGUMENT_ENUMS]: Rule.ARGUMENT_DESCRIPTOR_BLOCK,
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
                },
            ],
        ],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        const options = this.getOptions();
        const completedDocsWalker = new CompletedDocsWalker(sourceFile, options, program);

        completedDocsWalker.setRequirements(this.getRequirements(options.ruleArguments));

        return this.applyWithWalker(completedDocsWalker);
    }

    private getRequirements(ruleArguments: Array<DocType | IRequirementDescriptors>): Map<DocType, BlockOrClassRequirement> {
        if (ruleArguments.length === 0) {
            ruleArguments = Rule.defaultArguments;
        }

        return Requirement.constructRequirements(ruleArguments);
    }
}

abstract class Requirement<TDescriptor extends RequirementDescriptor> {
    public static constructRequirements(ruleArguments: Array<DocType | IRequirementDescriptors>): Map<DocType, BlockOrClassRequirement> {
        const requirements: Map<DocType, BlockOrClassRequirement> = new Map();

        for (const ruleArgument of ruleArguments) {
            Requirement.addRequirements(requirements, ruleArgument);
        }

        return requirements;
    }

    private static addRequirements(requirements: Map<DocType, BlockOrClassRequirement>, descriptor: DocType | IRequirementDescriptors) {
        if (typeof descriptor === "string") {
            requirements.set(descriptor, new BlockRequirement());
            return;
        }

        for (const type in descriptor) {
            if (hasOwnProperty(descriptor, type)) {
                requirements.set(
                    type as DocType,
                    (type === "methods" || type === "properties")
                        ? new ClassRequirement(descriptor[type] as IClassRequirementDescriptor)
                        : new BlockRequirement(descriptor[type] as IBlockRequirementDescriptor));
            }
        }
    }

    // tslint:disable-next-line no-object-literal-type-assertion
    protected constructor(public readonly descriptor: TDescriptor = {} as TDescriptor) { }

    public abstract shouldNodeBeDocumented(node: ts.Declaration): boolean;

    protected createSet<T extends All | string>(values?: T[]): Set<T> {
        if (values === undefined || values.length === 0) {
            values = [ALL as T];
        }

        return new Set(values);
    }
}

class BlockRequirement extends Requirement<IBlockRequirementDescriptor> {
    public readonly visibilities: Set<Visibility> = this.createSet(this.descriptor.visibilities);

    public shouldNodeBeDocumented(node: ts.Declaration): boolean {
        if (this.visibilities.has(ALL)) {
            return true;
        }

        if (Lint.hasModifier(node.modifiers, ts.SyntaxKind.ExportKeyword)) {
            return this.visibilities.has(VISIBILITY_EXPORTED);
        }

        return this.visibilities.has(VISIBILITY_INTERNAL);
    }
}

class ClassRequirement extends Requirement<IClassRequirementDescriptor> {
    public readonly locations: Set<Location> = this.createSet(this.descriptor.locations);
    public readonly privacies: Set<Privacy> = this.createSet(this.descriptor.privacies);

    public shouldNodeBeDocumented(node: ts.Declaration) {
        return this.shouldLocationBeDocumented(node) && this.shouldPrivacyBeDocumented(node);
    }

    private shouldLocationBeDocumented(node: ts.Declaration) {
        if (this.locations.has(ALL)) {
            return true;
        }

        if (Lint.hasModifier(node.modifiers, ts.SyntaxKind.StaticKeyword)) {
            return this.locations.has(LOCATION_STATIC);
        }

        return this.locations.has(LOCATION_INSTANCE);
    }

    private shouldPrivacyBeDocumented(node: ts.Declaration) {
        if (this.privacies.has(ALL)) {
            return true;
        }

        if (Lint.hasModifier(node.modifiers, ts.SyntaxKind.PrivateKeyword)) {
            return this.privacies.has(PRIVACY_PRIVATE);
        }

        if (Lint.hasModifier(node.modifiers, ts.SyntaxKind.ProtectedKeyword)) {
            return this.privacies.has(PRIVACY_PROTECTED);
        }

        return this.privacies.has(PRIVACY_PUBLIC);
    }
}

class CompletedDocsWalker extends Lint.ProgramAwareRuleWalker {
    private static readonly modifierAliases: { [i: string]: string } = {
        export: "exported",
    };

    private requirements: Map<DocType, BlockOrClassRequirement>;

    public setRequirements(requirements: Map<DocType, BlockOrClassRequirement>): void {
        this.requirements = requirements;
    }

    public visitClassDeclaration(node: ts.ClassDeclaration): void {
        this.checkNode(node, ARGUMENT_CLASSES);
        super.visitClassDeclaration(node);
    }

    public visitEnumDeclaration(node: ts.EnumDeclaration): void {
        this.checkNode(node, ARGUMENT_ENUMS);
        super.visitEnumDeclaration(node);
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
        this.checkNode(node, ARGUMENT_VARIABLES);
        super.visitVariableDeclaration(node);
    }

    private checkNode(node: ts.NamedDeclaration, nodeType: DocType): void {
        const { name } = node;
        if (name === undefined) {
            return;
        }

        const requirement = this.requirements.get(nodeType);
        if (requirement === undefined || !requirement.shouldNodeBeDocumented(node)) {
            return;
        }

        const symbol = this.getTypeChecker().getSymbolAtLocation(name);
        if (symbol === undefined) {
            return;
        }

        const comments = symbol.getDocumentationComment();
        this.checkComments(node, nodeType, comments);
    }

    private checkComments(node: ts.Declaration, nodeDescriptor: string, comments: ts.SymbolDisplayPart[]) {
        if (comments.map((comment: ts.SymbolDisplayPart) => comment.text).join("").trim() === "") {
            this.addDocumentationFailure(node, nodeDescriptor);
        }
    }

    private addDocumentationFailure(node: ts.Declaration, nodeType: string): void {
        const start = node.getStart();
        const width = node.getText().split(/\r|\n/g)[0].length;
        const description = this.describeDocumentationFailure(node, nodeType);

        this.addFailureAt(start, width, description);
    }

    private describeDocumentationFailure(node: ts.Declaration, nodeType: string): string {
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
}
