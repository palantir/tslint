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

/* start old options */
const OPTION_VARIABLES_BEFORE_FUNCTIONS = "variables-before-functions";
const OPTION_STATIC_BEFORE_INSTANCE = "static-before-instance";
const OPTION_PUBLIC_BEFORE_PRIVATE = "public-before-private";
/* end old options */

/* start new options */
const OPTION_ORDER = "order";
const PRESET_ORDERS: { [preset: string]: string[] } = {
    "fields-first": [
        "public-static-field",
        "protected-static-field",
        "private-static-field",
        "public-instance-field",
        "protected-instance-field",
        "private-instance-field",
        "constructor",
        "public-static-method",
        "protected-static-method",
        "private-static-method",
        "public-instance-method",
        "protected-instance-method",
        "private-instance-method",
    ],
    "instance-sandwich": [
        "public-static-field",
        "protected-static-field",
        "private-static-field",
        "public-instance-field",
        "protected-instance-field",
        "private-instance-field",
        "constructor",
        "public-instance-method",
        "protected-instance-method",
        "private-instance-method",
        "public-static-method",
        "protected-static-method",
        "private-static-method",
    ],
    "statics-first": [
        "public-static-field",
        "public-static-method",
        "protected-static-field",
        "protected-static-method",
        "private-static-field",
        "private-static-method",
        "public-instance-field",
        "protected-instance-field",
        "private-instance-field",
        "constructor",
        "public-instance-method",
        "protected-instance-method",
        "private-instance-method",
    ],
};
/* end new options */

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "member-ordering",
        description: "Enforces member ordering.",
        rationale: "A consistent ordering for class members can make classes easier to read, navigate, and edit.",
        optionsDescription: Lint.Utils.dedent`
            One argument, which is an object, must be provided. It should contain an \`order\` property.
            The \`order\` property should have a value of one of the following strings:

            * \`fields-first\`
            * \`statics-first\`
            * \`instance-sandwich\`

            Alternatively, the value for \`order\` maybe be an array consisting of the following strings:

            * \`public-static-field\`
            * \`protected-static-field\`
            * \`private-static-field\`
            * \`public-instance-field\`
            * \`protected-instance-field\`
            * \`private-instance-field\`
            * \`constructor\`
            * \`public-static-method\`
            * \`protected-static-method\`
            * \`private-static-method\`
            * \`public-instance-method\`
            * \`protected-instance-method\`
            * \`private-instance-method\`

            This is useful if one of the preset orders does not meet your needs.`,
        options: {
            type: "object",
            properties: {
                order: {
                    oneOf: [{
                        type: "string",
                        enum: ["fields-first", "statics-first", "instance-sandwich"],
                    }, {
                        type: "array",
                        items: {
                            type: "string",
                            enum: PRESET_ORDERS["statics-first"],
                        },
                        maxLength: 13,
                    }],
                },
            },
            additionalProperties: false,
        },
        optionExamples: ['[true, { "order": "fields-first" }]'],
        type: "typescript",
        typescriptOnly: true,
    };
    /* tslint:enable:object-literal-sort-keys */
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new MemberOrderingWalker(sourceFile, this.getOptions()));
    }
}

