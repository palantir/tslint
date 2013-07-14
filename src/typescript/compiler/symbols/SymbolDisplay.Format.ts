
module SymbolDisplay {
    /// <summary>
    /// Specifies the options for whether types are qualified when displayed in the description of a symbol.
    /// </summary>
    export enum TypeQualificationStyle {
        /// <summary>
        /// e.g. Class1
        /// </summary>
        NameOnly,

        /// <summary>
        /// ParentClass.NestedClass
        /// </summary>
        NameAndContainingModules,
    }

    export enum TypeOptions {
        None = 0,
        InlineAnonymousTypes = 1 << 0,
    }

    export enum GenericsOptions {
        /// <summary>
        /// Omit generics entirely.
        /// </summary>
        None = 0,

        /// <summary>
        /// Type parameters. e.g. "Foo&lt;T&gt;".
        /// </summary>
        IncludeTypeArguments = 1 << 0,

        /// <summary>
        /// Type parameter constraints.  e.g. "<T extends Foo>".
        /// </summary>
        IncludeTypeConstraints = 1 << 1,
    }

    /// <summary>
    /// Specifies the options for how members are displayed in the description of a symbol.
    /// </summary>
    export enum MemberOptions {
        /// <summary>
        /// Display only the name of the member.
        /// </summary>
        None = 0,

        /// <summary>
        /// Include the (return) type of the method/field/property.
        /// </summary>
        IncludeType = 1 << 0,

        /// <summary>
        /// Include modifiers.  e.g. "static"
        /// </summary>
        IncludeModifiers = 1 << 1,

        /// <summary>
        /// Include accessibility.  e.g. "public"
        /// </summary>
        IncludeAccessibility = 1 << 2,

        /// <summary>
        /// Include method/indexer parameters.  (See ParameterFlags for fine-grained settings.)
        /// </summary>
        IncludeParameters = 1 << 4,

        /// <summary>
        /// Include the name of the containing type.
        /// </summary>
        IncludeContainingType = 1 << 5,

        /// <summary>
        /// Include the value of the member if is a constant.
        /// </summary>
        IncludeConstantValue = 1 << 6,
    }

    /// <summary>
    /// Specifies the options for how parameters are displayed in the description of a symbol.
    /// </summary>
    export enum ParameterOptions {
        /// <summary>
        /// If MemberFlags.IncludeParameters is set, but this value is used, then only the parentheses will be shown
        /// (e.g. M()).
        /// </summary>
        None = 0,

        /// <summary>
        /// Include the params/public/.../etc. parameters.
        /// </summary>
        IncludeModifiers = 1 << 1,

        /// <summary>
        /// Include the parameter type.
        /// </summary>
        IncludeType = 1 << 2,

        /// <summary>
        /// Include the parameter name.
        /// </summary>
        IncludeName = 1 << 3,

        /// <summary>
        /// Include the parameter default value.
        /// </summary>
        IncludeDefaultValue = 1 << 4,
    }

    /// <summary>
    /// Specifies the options for how property/event accessors are displayed in the description of a symbol.
    /// </summary>
    export enum AccessorStyle {
        /// <summary>
        /// Only show the name of the property (formatted using MemberFlags).
        /// </summary>
        NameOnly,

        /// <summary>
        /// Show the getter and/or setter of the property.
        /// </summary>
        ShowAccessors,
    }

    /// <summary>
    /// Specifies the options for how locals are displayed in the description of a symbol.
    /// </summary>
    export enum LocalOptions {
        /// <summary>
        /// Only show the name of the local. (e.g. "x").
        /// </summary>
        None = 0,

        /// <summary>
        /// Include the type of the local. (e.g. "x : number").
        /// </summary>
        IncludeType = 1 << 0,

        /// <summary>
        /// Include the value of the local if is a constant. (e.g. "x : number = 1").
        /// </summary>
        IncludeConstantValue = 1 << 1,
    }

    /// <summary>
    /// Specifies the options for whether the type's kind should be displayed in the description of a symbol.
    /// </summary>
    export enum KindOptions {
        /// <summary>
        /// None
        /// </summary>
        None = 0,

