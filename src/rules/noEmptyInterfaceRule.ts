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

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-empty-interface",
        description: "Forbids empty interfaces.",
        rationale: "An empty interface is equivalent to its supertype (or `{}`).",
        optionsDescription: "Not configurable.",
        options: null,
        type: "typescript",
        typescriptOnly: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "An empty interface is equivalent to `{}`.";
    public static FAILURE_STRING_FOR_EXTENDS = "An interface declaring no members is equivalent to its supertype.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new Walker(sourceFile, this.getOptions()));
    }
}

class Walker extends Lint.RuleWalker {
    public visitInterfaceDeclaration(node: ts.InterfaceDeclaration) {
        if (node.members.length === 0 &&
            (node.heritageClauses === undefined ||
             node.heritageClauses[0].types === undefined ||
             // allow interfaces that extend 2 or more interfaces
             node.heritageClauses[0].types!.length < 2)) {
            this.addFailureAtNode(node.name, node.heritageClauses ? Rule.FAILURE_STRING_FOR_EXTENDS : Rule.FAILURE_STRING);
        }
    }
}
