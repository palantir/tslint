// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='typescriptServices.ts' />

module Services {
    export class CompletionHelpers {
        public static filterContextualMembersList(contextualMemberSymbols: TypeScript.PullSymbol[], existingMembers: TypeScript.PullVisibleSymbolsInfo): TypeScript.PullSymbol[] {
            if (!existingMembers || !existingMembers.symbols || existingMembers.symbols.length === 0) {
                return contextualMemberSymbols;
            }

            var existingMemberSymbols = existingMembers.symbols;
            var existingMemberNames: { [s: string]: boolean; } = {};
            for (var i = 0, n = existingMemberSymbols.length; i < n; i++) {
                existingMemberNames[TypeScript.stripQuotes(existingMemberSymbols[i].getDisplayName())] = true;
            }

            var filteredMembers: TypeScript.PullSymbol[] = [];
            for (var j = 0, m = contextualMemberSymbols.length; j < m; j++) {
                var contextualMemberSymbol = contextualMemberSymbols[j];
                if (!existingMemberNames[TypeScript.stripQuotes(contextualMemberSymbol.getDisplayName())]) {
                    filteredMembers.push(contextualMemberSymbol);
                }
            }

            return filteredMembers;
        }

        public static isRightOfDot(path: TypeScript.AstPath, position: number): boolean {
            return (path.count() >= 1 && path.asts[path.top].nodeType === TypeScript.NodeType.MemberAccessExpression && (<TypeScript.BinaryExpression>path.asts[path.top]).operand1.limChar < position) ||
                (path.count() >= 2 && path.asts[path.top].nodeType === TypeScript.NodeType.Name && path.asts[path.top - 1].nodeType === TypeScript.NodeType.MemberAccessExpression && (<TypeScript.BinaryExpression>path.asts[path.top - 1]).operand2 === path.asts[path.top]);
        }

        public static isCompletionListBlocker(sourceUnit: TypeScript.SourceUnitSyntax, position: number): boolean {
            // This method uses Fidelity completelly. Some information can be reached using the AST, but not everything.
            return TypeScript.Syntax.isEntirelyInsideComment(sourceUnit, position) ||
                TypeScript.Syntax.isEntirelyInStringOrRegularExpressionLiteral(sourceUnit, position) ||
                CompletionHelpers.isIdentifierDefinitionLocation(sourceUnit, position) ||
                CompletionHelpers.isRightOfIllegalDot(sourceUnit, position);
        }

        public static getContaingingObjectLiteralApplicableForCompletion(sourceUnit: TypeScript.SourceUnitSyntax, position: number): TypeScript.PositionedElement {
            // The locations in an object literal expression that are applicable for completion are property name definition locations.
            var previousToken = CompletionHelpers.getNonIdentifierCompleteTokenOnLeft(sourceUnit, position);

            if (previousToken) {
                var parent = previousToken.parent();

                switch (previousToken.kind()) {
                    case TypeScript.SyntaxKind.OpenBraceToken:  // var x = { |
                    case TypeScript.SyntaxKind.CommaToken:      // var x = { a: 0, |
                        if (parent && parent.kind() === TypeScript.SyntaxKind.SeparatedList) {
                            parent = parent.parent();
                        }

                        if (parent && parent.kind() === TypeScript.SyntaxKind.ObjectLiteralExpression) {
                            return parent;
                        }

                        break;
                }
            }

            return null;
        }

