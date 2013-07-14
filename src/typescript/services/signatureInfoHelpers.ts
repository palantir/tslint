// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='typescriptServices.ts' />

module Services {

    export interface IPartiallyWrittenTypeArgumentListInformation {
        genericIdentifer: TypeScript.PositionedToken;
        lessThanToken: TypeScript.PositionedToken;
        argumentIndex: number;
    }

    export class SignatureInfoHelpers {

        // A partially written generic type expression is not guaranteed to have the correct syntax tree. the expression could be parsed as less than/greater than expression or a comma expression
        // or some other combination depending on what the user has typed so far. For the purposes of signature help we need to consider any location after "<" as a possible generic type reference. 
        // To do this, the method will back parse the expression starting at the position required. it will try to parse the current expression as a generic type expression, if it did succeed it 
        // will return the generic identifier that started the expression (e.g. "foo" in "foo<any, |"). It is then up to the caller to ensure that this is a valid generic expression through 
        // looking up the type. The method will also keep track of the parameter index inside the expression.
        public static isInPartiallyWrittenTypeArgumentList(syntaxTree: TypeScript.SyntaxTree, position: number): IPartiallyWrittenTypeArgumentListInformation {
            var token = syntaxTree.sourceUnit().findTokenOnLeft(position, /*includeSkippedTokens*/ true);

            if (token && TypeScript.Syntax.hasAncestorOfKind(token, TypeScript.SyntaxKind.TypeParameterList)) {
                // We are in the wrong generic list. bail out
                return null;
            }

            var stack = 0;
            var argumentIndex = 0;

            whileLoop:
            while (token) {
                switch (token.kind()) {
                    case TypeScript.SyntaxKind.LessThanToken:
                        if (stack === 0) {
                            // Found the beginning of the generic argument expression
                            var lessThanToken = token;
                            token = token.previousToken(/*includeSkippedTokens*/ true);
                            if (!token || token.kind() !== TypeScript.SyntaxKind.IdentifierName) {
                                break whileLoop;
                            }

                            // Found the name, return the data
                            return {
                                genericIdentifer: token,
                                lessThanToken: lessThanToken,
                                argumentIndex: argumentIndex
                            };
                        }
                        else if (stack < 0) {
                            // Seen one too many less than tokens, bail out
                            break whileLoop;
                        }
                        else {
                            stack--;
                        }

                        break;

                    case TypeScript.SyntaxKind.GreaterThanGreaterThanGreaterThanToken:
                        stack++;

                    // Intentaion fall through
                    case TypeScript.SyntaxKind.GreaterThanToken:
                        stack++;
                        break;

                    case TypeScript.SyntaxKind.CommaToken:
                        if (stack == 0) {
                            argumentIndex++;
                        }

                        break;

                    case TypeScript.SyntaxKind.CloseBraceToken:
                        // This can be object type, skip untill we find the matching open brace token
                        var unmatchedOpenBraceTokens = 0;

                        // Skip untill the matching open brace token
                        token = SignatureInfoHelpers.moveBackUpTillMatchingTokenKind(token, TypeScript.SyntaxKind.CloseBraceToken, TypeScript.SyntaxKind.OpenBraceToken);
                        if (!token) {
                            // No matching token was found. bail out
                            break whileLoop;
                        }

                        break;

                    case TypeScript.SyntaxKind.EqualsGreaterThanToken:
                        // This can be a function type or a constructor type. In either case, we want to skip the function defintion
                        token = token.previousToken(/*includeSkippedTokens*/ true);

                        if (token && token.kind() === TypeScript.SyntaxKind.CloseParenToken) {
                            // Skip untill the matching open paren token
                            token = SignatureInfoHelpers.moveBackUpTillMatchingTokenKind(token, TypeScript.SyntaxKind.CloseParenToken, TypeScript.SyntaxKind.OpenParenToken);

                            if (token && token.kind() === TypeScript.SyntaxKind.GreaterThanToken) {
                                // Another generic type argument list, skip it\
                                token = SignatureInfoHelpers.moveBackUpTillMatchingTokenKind(token, TypeScript.SyntaxKind.GreaterThanToken, TypeScript.SyntaxKind.LessThanToken);
                            }

                            if (token && token.kind() === TypeScript.SyntaxKind.NewKeyword) {
                                // In case this was a constructor type, skip the new keyword
                                token = token.previousToken(/*includeSkippedTokens*/ true);
                            }

                            if (!token) {
                                // No matching token was found. bail out
                                break whileLoop;
                            }
                        }
                        else {
                            // This is not a funtion type. exit the main loop
                            break whileLoop;
                        }

                        break;

                    case TypeScript.SyntaxKind.IdentifierName:
                    case TypeScript.SyntaxKind.AnyKeyword:
                    case TypeScript.SyntaxKind.NumberKeyword:
                    case TypeScript.SyntaxKind.StringKeyword:
                    case TypeScript.SyntaxKind.VoidKeyword:
                    case TypeScript.SyntaxKind.BooleanKeyword:
                    case TypeScript.SyntaxKind.BoolKeyword:
                    case TypeScript.SyntaxKind.DotToken:
                    case TypeScript.SyntaxKind.OpenBracketToken:
                    case TypeScript.SyntaxKind.CloseBracketToken:
                        // Valid tokens in a type name. Skip.
                        break;

                    default:
                        break whileLoop;
                }

                token = token.previousToken(/*includeSkippedTokens*/ true);
            }

            return null;
        }