        /// <summary>
        /// Use the type's kind.  e.g. "class M1.C1" instead of "M1.C1"
        /// </summary>
        IncludeKind = 1 << 0,
    }

    export class Format {
        /// <summary>
        /// Determines how types are qualified (e.g. Nested vs Containing.Nested vs Namespace.Containing.Nested).
        /// </summary>
        private _typeQualificationStyle: TypeQualificationStyle;

        private _typeOptions: TypeOptions;

        /// <summary>
        /// Determines how generics (on types and methods) should be described (i.e. level of detail).
        /// </summary>
        private _genericsOptions: GenericsOptions;

        /// <summary>
        /// Formatting options that apply to fields, properties, and methods.
        /// </summary>
        private _memberOptions: MemberOptions;

        /// <summary>
        /// Formatting options that apply to method and indexer parameters (i.e. level of detail).
        /// </summary>
        private _parameterOptions: ParameterOptions;

        /// <summary>
        /// Determines how properties are displayed. "Prop" vs "Prop { get; set; }"
        /// </summary>
        private _accessorStyle: AccessorStyle;

        /// <summary>
        /// Determines how local variables are displayed.
        /// </summary>
        private _localOptions: LocalOptions;

        /// <summary>
        /// Formatting options that apply to types.
        /// </summary>
        private _kindOptions: KindOptions;

        constructor(typeQualificationStyle: TypeQualificationStyle = TypeQualificationStyle.NameOnly,
            typeOptions: TypeOptions = TypeOptions.None,
            genericsOptions: GenericsOptions = GenericsOptions.None,
            memberOptions: MemberOptions = MemberOptions.None,
            parameterOptions: ParameterOptions = ParameterOptions.None,
            accessorStyle: AccessorStyle = AccessorStyle.NameOnly,
            localOptions: LocalOptions = LocalOptions.None,
            kindOptions: KindOptions = KindOptions.None) {
            this._typeQualificationStyle = typeQualificationStyle;
            this._typeOptions = typeOptions;
            this._genericsOptions = genericsOptions;
            this._memberOptions = memberOptions;
            this._parameterOptions = parameterOptions;
            this._accessorStyle = accessorStyle;
            this._localOptions = localOptions;
            this._kindOptions = kindOptions;
        }

        public typeQualificationStyle(): TypeQualificationStyle {
            return this._typeQualificationStyle;
        }

        public typeOptions(): TypeOptions {
            return this._typeOptions;
        }

        public genericsOptions(): GenericsOptions {
            return this._genericsOptions;
        }

        public memberOptions(): MemberOptions {
            return this._memberOptions;
        }
    }

    export var errorMessageFormat: Format =
        new Format(
            TypeQualificationStyle.NameAndContainingModules,
            TypeOptions.InlineAnonymousTypes,
            GenericsOptions.IncludeTypeArguments,
            MemberOptions.IncludeParameters | MemberOptions.IncludeContainingType,
            ParameterOptions.IncludeModifiers | ParameterOptions.IncludeType,
            AccessorStyle.NameOnly);

    /// <summary>
    /// Fully qualified name format.
    /// </summary>
    //export var fullyQualifiedFormat: Format =
    //    new Format(
    //        TypeQualificationStyle.NameAndContainingModules,
    //        GenericsOptions.IncludeTypeParameters);

    /// <summary>
    /// Format used by default when asking to minimally qualify a symbol.
    /// </summary>
    export var minimallyQualifiedFormat: Format =
        new Format(
            TypeQualificationStyle.NameOnly,
            TypeOptions.None,
            GenericsOptions.IncludeTypeArguments,
            MemberOptions.IncludeParameters | MemberOptions.IncludeType | MemberOptions.IncludeContainingType,
            ParameterOptions.IncludeName | ParameterOptions.IncludeType | ParameterOptions.IncludeModifiers | ParameterOptions.IncludeDefaultValue,
            AccessorStyle.NameOnly,
            LocalOptions.IncludeType);
}