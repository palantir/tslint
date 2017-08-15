/**
 * @license
 * Copyright 2017 Palantir Technologies, Inc.
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

import { hasModifier,
        isClassDeclaration,
        isConstructorDeclaration,
        isParameterProperty } from "tsutils";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-static-only-classes",
        description: Lint.Utils.dedent`
            Disallows classes containing only static members. Classes
            with non-empty constructors are ignored.`,
        rationale: Lint.Utils.dedent`
            Users who come from a Java-style OO language may wrap
            their utility functions in an extra class, instead of
            putting them at the top level.`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "functionality",
        typescriptOnly: false,
    };

    public static FAILURE_STRING = "Classes containing only static members are disallowed.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoStaticOnlyClassesWalker(sourceFile, this.ruleName, this.ruleArguments));
    }
}

class NoStaticOnlyClassesWalker extends Lint.AbstractWalker<string[]> {
    public walk(sourceFile: ts.SourceFile) {
        const checkIfStaticOnlyClass = (node: ts.Node): void => {
            if (isClassDeclaration(node)
                && !hasExtendsClause(node)
                && !isEmptyClass(node)) {
                for (const member of node.members) {
                    if (!hasModifier(member.modifiers, ts.SyntaxKind.StaticKeyword) && !isEmptyConstructor(member)) {
                        return;
                    }
                }
                if (node.name !== undefined) {
                    this.addFailure(node.name.pos + 1, node.name.end, Rule.FAILURE_STRING);
                }
            }
            return ts.forEachChild(node, checkIfStaticOnlyClass);
        };
        ts.forEachChild(sourceFile, checkIfStaticOnlyClass);
    }
}

function hasExtendsClause(statement: ts.ClassDeclaration): boolean {
    return (statement.heritageClauses !== undefined) && (statement.heritageClauses[0].token === ts.SyntaxKind.ExtendsKeyword);
}

function isEmptyClass(statement: ts.ClassDeclaration): boolean {
    const classMembers = statement.members;
    if (classMembers.length === 0) {
        return true;
    } else if (classMembers.length === 1 && classMembers[0].kind === ts.SyntaxKind.Constructor) {
        return isEmptyConstructor(classMembers[0]);
    } else {
        return false;
    }
}

function isEmptyConstructor(member: ts.ClassElement): boolean {
    if (isConstructorDeclaration(member)
        && member.body !== undefined
        && !member.parameters.some(isParameterProperty)) {
        return member.body.statements.length === 0;
    }
    return false;
}
