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
        ruleName: "no-let-undefined",
        description: "Forbids a 'let' statement to be initialized to 'undefined'.",
        hasFix: true,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Unnecessary initialization to 'undefined'.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new Walker(sourceFile, this.getOptions()));
    }
}

class Walker extends Lint.RuleWalker {
    public visitVariableDeclaration(node: ts.VariableDeclaration) {
        if (Lint.isNodeFlagSet(node.parent!, ts.NodeFlags.Let) && isUndefined(node.initializer)) {
            const fix = this.createFix(this.deleteFromTo(
                Lint.childOfKind(node, ts.SyntaxKind.EqualsToken)!.pos,
                node.end));
            this.addFailureAtNode(node, Rule.FAILURE_STRING, fix);
        }
        super.visitVariableDeclaration(node);
    }
}

function isUndefined(node: ts.Node | undefined): boolean {
    return node !== undefined && node.kind === ts.SyntaxKind.Identifier && (node as ts.Identifier).text === "undefined";
}
