/**
 * @license
 * Copyright 2018 Palantir Technologies, Inc.
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

import { isObjectFlagSet, isObjectType, isTypeFlagSet } from "tsutils";
import * as ts from "typescript";
import * as Lint from "../index";

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-unnecessary-type-assertion",
        description: "Warns if a type assertion does not change the type of an expression.",
        options: {
            type: "list",
            listType: {
                type: "array",
                items: { type: "string" },
            },
        },
        optionsDescription: "A list of whitelisted assertion types to ignore",
        type: "typescript",
        hasFix: true,
        typescriptOnly: true,
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING =
        "This assertion is unnecessary since it does not change the type of the expression.";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithWalker(
            new Walker(sourceFile, this.ruleName, this.ruleArguments, program.getTypeChecker()),
        );
    }
}

class Walker extends Lint.AbstractWalker<string[]> {
    constructor(
        sourceFile: ts.SourceFile,
        ruleName: string,
        options: string[],
        private readonly checker: ts.TypeChecker,
    ) {
        super(sourceFile, ruleName, options);
    }

    public walk(sourceFile: ts.SourceFile) {
        const cb = (node: ts.Node): void => {
            switch (node.kind) {
                case ts.SyntaxKind.NonNullExpression:
                    this.checkNonNullAssertion(node as ts.NonNullExpression);
                    break;
                case ts.SyntaxKind.TypeAssertionExpression:
                case ts.SyntaxKind.AsExpression:
                    this.verifyCast(node as ts.AssertionExpression);
            }

            return ts.forEachChild(node, cb);
        };

        return ts.forEachChild(sourceFile, cb);
    }

    private checkNonNullAssertion(node: ts.NonNullExpression) {
        const type = this.checker.getTypeAtLocation(node.expression);
        if (type === this.checker.getNonNullableType(type)) {
            this.addFailureAtNode(
                node,
                Rule.FAILURE_STRING,
                Lint.Replacement.deleteFromTo(node.expression.end, node.end),
            );
        }
    }

    private verifyCast(node: ts.AssertionExpression) {
        if (this.options.indexOf(node.type.getText(this.sourceFile)) !== -1) {
            return;
        }
        const castType = this.checker.getTypeAtLocation(node);

        if (
            isTypeFlagSet(castType, ts.TypeFlags.Literal) ||
            (isObjectType(castType) &&
                (isObjectFlagSet(castType, ts.ObjectFlags.Tuple) || couldBeTupleType(castType)))
        ) {
            // It's not always safe to remove a cast to a literal type or tuple
            // type, as those types are sometimes widened without the cast.
            return;
        }

        const uncastType = this.checker.getTypeAtLocation(node.expression);
        if (uncastType === castType) {
            this.addFailureAtNode(
                node,
                Rule.FAILURE_STRING,
                node.kind === ts.SyntaxKind.TypeAssertionExpression
                    ? Lint.Replacement.deleteFromTo(node.getStart(), node.expression.getStart())
                    : Lint.Replacement.deleteFromTo(node.expression.end, node.end),
            );
        }
    }
}

/**
 * Sometimes tuple types don't have ObjectFlags.Tuple set, like when they're being matched against an inferred type.
 * So, in addition, check if there are integer properties 0..n and no other numeric keys
 */
function couldBeTupleType(type: ts.ObjectType): boolean {
    const properties = type.getProperties();
    if (properties.length === 0) {
        return false;
    }
    let i = 0;
    for (; i < properties.length; ++i) {
        const name = properties[i].name;
        if (String(i) !== name) {
            if (i === 0) {
                // if there are no integer properties, this is not a tuple
                return false;
            }
            break;
        }
    }
    for (; i < properties.length; ++i) {
        if (String(+properties[i].name) === properties[i].name) {
            return false; // if there are any other numeric properties, this is not a tuple
        }
    }
    return true;
}
