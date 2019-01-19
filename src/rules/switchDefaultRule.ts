/**
 * @license
 * Copyright 2015 Palantir Technologies, Inc.
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

import { inspect } from "util";

import { isDefaultClause, isTypeFlagSet, unionTypeParts } from "tsutils";
import * as ts from "typescript";

import { showWarningOnce } from "../error";
import * as Lint from "../index";
import { codeExamples } from "./code-examples/switchDefault.examples";

const OPTION_ALLOW_EXHAUSTIVE = "allow-exhaustive";

interface Options {
    allowExhaustive: boolean;
}

export class Rule extends Lint.Rules.OptionallyTypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "switch-default",
        description: "Require a `default` case in all `switch` statements.",
        optionsDescription: Lint.Utils.dedent`
            One argument may be optionally provided:

            * \`"${OPTION_ALLOW_EXHAUSTIVE}"\` doesn't require the \`default\` case if all possible expression values\
are covered by existing \`case\` labels. Requires type information.`,
        options: {
            type: "array",
            items: {
                type: "string",
                enum: [OPTION_ALLOW_EXHAUSTIVE],
            },
            minLength: 0,
            maxLength: 1,
        },
        optionExamples: [true, [true, OPTION_ALLOW_EXHAUSTIVE]],
        type: "functionality",
        typescriptOnly: false,
        codeExamples,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Switch statement should include a `default` case";

    public static failureStringForMissingCases(cases: SingletonValue[]): string {
        let casesString: string;

        if (cases.length === 0) {
            throw Error("There should be no failure if there are no missing cases");
        } else if (cases.length === 1) {
            casesString = `case \`${inspect(cases[0])}\``;
        } else {
            // tslint:disable-next-line: no-unnecessary-callback-wrapper
            const firstCases: string[] = cases.slice(0, -1).map(x => inspect(x));
            const lastCase = inspect(cases[cases.length - 1]);

            casesString = `cases \`${firstCases.join(", ")}\` and \`${lastCase}\``;
        }
        return `Switch statement is not exhaustive. Add the missing ${casesString} or a \`default\` case.`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const options = parseOptions(this.ruleArguments);

        if (options.allowExhaustive) {
            // allow-exhaustive is enabled, but we don't have type information
            showWarningOnce(
                Lint.Utils.dedent`
                    ${this.ruleName} needs type info to use "${OPTION_ALLOW_EXHAUSTIVE}".
                    See https://palantir.github.io/tslint/usage/type-checking/ for documentation on
                    how to enable this feature.
                `,
            );

            return [];
        }

        return this.applyWithFunction(sourceFile, walk, options);
    }

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithFunction(
            sourceFile,
            walk,
            {
                allowExhaustive: this.ruleArguments.indexOf(OPTION_ALLOW_EXHAUSTIVE) !== -1,
            },
            program.getTypeChecker(),
        );
    }
}

function parseOptions(ruleArguments: any[]): Options {
    return {
        allowExhaustive: ruleArguments.indexOf(OPTION_ALLOW_EXHAUSTIVE) !== -1,
    };
}

function walk(ctx: Lint.WalkContext<Options>, checker?: ts.TypeChecker) {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (ts.isSwitchStatement(node) && !node.caseBlock.clauses.some(isDefaultClause)) {
            if (!ctx.options.allowExhaustive) {
                ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
            } else if (checker === undefined) {
                throw Error("Expected `checker` to be defined");
            } else {
                const uncovered = uncoveredValues(checker, node);

                if (uncovered === "non-exhaustive") {
                    ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
                } else if (uncovered.length > 0) {
                    ctx.addFailureAtNode(node, Rule.failureStringForMissingCases(uncovered));
                }
            }
        }
        return ts.forEachChild(node, cb);
    });
}

// returns a (possibly empty) array of missing values, or the string 'non-exhaustive' if the
// type of the switched expression can't possibly be matched exhaustively
function uncoveredValues(
    checker: ts.TypeChecker,
    switchStatement: ts.SwitchStatement,
): "non-exhaustive" | SingletonValue[] {
    const switchedExprType = checker.getTypeAtLocation(switchStatement.expression);

    const possibleValues: SingletonValue[] = [];
    for (const type of unionTypeParts(switchedExprType)) {
        // Note: `boolean` is represented as `true | false` under the hood, so we don't have to
        // do anything extra to support it
        const value = singletonValueOfType(type);

        if (value === undefined) {
            return "non-exhaustive";
        }

        possibleValues.push(value.value);
    }

    const caseClauses = switchStatement.caseBlock.clauses as ts.NodeArray<ts.CaseClause>;

    const caseValues: SingletonValue[] = [];
    for (const clause of caseClauses) {
        const type = checker.getTypeAtLocation(clause.expression);
        const value = singletonValueOfType(type);

        if (value === undefined) {
            return "non-exhaustive";
        }

        caseValues.push(value.value);
    }

    // PseudoBigInt is an object, and indexOf will use reference equality. But this should be OK
    // because AFAICT TypeScript interns all literal types in a Map, and if the type checker returns
    // the same type twice, it will be the same object (and therefore that object's `value` field
    // will be the same, too).
    return possibleValues.filter(value => caseValues.indexOf(value) === -1);
}

// ts.PseudoBigInt was added in Typescript 3.2, and is a possible `LiteralType` value.
// Since it is not available in earlier versions, we copy its definition and use it here.
interface PseudoBigInt {
    negative: boolean;
    base10Value: string;
}

type SingletonValue = string | number | PseudoBigInt | true | false | null | undefined;

// if `type` is a singleton type (a literal, `true`, `false`, `null`, or `undefined`),
// returns an object whose `value` field is the single value that occupies that type.
// Otherwise, returns `undefined`.
// The object wrapper is to distinguish between `undefined` and `{value: undefined}`.
function singletonValueOfType(type: ts.Type): { value: SingletonValue } | undefined {
    if (isTypeFlagSet(type, ts.TypeFlags.Null)) {
        return { value: null };
    } else if (isTypeFlagSet(type, ts.TypeFlags.Undefined)) {
        return { value: undefined };
    } else if (isTypeFlagSet(type, ts.TypeFlags.BooleanLiteral)) {
        // ts.IntrinsicType is marked as @internal, but AFAIK this is the only way to tell the
        // difference between `true` and `false`.
        const name = (type as ts.IntrinsicType).intrinsicName;
        switch (name) {
            case "true":
                return { value: true };
            case "false":
                return { value: false };
            default:
                throw Error(
                    `Expected boolean literal type to be "true" or "false", found "${name}"`,
                );
        }
    } else if (type.isLiteral()) {
        return { value: type.value };
    } else {
        return undefined;
    }
}
