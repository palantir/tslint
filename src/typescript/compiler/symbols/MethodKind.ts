/// <summary>
/// Enumeration for possible kinds of method symbols.
/// </summary>
enum MethodKind
{
    /// <summary>
    /// An anonymous method or lambda expression
    /// </summary>
    ArrowFunction = 0,

    /// <summary>
    /// Method is a constructor.
    /// </summary>
    Constructor = 1,

    /// <summary>
    /// Method is an ordinary method.
    /// </summary>
    Ordinary = 10,

    /// <summary>
    /// Method is a property get.
    /// </summary>
    GetAccessor = 11,

    /// <summary>
    /// Method is a property set.
    /// </summary>
    SetAccessor = 12,
}