        public static getSignatureInfoFromSignatureSymbol(symbol: TypeScript.PullSymbol, signatures: TypeScript.PullSignatureSymbol[], enclosingScopeSymbol: TypeScript.PullSymbol, compilerState: CompilerState) {
            var signatureGroup: FormalSignatureItemInfo[] = [];

            var hasOverloads = signatures.length > 1;

            for (var i = 0, n = signatures.length; i < n; i++) {
                var signature = signatures[i];

                // filter out the definition signature if there are overloads
                if (hasOverloads && signature.isDefinition()) {
                    continue;
                }

                var signatureGroupInfo = new FormalSignatureItemInfo();
                var paramIndexInfo: number[] = [];
                var functionName = signature.getScopedNameEx(enclosingScopeSymbol).toString();
                if (!functionName) {
                    functionName = symbol.getDisplayName();
                }

                var signatureMemberName = signature.getSignatureTypeNameEx(functionName, false, false, enclosingScopeSymbol, true, true);
                signatureGroupInfo.signatureInfo = TypeScript.MemberName.memberNameToString(signatureMemberName, paramIndexInfo);
                signatureGroupInfo.docComment = compilerState.getDocComments(signature);

                var parameterMarkerIndex = 0;

                if (signature.isGeneric()) {
                    var typeParameters = signature.getTypeParameters();
                    for (var j = 0, m = typeParameters.length; j < m; j++) {
                        var typeParameter = typeParameters[j];
                        var signatureTypeParameterInfo = new FormalTypeParameterInfo();
                        signatureTypeParameterInfo.name = typeParameter.getDisplayName();
                        signatureTypeParameterInfo.docComment = compilerState.getDocComments(typeParameter);
                        signatureTypeParameterInfo.minChar = paramIndexInfo[2 * parameterMarkerIndex];
                        signatureTypeParameterInfo.limChar = paramIndexInfo[2 * parameterMarkerIndex + 1];
                        parameterMarkerIndex++;
                        signatureGroupInfo.typeParameters.push(signatureTypeParameterInfo);
                    }
                }

                var parameters = signature.getParameters();
                for (var j = 0, m = parameters.length; j < m; j++) {
                    var parameter = parameters[j];
                    var signatureParameterInfo = new FormalParameterInfo();
                    signatureParameterInfo.isVariable = signature.hasVariableParamList() && (j === parameters.length - 1);
                    signatureParameterInfo.name = parameter.getDisplayName();
                    signatureParameterInfo.docComment = compilerState.getDocComments(parameter);
                    signatureParameterInfo.minChar = paramIndexInfo[2 * parameterMarkerIndex];
                    signatureParameterInfo.limChar = paramIndexInfo[2 * parameterMarkerIndex + 1];
                    parameterMarkerIndex++;
                    signatureGroupInfo.parameters.push(signatureParameterInfo);
                }

                signatureGroup.push(signatureGroupInfo);
            }

            return signatureGroup;
        }

        public static getSignatureInfoFromGenericSymbol(symbol: TypeScript.PullSymbol, enclosingScopeSymbol: TypeScript.PullSymbol, compilerState: CompilerState) {
            var signatureGroupInfo = new FormalSignatureItemInfo();

            var paramIndexInfo: number[] = [];
            var symbolName = symbol.getScopedNameEx(enclosingScopeSymbol, true, false, true);

            signatureGroupInfo.signatureInfo = TypeScript.MemberName.memberNameToString(symbolName, paramIndexInfo);
            signatureGroupInfo.docComment = compilerState.getDocComments(symbol);

            var parameterMarkerIndex = 0;

            var typeSymbol = symbol.getType();

            var typeParameters = typeSymbol.getTypeParameters();
            for (var i = 0, n = typeParameters.length; i < n; i++) {
                var typeParameter = typeParameters[i];
                var signatureTypeParameterInfo = new FormalTypeParameterInfo();
                signatureTypeParameterInfo.name = typeParameter.getDisplayName();
                signatureTypeParameterInfo.docComment = compilerState.getDocComments(typeParameter);
                signatureTypeParameterInfo.minChar = paramIndexInfo[2 * i];
                signatureTypeParameterInfo.limChar = paramIndexInfo[2 * i + 1];
                signatureGroupInfo.typeParameters.push(signatureTypeParameterInfo);
            }

            return [signatureGroupInfo];
        }

