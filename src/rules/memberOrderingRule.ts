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
import * as Lint from "../lint";
import * as ts from "typescript";

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
    };
    /* tslint:enable:object-literal-sort-keys */
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new MemberOrderingWalker(sourceFile, this.getOptions()));
    }
}

/* start code supporting old options (i.e. "public-before-private") */
interface IModifiers {
    isMethod: boolean;
    isPrivate: boolean;
    isInstance: boolean;
}

function getModifiers(isMethod: boolean, modifiers?: ts.ModifiersArray): IModifiers {
    return {
        isInstance: !Lint.hasModifier(modifiers, ts.SyntaxKind.StaticKeyword),
        isMethod: isMethod,
        isPrivate: Lint.hasModifier(modifiers, ts.SyntaxKind.PrivateKeyword),
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
enum AccessLevel {
    PRIVATE,
    PROTECTED,
    PUBLIC,
}

enum Membership {
    INSTANCE,
    STATIC,
}

enum Kind {
    FIELD,
    METHOD,
}

interface INodeAndModifiers {
    accessLevel: AccessLevel;
    isConstructor: boolean;
    kind: Kind;
    membership: Membership;
    node: ts.Node;
}

function getNodeAndModifiers(node: ts.Node, isMethod: boolean, isConstructor = false): INodeAndModifiers {
    const { modifiers } = node;
    const accessLevel = Lint.hasModifier(modifiers, ts.SyntaxKind.PrivateKeyword) ? AccessLevel.PRIVATE
        : Lint.hasModifier(modifiers, ts.SyntaxKind.ProtectedKeyword) ? AccessLevel.PROTECTED
        : AccessLevel.PUBLIC;
    const kind = isMethod ? Kind.METHOD : Kind.FIELD;
    const membership = Lint.hasModifier(modifiers, ts.SyntaxKind.StaticKeyword) ? Membership.STATIC : Membership.INSTANCE;
    return {
        accessLevel,
        isConstructor,
        kind,
        membership,
        node,
    };
}

function getNodeOption({accessLevel, isConstructor, kind, membership}: INodeAndModifiers) {
    if (isConstructor) {
        return "constructor";
    }

    return [
        AccessLevel[accessLevel].toLowerCase(),
        Membership[membership].toLowerCase(),
        Kind[kind].toLowerCase(),
    ].join("-");
}
/* end new code */

export class MemberOrderingWalker extends Lint.RuleWalker {
    private previousMember: IModifiers;
    private memberStack: INodeAndModifiers[][] = [];
    private hasOrderOption = this.getHasOrderOption();

    public visitClassDeclaration(node: ts.ClassDeclaration) {
        this.resetPreviousModifiers();

        this.newMemberList();
        super.visitClassDeclaration(node);
        this.checkMemberOrder();
    }

    public visitClassExpression(node: ts.ClassExpression) {
        this.resetPreviousModifiers();

        this.newMemberList();
        super.visitClassExpression(node);
        this.checkMemberOrder();
    }

    public visitInterfaceDeclaration(node: ts.InterfaceDeclaration) {
        this.resetPreviousModifiers();

        this.newMemberList();
        super.visitInterfaceDeclaration(node);
        this.checkMemberOrder();
    }

    public visitMethodDeclaration(node: ts.MethodDeclaration) {
        this.checkModifiersAndSetPrevious(node, getModifiers(true, node.modifiers));
        this.pushMember(getNodeAndModifiers(node, true));
        super.visitMethodDeclaration(node);
    }

    public visitMethodSignature(node: ts.SignatureDeclaration) {
        this.checkModifiersAndSetPrevious(node, getModifiers(true, node.modifiers));
        this.pushMember(getNodeAndModifiers(node, true));
        super.visitMethodSignature(node);
    }

    public visitConstructorDeclaration(node: ts.ConstructorDeclaration) {
        this.checkModifiersAndSetPrevious(node, getModifiers(true, node.modifiers));
        this.pushMember(getNodeAndModifiers(node, true, true));
        super.visitConstructorDeclaration(node);
    }

    public visitPropertyDeclaration(node: ts.PropertyDeclaration) {
        const { initializer } = node;
        const isFunction = initializer != null
            && (initializer.kind === ts.SyntaxKind.ArrowFunction || initializer.kind === ts.SyntaxKind.FunctionExpression);
        this.checkModifiersAndSetPrevious(node, getModifiers(isFunction, node.modifiers));
        this.pushMember(getNodeAndModifiers(node, isFunction));
        super.visitPropertyDeclaration(node);
    }

    public visitPropertySignature(node: ts.PropertyDeclaration) {
        this.checkModifiersAndSetPrevious(node, getModifiers(false, node.modifiers));
        this.pushMember(getNodeAndModifiers(node, false));
        super.visitPropertySignature(node);
    }

    public visitTypeLiteral(node: ts.TypeLiteralNode) {
        // don't call super from here -- we want to skip the property declarations in type literals
    }

    public visitObjectLiteralExpression(node: ts.ObjectLiteralExpression) {
        // again, don't call super here - object literals can have methods,
        // and we don't wan't to check these
    }

    /* start old code */
    private resetPreviousModifiers() {
        this.previousMember = {
            isInstance: false,
            isMethod: false,
            isPrivate: false,
        };
    }

    private checkModifiersAndSetPrevious(node: ts.Node, currentMember: IModifiers) {
        if (!this.canAppearAfter(this.previousMember, currentMember)) {
            const failure = this.createFailure(
                node.getStart(),
                node.getWidth(),
                `Declaration of ${toString(currentMember)} not allowed to appear after declaration of ${toString(this.previousMember)}`
            );
            this.addFailure(failure);
        }
        this.previousMember = currentMember;
    }

    private canAppearAfter(previousMember: IModifiers, currentMember: IModifiers) {
        if (previousMember == null || currentMember == null) {
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

    /* start new code */
    private newMemberList() {
        if (this.hasOrderOption) {
            this.memberStack.push([]);
        }
    }

    private pushMember(node: INodeAndModifiers) {
        if (this.hasOrderOption) {
            this.memberStack[this.memberStack.length - 1].push(node);
        }
    }

    private checkMemberOrder() {
        if (this.hasOrderOption) {
            const memberList = this.memberStack.pop();
            const order = this.getOrder();
            const memberRank = memberList.map((n) => order.indexOf(getNodeOption(n)));

            let prevRank = -1;
            memberRank.forEach((rank, i) => {
                // no explicit ordering for this kind of node specified, so continue
                if (rank === -1) { return; }

                // node should have come before last node, so add a failure
                if (rank < prevRank) {
                    // generate a nice and clear error message
                    const node = memberList[i].node;
                    const nodeType = order[rank].split("-").join(" ");
                    const prevNodeType = order[prevRank].split("-").join(" ");

                    const lowerRanks = memberRank.filter((r) => r < rank && r !== -1).sort();
                    const locationHint = lowerRanks.length > 0
                        ? `after ${order[lowerRanks[lowerRanks.length - 1]].split("-").join(" ")}s`
                        : "at the beginning of the class/interface";

                    const errorLine1 = `Declaration of ${nodeType} not allowed after declaration of ${prevNodeType}. ` +
                        `Instead, this should come ${locationHint}.`;
                    this.addFailure(this.createFailure(
                        node.getStart(),
                        node.getWidth(),
                        errorLine1
                    ));
                } else {
                    // keep track of last good node
                    prevRank = rank;
                }
            });
        }
    }

    private getHasOrderOption() {
        const allOptions = this.getOptions();
        if (allOptions == null || allOptions.length === 0) {
            return false;
        }

        const firstOption = allOptions[0];
        return firstOption != null && typeof firstOption === "object" && firstOption[OPTION_ORDER] != null;
    }

    // assumes this.hasOrderOption() === true
    private getOrder(): string[] {
        const orderOption = this.getOptions()[0][OPTION_ORDER];
        if (Array.isArray(orderOption)) {
            return orderOption;
        } else if (typeof orderOption === "string") {
            return PRESET_ORDERS[orderOption] || PRESET_ORDERS["default"];
        }
    }
    /* end new code */
}
