/*
 * Copyright 2015 Palantir Technologies, Inc.
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

var OPTION_LEADING_UNDERSCORE = "no-var-keyword";

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "use of the var-keyword is disallowed, use 'let' or 'const' instead";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        var noVarKeywordWalker = new NoVarKeywordWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(noVarKeywordWalker);
    }
}

class NoVarKeywordWalker extends Lint.RuleWalker {
    private skipVariableDeclaration = false;

    public visitVariableStatement(node: ts.VariableStatement): void {
        if (this.hasModifier(node.modifiers, ts.SyntaxKind.ExportKeyword) ||
            this.hasModifier(node.modifiers, ts.SyntaxKind.DeclareKeyword)) {
            this.skipVariableDeclaration = true;
        }

        super.visitVariableStatement(node);
        this.skipVariableDeclaration = false;
    }

    public visitVariableDeclaration(node: ts.VariableDeclaration) {

        if (!this.skipVariableDeclaration) {
            var flags = node.parent.flags;
            var name = (<ts.Identifier> node.name);
            var declarationIsLet = (Math.floor(flags / ts.NodeFlags.Let) % 2) === 1;
            var declarationIsConst = (Math.floor(flags / ts.NodeFlags.Const) % 2) === 1;
            if (!declarationIsConst && !declarationIsLet) {
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
            }
        }

        super.visitVariableDeclaration(node);
    }

    private hasModifier(modifiers: ts.ModifiersArray, modifierKind: ts.SyntaxKind) {
        if (modifiers == null) {
            return false;
        }
        for (var i = 0; i < modifiers.length; i++) {
            var modifier = modifiers[i];
            if (modifier.kind === modifierKind) {
                return true;
            }
        }
        return false;
    }

}
