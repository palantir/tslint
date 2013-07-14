///<reference path='syntaxKind.ts' />

module TypeScript.SyntaxFacts {
    var textToKeywordKind: any = {
        "any": SyntaxKind.AnyKeyword,
        "bool": SyntaxKind.BoolKeyword,
        "boolean": SyntaxKind.BooleanKeyword,
        "break": SyntaxKind.BreakKeyword,
        "case": SyntaxKind.CaseKeyword,
        "catch": SyntaxKind.CatchKeyword,
        "class": SyntaxKind.ClassKeyword,
        "continue": SyntaxKind.ContinueKeyword,
        "const": SyntaxKind.ConstKeyword,
        "constructor": SyntaxKind.ConstructorKeyword,
        "debugger": SyntaxKind.DebuggerKeyword,
        "declare": SyntaxKind.DeclareKeyword,
        "default": SyntaxKind.DefaultKeyword,
        "delete": SyntaxKind.DeleteKeyword,
        "do": SyntaxKind.DoKeyword,
        "else": SyntaxKind.ElseKeyword,
        "enum": SyntaxKind.EnumKeyword,
        "export": SyntaxKind.ExportKeyword,
        "extends": SyntaxKind.ExtendsKeyword,
        "false": SyntaxKind.FalseKeyword,
        "finally": SyntaxKind.FinallyKeyword,
        "for": SyntaxKind.ForKeyword,
        "function": SyntaxKind.FunctionKeyword,
        "get": SyntaxKind.GetKeyword,
        "if": SyntaxKind.IfKeyword,
        "implements": SyntaxKind.ImplementsKeyword,
        "import": SyntaxKind.ImportKeyword,
        "in": SyntaxKind.InKeyword,
        "instanceof": SyntaxKind.InstanceOfKeyword,
        "interface": SyntaxKind.InterfaceKeyword,
        "let": SyntaxKind.LetKeyword,
        "module": SyntaxKind.ModuleKeyword,
        "new": SyntaxKind.NewKeyword,
        "null": SyntaxKind.NullKeyword,
        "number":SyntaxKind.NumberKeyword,
        "package": SyntaxKind.PackageKeyword,
        "private": SyntaxKind.PrivateKeyword,
        "protected": SyntaxKind.ProtectedKeyword,
        "public": SyntaxKind.PublicKeyword,
        "require": SyntaxKind.RequireKeyword,
        "return": SyntaxKind.ReturnKeyword,
        "set": SyntaxKind.SetKeyword,
        "static": SyntaxKind.StaticKeyword,
        "string": SyntaxKind.StringKeyword,
        "super": SyntaxKind.SuperKeyword,
        "switch": SyntaxKind.SwitchKeyword,
        "this": SyntaxKind.ThisKeyword,
        "throw": SyntaxKind.ThrowKeyword,
        "true": SyntaxKind.TrueKeyword,
        "try": SyntaxKind.TryKeyword,
        "typeof": SyntaxKind.TypeOfKeyword,
        "var": SyntaxKind.VarKeyword,
        "void": SyntaxKind.VoidKeyword,
        "while": SyntaxKind.WhileKeyword,
        "with": SyntaxKind.WithKeyword,
        "yield": SyntaxKind.YieldKeyword,

        "{": SyntaxKind.OpenBraceToken,
        "}": SyntaxKind.CloseBraceToken,
        "(": SyntaxKind.OpenParenToken,
        ")": SyntaxKind.CloseParenToken,
        "[": SyntaxKind.OpenBracketToken,
        "]": SyntaxKind.CloseBracketToken,
        ".": SyntaxKind.DotToken,
        "...": SyntaxKind.DotDotDotToken,
        ";": SyntaxKind.SemicolonToken,
        ",": SyntaxKind.CommaToken,
        "<": SyntaxKind.LessThanToken,
        ">": SyntaxKind.GreaterThanToken,
        "<=": SyntaxKind.LessThanEqualsToken,
        ">=": SyntaxKind.GreaterThanEqualsToken,
        "==": SyntaxKind.EqualsEqualsToken,
        "=>": SyntaxKind.EqualsGreaterThanToken,
        "!=": SyntaxKind.ExclamationEqualsToken,
        "===": SyntaxKind.EqualsEqualsEqualsToken,
        "!==": SyntaxKind.ExclamationEqualsEqualsToken,
        "+": SyntaxKind.PlusToken,
        "-": SyntaxKind.MinusToken,
        "*": SyntaxKind.AsteriskToken,
        "%": SyntaxKind.PercentToken,
        "++": SyntaxKind.PlusPlusToken,
        "--": SyntaxKind.MinusMinusToken,
        "<<": SyntaxKind.LessThanLessThanToken,
        ">>": SyntaxKind.GreaterThanGreaterThanToken,
        ">>>": SyntaxKind.GreaterThanGreaterThanGreaterThanToken,
        "&": SyntaxKind.AmpersandToken,
        "|": SyntaxKind.BarToken,
        "^": SyntaxKind.CaretToken,
        "!": SyntaxKind.ExclamationToken,
        "~": SyntaxKind.TildeToken,
        "&&": SyntaxKind.AmpersandAmpersandToken,
        "||": SyntaxKind.BarBarToken,
        "?": SyntaxKind.QuestionToken,
        ":": SyntaxKind.ColonToken,
        "=": SyntaxKind.EqualsToken,
        "+=": SyntaxKind.PlusEqualsToken,
        "-=": SyntaxKind.MinusEqualsToken,
        "*=": SyntaxKind.AsteriskEqualsToken,
        "%=": SyntaxKind.PercentEqualsToken,
        "<<=": SyntaxKind.LessThanLessThanEqualsToken,
        ">>=": SyntaxKind.GreaterThanGreaterThanEqualsToken,
        ">>>=": SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken,
        "&=": SyntaxKind.AmpersandEqualsToken,
        "|=": SyntaxKind.BarEqualsToken,
        "^=": SyntaxKind.CaretEqualsToken,
        "/": SyntaxKind.SlashToken,
        "/=": SyntaxKind.SlashEqualsToken,
    };

