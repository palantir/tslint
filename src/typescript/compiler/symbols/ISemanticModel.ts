///<reference path='ICompilation.ts' />
///<reference path='ISymbolInfo.ts' />
///<reference path='ITypeInfo.ts' />

enum LookupOptions {
    /// <summary>
    /// Consider all symbols.
    /// </summary>
    Default = 0,

    /// <summary>
    /// Consider only namespaces and types.
    /// </summary>
    ModulesOrTypesOnly = 1 << 1,
}

interface ISemanticModel {
    compilation(): ICompilation;
    syntaxTree(): SyntaxTree;

    getSymbolInfo(syntaxNode: SyntaxNode, cancellationToken: ICancellationToken): ISymbolInfo;
    getTypeInfo(syntaxNode: SyntaxNode, cancellationToken: ICancellationToken): ITypeInfo;

    getDiagnostics(cancellationToken: ICancellationToken): Diagnostic[];

    /// <summary>
    /// Gets the symbol associated with a declaration syntax node.
    /// </summary>
    /// <param name="declaration">A syntax node that is a declaration. This can be any type
    /// derived from MemberDeclarationSyntax, TypeDeclarationSyntax, EnumDeclarationSyntax,
    /// NamespaceDeclarationSyntax, ParameterSyntax, TypeParameterSyntax, or the alias part of a
    /// UsingDirectiveSyntax</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>The symbol declared by the node or null if the node is not a declaration.</returns>
    getDeclaredSymbol(declaration: SyntaxNode, cancellationToken: ICancellationToken): ISymbol;
    getDeclaredSymbol(declaration: ModuleDeclarationSyntax, cancellationToken: ICancellationToken): IModuleSymbol;
    getDeclaredSymbol(declaration: SourceUnitSyntax, cancellationToken: ICancellationToken): IModuleSymbol;
    getDeclaredSymbol(declaration: ClassDeclarationSyntax, cancellationToken: ICancellationToken): IObjectTypeSymbol;
    getDeclaredSymbol(declaration: InterfaceDeclarationSyntax, cancellationToken: ICancellationToken): IObjectTypeSymbol;
    getDeclaredSymbol(declaration: EnumDeclarationSyntax, cancellationToken: ICancellationToken): IObjectTypeSymbol;
    getDeclaredSymbol(declarator: VariableDeclaratorSyntax, cancellationToken: ICancellationToken): IVariableSymbol;
    
    // TODO: add more getDeclaredSymbol overloads.

    /// <summary>
    /// Gets the available named symbols in the context of the specified location and optional container. Only
    /// symbols that are accessible and visible from the given location are returned.
    /// </summary>
    /// <param name="position">The character position for determining the enclosing declaration scope and
    /// accessibility.</param>
    /// <param name="container">The container to search for symbols within. If null then the enclosing declaration
    /// scope around position is used.</param>
    /// <param name="name">The name of the symbol to find. If null is specified then symbols
    /// with any names are returned.</param>
    /// <param name="arity">The number of generic type parameters the symbol has. If null is specified then symbols
    /// with any arity are returned.</param>
    /// <param name="options">Additional options that affect the lookup process.</param>
    /// <returns>A list of symbols that were found. If no symbols were found, an empty list is returned.</returns>
    /// <remarks>
    /// The "position" is used to determine what variables are visible and accessible. Even if "container" is
    /// specified, the "position" location is significant for determining which members of "containing" are
    /// accessible. 
    /// </remarks>
    lookupSymbols(position: number): ISymbol[];
    lookupSymbols(position: number, container: IModuleOrTypeSymbol): ISymbol[];
    lookupSymbols(position: number, container: IModuleOrTypeSymbol, name: string): ISymbol[];
    lookupSymbols(position: number, container: IModuleOrTypeSymbol, name: string, arity: number): ISymbol[];
    lookupSymbols(position: number, container: IModuleOrTypeSymbol, name: string, arity: number, options: LookupOptions): ISymbol[];

    getMethodGroup(node: SyntaxNode, cancellationToken: ICancellationToken): ISymbol[];

    /// <summary>
    /// Given a position in the SyntaxTree for this ISemanticModel returns the innermost ISymbol
    /// that the position is considered inside of.
    /// </summary>
    getEnclosingSymbol(position: number, cancellationToken: ICancellationToken): ISymbol;

    /// <summary>
    /// Determines if the symbol is accessible from the specified location. 
    /// </summary>
    /// <param name="position">A character position used to identify a declaration scope and
    /// accessibility. This character position must be within the FullSpan of the Root syntax
    /// node in this SemanticModel.
    /// </param>
    /// <param name="symbol">The symbol that we are checking to see if it accessible.</param>
    /// <returns>
    /// True if "symbol is accessible, false otherwise.</returns>
    isAccessible(position: number, symbol: ISymbol): boolean;
}