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

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-misused-new",
        description: "Warns on apparent attempts to define constructors for interfaces or `new` for classes.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "functionality",
        typescriptOnly: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_INTERFACE = "Interfaces cannot be constructed, only classes. Did you mean `declare class`?";
    public static FAILURE_STRING_CLASS = '`new` in a class is a method named "new". Did you mean `constructor`?';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new Walker(sourceFile, this.getOptions()));
    }
}

class Walker extends Lint.RuleWalker {
    public visitMethodSignature(node: ts.MethodSignature) {
        if (nameIs(node.name, "constructor")) {
            this.addFailureAtNode(node, Rule.FAILURE_STRING_INTERFACE);
        }
    }

    public visitMethodDeclaration(node: ts.MethodDeclaration) {
        if (node.body === undefined && nameIs(node.name, "new") &&
            returnTypeMatchesParent(node.parent as ts.ClassLikeDeclaration, node)) {
            this.addFailureAtNode(node, Rule.FAILURE_STRING_CLASS);
        }
    }

    public visitConstructSignature(node: ts.ConstructSignatureDeclaration) {
        if (returnTypeMatchesParent(node.parent as ts.InterfaceDeclaration, node)) {
            this.addFailureAtNode(node, Rule.FAILURE_STRING_INTERFACE);
        }
    }
}

function nameIs(name: ts.PropertyName, text: string): boolean {
    return name.kind === ts.SyntaxKind.Identifier && name.text === text;
}

function returnTypeMatchesParent(parent: { name?: ts.Identifier }, decl: ts.SignatureDeclaration): boolean {
    if (parent.name === undefined) {
        return false;
    }

    const name = parent.name.text;
    const type = decl.type;
    if (type === undefined || type.kind !== ts.SyntaxKind.TypeReference) {
        return false;
    }

    const typeName = (type as ts.TypeReferenceNode).typeName;
    return typeName.kind === ts.SyntaxKind.Identifier && (typeName as ts.Identifier).text === name;
}
