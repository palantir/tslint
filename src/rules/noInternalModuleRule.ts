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
import * as Lint from "../lint";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-internal-module",
        description: "Disallows internal `module`",
        rationale: "Using `module` leads to a confusion of concepts with external modules. Use the newer `namespace` keyword instead.",
        optionsDescription: "Not configurable.",
        options: {},
        optionExamples: ["true"],
        type: "typescript",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "forbidden internal module";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoInternalModuleWalker(sourceFile, this.getOptions()));
    }
}

class NoInternalModuleWalker extends Lint.RuleWalker {
    public visitModuleDeclaration(node: ts.ModuleDeclaration) {
        if (this.isInternalModuleDeclaration(node)) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }
        super.visitModuleDeclaration(node);
    }

    private isInternalModuleDeclaration(node: ts.ModuleDeclaration) {
        // an internal module declaration is not a namespace or a nested declaration
        // for external modules, node.name.kind will be a LiteralExpression instead of Identifier
        return !Lint.isNodeFlagSet(node, ts.NodeFlags.Namespace)
            && !Lint.isNestedModuleDeclaration(node)
            && node.name.kind === ts.SyntaxKind.Identifier
            && !isGlobalAugmentation(node);
    }
}

function isGlobalAugmentation(node: ts.ModuleDeclaration) {
    // augmenting global uses a sepcial syntax that is allowed
    // see https://github.com/Microsoft/TypeScript/pull/6213
    return node.name.kind === ts.SyntaxKind.Identifier && node.name.text === "global";
}
