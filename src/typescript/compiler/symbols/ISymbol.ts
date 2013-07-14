///<reference path='..\Syntax\SyntaxNode.ts' />
///<reference path='Accessibility.ts' />
///<reference path='MethodKind.ts' />
///<reference path='IMemberSymbol.ts' />
///<reference path='ISymbolVisitor.ts' />
///<reference path='SymbolDisplay.ts' />
///<reference path='SymbolDisplay.Format.ts' />
///<reference path='SymbolKind.ts' />
///<reference path='TypeKind.ts' />

interface ISymbol {
    kind(): SymbolKind;

    /// <summary>
    /// Gets the symbol name. Returns the empty string if unnamed.
    /// </summary>
    name(): string;

    /// <summary>
    /// Gets the immediately containing symbol.
    /// </summary>
    containingSymbol(): ISymbol;

    /// <summary>
    /// Gets the containing type. Returns null if the symbol is not contained within a type.
    /// </summary>
    containingType(): IObjectTypeSymbol;

    /// <summary>
    /// Gets the nearest enclosing module. Returns null if the symbol isn't contained in a module.
    /// </summary>
    containingModule(): IModuleSymbol;

    locations(): ILocation[];

    // True if this symbol is a definition.  False if it not (i.e. it is a constructed generic
    // symbol).
    isDefinition(): boolean;

    /// <summary>
    /// Gets the the original definition of the symbol. If this symbol is derived from another symbol,
    /// by type substitution for instance, this gets the original symbol, as it was defined in source.
    /// </summary>
    originalDefinition(): ISymbol;

    // True if this symbol was automatically generated based on the absense of the normal construct
    // that would usually cause it to be created.  For example, a class with no 'constructor' 
    // node will still have a symbol for the constructor synthesized.  
    isImplicitlyDeclared(): boolean;

    // Returns true if this symbol can be referenced by its name in code.
    canBeReferencedByName(): boolean;

    accessibility(): Accessibility;

    accept(visitor: ISymbolVisitor): any;

    toSymbolDisplayParts(format: SymbolDisplay.Format): SymbolDisplay.Part[];

    isStatic(): boolean;

    isType(): boolean;
    isSignature(): boolean;
    isMember(): boolean;
    isPrimitiveType(): boolean;
    isObjectType(): boolean;
    isArrayType(): boolean;
}

/// Represents any symbol that has type parameters.
interface IGenericSymbol extends ISymbol {
    /// <summary>
    /// Returns the type parameters that this type has. If this is a non-generic type,
    /// returns an empty ReadOnlyArray.  
    /// </summary>
    typeParameters(): ITypeParameterSymbol[];

    /// <summary>
    /// Returns the type arguments that have been substituted for the type parameters. 
    /// If nothing has been substituted for a give type parameters,
    /// then the type parameter itself is consider the type argument.
    /// </summary>
    typeArguments(): ITypeSymbol[];

    /// <summary>
    /// Get the original definition of this type symbol. If this symbol is derived from another
    /// symbol by (say) type substitution, this gets the original symbol, as it was defined in
    /// source.
    /// </summary>
    originalDefinition(): IGenericSymbol;
}

/// <summary>
/// Represents a parameter of a method or property.
/// </summary>
interface IParameterSymbol extends ISymbol {
    /// <summary>
    /// Returns true if the parameter was declared as a parameter array. 
    /// </summary>
    isRest(): boolean;

    /// <summary>
    /// Returns true if the parameter is optional.
    /// </summary>
    isOptional(): boolean;

    /// <summary>
    /// Gets the type of the parameter.
    /// </summary>
    type(): ITypeSymbol;

    /// <summary>
    /// Gets the ordinal position of the parameter. The first parameter has ordinal zero.
    /// </summary>
    ordinal(): number;

    /// <summary>
    /// Returns true if the parameter specifies a default value to be passed
    /// when no value is provided as an argument to a call. The default value
    /// can be obtained with the DefaultValue property.
    /// </summary>
    hasValue(): boolean;

    /// <summary>
    /// Returns the default value of the parameter. 
    /// </summary>
    value(): any;

    /// The associated variable if this parameter caused a field to be generated.
    associatedVariable(): IVariableSymbol;
}

/// Represents any symbol that takes parameters.
interface IParameterizedSymbol extends ISymbol {
    parameters(): IParameterSymbol[];
}

interface IModuleOrTypeSymbol extends ISymbol {
}

interface IModuleSymbol extends IMemberSymbol, IModuleOrTypeSymbol {
    isGlobalModule(): boolean;

    memberCount(): number;
    memberAt(index: number): IMemberSymbol;
}