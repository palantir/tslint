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

const OPTION_ORDER = "order";

enum MemberKind {
    publicStaticField,
    publicStaticMethod,
    protectedStaticField,
    protectedStaticMethod,
    privateStaticField,
    privateStaticMethod,
    publicInstanceField,
    protectedInstanceField,
    privateInstanceField,
    publicConstructor,
    protectedConstructor,
    privateConstructor,
    publicInstanceMethod,
    protectedInstanceMethod,
    privateInstanceMethod,
}

const PRESETS = new Map<string, MemberCategoryJson[]>([
    ["variables-before-functions", [
        {
            kinds: [
                "public-static-field",
                "protected-static-field",
                "private-static-field",
                "public-instance-field",
                "protected-instance-field",
                "private-instance-field",
            ],
            name: "field",
        },
        {
            kinds: [
                "constructor",
                "public-static-method",
                "protected-static-method",
                "private-static-method",
                "public-instance-method",
                "protected-instance-method",
                "private-instance-method",
            ],
            name: "method",
        },
    ]],
    ["static-before-instance", [
        {
            kinds: [
                "public-static-field",
                "public-static-method",
                "protected-static-field",
                "protected-static-method",
                "private-static-field",
                "private-static-method",
            ],
            name: "static member",
        },
        {
            kinds: [
                "public-instance-field",
                "protected-instance-field",
                "private-instance-field",
                "constructor",
                "public-instance-method",
                "protected-instance-method",
                "private-instance-method",
            ],
            name: "instance member",
        },
    ]],
    ["public-before-private", [
        {
            kinds: [
                "public-static-field",
                "protected-static-field",
                "public-instance-field",
                "protected-instance-field",
                "public-instance-method",
                "protected-instance-method",
                "public-static-method",
                "protected-static-method",
                "public-constructor",
                "protected-constructor",
            ],
            name: "public member",
        },
        {
            kinds: [
                "private-static-field",
                "private-instance-field",
                "private-instance-method",
                "private-static-method",
                "private-constructor",
            ],
            name: "private member",
        },
    ]],
    ["fields-first", [
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
    ]],
    ["instance-sandwich", [
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
    ]],
    ["statics-first", [
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
    ]],
]);
const PRESET_NAMES = Array.from(PRESETS.keys());

const allMemberKindNames = mapDefined(Object.keys(MemberKind), (key) => {
    const mk = (MemberKind as any)[key];
    return typeof mk === "number" ? MemberKind[mk].replace(/[A-Z]/g, (cap) => "-" + cap.toLowerCase()) : undefined;
});

function namesMarkdown(names: string[]): string {
    return names.map((name) => "* `" + name + "`").join("\n    ");
}

const optionsDescription = Lint.Utils.dedent`
    One argument, which is an object, must be provided. It should contain an \`order\` property.
    The \`order\` property should have a value of one of the following strings:

    ${namesMarkdown(PRESET_NAMES)}

    Alternatively, the value for \`order\` maybe be an array consisting of the following strings:

    ${namesMarkdown(allMemberKindNames)}

    You can also omit the access modifier to refer to "public-", "protected-", and "private-" all at once; for example, "static-field".

    You can also make your own categories by using an object instead of a string:

        {
            "name": "static non-private",
            "kinds": [
                "public-static-field",
                "protected-static-field",
                "public-static-method",
                "protected-static-method"
            ]
        }`;

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "member-ordering",
        description: "Enforces member ordering.",
        rationale: "A consistent ordering for class members can make classes easier to read, navigate, and edit.",
        optionsDescription,
        options: {
            type: "object",
            properties: {
                order: {
                    oneOf: [{
                        type: "string",
                        enum: PRESET_NAMES,
                    }, {
                        type: "array",
                        items: {
                            type: "string",
                            enum: allMemberKindNames,
                        },
                        maxLength: 13,
                    }],
                },
            },
            additionalProperties: false,
        },
        optionExamples: [
            '[true, { "order": "fields-first" }]',
            Lint.Utils.dedent`
                [true, {
                    "order": [
                        "static-field",
                        "instance-field",
                        "constructor",
                        "public-instance-method",
                        "protected-instance-method",
                        "private-instance-method"
                    ]
                }]`,
            Lint.Utils.dedent`
                [true, {
                    "order": [
                        {
                            "name": "static non-private",
                            "kinds": [
                                "public-static-field",
                                "protected-static-field",
                                "public-static-method",
                                "protected-static-method"
                            ]
                        },
                        "constructor"
                    ]
                }]`,
        ],
        type: "typescript",
        typescriptOnly: true,
    };
    /* tslint:enable:object-literal-sort-keys */
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new MemberOrderingWalker(sourceFile, this.getOptions()));
    }
}

