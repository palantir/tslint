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
    static FAILURE_STRING = "name must be in pascal case";

    public apply(source: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NameWalker(source, this.getOptions()));
    }
}

class NameWalker extends Lint.RuleWalker {
    public visitClassDeclaration(node: ts.ClassDeclaration): void {
        var className = node.name.getText();
        if (!this.isPascalCased(className)) {
            this.addFailureAt(node.name.getStart(), node.name.getWidth());
        }

        super.visitClassDeclaration(node);
    }

    public visitInterfaceDeclaration(node: ts.InterfaceDeclaration): void {
        var interfaceName = node.name.getText();
        if (!this.isPascalCased(interfaceName)) {
            this.addFailureAt(node.name.getStart(), node.name.getWidth());
        }

        super.visitInterfaceDeclaration(node);
    }

    private isPascalCased(name: string): boolean {
        if (name.length <= 0) {
            return true;
        }

        var firstCharacter = name.charAt(0);
        return ((firstCharacter === firstCharacter.toUpperCase()) && name.indexOf("_") === -1);
    }

    private addFailureAt(position: number, width: number) {
        var failure = this.createFailure(position, width, Rule.FAILURE_STRING);
        this.addFailure(failure);
    }

}
