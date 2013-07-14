///<reference path='ISymbol.ts' />

/// <summary>
/// Indicates the reasons why a candidate (or set of candidate) symbols were not considered
/// correct in SemanticInfo. Higher values take precedence over lower values, so if, for
/// example, there a symbol with a given name that was inaccessible, and other with the wrong
/// arity, only the inaccessible one would be reported in the SemanticInfo.
/// </summary>
enum CandidateReason {
    // Implementation note. Values in this enumeration should generally be kept in sync with the
    // language-specific LookupResultKind enumeration.

    /// <summary>
    /// No CandidateSymbols.
    /// </summary>
    None,

    /// <summary>
    /// Only a type or module was valid in the given location, but the candidate symbols was
    /// of the wrong kind.
    /// </summary>
    NotATypeOrModule,

    /// <summary>
    /// The candidate symbol takes a different number of type parameters that was required.
    /// </summary>
    WrongArity,

    /// <summary>
    /// The candidate symbol existed, but was not allowed to be created in a new expression. 
    /// For example, interfaces, and type parameters.
    /// </summary>
    NotCreatable,

    /// <summary>
    /// The candidate symbol existed, but was not allowed to be referenced.
    /// </summary>
    NotReferencable,

    /// <summary>
    /// The candidate symbol had an accessibility modifier that made it inaccessible.
    /// </summary>
    Inaccessible,

    /// <summary>
    /// The candidate symbol was in a place where a value was required, but was not a value
    /// (e.g., was a a type or module).
    /// </summary>
    NotAValue,

    /// <summary>
    /// The candidate symbol was in a place where a variable was required, but was not allowed there 
    /// because it isn't a symbol that can be assigned to. For example, the left hand side of an 
    /// assignment.
    /// </summary>
    NotAVariable,

    /// <summary>
    /// The candidate symbol was used in a way that an invocable member (method, function type)
    /// was required, but the candidate symbol was not invocable.
    /// </summary>
    NotInvocable,

    /// <summary>
    /// The candidate symbol must be an instance variable, but was used as static, or the
    /// reverse. Also occurs if "this" is used in a context (i.e. static method) where "this"
    /// is not available.
    /// </summary>
    StaticInstanceMismatch,

    /// <summary>
    /// Overload resolution did not choose a method. The candidate symbols are the methods there
    /// were considered during overload resolution (which may or may not be applicable methods). 
    /// </summary>
    OverloadResolutionFailure,

    /// <summary>
    /// Multiple ambiguous symbols were available with the same name. This can occur if "using"
    /// statements bring multiple namespaces into scope, and the same type is available in
    /// multiple. This can also occur if multiple properties of the same name are available in a
    /// multiple interface inheritance situation.
    /// </summary>
    Ambiguous,
}

interface ISymbolInfo {
    /// <summary>
    /// The symbol that was referred to by the syntax node, if any. Returns null if the given
    /// expression did not bind successfully to a single symbol. If null is returned, it may
    /// still be that case that we have one or more "best guesses" as to what symbol was
    /// intended. These best guesses are available via the CandidateSymbols property.
    /// </summary>
    symbol(): ISymbol;

    /// <summary>
    /// If the expression did not successfully resolve to a symbol, but there were one or more
    /// symbols that may have been considered but discarded, this property returns those
    /// symbols. The reason that the symbols did not successfully resolve to a symbol are
    /// available in the CandidateReason property. For example, if the symbol was inaccessible,
    /// ambiguous, or used in the wrong context.
    /// </summary>
    candidateSymbols(): ISymbol[];

    ///<summary>
    /// If the expression did not successfully resolve to a symbol, but there were one or more
    /// symbols that may have been considered but discarded, this property describes why those
    /// symbol or symbols were not considered suitable.
    /// </summary>
    candidateReason(): CandidateReason;
}