export class MemberOrderingWalker extends Lint.RuleWalker {
    private readonly order: string[] | undefined;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
        this.order = this.getOrder();
    }

    public visitClassDeclaration(node: ts.ClassDeclaration) {
        this.visitMembers(node.members);
        super.visitClassDeclaration(node);
    }

    public visitClassExpression(node: ts.ClassExpression) {
        this.visitMembers(node.members);
        super.visitClassExpression(node);
    }

    public visitInterfaceDeclaration(node: ts.InterfaceDeclaration) {
        this.visitMembers(node.members);
        super.visitInterfaceDeclaration(node);
    }

    public visitTypeLiteral(node: ts.TypeLiteralNode) {
        this.visitMembers(node.members);
        super.visitTypeLiteral(node);
    }

    private getOrder(): string[] | undefined {
        const allOptions = this.getOptions();
        if (allOptions == null || allOptions.length === 0) {
            return undefined;
        }

        const firstOption = allOptions[0];
        if (firstOption == null || typeof firstOption !== "object") {
            return undefined;
        }

        const orderOption = firstOption[OPTION_ORDER];
        if (Array.isArray(orderOption)) {
            return orderOption;
        } else if (typeof orderOption === "string") {
            return PRESET_ORDERS[orderOption] || PRESET_ORDERS["default"];
        } else {
            return undefined;
        }
    }

    private visitMembers(members: Member[]) {
        if (this.order === undefined) {
            this.checkUsingOldOptions(members);
        } else {
            this.checkUsingNewOptions(members);
        }
    }

    /* start new code */
    private checkUsingNewOptions(members: Member[]) {
        let prevRank = -1;
        for (const member of members) {
            const rank = this.memberRank(member);
            if (rank === -1) {
                // no explicit ordering for this kind of node specified, so continue
                continue;
            }

            if (rank < prevRank) {
                const nodeType = this.rankName(rank);
                const prevNodeType = this.rankName(prevRank);
                const lowerRank = this.findLowerRank(members, rank);
                const locationHint = lowerRank !== -1
                    ? `after ${this.rankName(lowerRank)}s`
                    : "at the beginning of the class/interface";
                const errorLine1 = `Declaration of ${nodeType} not allowed after declaration of ${prevNodeType}. ` +
                    `Instead, this should come ${locationHint}.`;
                this.addFailureAtNode(member, errorLine1);
            } else {
                // keep track of last good node
                prevRank = rank;
            }
        }
    }

    /** Finds the highest existing rank lower than `targetRank`. */
    private findLowerRank(members: Member[], targetRank: Rank): Rank | -1 {
        let max: Rank | -1 = -1;
        for (const member of members) {
            const rank = this.memberRank(member);
            if (rank !== -1 && rank < targetRank) {
                max = Math.max(max, rank);
            }
        }
        return max;
    }

    private memberRank(member: Member): Rank | -1 {
        const optionName = getOptionName(member);
        return optionName === undefined ? -1 : this.order!.indexOf(optionName);
    }

    private rankName(rank: Rank): string {
        return this.order![rank].replace(/-/g, " ");
    }
    /* end new code */

    /* start old code */
    private checkUsingOldOptions(members: Member[]) {
        let previousModifiers: IModifiers | undefined;
        for (const member of members) {
            const modifiers = getModifiers(member);
            if (previousModifiers !== undefined && !this.canAppearAfter(previousModifiers, modifiers)) {
                this.addFailureAtNode(member,
                    `Declaration of ${toString(modifiers)} not allowed to appear after declaration of ${toString(previousModifiers)}`);
            }
            previousModifiers = modifiers;
        }
    }

    private canAppearAfter(previousMember: IModifiers | undefined, currentMember: IModifiers) {
        if (previousMember === undefined) {
            return true;
        }

        if (this.hasOption(OPTION_VARIABLES_BEFORE_FUNCTIONS) && previousMember.isMethod !== currentMember.isMethod) {
            return Number(previousMember.isMethod) < Number(currentMember.isMethod);
        }

        if (this.hasOption(OPTION_STATIC_BEFORE_INSTANCE) && previousMember.isInstance !== currentMember.isInstance) {
            return Number(previousMember.isInstance) < Number(currentMember.isInstance);
        }

        if (this.hasOption(OPTION_PUBLIC_BEFORE_PRIVATE) && previousMember.isPrivate !== currentMember.isPrivate) {
            return Number(previousMember.isPrivate) < Number(currentMember.isPrivate);
        }

        return true;
    }
    /* end old code */
}

/* start code supporting old options (i.e. "public-before-private") */
interface IModifiers {
    isMethod: boolean;
    isPrivate: boolean;
    isInstance: boolean;
}

function getModifiers(member: Member): IModifiers {
    return {
        isInstance: !Lint.hasModifier(member.modifiers, ts.SyntaxKind.StaticKeyword),
        isMethod: isMethodOrConstructor(member),
        isPrivate: Lint.hasModifier(member.modifiers, ts.SyntaxKind.PrivateKeyword),
    };
}

function toString(modifiers: IModifiers): string {
    return [
        modifiers.isPrivate ? "private" : "public",
        modifiers.isInstance ? "instance" : "static",
        "member",
        modifiers.isMethod ? "function" : "variable",
    ].join(" ");
}
/* end old code */

/* start new code */
const enum MemberKind { Method, Constructor, Field, Ignore }
function getMemberKind(member: Member): MemberKind {
    switch (member.kind) {
        case ts.SyntaxKind.Constructor:
        case ts.SyntaxKind.ConstructSignature:
            return MemberKind.Constructor;
        case ts.SyntaxKind.MethodDeclaration:
        case ts.SyntaxKind.MethodSignature:
            return MemberKind.Method;
        case ts.SyntaxKind.PropertyDeclaration:
        case ts.SyntaxKind.PropertySignature:
            const { initializer } = member as ts.PropertyDeclaration;
            const isFunction = initializer !== undefined &&
                (initializer.kind === ts.SyntaxKind.ArrowFunction || initializer.kind === ts.SyntaxKind.FunctionExpression);
            return isFunction ? MemberKind.Method : MemberKind.Field;
        default:
            return MemberKind.Ignore;
    }
}

function isMethodOrConstructor(member: Member) {
    const kind = getMemberKind(member);
    return kind === MemberKind.Method || kind === MemberKind.Constructor;
}

/** Returns e.g. "public-static-field". */
function getOptionName(member: Member): string | undefined {
    const memberKind = getMemberKind(member);
    switch (memberKind) {
        case MemberKind.Constructor:
            return "constructor";
        case MemberKind.Ignore:
            return undefined;
        default:
            const accessLevel = hasModifier(ts.SyntaxKind.PrivateKeyword) ? "private"
                : hasModifier(ts.SyntaxKind.ProtectedKeyword) ? "protected"
                : "public";
            const membership = hasModifier(ts.SyntaxKind.StaticKeyword) ? "static" : "instance";
            const kind = memberKind === MemberKind.Method ? "method" : "field";
            return `${accessLevel}-${membership}-${kind}`;
    }
    function hasModifier(kind: ts.SyntaxKind) {
        return Lint.hasModifier(member.modifiers, kind);
    }
}

type Member = ts.TypeElement | ts.ClassElement;
type Rank = number;
/* end new code */
