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
    [
        "fields-first",
        [
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
    ],
    [
        "instance-sandwich",
        [
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
    ],
    [
        "statics-first",
        [
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
    ],
]);
const PRESET_NAMES = Array.from(PRESETS.keys());

const allMemberKindNames = mapDefined(Object.keys(MemberKind), key => {
    const mk = (MemberKind as any)[key];
    return typeof mk === "number"
        ? MemberKind[mk].replace(/[A-Z]/g, cap => `-${cap.toLowerCase()}`)
        : undefined;
});

function namesMarkdown(names: string[]): string {
    return names.map(name => `* \`${name}\``).join("\n    ");
}

const optionsDescription = Lint.Utils.dedent`
    One argument, which is an object, must be provided. It should contain an \`order\` property.
    The \`order\` property should have a value of one of the following strings:

    ${namesMarkdown(PRESET_NAMES)}

    \`fields-first\` puts, in order of precedence:

        * fields before constructors before methods
        * static members before instance members
        * public members before protected members before private members

    \`instance-sandwich\` puts, in order of precedence:

        * fields before constructors before methods
        * static fields before instance fields, but static methods *after* instance methods
        * public members before protected members before private members

    \`statics-first\` puts, in order of precedence:

        * static members before instance members
            * public members before protected members before private members
            * fields before methods
        * instance fields before constructors before instance methods
            * fields before constructors before methods
            * public members before protected members before private members

    Note that these presets, despite looking similar, can have subtly different behavior due to the order in which these
    rules are specified. A fully expanded ordering can be found in the PRESETS constant in
    https://github.com/palantir/tslint/blob/master/src/rules/memberOrderingRule.ts.
    (You may need to check the version of the file corresponding to your version of tslint.)

    Alternatively, the value for \`order\` may be an array consisting of the following strings:

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
        hasFix: true,
        rationale: Lint.Utils.dedent`
            A consistent ordering for class members can make classes easier to read, navigate, and edit.

            A common opposite practice to \`member-ordering\` is to keep related groups of classes together.
            Instead of creating classes with multiple separate groups, consider splitting class responsibilities
            apart across multiple single-responsibility classes.
        `,
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
                alphabetize: {
                    type: "boolean",
                },
            },
            additionalProperties: false,
        },
        optionExamples: [
            [true, { order: "fields-first" }],
            [
                true,
                {
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
                    alphabetize: true,
                },
            ],
            [
                true,
                {
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
                },
            ],
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
    private readonly fixes: Array<[Lint.RuleFailure, Lint.Replacement]> = [];

    public walk(sourceFile: ts.SourceFile) {
        const cb = (node: ts.Node): void => {
            // NB: iterate through children first!
            ts.forEachChild(node, cb);

            switch (node.kind) {
                case ts.SyntaxKind.ClassDeclaration:
                case ts.SyntaxKind.ClassExpression:
                case ts.SyntaxKind.InterfaceDeclaration:
                case ts.SyntaxKind.TypeLiteral:
                    this.checkMembers(
                        (node as
                            | ts.ClassLikeDeclaration
                            | ts.InterfaceDeclaration
                            | ts.TypeLiteralNode).members,
                    );
            }
        };
        ts.forEachChild(sourceFile, cb);

        // assign Replacements which have not been merged into surrounding ones to their RuleFailures.
        this.fixes.forEach(([failure, replacement]) => {
            (failure.getFix() as Lint.Replacement[]).push(replacement);
        });
    }

    /**
     * Check whether the passed members adhere to the configured order. If not, RuleFailures are generated and a single
     * Lint.Replacement is generated, which replaces the entire NodeArray with a correctly sorted one. The Replacement
     * is not immediately added to a RuleFailure, as incorrectly sorted nodes can be nested (e.g. a class declaration
     * in a method implementation), but instead temporarily stored in `this.fixes`. Nested Replacements are manually
     * merged, as TSLint doesn't handle overlapping ones. For this reason it is important that the recursion happens
     * before the checkMembers call in this.walk().
     */
    private checkMembers(members: ts.NodeArray<Member>) {
        let prevRank = -1;
        let prevName: string | undefined;
        let failureExists = false;
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
                const locationHint =
                    lowerRank !== -1
                        ? `after ${this.rankName(lowerRank)}s`
                        : "at the beginning of the class/interface";
                const errorLine1 =
                    `Declaration of ${nodeType} not allowed after declaration of ${prevNodeType}. ` +
                    `Instead, this should come ${locationHint}.`;
                // add empty array as fix so we can add a replacement later. (fix itself is readonly)
                this.addFailureAtNode(member, errorLine1, []);
                failureExists = true;
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
                            Rule.FAILURE_STRING_ALPHABETIZE(
                                this.findLowerName(members, rank, curName),
                                curName,
                            ),
                            [],
                        );
                        failureExists = true;
                    } else {
                        prevName = curName;
                    }
                }

                // keep track of last good node
                prevRank = rank;
            }
        }
        if (failureExists) {
            const sortedMemberIndexes = members.map((_, i) => i).sort((ai, bi) => {
                const a = members[ai];
                const b = members[bi];

                // first, sort by member rank
                const rankDiff = this.memberRank(a) - this.memberRank(b);
                if (rankDiff !== 0) {
                    return rankDiff;
                }
                // then lexicographically if alphabetize == true
                if (this.options.alphabetize && a.name !== undefined && b.name !== undefined) {
                    const aName = nameString(a.name);
                    const bName = nameString(b.name);
                    const nameDiff = aName.localeCompare(bName);
                    if (nameDiff !== 0) {
                        return nameDiff;
                    }
                }
                // finally, sort by position in original NodeArray so the sort remains stable.
                return ai - bi;
            });
            const splits = getSplitIndexes(members, this.sourceFile.text);
            const sortedMembersText = sortedMemberIndexes.map(i => {
                const start = splits[i];
                const end = splits[i + 1];
                let nodeText = this.sourceFile.text.substring(start, end);
                while (true) {
                    // check if there are previous fixes which we need to merge into this one
                    // if yes, remove it from the list so that we do not return overlapping Replacements
                    const fixIndex = arrayFindLastIndex(
                        this.fixes,
                        ([, r]) => r.start >= start && r.start + r.length <= end,
                    );
                    if (fixIndex === -1) {
                        break;
                    }
                    const fix = this.fixes.splice(fixIndex, 1)[0];
                    const [, replacement] = fix;
                    nodeText = applyReplacementOffset(nodeText, replacement, start);
                }
                return nodeText;
            });
            // instead of assigning the fix immediately to the last failure, we temporarily store it in `this.fixes`,
            // in case a containing node needs to be fixed too. We only "add" the fix to the last failure, although
            // it fixes all failures in this NodeArray, as TSLint doesn't handle duplicate Replacements.
            this.fixes.push([
                arrayLast(this.failures),
                Lint.Replacement.replaceFromTo(
                    splits[0],
                    arrayLast(splits),
                    sortedMembersText.join(""),
                ),
            ]);
        }
    }

    /** Finds the lowest name higher than 'targetName'. */
    private findLowerName(
        members: ReadonlyArray<Member>,
        targetRank: Rank,
        targetName: string,
    ): string {
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
        return this.options.order.findIndex(category => category.has(optionName));
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

function memberKindForMethodOrField(
    access: Access,
    membership: "Static" | "Instance",
    kind: "Method" | "Field",
): MemberKind {
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
    const accessLevel = hasModifier(member.modifiers, ts.SyntaxKind.PrivateKeyword)
        ? "private"
        : hasModifier(member.modifiers, ts.SyntaxKind.ProtectedKeyword)
            ? "protected"
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
        const membership = hasModifier(member.modifiers, ts.SyntaxKind.StaticKeyword)
            ? "Static"
            : "Instance";
        return memberKindForMethodOrField(accessLevel, membership, isMethod ? "Method" : "Field");
    }
}

