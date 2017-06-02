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

import * as Lint from "tslint";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-public-modifiers",
        description: "Disallows explicit public visibility modifier.",
        rationale: Lint.Utils.dedent`
            Typescript declarations are public by default, and the transpiled JavaScript declarations will be public too.
            Therefore, explicit public modifiers are unnecessary, and may add noise to the code.`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "typescript",
        typescriptOnly: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_FACTORY = (memberType: string, memberName: string | undefined) => {
        memberName = memberName === undefined ? "" : ` '${memberName}'`;
        return `The ${memberType}${memberName} must not be explicitly marked as 'public'`;
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new MemberAccessWalker(sourceFile, this.getOptions()));
    }
}

export class MemberAccessWalker extends Lint.RuleWalker {
    public visitConstructorDeclaration(node: ts.ConstructorDeclaration) {
        this.validateNoPublicVisibilityModifier(node);
        super.visitConstructorDeclaration(node);
    }

    public visitMethodDeclaration(node: ts.MethodDeclaration) {
        this.validateNoPublicVisibilityModifier(node);
        super.visitMethodDeclaration(node);
    }

    public visitPropertyDeclaration(node: ts.PropertyDeclaration) {
        this.validateNoPublicVisibilityModifier(node);
        super.visitPropertyDeclaration(node);
    }

    public visitGetAccessor(node: ts.AccessorDeclaration) {
        this.validateNoPublicVisibilityModifier(node);
        super.visitGetAccessor(node);
    }

    public visitSetAccessor(node: ts.AccessorDeclaration) {
        this.validateNoPublicVisibilityModifier(node);
        super.visitSetAccessor(node);
    }

    private validateNoPublicVisibilityModifier(node: ts.ClassElement) {
        if (node.parent!.kind === ts.SyntaxKind.ObjectLiteralExpression) {
            return;
        }

        const hasPublicVisibilityModifier = Lint.hasModifier(
            node.modifiers,
            ts.SyntaxKind.PublicKeyword,
        );

        if (hasPublicVisibilityModifier) {
            let memberType: string;
            let end: number;

            if (node.kind === ts.SyntaxKind.MethodDeclaration) {
                memberType = "class method";
                end = (node as ts.MethodDeclaration).name.getEnd();
            } else if (node.kind === ts.SyntaxKind.PropertyDeclaration) {
                memberType = "class property";
                end = (node as ts.PropertyDeclaration).name.getEnd();
            } else if (node.kind === ts.SyntaxKind.Constructor) {
                memberType = "class constructor";
                end = Lint.childOfKind(node, ts.SyntaxKind.ConstructorKeyword)!.getEnd();
            } else if (node.kind === ts.SyntaxKind.GetAccessor) {
                memberType = "get property accessor";
                end = (node as ts.AccessorDeclaration).name.getEnd();
            } else if (node.kind === ts.SyntaxKind.SetAccessor) {
                memberType = "set property accessor";
                end = (node as ts.AccessorDeclaration).name.getEnd();
            } else {
                throw new Error("unhandled node type");
            }

            let memberName: string|undefined;
            // look for the identifier and get its text
            if (node.name !== undefined && node.name.kind === ts.SyntaxKind.Identifier) {
                memberName = (node.name as ts.Identifier).text;
            }
            const failureString = Rule.FAILURE_STRING_FACTORY(memberType, memberName);
            this.addFailureFromStartToEnd(node.getStart(), end, failureString);
        }
    }
}