        public static getActualSignatureInfoFromCallExpression(ast: TypeScript.CallExpression, caretPosition: number, typeParameterInformation: IPartiallyWrittenTypeArgumentListInformation): ActualSignatureInfo {
            if (!ast) {
                return null;
            }

            var result = new ActualSignatureInfo();

            // The expression is not guaranteed to be complete, we need to populate the min and lim with the most accurate information we have about
            // type argument and argument lists
            var parameterMinChar = caretPosition;
            var parameterLimChar = caretPosition;

            if (ast.typeArguments) {
                parameterMinChar = Math.min(ast.typeArguments.minChar);
                parameterLimChar = Math.max(Math.max(ast.typeArguments.minChar, ast.typeArguments.limChar + ast.typeArguments.trailingTriviaWidth));
            }

            if (ast.arguments) {
                parameterMinChar = Math.min(parameterMinChar, ast.arguments.minChar);
                parameterLimChar = Math.max(parameterLimChar, Math.max(ast.arguments.minChar, ast.arguments.limChar + ast.arguments.trailingTriviaWidth));
            }

            result.parameterMinChar = parameterMinChar;
            result.parameterLimChar = parameterLimChar;
            result.currentParameterIsTypeParameter = false;
            result.currentParameter = -1;

            if (typeParameterInformation) {
                result.currentParameterIsTypeParameter = true;
                result.currentParameter = typeParameterInformation.argumentIndex;
            }
            else if (ast.arguments && ast.arguments.members) {
                result.currentParameter = 0;
                for (var index = 0; index < ast.arguments.members.length; index++) {
                    if (caretPosition > ast.arguments.members[index].limChar + ast.arguments.members[index].trailingTriviaWidth) {
                        result.currentParameter++;
                    }
                }
            }

            return result;
        }

        public static getActualSignatureInfoFromPartiallyWritenGenericExpression(caretPosition: number, typeParameterInformation: IPartiallyWrittenTypeArgumentListInformation): ActualSignatureInfo {
            var result = new ActualSignatureInfo();

            result.parameterMinChar = typeParameterInformation.lessThanToken.start();
            result.parameterLimChar = Math.max(typeParameterInformation.lessThanToken.fullEnd(), caretPosition);
            result.currentParameterIsTypeParameter = true;
            result.currentParameter = typeParameterInformation.argumentIndex;

            return result;
        }

        public static isSignatureHelpBlocker(sourceUnit: TypeScript.SourceUnitSyntax, position: number): boolean {
            return TypeScript.Syntax.isEntirelyInsideComment(sourceUnit, position);
        }

        public static isTargetOfObjectCreationExpression(positionedToken: TypeScript.PositionedToken): boolean {
            var positionedParent = TypeScript.Syntax.getAncestorOfKind(positionedToken, TypeScript.SyntaxKind.ObjectCreationExpression);
            if (positionedParent) {
                var objectCreationExpression = <TypeScript.ObjectCreationExpressionSyntax> positionedParent.element();
                var expressionRelativeStart = objectCreationExpression.newKeyword.fullWidth();
                var tokenRelativeStart = positionedToken.fullStart() - positionedParent.fullStart();
                return tokenRelativeStart >= expressionRelativeStart &&
                    tokenRelativeStart <= (expressionRelativeStart + objectCreationExpression.expression.fullWidth());
            }

            return false;
        }

        private static moveBackUpTillMatchingTokenKind(token: TypeScript.PositionedToken, tokenKind: TypeScript.SyntaxKind, matchingTokenKind: TypeScript.SyntaxKind): TypeScript.PositionedToken {
            if (!token || token.kind() !== tokenKind) {
                throw TypeScript.Errors.invalidOperation();
            }

            // Skip the current token
            token = token.previousToken(/*includeSkippedTokens*/ true);

            var stack = 0;

            while (token) {
                if (token.kind() === matchingTokenKind) {
                    if (stack === 0) {
                        // Found the matching token, return
                        return token;
                    }
                    else if (stack < 0) {
                        // tokens overlapped.. bail out.
                        break;
                    }
                    else {
                        stack--;
                    }
                }
                else if (token.kind() === tokenKind) {
                    stack++;
                }

                // Move back
                token = token.previousToken(/*includeSkippedTokens*/ true);
            }

            // Did not find matching token
            return null;
        }
    }
}