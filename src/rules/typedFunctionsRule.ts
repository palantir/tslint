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

/// <reference path="../../lib/tslint.d.ts" />

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "missing type declaration";

    public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[] {
        return this.applyWithWalker(<Lint.RuleWalker>(new TypedDefinitionWalker(syntaxTree)));
    }
}

class TypedDefinitionWalker extends Lint.RuleWalker {

    public visitCallSignature(node: TypeScript.CallSignatureSyntax): void {
        this.validateReturnType(node);

        var parameters = node.parameterList.parameters;
        this.validateFunctionParameters(parameters);
    }

    private validateReturnType(callSignature: TypeScript.CallSignatureSyntax): void {
        var returnType = callSignature.typeAnnotation;
        if (returnType === null) {
            this.addFailure(this.createFailure(
                this.positionAfter(callSignature.parameterList),
                1,
                "expected function to have a return type."
            ));
        }
    }

    private validateFunctionParameters(parameters: TypeScript.ISeparatedSyntaxList): void {
        for (var i = 0; i < parameters.childCount(); i++) {
            var child = parameters.childAt(i);
            if (child.kind() === TypeScript.SyntaxKind.Parameter) {
                var parameter = <TypeScript.ParameterSyntax>child;
                if (parameter.typeAnnotation === null) {
                    this.addFailure(this.createFailure(
                        this.positionAfter(parameter.identifier),
                        1,
                        "expected " + parameter.identifier.text() + " to have a type."
                    ));
                }
            }
        }
    }
}
