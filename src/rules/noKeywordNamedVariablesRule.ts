/*
 * Copyright 2014 Palantir Technologies, Inc.
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
import * as Lint from "../lint";
import * as ts from "typescript";

const BAD_NAMES = [ "any", "Number", "number", "String", "string", "Boolean", "boolean", "undefined" ];

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "variable name clashes with keyword/type: ";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoKeywordNamedVariablesWalker(sourceFile, this.getOptions()));
    }
}

class NoKeywordNamedVariablesWalker extends Lint.RuleWalker {
    public visitBindingElement(node: ts.BindingElement) {
        if (node.name.kind === ts.SyntaxKind.Identifier) {
            this.handleVariableName(<ts.Identifier> node.name);
        }
        super.visitBindingElement(node);
    }

    public visitParameterDeclaration(node: ts.ParameterDeclaration) {
        if (node.name.kind === ts.SyntaxKind.Identifier) {
            this.handleVariableName(<ts.Identifier> node.name);
        }
        super.visitParameterDeclaration(node);
    }

    public visitVariableDeclaration(node: ts.VariableDeclaration) {
        if (node.name.kind === ts.SyntaxKind.Identifier) {
            this.handleVariableName(<ts.Identifier> node.name);
        }
        super.visitVariableDeclaration(node);
    }

    private handleVariableName(name: ts.Identifier) {
        const variableName = name.text;

        if(BAD_NAMES.indexOf(variableName) !== -1) {
            this.addFailure(this.createFailure(name.getStart(), name.getWidth(), Rule.FAILURE_STRING));
        }
    }
}