export class MemberOrderingWalker extends Lint.RuleWalker {
    private readonly order: MemberCategory[];

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
        this.order = getOrder(this.getOptions());
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

    private visitMembers(members: Member[]) {
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
        const optionName = getMemberKind(member);
        if (optionName === undefined) {
            return -1;
        }
        return this.order.findIndex((category) => category.has(optionName));
    }

    private rankName(rank: Rank): string {
        return this.order[rank].name;
    }
}

function memberKindForConstructor(access: Access): MemberKind {
    return (MemberKind as any)[access + "Constructor"];
}

function memberKindForMethodOrField(access: Access, membership: "Static" | "Instance", kind: "Method" | "Field"): MemberKind {
    return (MemberKind as any)[access + membership + kind];
}

const allAccess: Access[] = ["public", "protected", "private"];

function memberKindFromName(name: string): MemberKind[] {
    const kind = (MemberKind as any)[Lint.Utils.camelize(name)];
    return typeof kind === "number" ? [kind as MemberKind] : allAccess.map(addModifier);

    function addModifier(modifier: string) {
        const modifiedKind = (MemberKind as any)[Lint.Utils.camelize(modifier + "-" + name)];
        if (typeof modifiedKind !== "number") {
            throw new Error(`Bad member kind: ${name}`);
        }
        return modifiedKind;
    }
}

function getMemberKind(member: Member): MemberKind | undefined {
    const accessLevel =  hasModifier(ts.SyntaxKind.PrivateKeyword) ? "private"
        : hasModifier(ts.SyntaxKind.ProtectedKeyword) ? "protected"
        : "public";

    switch (member.kind) {
        case ts.SyntaxKind.Constructor:
        case ts.SyntaxKind.ConstructSignature:
            return memberKindForConstructor(accessLevel);

        case ts.SyntaxKind.PropertyDeclaration:
        case ts.SyntaxKind.PropertySignature:
            return methodOrField(isFunctionLiteral((member as ts.PropertyDeclaration).initializer));

        case ts.SyntaxKind.MethodDeclaration:
        case ts.SyntaxKind.MethodSignature:
            return methodOrField(true);

        default:
            return undefined;
    }

    function methodOrField(isMethod: boolean) {
        const membership = hasModifier(ts.SyntaxKind.StaticKeyword) ? "Static" : "Instance";
        return memberKindForMethodOrField(accessLevel, membership, isMethod ? "Method" : "Field");
    }

    function hasModifier(kind: ts.SyntaxKind) {
        return Lint.hasModifier(member.modifiers, kind);
    }
}

type MemberCategoryJson = { name: string, kinds: string[] } | string;
class MemberCategory {
    constructor(readonly name: string, private readonly kinds: Set<MemberKind>) {}
    public has(kind: MemberKind) { return this.kinds.has(kind); }
}

type Member = ts.TypeElement | ts.ClassElement;
type Rank = number;

type Access = "public" | "protected" | "private";

function getOrder(options: any[]): MemberCategory[] {
    return getOrderJson(options).map((cat) => typeof cat === "string"
        ? new MemberCategory(cat.replace(/-/g, " "), new Set(memberKindFromName(cat)))
        : new MemberCategory(cat.name, new Set(flatMap(cat.kinds, memberKindFromName))));
}
function getOrderJson(allOptions: any[]): MemberCategoryJson[] {
    if (allOptions == null || allOptions.length === 0 || allOptions[0] == null) {
        throw new Error("Got empty options");
    }

    const firstOption = allOptions[0];
    if (typeof firstOption !== "object") {
        return categoryFromOption(firstOption);
    }

    return categoryFromOption(firstOption[OPTION_ORDER]);
}
function categoryFromOption(orderOption: {}): MemberCategoryJson[] {
    if (Array.isArray(orderOption)) {
        return orderOption;
    }

    const preset = PRESETS.get(orderOption as string);
    if (!preset) {
        throw new Error(`Bad order: ${JSON.stringify(orderOption)}`);
    }
    return preset;
}

function isFunctionLiteral(node: ts.Node | undefined) {
    switch (node && node.kind) {
        case ts.SyntaxKind.ArrowFunction:
        case ts.SyntaxKind.FunctionExpression:
            return true;
        default:
            return false;
    }
}

function mapDefined<T, U>(inputs: T[], getOutput: (input: T) => U | undefined): U[] {
    const out = [];
    for (const input of inputs) {
        const output = getOutput(input);
        if (output !== undefined) {
            out.push(output);
        }
    }
    return out;
}

function flatMap<T, U>(inputs: T[], getOutputs: (input: T) => U[]): U[] {
    const out = [];
    for (const input of inputs) {
        out.push(...getOutputs(input));
    }
    return out;
}
