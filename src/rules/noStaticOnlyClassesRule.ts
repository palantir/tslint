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

import { getChildOfKind,
        hasModifier,
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
            if (isClassDeclaration(node) && node.members.length > 0 && !hasExtendsClause(node)) {
                if (node.members.some(isConstructorWithClassDeclaration)) {
                    return ts.forEachChild(node, checkIfStaticOnlyClass);
                }
                if (!allClassMembersAreConstructors(node)) {
                    for (const member of node.members) {
                        if (isConstructorWithShorthandProps(member) ||
                        (!isConstructorDeclaration(member) && !hasModifier(member.modifiers, ts.SyntaxKind.StaticKeyword))) {
                            return;
                        }
                    }
                    this.addFailureAtNode(getChildOfKind(node, ts.SyntaxKind.ClassKeyword, this.sourceFile)!, Rule.FAILURE_STRING);
                }
            }
            return ts.forEachChild(node, checkIfStaticOnlyClass);
        };
        ts.forEachChild(sourceFile, checkIfStaticOnlyClass);
    }
}

function hasExtendsClause(declaration: ts.ClassDeclaration): boolean {
    return (declaration.heritageClauses !== undefined) && (declaration.heritageClauses[0].token === ts.SyntaxKind.ExtendsKeyword);
}

function isConstructorWithClassDeclaration(member: ts.ClassElement): boolean {
    return (isConstructorDeclaration(member) && member.body !== undefined) ? member.body.statements.some(isClassDeclaration) : false;
}

function allClassMembersAreConstructors(declaration: ts.ClassDeclaration): boolean {
    return isClassDeclaration(declaration) && declaration.members.every(isConstructorDeclaration);
}

function isConstructorWithShorthandProps(member: ts.ClassElement): boolean {
    return isConstructorDeclaration(member) && member.parameters.some(isParameterProperty);
}