    var kindToText: string[] = [];

    for (var name in textToKeywordKind) {
        if (textToKeywordKind.hasOwnProperty(name)) {
            // Debug.assert(kindToText[textToKeywordKind[name]] === undefined);
            kindToText[textToKeywordKind[name]] = name;
        }
    }

    // Manually work around a bug in the CScript 5.8 runtime where 'constructor' is not
    // listed when SyntaxFacts.textToKeywordKind is enumerated because it is the name of
    // the constructor function.
    kindToText[SyntaxKind.ConstructorKeyword] = "constructor";

    export function getTokenKind(text: string): SyntaxKind {
        if (textToKeywordKind.hasOwnProperty(text)) {
            return textToKeywordKind[text];
        }

        return SyntaxKind.None;
    }

    export function getText(kind: SyntaxKind): string {
        var result = kindToText[kind];
        return result !== undefined ? result : null;
    }

    export function isTokenKind(kind: SyntaxKind): boolean {
        return kind >= SyntaxKind.FirstToken && kind <= SyntaxKind.LastToken;
    }

    export function isAnyKeyword(kind: SyntaxKind): boolean {
        return kind >= SyntaxKind.FirstKeyword && kind <= SyntaxKind.LastKeyword;
    }

    export function isStandardKeyword(kind: SyntaxKind): boolean {
        return kind >= SyntaxKind.FirstStandardKeyword && kind <= SyntaxKind.LastStandardKeyword;
    }

    export function isFutureReservedKeyword(kind: SyntaxKind): boolean {
        return kind >= SyntaxKind.FirstFutureReservedKeyword && kind <= SyntaxKind.LastFutureReservedKeyword;
    }

    export function isFutureReservedStrictKeyword(kind: SyntaxKind): boolean {
        return kind >= SyntaxKind.FirstFutureReservedStrictKeyword && kind <= SyntaxKind.LastFutureReservedStrictKeyword;
    }

    export function isAnyPunctuation(kind: SyntaxKind): boolean {
        return kind >= SyntaxKind.FirstPunctuation && kind <= SyntaxKind.LastPunctuation;
    }

    export function isPrefixUnaryExpressionOperatorToken(tokenKind: SyntaxKind): boolean {
        return getPrefixUnaryExpressionFromOperatorToken(tokenKind) !== SyntaxKind.None;
    }

    export function isBinaryExpressionOperatorToken(tokenKind: SyntaxKind): boolean {
        return getBinaryExpressionFromOperatorToken(tokenKind) !== SyntaxKind.None;
    }

