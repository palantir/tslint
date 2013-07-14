///<reference path='ISymbol.ts' />
///<reference path='ITypeSymbol.ts' />

interface IMemberSymbol extends ISymbol {
}

interface IConstructorSymbol extends IMemberSymbol, IParameterizedSymbol {
}

interface IFunctionSymbol extends IMemberSymbol, IParameterizedSymbol, IGenericSymbol {
    returnType(): ITypeSymbol;
}

/// <summary>
/// Represents a variable in a class, module or enum.
/// </summary>
interface IVariableSymbol extends IMemberSymbol {
    /// <summary>
    /// Gets the type of this field.
    /// </summary>
    type(): ITypeSymbol;

    hasValue(): boolean;

    /// <summary>
    /// Gets the constant value of this field
    /// </summary>
    value(): any;

    /// The parameter this variable was created from if it was created from a parameter.
    associatedParameter(): IParameterSymbol;
}