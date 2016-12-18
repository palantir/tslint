/**
 * @license
 * Copyright 2016 Palantir Technologies, Inc.
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
import { isTypeFlagSet } from "../language/utils";

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-void-expression",
        description: "Requires expressions of type `void` to appear in statement position.",
        optionsDescription: "Not configurable.",
        options: null,
        requiresTypeInfo: true,
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Expression has type `void`. Put it on its own line as a statement.";

    public applyWithProgram(sourceFile: ts.SourceFile, langSvc: ts.LanguageService): Lint.RuleFailure[] {
        return this.applyWithWalker(new Walker(sourceFile, this.getOptions(), langSvc.getProgram()));
    }
}

class Walker extends Lint.ProgramAwareRuleWalker {
    public visitNode(node: ts.Node) {
        if (isPossiblyVoidExpression(node) && node.parent!.kind !== ts.SyntaxKind.ExpressionStatement && this.isVoid(node)) {
            this.addFailureAtNode(node, Rule.FAILURE_STRING);
        }
        super.visitNode(node);
    }

    private isVoid(node: ts.Node): boolean {
        return isTypeFlagSet(this.getTypeChecker().getTypeAtLocation(node), ts.TypeFlags.Void);
    }
}

function isPossiblyVoidExpression(node: ts.Node): boolean {
    switch (node.kind) {
        case ts.SyntaxKind.AwaitExpression:
        case ts.SyntaxKind.CallExpression:
        case ts.SyntaxKind.TaggedTemplateExpression:
            return true;
        default:
            return false;
    }
}
