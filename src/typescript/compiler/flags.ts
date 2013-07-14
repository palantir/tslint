//
// Copyright (c) Microsoft Corporation.  All rights reserved.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

///<reference path='typescript.ts' />

module TypeScript {

    export function hasFlag(val: number, flag: number): boolean {
        return (val & flag) !== 0;
    }

    export function withoutFlag(val: number, flag: number): number {
        return val & ~flag;
    }

    export enum ASTFlags {
        None = 0,
        SingleLine = 1 << 1,
        OptionalName = 1 << 2,
        TypeReference = 1 << 3,
        EnumElement = 1 << 4,
        EnumMapElement = 1 << 5,
    }

    export enum DeclFlags {
        None = 0,
        Exported = 1,
        Private = 1 << 1,
        Public = 1 << 2,
        Ambient = 1 << 3,
        Static = 1 << 4,
    }

    export enum ModuleFlags {
        None = 0,
        Exported = 1,
        Private = 1 << 1,
        Public = 1 << 2,
        Ambient = 1 << 3,
        Static = 1 << 4,
        IsEnum = 1 << 7,
        IsWholeFile = 1 << 8,
        IsDynamic = 1 << 9,
    }

    export enum VariableFlags {
        None = 0,
        Exported = 1,
        Private = 1 << 1,
        Public = 1 << 2,
        Ambient = 1 << 3,
        Static = 1 << 4,
        Property = 1 << 8,
        ClassProperty = 1 << 11,
        Constant = 1 << 12,
        EnumElement = 1 << 13
    }

    export enum FunctionFlags {
        None = 0,
        Exported = 1,
        Private = 1 << 1,
        Public = 1 << 2,
        Ambient = 1 << 3,
        Static = 1 << 4,
        GetAccessor = 1 << 5,
        SetAccessor = 1 << 6,
        Signature = 1 << 7,
        Method = 1 << 8,
        CallMember = 1 << 9,
        ConstructMember = 1 << 10,
        IsFatArrowFunction = 1 << 11,
        IndexerMember = 1 << 12,
        IsFunctionExpression = 1 << 13,
        IsFunctionProperty = 1 << 14,       // function property in an object literal expression
    }

    export function ToDeclFlags(functionFlags: FunctionFlags) : DeclFlags;
    export function ToDeclFlags(varFlags: VariableFlags) : DeclFlags;
    export function ToDeclFlags(moduleFlags: ModuleFlags): DeclFlags;
    export function ToDeclFlags(fncOrVarOrModuleFlags: any) {
        return <DeclFlags>fncOrVarOrModuleFlags;
    }

    export enum TypeRelationshipFlags {
        SuccessfulComparison = 0,
        RequiredPropertyIsMissing = 1 << 1,
        IncompatibleSignatures = 1 << 2,
        SourceSignatureHasTooManyParameters = 3,
        IncompatibleReturnTypes = 1 << 4,
        IncompatiblePropertyTypes = 1 << 5,
        IncompatibleParameterTypes = 1 << 6,
        InconsistantPropertyAccesibility = 1 << 7,
    }

    export enum ModuleGenTarget {
        Synchronous = 0,
        Asynchronous = 1,
    }
}