    export function getPrefixUnaryExpressionFromOperatorToken(tokenKind: SyntaxKind): SyntaxKind {
        switch (tokenKind) {
            case SyntaxKind.PlusToken:
                return SyntaxKind.PlusExpression;
            case SyntaxKind.MinusToken:
                return SyntaxKind.NegateExpression;
            case SyntaxKind.TildeToken:
                return SyntaxKind.BitwiseNotExpression;
            case SyntaxKind.ExclamationToken:
                return SyntaxKind.LogicalNotExpression;
            case SyntaxKind.PlusPlusToken:
                return SyntaxKind.PreIncrementExpression;
            case SyntaxKind.MinusMinusToken:
                return SyntaxKind.PreDecrementExpression;
            //case SyntaxKind.DeleteKeyword:
            //    return SyntaxKind.DeleteExpression;
            //case SyntaxKind.TypeOfKeyword:
            //    return SyntaxKind.TypeOfExpression;
            //case SyntaxKind.VoidKeyword:
            //    return SyntaxKind.VoidExpression;
            default:
                return SyntaxKind.None;
        }
    }

    export function getPostfixUnaryExpressionFromOperatorToken(tokenKind: SyntaxKind): SyntaxKind {
        switch (tokenKind) {
            case SyntaxKind.PlusPlusToken:
                return SyntaxKind.PostIncrementExpression;
            case SyntaxKind.MinusMinusToken:
                return SyntaxKind.PostDecrementExpression;
            default:
                return SyntaxKind.None;
        }
    }

    export function getBinaryExpressionFromOperatorToken(tokenKind: SyntaxKind): SyntaxKind {
        switch (tokenKind) {
            case SyntaxKind.AsteriskToken:
                return SyntaxKind.MultiplyExpression;

            case SyntaxKind.SlashToken:
                return SyntaxKind.DivideExpression;

            case SyntaxKind.PercentToken:
                return SyntaxKind.ModuloExpression;

            case SyntaxKind.PlusToken:
                return SyntaxKind.AddExpression;

            case SyntaxKind.MinusToken:
                return SyntaxKind.SubtractExpression;

            case SyntaxKind.LessThanLessThanToken:
                return SyntaxKind.LeftShiftExpression;

            case SyntaxKind.GreaterThanGreaterThanToken:
                return SyntaxKind.SignedRightShiftExpression;

            case SyntaxKind.GreaterThanGreaterThanGreaterThanToken:
                return SyntaxKind.UnsignedRightShiftExpression;

            case SyntaxKind.LessThanToken:
                return SyntaxKind.LessThanExpression;

            case SyntaxKind.GreaterThanToken:
                return SyntaxKind.GreaterThanExpression;

            case SyntaxKind.LessThanEqualsToken:
                return SyntaxKind.LessThanOrEqualExpression;

            case SyntaxKind.GreaterThanEqualsToken:
                return SyntaxKind.GreaterThanOrEqualExpression;

            case SyntaxKind.InstanceOfKeyword:
                return SyntaxKind.InstanceOfExpression;

            case SyntaxKind.InKeyword:
                return SyntaxKind.InExpression;

            case SyntaxKind.EqualsEqualsToken:
                return SyntaxKind.EqualsWithTypeConversionExpression;

            case SyntaxKind.ExclamationEqualsToken:
                return SyntaxKind.NotEqualsWithTypeConversionExpression;

            case SyntaxKind.EqualsEqualsEqualsToken:
                return SyntaxKind.EqualsExpression;

            case SyntaxKind.ExclamationEqualsEqualsToken:
                return SyntaxKind.NotEqualsExpression;

            case SyntaxKind.AmpersandToken:
                return SyntaxKind.BitwiseAndExpression;

            case SyntaxKind.CaretToken:
                return SyntaxKind.BitwiseExclusiveOrExpression;

            case SyntaxKind.BarToken:
                return SyntaxKind.BitwiseOrExpression;

            case SyntaxKind.AmpersandAmpersandToken:
                return SyntaxKind.LogicalAndExpression;

            case SyntaxKind.BarBarToken:
                return SyntaxKind.LogicalOrExpression;

            case SyntaxKind.BarEqualsToken:
                return SyntaxKind.OrAssignmentExpression;

            case SyntaxKind.AmpersandEqualsToken:
                return SyntaxKind.AndAssignmentExpression;

            case SyntaxKind.CaretEqualsToken:
                return SyntaxKind.ExclusiveOrAssignmentExpression;

            case SyntaxKind.LessThanLessThanEqualsToken:
                return SyntaxKind.LeftShiftAssignmentExpression;

            case SyntaxKind.GreaterThanGreaterThanEqualsToken:
                return SyntaxKind.SignedRightShiftAssignmentExpression;

            case SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken:
                return SyntaxKind.UnsignedRightShiftAssignmentExpression;

            case SyntaxKind.PlusEqualsToken:
                return SyntaxKind.AddAssignmentExpression;

            case SyntaxKind.MinusEqualsToken:
                return SyntaxKind.SubtractAssignmentExpression;

            case SyntaxKind.AsteriskEqualsToken:
                return SyntaxKind.MultiplyAssignmentExpression;

            case SyntaxKind.SlashEqualsToken:
                return SyntaxKind.DivideAssignmentExpression;

            case SyntaxKind.PercentEqualsToken:
                return SyntaxKind.ModuloAssignmentExpression;

            case SyntaxKind.EqualsToken:
                return SyntaxKind.AssignmentExpression;

            case SyntaxKind.CommaToken:
                return SyntaxKind.CommaExpression;

            default:
                return SyntaxKind.None;
        }
    }

