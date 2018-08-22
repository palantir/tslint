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

import { isDefaultClause, isTypeFlagSet } from "tsutils";
import * as ts from "typescript";

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
are covered by existing \`case\` labels.`,
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

    public static FAILURE_STRING = "Switch statement should include a 'default' case";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, {
            allowExhaustive: false, // This option requires TypeChecker
        });
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

function walk(ctx: Lint.WalkContext<Options>, checker?: ts.TypeChecker) {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (
            ts.isSwitchStatement(node)
            && !node.caseBlock.clauses.some(isDefaultClause)
        ) {
            const failure = !checker || !ctx.options.allowExhaustive
                ? `${Rule.FAILURE_STRING}`
                : checkForUncoveredValues(
                    checker.getTypeAtLocation(node.expression),
                    node.caseBlock,
                );

            if (failure !== undefined) {
                ctx.addFailureAtNode(node, failure);
            }
        }
        return ts.forEachChild(node, cb);
    });
}

function checkForUncoveredValues(exprType: ts.Type, caseBlock: ts.CaseBlock): string | void {
    if (!isTypeFlagSet(exprType, ts.TypeFlags.Union)) {
        return Rule.FAILURE_STRING;
    }

    for (const type of (exprType as ts.UnionType).types) {
        if (!isTypeFlagSet(type, ts.TypeFlags.StringLiteral)) {
            return Rule.FAILURE_STRING;
        }

        const text = (type as ts.StringLiteralType).value;
        const hasSuchClause = caseBlock.clauses.some(
            (clause) => ts.isCaseClause(clause)
                && ts.isStringLiteral(clause.expression)
                && (clause.expression.text === text),
        );
        if (!hasSuchClause) {
            return failureStringWithMissingCase(text);
        }
    }

    function failureStringWithMissingCase(missingCase: string) {
        return `${Rule.FAILURE_STRING}, at least the '${missingCase}' case is missing`;
    }
}
