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

import { hasModifier } from "tsutils";
import * as ts from "typescript";

import { showWarningOnce } from "../error";
import * as Lint from "../index";
import { flatMap, mapDefined } from "../utils";

const OPTION_ORDER = "order";
const OPTION_ALPHABETIZE = "alphabetize";

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
    return typeof mk === "number" ? MemberKind[mk].replace(/[A-Z]/g, (cap) => `-${cap.toLowerCase()}`) : undefined;
});

function namesMarkdown(names: string[]): string {
    return names.map((name) => `* \`${name}\``).join("\n    ");
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
        }

    The '${OPTION_ALPHABETIZE}' option will enforce that members within the same category should be alphabetically sorted by name.`;

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
                    oneOf: [
                        {
                            type: "string",
                            enum: PRESET_NAMES,
                        },
                        {
                            type: "array",
                            items: {
                                type: "string",
                                enum: allMemberKindNames,
                            },
                            maxLength: 13,
                        },
                    ],
                },
            },
            additionalProperties: false,
        },
        optionExamples: [
            [true, { order: "fields-first" }],
            [true, {
                order: [
                    "public-static-field",
                    "public-instance-field",
                    "public-constructor",
                    "private-static-field",
                    "private-instance-field",
                    "private-constructor",
                    "public-instance-method",
                    "protected-instance-method",
                    "private-instance-method",
                ],
            }],
            [true, {
                order: [
                    {
                        name: "static non-private",
                        kinds: [
                            "public-static-field",
                            "protected-static-field",
                            "public-static-method",
                            "protected-static-method",
                        ],
                    },
                    "constructor",
                ],
            }],
        ],
        type: "typescript",
        typescriptOnly: false,
    };

    public static FAILURE_STRING_ALPHABETIZE(prevName: string, curName: string) {
        return `${show(curName)} should come alphabetically before ${show(prevName)}`;
        function show(s: string) {
            return s === "" ? "Computed property" : `'${s}'`;
        }
    }

    /* tslint:enable:object-literal-sort-keys */
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        let options: Options;
        try {
            options = parseOptions(this.ruleArguments);
        } catch (e) {
            showWarningOnce(`Warning: ${this.ruleName} - ${(e as Error).message}`);
            return [];
        }
        return this.applyWithWalker(new MemberOrderingWalker(sourceFile, this.ruleName, options));
    }
}

class MemberOrderingWalker extends Lint.AbstractWalker<Options> {
    public walk(sourceFile: ts.SourceFile) {
        const cb = (node: ts.Node): void => {
            switch (node.kind) {
                case ts.SyntaxKind.ClassDeclaration:
                case ts.SyntaxKind.ClassExpression:
                case ts.SyntaxKind.InterfaceDeclaration:
                case ts.SyntaxKind.TypeLiteral:
                    this.checkMembers((node as ts.ClassLikeDeclaration | ts.InterfaceDeclaration | ts.TypeLiteralNode).members);
            }
            return ts.forEachChild(node, cb);
        };
        return ts.forEachChild(sourceFile, cb);
    }

    private checkMembers(members: ts.NodeArray<Member>) {
        let prevRank = -1;
        let prevName: string | undefined;
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
                if (this.options.alphabetize && member.name !== undefined) {
                    if (rank !== prevRank) {
                        // No alphabetical ordering between different ranks
                        prevName = undefined;
                    }

                    const curName = nameString(member.name);
                    if (prevName !== undefined && caseInsensitiveLess(curName, prevName)) {
                        this.addFailureAtNode(
                            member.name,
                            Rule.FAILURE_STRING_ALPHABETIZE(this.findLowerName(members, rank, curName), curName));
                    } else {
                        prevName = curName;
                    }
                }

                // keep track of last good node
                prevRank = rank;
            }
        }
    }

    /** Finds the lowest name higher than 'targetName'. */
    private findLowerName(members: ReadonlyArray<Member>, targetRank: Rank, targetName: string): string {
        for (const member of members) {
            if (member.name === undefined || this.memberRank(member) !== targetRank) {
                continue;
            }
            const name = nameString(member.name);
            if (caseInsensitiveLess(targetName, name)) {
                return name;
            }
        }
        throw new Error("Expected to find a name");
    }

    /** Finds the highest existing rank lower than `targetRank`. */
    private findLowerRank(members: ReadonlyArray<Member>, targetRank: Rank): Rank | -1 {
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
        return this.options.order.findIndex((category) => category.has(optionName));
    }

    private rankName(rank: Rank): string {
        return this.options.order[rank].name;
    }
}

function caseInsensitiveLess(a: string, b: string) {
    return a.toLowerCase() < b.toLowerCase();
}

function memberKindForConstructor(access: Access): MemberKind {
    return (MemberKind as any)[`${access}Constructor`] as MemberKind;
}

function memberKindForMethodOrField(access: Access, membership: "Static" | "Instance", kind: "Method" | "Field"): MemberKind {
    return (MemberKind as any)[access + membership + kind] as MemberKind;
}

const allAccess: Access[] = ["public", "protected", "private"];

function memberKindFromName(name: string): MemberKind[] {
    const kind = (MemberKind as any)[Lint.Utils.camelize(name)];
    return typeof kind === "number" ? [kind as MemberKind] : allAccess.map(addModifier);

    function addModifier(modifier: string) {
        const modifiedKind = (MemberKind as any)[Lint.Utils.camelize(`${modifier}-${name}`)];
        if (typeof modifiedKind !== "number") {
            throw new Error(`Bad member kind: ${name}`);
        }
        return modifiedKind;
    }
}

function getMemberKind(member: Member): MemberKind | undefined {
    const accessLevel =  hasModifier(member.modifiers, ts.SyntaxKind.PrivateKeyword) ? "private"
        : hasModifier(member.modifiers, ts.SyntaxKind.ProtectedKeyword) ? "protected"
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
        const membership = hasModifier(member.modifiers, ts.SyntaxKind.StaticKeyword) ? "Static" : "Instance";
        return memberKindForMethodOrField(accessLevel, membership, isMethod ? "Method" : "Field");
    }
}

type MemberCategoryJson = { name: string; kinds: string[] } | string;
class MemberCategory {
    constructor(readonly name: string, private readonly kinds: Set<MemberKind>) {}
    public has(kind: MemberKind) { return this.kinds.has(kind); }
}

type Member = ts.TypeElement | ts.ClassElement;
type Rank = number;

type Access = "public" | "protected" | "private";

interface Options {
    order: MemberCategory[];
    alphabetize: boolean;
}

function parseOptions(options: any[]): Options {
    const { order: orderJson, alphabetize } = getOptionsJson(options);
    const order = orderJson.map((cat) => typeof cat === "string"
        ? new MemberCategory(cat.replace(/-/g, " "), new Set(memberKindFromName(cat)))
        : new MemberCategory(cat.name, new Set(flatMap(cat.kinds, memberKindFromName))));
    return { order, alphabetize };
}
function getOptionsJson(allOptions: any[]): { order: MemberCategoryJson[]; alphabetize: boolean } {
    if (allOptions == undefined || allOptions.length === 0 || allOptions[0] == undefined) {
        throw new Error("Got empty options");
    }

    const firstOption = allOptions[0] as { order: MemberCategoryJson[] | string; alphabetize?: boolean } | string;
    if (typeof firstOption !== "object") {
        // Undocumented direct string option. Deprecate eventually.
        return { order: convertFromOldStyleOptions(allOptions), alphabetize: false }; // presume allOptions to be string[]
    }

    return { order: categoryFromOption(firstOption[OPTION_ORDER]), alphabetize: firstOption[OPTION_ALPHABETIZE] === true };
}
function categoryFromOption(orderOption: MemberCategoryJson[] | string): MemberCategoryJson[] {
    if (Array.isArray(orderOption)) {
        return orderOption;
    }

    const preset = PRESETS.get(orderOption);
    if (preset === undefined) {
        throw new Error(`Bad order: ${JSON.stringify(orderOption)}`);
    }
    return preset;
}

/**
 * Convert from undocumented old-style options.
 * This is designed to mimic the old behavior and should be removed eventually.
 */
function convertFromOldStyleOptions(options: string[]): MemberCategoryJson[] {
    let categories: NameAndKinds[] = [{ name: "member", kinds: allMemberKindNames }];
    if (hasOption("variables-before-functions")) {
        categories = splitOldStyleOptions(categories, (kind) => kind.includes("field"), "field", "method");
    }
    if (hasOption("static-before-instance")) {
        categories = splitOldStyleOptions(categories, (kind) => kind.includes("static"), "static", "instance");
    }
    if (hasOption("public-before-private")) {
        // 'protected' is considered public
        categories = splitOldStyleOptions(categories, (kind) => !kind.includes("private"), "public", "private");
    }
    return categories;

    function hasOption(x: string): boolean {
        return options.indexOf(x) !== -1;
    }
}
interface NameAndKinds { name: string; kinds: string[]; }
function splitOldStyleOptions(categories: NameAndKinds[], filter: (name: string) => boolean, a: string, b: string): NameAndKinds[] {
    const newCategories: NameAndKinds[]  = [];
    for (const cat of categories) {
        const yes = []; const no = [];
        for (const kind of cat.kinds) {
            if (filter(kind)) {
                yes.push(kind);
            } else {
                no.push(kind);
            }
        }
        const augmentName = (s: string) => {
            if (a === "field") {
                // Replace "member" with "field"/"method" instead of augmenting.
                return s;
            }
            return `${s} ${cat.name}`;
        };
        newCategories.push({ name: augmentName(a), kinds: yes });
        newCategories.push({ name: augmentName(b), kinds: no });
    }
    return newCategories;
}

function isFunctionLiteral(node: ts.Node | undefined) {
    if (node === undefined) {
        return false;
    }

    switch (node.kind) {
        case ts.SyntaxKind.ArrowFunction:
        case ts.SyntaxKind.FunctionExpression:
            return true;
        default:
            return false;
    }
}

function nameString(name: ts.PropertyName): string {
    switch (name.kind) {
        case ts.SyntaxKind.Identifier:
        case ts.SyntaxKind.StringLiteral:
        case ts.SyntaxKind.NumericLiteral:
            return (name as ts.Identifier | ts.LiteralExpression).text;
        default:
            return "";
    }
}