    export function isAnyDivideToken(kind: SyntaxKind): boolean {
        switch (kind) {
            case SyntaxKind.SlashToken:
            case SyntaxKind.SlashEqualsToken:
                return true;
            default:
                return false;
        }
    }

    export function isAnyDivideOrRegularExpressionToken(kind: SyntaxKind): boolean {
        switch (kind) {
            case SyntaxKind.SlashToken:
            case SyntaxKind.SlashEqualsToken:
            case SyntaxKind.RegularExpressionLiteral:
                return true;
            default:
                return false;
        }
    }

    export function isParserGenerated(kind: SyntaxKind): boolean {
        switch (kind) {
            case SyntaxKind.GreaterThanGreaterThanToken:
            case SyntaxKind.GreaterThanGreaterThanGreaterThanToken:
            case SyntaxKind.GreaterThanEqualsToken:
            case SyntaxKind.GreaterThanGreaterThanEqualsToken:
            case SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken:
                return true;
            default:
                return false;
        }
    }

    export function isAnyBinaryExpression(kind: SyntaxKind): boolean {
        switch (kind) {
            case SyntaxKind.CommaExpression:
            case SyntaxKind.AssignmentExpression:
            case SyntaxKind.AddAssignmentExpression:
            case SyntaxKind.SubtractAssignmentExpression:
            case SyntaxKind.MultiplyAssignmentExpression:
            case SyntaxKind.DivideAssignmentExpression:
            case SyntaxKind.ModuloAssignmentExpression:
            case SyntaxKind.AndAssignmentExpression:
            case SyntaxKind.ExclusiveOrAssignmentExpression:
            case SyntaxKind.OrAssignmentExpression:
            case SyntaxKind.LeftShiftAssignmentExpression:
            case SyntaxKind.SignedRightShiftAssignmentExpression:
            case SyntaxKind.UnsignedRightShiftAssignmentExpression:
            case SyntaxKind.LogicalOrExpression:
            case SyntaxKind.LogicalAndExpression:
            case SyntaxKind.BitwiseOrExpression:
            case SyntaxKind.BitwiseExclusiveOrExpression:
            case SyntaxKind.BitwiseAndExpression:
            case SyntaxKind.EqualsWithTypeConversionExpression:
            case SyntaxKind.NotEqualsWithTypeConversionExpression:
            case SyntaxKind.EqualsExpression:
            case SyntaxKind.NotEqualsExpression:
            case SyntaxKind.LessThanExpression:
            case SyntaxKind.GreaterThanExpression:
            case SyntaxKind.LessThanOrEqualExpression:
            case SyntaxKind.GreaterThanOrEqualExpression:
            case SyntaxKind.InstanceOfExpression:
            case SyntaxKind.InExpression:
            case SyntaxKind.LeftShiftExpression:
            case SyntaxKind.SignedRightShiftExpression:
            case SyntaxKind.UnsignedRightShiftExpression:
            case SyntaxKind.MultiplyExpression:
            case SyntaxKind.DivideExpression:
            case SyntaxKind.ModuloExpression:
            case SyntaxKind.AddExpression:
            case SyntaxKind.SubtractExpression:
                return true;
        }

        return false;
    }
}