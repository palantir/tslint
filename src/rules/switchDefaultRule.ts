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
    public static FAILURE_STRING = "Switch statement doesn't include a 'default' case";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new SwitchDefaultWalker(sourceFile, this.getOptions()));
    }
}

export class SwitchDefaultWalker extends Lint.RuleWalker {

    public visitSwitchStatement(node: ts.SwitchStatement) {
        var hasDefaultCase = node.clauses.some((clause) =>
                                               clause.kind === ts.SyntaxKind.DefaultClause);
        if (!hasDefaultCase) {
            this.addFailure(this.createFailure(node.getStart(),
                                               node.getWidth(),
                                               Rule.FAILURE_STRING));
        }
        super.visitSwitchStatement(node);
    }
}
