///<reference path='..\Syntax\SyntaxTree.ts' />
///<reference path='..\Core\ICancellationToken.ts' />
///<reference path='ISemanticModel.ts' />
///<reference path='ISymbol.ts' />

interface ICompilation {
    /// <summary>
    /// Gets the syntax trees (parsed from source code) that this compilation was created with.
    /// </summary>
    syntaxTrees(): SyntaxTree[];

    getSemanticModel(syntaxTree: SyntaxTree): ISemanticModel;

    addSyntaxTrees(...syntaxTrees: SyntaxTree[]): void;

    removeSyntaxTrees(...syntaxTrees: SyntaxTree[]): void;

    replaceSyntaxTree(oldSyntaxTree: SyntaxTree, newSyntaxTree: SyntaxTree): void;

    containsSyntaxTree(syntaxTree: SyntaxTree): boolean;

    globalModule(): IModuleSymbol;

    anyType(): IAnyTypeSymbol;

    numberType(): INumberTypeSymbol;
    booleanType(): IBooleanTypeSymbol;
    stringType(): IStringTypeSymbol;
    voidType(): IVoidTypeSymbol;
    nullType(): INullTypeSymbol;
    undefinedType(): IUndefinedTypeSymbol;

    /// <summary>
    /// Gets all the diagnostics for the compilation, including syntax, declaration, and
    /// binding. Does not include any diagnostics that might be produced during emit.
    /// </summary>
    getDiagnostics(cancellationToken: ICancellationToken): Diagnostic[];

    // TODO: add parameters here to control emitting.
    emit(): void;
}