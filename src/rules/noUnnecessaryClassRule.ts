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
        ruleName: "no-unnecessary-class",
        description: Lint.Utils.dedent`
            Disallows classes containing only static members. Classes
            with non-empty constructors are ignored.`,
        rationale: Lint.Utils.dedent`
            Users who come from a Java-style OO language may wrap
            their utility functions in an extra class, instead of
            putting them at the top level.`,
        optionsDescription: Lint.Utils.dedent`
            Three arguments may be optionally provided:

            * \`"allow-constructor-only"\` ignores classes whose members are constructors.
            * \`"allow-empty-class"\` ignores \`class DemoClass {}\`.
            * \`"allow-static-only"\` ignores classes whose members are static.`,
        options: {
            type: "array",
            items: {
                type: "string",
            },
            minLength: 0,
            maxLength: 3,
        },
        optionExamples: [true, ["allow-empty-class", "allow-constructor-only"]],
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_CONSTRUCTOR_ONLY = "Every member of this class is a constructor. Use functions instead.";
    public static FAILURE_STATIC_ONLY = "Every member of this class is static. Use namespaces or plain objects instead.";
    public static FAILURE_EMPTY_CLASS = "This class has no members.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoUnnecessaryClassWalker(sourceFile, this.ruleName, this.ruleArguments));
    }
}

const OPTION__ALLOW_CONSTRUCTOR_ONLY = "allow-constructor-only";
const OPTION__ALLOW_EMPTY_CLASS = "allow-empty-class";
const OPTION__ALLOW_STATIC_ONLY = "allow-static-only";

class NoUnnecessaryClassWalker extends Lint.AbstractWalker<string[]> {
    public walk(sourceFile: ts.SourceFile) {
        const checkIfUnnecessaryClass = (node: ts.Node): void => {
            if (isClassDeclaration(node) && !hasExtendsClause(node)) {
                return this.checkMembers(node, checkIfUnnecessaryClass);
            }
            return ts.forEachChild(node, checkIfUnnecessaryClass);
        };
        ts.forEachChild(sourceFile, checkIfUnnecessaryClass);
    }

    private checkMembers(node: ts.ClassDeclaration, checkIfUnnecessaryClass: (node: ts.Node) => void) {
        if (node.members.length === 0) {
            if (!this.hasOption(OPTION__ALLOW_EMPTY_CLASS)) {
                this.addFailureAtNode(getChildOfKind(node, ts.SyntaxKind.ClassKeyword)!, Rule.FAILURE_EMPTY_CLASS);
            }
            return;
        }

        const allMembersAreConstructors = node.members.every(isConstructorDeclaration);
        const classHasShorthandProps = node.members.some(isConstructorWithShorthandProps);
        if (allMembersAreConstructors && !this.hasOption(OPTION__ALLOW_CONSTRUCTOR_ONLY) && !classHasShorthandProps) {
            this.addFailureAtNode(
                getChildOfKind(node, ts.SyntaxKind.ClassKeyword, this.sourceFile)!, Rule.FAILURE_CONSTRUCTOR_ONLY,
            );
            return;
        }

        for (const member of node.members) {
            if (isConstructorWithClassDeclaration(member)) {
                return ts.forEachChild(member, checkIfUnnecessaryClass);
            }
        }

        if (!allMembersAreConstructors && !this.hasOption(OPTION__ALLOW_STATIC_ONLY)) {
            for (const member of node.members) {
                if (isConstructorWithShorthandProps(member) ||
                (!isConstructorDeclaration(member) && !hasModifier(member.modifiers, ts.SyntaxKind.StaticKeyword))) {
                    return;
                }
            }
            this.addFailureAtNode(getChildOfKind(node, ts.SyntaxKind.ClassKeyword, this.sourceFile)!, Rule.FAILURE_STATIC_ONLY);
            return;
        }
    }

    private hasOption(option: string): boolean {
        return this.options.indexOf(option) !== -1;
    }
}

function hasExtendsClause(declaration: ts.ClassDeclaration): boolean {
    return (declaration.heritageClauses !== undefined) && (declaration.heritageClauses[0].token === ts.SyntaxKind.ExtendsKeyword);
}

function isConstructorWithClassDeclaration(member: ts.ClassElement): boolean {
    return (isConstructorDeclaration(member) && member.body !== undefined) ? member.body.statements.some(isClassDeclaration) : false;
}

function isConstructorWithShorthandProps(member: ts.ClassElement): boolean {
    return isConstructorDeclaration(member) && member.parameters.some(isParameterProperty);
}
