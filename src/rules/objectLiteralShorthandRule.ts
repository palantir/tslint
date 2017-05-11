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

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "object-literal-shorthand",
        description: "Enforces use of ES6 object literal shorthand when possible.",
        hasFix: true,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static LONGHAND_PROPERTY = "Expected property shorthand in object literal ";
    public static LONGHAND_METHOD = "Expected method shorthand in object literal ";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const objectLiteralShorthandWalker = new ObjectLiteralShorthandWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(objectLiteralShorthandWalker);
    }
}

class ObjectLiteralShorthandWalker extends Lint.RuleWalker {

    public visitPropertyAssignment(node: ts.PropertyAssignment) {
        const name = node.name;
        const value = node.initializer;

        if (name.kind === ts.SyntaxKind.Identifier &&
            value.kind === ts.SyntaxKind.Identifier &&
            name.getText() === value.getText()) {
                // Delete from name start up to value to include the ':'.
                const lengthToValueStart = value.getStart() - name.getStart();
                const fix = this.deleteText(name.getStart(), lengthToValueStart);
                this.addFailureAtNode(node, `${Rule.LONGHAND_PROPERTY}('{${name.getText()}}').`, fix);
        }

        if (value.kind === ts.SyntaxKind.FunctionExpression) {
            const fnNode = value as ts.FunctionExpression;
            if (fnNode.name !== undefined) {
                return;  // named function expressions are OK.
            }
            const star = fnNode.asteriskToken !== undefined ? fnNode.asteriskToken.getText() : "";
            this.addFailureAtNode(node, `${Rule.LONGHAND_METHOD}('{${name.getText()}${star}() {...}}').`);
        }

        super.visitPropertyAssignment(node);
    }
}
