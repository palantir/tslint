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

import * as utils from "tsutils";
import * as ts from "typescript";

const OUTSIDE_CONSTRUCTOR = -1;
const DIRECTLY_INSIDE_CONSTRUCTOR = OUTSIDE_CONSTRUCTOR + 1;

interface VariableModifications {
    toMember?: boolean;
    toStatic?: boolean;
}

export type ParameterOrPropertyDeclaration = ts.ParameterDeclaration | ts.PropertyDeclaration;

function typeIsOrHasBaseType(type: ts.Type, parentType: ts.Type) {
    if (type.symbol === undefined || parentType.symbol === undefined) {
        return false;
    }

    for (const baseType of [type, ...type.getBaseTypes()]) {
        if (baseType.symbol !== undefined && baseType.symbol.name === parentType.symbol.name) {
            return true;
        }
    }

    return false;
}

export class ClassScope {
    private readonly privateModifiableMembers = new Map<string, ParameterOrPropertyDeclaration>();
    private readonly privateModifiableStatics = new Map<string, ParameterOrPropertyDeclaration>();
    private readonly variableModifications = new Map<string, VariableModifications>();

    private readonly typeChecker: ts.TypeChecker;
    private readonly classType: ts.Type;

    private constructorScopeDepth = OUTSIDE_CONSTRUCTOR;

    public constructor(classNode: ts.Node, typeChecker: ts.TypeChecker) {
        this.classType = typeChecker.getTypeAtLocation(classNode);
        this.typeChecker = typeChecker;
    }

    public addDeclaredVariable(node: ParameterOrPropertyDeclaration) {
        if (!utils.isModfierFlagSet(node, ts.ModifierFlags.Private)
            || utils.isModfierFlagSet(node, ts.ModifierFlags.Readonly)) {
            return;
        }

        if (utils.isModfierFlagSet(node, ts.ModifierFlags.Static)) {
            this.privateModifiableStatics.set(node.name.getText(), node);
        } else {
            this.privateModifiableMembers.set(node.name.getText(), node);
        }
    }

    public addVariableModification(node: ts.PropertyAccessExpression) {
        const modifierType = this.typeChecker.getTypeAtLocation(node.expression);
        if (modifierType.symbol === undefined || !typeIsOrHasBaseType(modifierType, this.classType)) {
            return;
        }

        const toStatic = utils.isObjectType(modifierType) && utils.isObjectFlagSet(modifierType, ts.ObjectFlags.Anonymous);
        if (!toStatic && this.constructorScopeDepth === DIRECTLY_INSIDE_CONSTRUCTOR) {
            return;
        }

        const variable = node.name.text;
        const modifications = this.variableModifications.get(variable);
        const toMember = !toStatic;

        if (modifications === undefined) {
            this.variableModifications.set(variable, { toMember, toStatic });
        } else {
            modifications.toMember = modifications.toMember || toMember;
            modifications.toStatic = modifications.toStatic || toStatic;
        }
    }

    public enterConstructor() {
        this.constructorScopeDepth = DIRECTLY_INSIDE_CONSTRUCTOR;
    }

    public exitConstructor() {
        this.constructorScopeDepth = OUTSIDE_CONSTRUCTOR;
    }

    public enterNonConstructorScope() {
        if (this.constructorScopeDepth === DIRECTLY_INSIDE_CONSTRUCTOR) {
            this.constructorScopeDepth += 1;
        }
    }

    public exitNonConstructorScope() {
        if (this.constructorScopeDepth > DIRECTLY_INSIDE_CONSTRUCTOR) {
            this.constructorScopeDepth = Math.max(OUTSIDE_CONSTRUCTOR, this.constructorScopeDepth - 1);
        }
    }

    public finalizeUnmodifiedPrivateNonReadonlys() {
        this.variableModifications.forEach((modifications, variableName) => {
            if (modifications.toMember) {
                this.privateModifiableMembers.delete(variableName);
            }

            if (modifications.toStatic) {
                this.privateModifiableStatics.delete(variableName);
            }
        });

        return [
            ...Array.from(this.privateModifiableMembers.values()),
            ...Array.from(this.privateModifiableStatics.values()),
        ];
    }
}
