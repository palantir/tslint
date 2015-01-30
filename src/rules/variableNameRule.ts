/*
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

///<reference path='../../lib/tslint.d.ts' />

var OPTION_LEADING_UNDERSCORE = "allow-leading-underscore";

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "variable name must be in camelcase or uppercase";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        var variableNameWalker = new VariableNameWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(variableNameWalker);
    }
}

class VariableNameWalker extends Lint.RuleWalker {
    public visitPropertyDeclaration(node: ts.PropertyDeclaration) {
        if (node.name != null && node.name.kind === ts.SyntaxKind.Identifier) {
            this.handleVariableName(<ts.Identifier> node.name);
        }
        super.visitPropertyDeclaration(node);
    }

    public visitVariableDeclaration(node: ts.VariableDeclaration) {
        this.handleVariableName(node.name);
        super.visitVariableDeclaration(node);
    }

    public visitVariableStatement(node: ts.VariableStatement) {
        // skip 'declare' keywords
        var hasDeclareModifier = (node.modifiers != null) &&
                (node.modifiers.length > 0) &&
                (node.modifiers[0].kind === ts.SyntaxKind.DeclareKeyword);

        if (!hasDeclareModifier) {
            super.visitVariableStatement(node);
        }
    }

    private handleVariableName(name: ts.Identifier) {
        var variableName = name.text;

        if (!this.isCamelCase(variableName) && !this.isUpperCase(variableName)) {
            this.addFailure(this.createFailure(name.getStart(), name.getWidth(), Rule.FAILURE_STRING));
        }
    }

    private isCamelCase(name: string) {
        var firstCharacter = name.charAt(0);
        var rest = name.substring(1);

        if (name.length <= 0) {
            return true;
        } else if (!this.hasOption(OPTION_LEADING_UNDERSCORE) && firstCharacter === "_") {
            return false;
        }

        return firstCharacter === firstCharacter.toLowerCase() && rest.indexOf("_") === -1;
    }

    private isUpperCase(name: string) {
        return name === name.toUpperCase();
    }
}
