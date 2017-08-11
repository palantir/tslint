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

import { isClassDeclaration, isFunctionWithBody } from "tsutils";

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
        for (const statement of sourceFile.statements) {
            if (isClassDeclaration(statement) && !hasExtendsClause(statement) && !hasImplementsClause(statement)) {
                for (const member of statement.members) {
                    if (!hasStaticModifier(member.modifiers) && !isEmptyConstructor(member)) {
                        return;
                    }
                }
                if (statement.name !== undefined) {
                    this.addFailure(statement.name.pos + 1, statement.name.end, Rule.FAILURE_STRING);
                }
            }
        }
    }
}

function hasImplementsClause(statement: ts.ClassDeclaration): boolean {
    return (statement.heritageClauses !== undefined) ? statement.heritageClauses[0].token === ts.SyntaxKind.ImplementsKeyword : false;
}

function hasExtendsClause(statement: ts.ClassDeclaration): boolean {
    return (statement.heritageClauses !== undefined) ? statement.heritageClauses[0].token === ts.SyntaxKind.ExtendsKeyword : false;
}

function hasStaticModifier(modifiers: ts.NodeArray<ts.Modifier> | undefined): boolean {
    if (modifiers === undefined) {
        return false;
    }
    for (const modifier of modifiers) {
        if (modifier.kind === ts.SyntaxKind.StaticKeyword) {
            return true;
        }
    }
    return false;
}

function isEmptyConstructor(member: ts.ClassElement): boolean {
    if (member.kind === ts.SyntaxKind.Constructor
        && isFunctionWithBody(member)
        && member.body !== undefined) {
        return member.body.getFullText().trim().replace(/\s+/g, "") === "{}";
    }
    return false;
}
