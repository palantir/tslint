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
        ruleName: "class-name",
        description: "Enforces PascalCased class and interface names.",
        rationale: "Makes it easy to differentiate classes from regular variables at a glance.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Class name must be in pascal case";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NameWalker(sourceFile, this.getOptions()));
    }
}

class NameWalker extends Lint.RuleWalker {
    public visitClassDeclaration(node: ts.ClassDeclaration) {
        // classes declared as default exports will be unnamed
        if (node.name != null) {
            const className = node.name.getText();
            if (!this.isPascalCased(className)) {
                this.addFailureAtNode(node.name, Rule.FAILURE_STRING);
            }
        }

        super.visitClassDeclaration(node);
    }

    public visitInterfaceDeclaration(node: ts.InterfaceDeclaration) {
        const interfaceName = node.name.getText();
        if (!this.isPascalCased(interfaceName)) {
            this.addFailureAtNode(node.name, Rule.FAILURE_STRING);
        }

        super.visitInterfaceDeclaration(node);
    }

    private isPascalCased(name: string) {
        if (name.length <= 0) {
            return true;
        }

        const firstCharacter = name.charAt(0);
        return ((firstCharacter === firstCharacter.toUpperCase()) && name.indexOf("_") === -1);
    }
}