        public static isIdentifierDefinitionLocation(sourceUnit: TypeScript.SourceUnitSyntax, position: number): boolean {
            var positionedToken = CompletionHelpers.getNonIdentifierCompleteTokenOnLeft(sourceUnit, position);

            if (positionedToken) {
                var containingNodeKind = positionedToken.containingNode() && positionedToken.containingNode().kind();
                switch (positionedToken.kind()) {
                    case TypeScript.SyntaxKind.CommaToken:
                        return containingNodeKind === TypeScript.SyntaxKind.ParameterList ||
                            containingNodeKind === TypeScript.SyntaxKind.VariableDeclaration;

                    case TypeScript.SyntaxKind.OpenParenToken:
                        return containingNodeKind === TypeScript.SyntaxKind.ParameterList ||
                            containingNodeKind === TypeScript.SyntaxKind.CatchClause;

                    case TypeScript.SyntaxKind.PublicKeyword:
                    case TypeScript.SyntaxKind.PrivateKeyword:
                    case TypeScript.SyntaxKind.StaticKeyword:
                    case TypeScript.SyntaxKind.DotDotDotToken:
                        return containingNodeKind === TypeScript.SyntaxKind.Parameter;

                    case TypeScript.SyntaxKind.ClassKeyword:
                    case TypeScript.SyntaxKind.ModuleKeyword:
                    case TypeScript.SyntaxKind.EnumKeyword:
                    case TypeScript.SyntaxKind.InterfaceKeyword:
                    case TypeScript.SyntaxKind.FunctionKeyword:
                    case TypeScript.SyntaxKind.VarKeyword:
                    case TypeScript.SyntaxKind.GetKeyword:
                    case TypeScript.SyntaxKind.SetKeyword:
                        return true;
                }

                // Previous token may have been a keyword that was converted to an identifier.
                switch (positionedToken.token().text()) {
                    case "class":
                    case "interface":
                    case "enum":
                    case "module":
                        return true;
                }
            }

            return false;
        }

        public static getNonIdentifierCompleteTokenOnLeft(sourceUnit: TypeScript.SourceUnitSyntax, position: number): TypeScript.PositionedToken {
            var positionedToken = sourceUnit.findCompleteTokenOnLeft(position, /*includeSkippedTokens*/true);

            if (positionedToken && position === positionedToken.end() && positionedToken.kind() == TypeScript.SyntaxKind.EndOfFileToken) {
                // EndOfFile token is not intresting, get the one before it
                positionedToken = positionedToken.previousToken(/*includeSkippedTokens*/true);
            }

            if (positionedToken && position === positionedToken.end() && positionedToken.kind() === TypeScript.SyntaxKind.IdentifierName) {
                // The caret is at the end of an identifier, the decession to provide completion depends on the previous token
                positionedToken = positionedToken.previousToken(/*includeSkippedTokens*/true);
            }

            return positionedToken;
        }

        public static isRightOfIllegalDot(sourceUnit: TypeScript.SourceUnitSyntax, position: number): boolean {
            var positionedToken = CompletionHelpers.getNonIdentifierCompleteTokenOnLeft(sourceUnit, position);

            if (positionedToken) {
                switch (positionedToken.kind()) {
                    case TypeScript.SyntaxKind.DotToken:
                        var leftOfDotPositionedToken = positionedToken.previousToken(/*includeSkippedTokens*/true);
                        return leftOfDotPositionedToken && leftOfDotPositionedToken.kind() === TypeScript.SyntaxKind.NumericLiteral;

                    case TypeScript.SyntaxKind.NumericLiteral:
                        var text = positionedToken.token().text();
                        return text.charAt(text.length - 1) === ".";
                }
            }

            return false;
        }

        public static getValidCompletionEntryDisplayName(displayName: string, languageVersion: TypeScript.LanguageVersion): string {
            if (displayName && displayName.length > 0) {
                var firstChar = displayName.charCodeAt(0);
                if (firstChar === TypeScript.CharacterCodes.singleQuote || firstChar === TypeScript.CharacterCodes.doubleQuote) {
                    // If the user entered name for the symbol was quoted, removing the quotes is not enough, as the name could be an
                    // invalid identifer name. We need to check if whatever was inside the qouates is actually a valid identifier name.
                    displayName = TypeScript.stripQuotes(displayName);

                    if (TypeScript.Scanner.isValidIdentifier(TypeScript.SimpleText.fromString(displayName), languageVersion)) {
                        return displayName;
                    }
                }
                else {
                    return displayName;
                }
            }

            return null;
        }
    }
}