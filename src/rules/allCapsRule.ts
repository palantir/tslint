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

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "all-caps variables must be const";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new AllCapsWalker(sourceFile, this.getOptions()));
    }
}

class AllCapsWalker extends Lint.RuleWalker {
    public visitVariableDeclaration(node: ts.VariableDeclaration) {
        const variableName = node.name.getText();
        const isConst = Lint.isNodeFlagSet(node.parent, ts.NodeFlags.Const);
        if (!isConst && this.isUpperCase(variableName)) {
            this.addFailure(this.createFailure(node.name.getStart(), node.name.getWidth(), Rule.FAILURE_STRING));
        }

        super.visitVariableDeclaration(node);
    }

    private isUpperCase(name: string) {
        return name === name.toUpperCase();
    }
}
