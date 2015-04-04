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

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING_PART = " cannot be declared in the constructor";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoConstructorVariableDeclarationsWalker(sourceFile, this.getOptions()));
    }
}

export class NoConstructorVariableDeclarationsWalker extends Lint.RuleWalker {

    public visitConstructorDeclaration(node: ts.ConstructorDeclaration): void {
        var parameters = node.parameters;
        parameters.forEach((parameter) => {
            if (parameter.modifiers != null && parameter.modifiers.length > 0) {
                var name = <ts.Identifier> parameter.name;
                var errorMessage = "'" + name.text + "'" + Rule.FAILURE_STRING_PART;

                var lastModifier = parameter.modifiers[parameter.modifiers.length - 1];
                var position = lastModifier.getEnd() - parameter.getStart();

                this.addFailure(this.createFailure(parameter.getStart(), position, errorMessage));
            }
        });
        super.visitConstructorDeclaration(node);
    }
}