type MemberCategoryJson = { name: string; kinds: string[] } | string;
class MemberCategory {
    constructor(readonly name: string, private readonly kinds: Set<MemberKind>) {}
    public has(kind: MemberKind) {
        return this.kinds.has(kind);
    }
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
    const order = orderJson.map(
        cat =>
            typeof cat === "string"
                ? new MemberCategory(cat.replace(/-/g, " "), new Set(memberKindFromName(cat)))
                : new MemberCategory(cat.name, new Set(flatMap(cat.kinds, memberKindFromName))),
    );
    return { order, alphabetize };
}
function getOptionsJson(allOptions: any[]): { order: MemberCategoryJson[]; alphabetize: boolean } {
    if (allOptions == undefined || allOptions.length === 0 || allOptions[0] == undefined) {
        throw new Error("Got empty options");
    }

    const firstOption = allOptions[0] as
        | { order: MemberCategoryJson[] | string; alphabetize?: boolean }
        | string;
    if (typeof firstOption !== "object") {
        // Undocumented direct string option. Deprecate eventually.
        return { order: convertFromOldStyleOptions(allOptions), alphabetize: false }; // presume allOptions to be string[]
    }

    return {
        alphabetize: firstOption[OPTION_ALPHABETIZE] === true,
        order: categoryFromOption(firstOption[OPTION_ORDER]),
    };
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
        categories = splitOldStyleOptions(
            categories,
            kind => kind.includes("field"),
            "field",
            "method",
        );
    }
    if (hasOption("static-before-instance")) {
        categories = splitOldStyleOptions(
            categories,
            kind => kind.includes("static"),
            "static",
            "instance",
        );
    }
    if (hasOption("public-before-private")) {
        // 'protected' is considered public
        categories = splitOldStyleOptions(
            categories,
            kind => !kind.includes("private"),
            "public",
            "private",
        );
    }
    return categories;

    function hasOption(x: string): boolean {
        return options.indexOf(x) !== -1;
    }
}
interface NameAndKinds {
    name: string;
    kinds: string[];
}
function splitOldStyleOptions(
    categories: NameAndKinds[],
    filter: (name: string) => boolean,
    a: string,
    b: string,
): NameAndKinds[] {
    const newCategories: NameAndKinds[] = [];
    for (const cat of categories) {
        const yes = [];
        const no = [];
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
/**
 * Returns the last element of an array. (Or undefined).
 */
function arrayLast<T>(array: ArrayLike<T>): T {
    return array[array.length - 1];
}

/**
 * Array.prototype.findIndex, but the last index.
 */
function arrayFindLastIndex<T>(
    array: ArrayLike<T>,
    predicate: (el: T, elIndex: number, array: ArrayLike<T>) => boolean,
): number {
    for (let i = array.length; i-- > 0; ) {
        if (predicate(array[i], i, array)) {
            return i;
        }
    }
    return -1;
}

/**
 * Applies a Replacement to a part of the text which starts at offset.
 * See also Replacement.apply
 */
function applyReplacementOffset(content: string, replacement: Lint.Replacement, offset: number) {
    return (
        content.substring(0, replacement.start - offset) +
        replacement.text +
        content.substring(replacement.start - offset + replacement.length)
    );
}

/**
 * Get the indexes of the boundaries between nodes in the node array. The following points must be taken into account:
 * - Trivia should stay with its corresponding node (comments on the same line following the token belong to the
 *   previous token, the rest to the next).
 * - Reordering the subtexts should not result in code being commented out due to being moved between a "//" and
 *   the following newline.
 * - The end of one node must be the start of the next, otherwise the intravening whitespace will be lost when
 *   reordering.
 *
 * Hence, the boundaries are chosen to be _after_ the newline following the node, or the beginning of the next token,
 * if that comes first.
 */
function getSplitIndexes(members: ts.NodeArray<Member>, text: string) {
    const result = members.map(member => getNextSplitIndex(text, member.getFullStart()));
    result.push(getNextSplitIndex(text, arrayLast(members).getEnd()));
    return result;
}

/**
 * Calculates the index after the newline following pos, or the beginning of the next token, whichever comes first.
 * See also getSplitIndexes.
 * This method is a modified version of TypeScript's internal iterateCommentRanges function.
 */
function getNextSplitIndex(text: string, pos: number) {
    const enum CharacterCodes {
        lineFeed = 0x0a, // \n
        carriageReturn = 0x0d, // \r
        formFeed = 0x0c, // \f
        tab = 0x09, // \t
        verticalTab = 0x0b, // \v
        slash = 0x2f, // /
        asterisk = 0x2a, // *
        space = 0x0020, // " "
        maxAsciiCharacter = 0x7f,
    }
    scan: while (pos >= 0 && pos < text.length) {
        const ch = text.charCodeAt(pos);
        switch (ch) {
            case CharacterCodes.carriageReturn:
                if (text.charCodeAt(pos + 1) === CharacterCodes.lineFeed) {
                    pos++;
                }
            // falls through
            case CharacterCodes.lineFeed:
                pos++;
                // split is after new line
                return pos;
            case CharacterCodes.tab:
            case CharacterCodes.verticalTab:
            case CharacterCodes.formFeed:
            case CharacterCodes.space:
                // skip whitespace
                pos++;
                continue;
            case CharacterCodes.slash:
                const nextChar = text.charCodeAt(pos + 1);
                if (nextChar === CharacterCodes.slash || nextChar === CharacterCodes.asterisk) {
                    const isSingleLineComment = nextChar === CharacterCodes.slash;
                    pos += 2;
                    if (isSingleLineComment) {
                        while (pos < text.length) {
                            if (ts.isLineBreak(text.charCodeAt(pos))) {
                                // the comment ends here, go back to default logic to handle parsing new line and result
                                continue scan;
                            }
                            pos++;
                        }
                    } else {
                        while (pos < text.length) {
                            if (
                                text.charCodeAt(pos) === CharacterCodes.asterisk &&
                                text.charCodeAt(pos + 1) === CharacterCodes.slash
                            ) {
                                pos += 2;
                                continue scan;
                            }
                            pos++;
                        }
                    }

                    // if we arrive here, it's because pos == text.length
                    return pos;
                }
                break scan;
            default:
                // skip whitespace:
                if (ch > CharacterCodes.maxAsciiCharacter && ts.isWhiteSpaceLike(ch)) {
                    pos++;
                    continue;
                }
                break scan;
        }
    }
    return pos;
}
