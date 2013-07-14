// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='..\typescript.ts' />

module TypeScript {

    export enum PullElementFlags {
        None = 0,
        Exported = 1,
        Private = 1 << 1,
        Public = 1 << 2,
        Ambient = 1 << 3,
        Static = 1 << 4,
        GetAccessor = 1 << 5,
        SetAccessor = 1 << 6,
        Optional = 1 << 7,
        Call = 1 << 8,
        Constructor = 1 << 9,
        Index = 1 << 10,
        Signature = 1 << 11,
        Enum = 1 << 12,
        FatArrow = 1 << 13,

        ClassConstructorVariable = 1 << 14,
        InitializedModule = 1 << 15,
        InitializedDynamicModule = 1 << 16,
        InitializedEnum = 1 << 17,

        MustCaptureThis = 1 << 18,
        Constant = 1 << 19,

        ExpressionElement = 1 << 20,

        DeclaredInAWithBlock = 1 << 21,

        ImplicitVariable = ClassConstructorVariable | InitializedModule | InitializedDynamicModule | InitializedEnum,
        SomeInitializedModule = InitializedModule | InitializedDynamicModule | InitializedEnum,
    }

    export enum PullElementKind {
        None = 0,
        Global = 0,

        Script = 1,
        Primitive = 1 << 1,

        Container = 1 << 2,
        Class = 1 << 3,
        Interface = 1 << 4,
        DynamicModule = 1 << 5,
        Enum = 1 << 6,
        Array = 1 << 7,
        TypeAlias = 1 << 8,
        ObjectLiteral = 1 << 9,

        Variable = 1 << 10,
        Parameter = 1 << 11,
        Property = 1 << 12,
        TypeParameter = 1 << 13,

        Function = 1 << 14,
        ConstructorMethod = 1 << 15,
        Method = 1 << 16,
        FunctionExpression = 1 << 17,

        GetAccessor = 1 << 18,
        SetAccessor = 1 << 19,

        CallSignature = 1 << 20,
        ConstructSignature = 1 << 21,
        IndexSignature = 1 << 22,

        ObjectType = 1 << 23,
        FunctionType = 1 << 24,
        ConstructorType = 1 << 25,

        EnumMember = 1 << 26,
        ErrorType = 1 << 27,

        Expression = 1 << 28,

        WithBlock = 1 << 29,
        CatchBlock = 1 << 30,

        // WARNING: To prevent JS VMs from wrapping these values as floats, we don't want to utilize more than the 31 bits above.  (Doing so would
        // seriously slow down bitwise operations

        All = Script | Global | Primitive | Container | Class | Interface | DynamicModule | Enum | Array | TypeAlias |
            ObjectLiteral | Variable | Parameter | Property | TypeParameter | Function | ConstructorMethod | Method |
            FunctionExpression | GetAccessor | SetAccessor | CallSignature | ConstructSignature | IndexSignature | ObjectType |
            FunctionType | ConstructorType | EnumMember | ErrorType | Expression | WithBlock | CatchBlock,

        SomeFunction = Function | ConstructorMethod | Method | FunctionExpression | GetAccessor | SetAccessor | CallSignature | ConstructSignature | IndexSignature,

        // Warning: SomeValue and SomeType (along with their constituents) must be disjoint
        SomeValue = Variable | Parameter | Property | EnumMember | SomeFunction,

        SomeType = Script | Global | Primitive | Class | Interface |
                    Enum | Array | ObjectType | FunctionType | ConstructorType | TypeParameter | ErrorType,

        AcceptableAlias = Variable | SomeFunction | Class | Interface | Enum | Container | ObjectType | FunctionType | ConstructorType,

        SomeContainer = Container | DynamicModule | TypeAlias,

        SomeBlock = WithBlock | CatchBlock,

        SomeSignature = CallSignature | ConstructSignature | IndexSignature,

        SomeAccessor = GetAccessor | SetAccessor,

        SomeTypeReference = Interface | ObjectType | FunctionType | ConstructorType,

        SomeLHS = Variable | Property | Parameter | SetAccessor | Method,

        InterfaceTypeExtension = Interface | Class | Enum,
        ClassTypeExtension = Interface | Class,
        EnumTypeExtension = Interface | Enum,
    }

    export enum SymbolLinkKind {
        TypedAs,
        ContextuallyTypedAs,
        ProvidesInferredType,
        ArrayType,

        ArrayOf,

        PublicMember,
        PrivateMember,

        ConstructorMethod,

        Aliases,
        ExportAliases,

        ContainedBy,

        Extends,
        Implements,

        Parameter,
        ReturnType,

        CallSignature,
        ConstructSignature,
        IndexSignature,

        TypeParameter,
        TypeArgument,
        TypeParameterSpecializedTo,
        SpecializedTo,

        TypeConstraint,

        ContributesToExpression,

        GetterFunction,
        SetterFunction,
    }
}