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
import * as Lint from "../lint";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-default-export",
        description: "Disallows default exports in ES6-style modules.",
        descriptionDetails: "Use named exports instead.",
        rationale: Lint.Utils.dedent`
            Named imports/exports [promote clarity](https://github.com/palantir/tslint/issues/1182#issue-151780453).
            In addition, current tooling differs on the correct way to handle default imports/exports.
            Avoiding them all together can help avoid tooling bugs and conflicts.`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "maintainability",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Use of default exports is forbidden";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoDefaultExportWalker(sourceFile, this.getOptions()));
    }
}

class NoDefaultExportWalker extends Lint.RuleWalker {
    public visitExportAssignment(node: ts.ExportAssignment) {
        const exportMember = node.getChildAt(1);
        if (exportMember != null && exportMember.kind === ts.SyntaxKind.DefaultKeyword) {
            this.addFailure(this.createFailure(exportMember.getStart(), exportMember.getWidth(), Rule.FAILURE_STRING));
        }
        super.visitExportAssignment(node);
    }

    // inline class declaration and function declaration exports use modifiers
    public visitNode(node: ts.Node) {
        if (node.kind === ts.SyntaxKind.DefaultKeyword && node.parent != null) {
            const nodes = node.parent.modifiers;
            if (nodes != null &&
                nodes.length === 2 &&
                nodes[0].kind === ts.SyntaxKind.ExportKeyword &&
                nodes[1].kind === ts.SyntaxKind.DefaultKeyword) {
                    this.addFailure(this.createFailure(nodes[1].getStart(), nodes[1].getWidth(), Rule.FAILURE_STRING));
            }
        }
        super.visitNode(node);
    }
}
