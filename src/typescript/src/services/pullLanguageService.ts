// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='typescriptServices.ts' />

module Services {
    export class LanguageService implements ILanguageService {
        private logger: TypeScript.ILogger;
        private compilerState: CompilerState;
        private formattingRulesProvider: TypeScript.Formatting.RulesProvider;

        private currentFileName: string = "";
        private currentFileVersion: number = -1;
        private currentFileSyntaxTree: TypeScript.SyntaxTree = null;

        private activeCompletionSession: CompletionSession = null;

        constructor(public host: ILanguageServiceHost) {
            this.logger = this.host;
            this.compilerState = new CompilerState(this.host);

            // Check if the localized messages json is set, otherwise query the host for it
            if (!TypeScript.LocalizedDiagnosticMessages) {
                TypeScript.LocalizedDiagnosticMessages = this.host.getLocalizedDiagnosticMessages();
            }
        }

        public refresh(): void {
            TypeScript.timeFunction(this.logger, "refresh()", () => {
                this.compilerState.refresh();
            });
        }

        private minimalRefresh(): void {
            TypeScript.timeFunction(this.logger, "minimalRefresh()", () => {
                this.compilerState.minimalRefresh();
            });
        }

        public getReferencesAtPosition(fileName: string, pos: number): ReferenceEntry[] {
            this.refresh();

            var result: ReferenceEntry[] = [];

            var document = this.compilerState.getDocument(fileName);
            var script = document.script;
              
            /// TODO: this does not allow getting references on "constructor"

            var path = this.getAstPathToPosition(script, pos);
            if (path.ast() === null || path.ast().nodeType() !== TypeScript.NodeType.Name) {
                this.logger.log("No name found at the given position");
                return result;
            }

            var symbolInfoAtPosition = this.compilerState.getSymbolInformationFromPath(path, document);
            if (symbolInfoAtPosition === null || symbolInfoAtPosition.symbol === null) {
                this.logger.log("No symbol found at the given position");
                return result;
            }

            var symbol = symbolInfoAtPosition.symbol;
            var symbolName: string = symbol.getName();

            var fileNames = this.compilerState.getFileNames();
            for (var i = 0, len = fileNames.length; i < len; i++) {
                var tempFileName = fileNames[i];
        
                var tempDocument = this.compilerState.getDocument(tempFileName);
                var filter: TypeScript.BloomFilter = tempDocument.bloomFilter();

                if (filter.probablyContains(symbolName)) {
                    result = result.concat(this.getReferencesInFile(tempFileName, symbol));
                }
            }

            return result;
        }

        public getOccurrencesAtPosition(fileName: string, pos: number): ReferenceEntry[]{
            this.refresh();

            var result: ReferenceEntry[] = [];

            var document = this.compilerState.getDocument(fileName);
            var script = document.script;

            /// TODO: this does not allow getting references on "constructor"

            var path = this.getAstPathToPosition(script, pos);
            if (path.ast() === null || path.ast().nodeType() !== TypeScript.NodeType.Name) {
                this.logger.log("No name found at the given position");
                return result;
            }

            var symbolInfoAtPosition = this.compilerState.getSymbolInformationFromPath(path, document);
            if (symbolInfoAtPosition === null || symbolInfoAtPosition.symbol === null) {
                this.logger.log("No symbol found at the given position");
                return result;
            }

            var symbol = symbolInfoAtPosition.symbol;
            return this.getReferencesInFile(fileName, symbol);
        }

        public getImplementorsAtPosition(fileName: string, pos: number): ReferenceEntry[] {
            this.refresh();

            var result: ReferenceEntry[] = [];

            var document = this.compilerState.getDocument(fileName);
            var script = document.script;
            
            var path = this.getAstPathToPosition(script, pos);
            if (path.ast() === null || path.ast().nodeType() !== TypeScript.NodeType.Name) {
                this.logger.log("No identifier at the specified location.");
                return result;
            }

            var symbolInfoAtPosition = this.compilerState.getSymbolInformationFromPath(path, document);
            var symbol = symbolInfoAtPosition.symbol;

            if (symbol === null) {
                this.logger.log("No symbol annotation on the identifier AST.");
                return [];
            }

            var typeSymbol: TypeScript.PullTypeSymbol = symbol.type;
            var typesToSearch: TypeScript.PullTypeSymbol[];

            if (typeSymbol.isClass() || typeSymbol.isInterface()) {
                typesToSearch = typeSymbol.getTypesThatExtendThisType();
            } 
            else if (symbol.kind == TypeScript.PullElementKind.Property ||
                symbol.kind == TypeScript.PullElementKind.Function ||
                typeSymbol.isMethod() || typeSymbol.isProperty()) {

                var declaration: TypeScript.PullDecl = symbol.getDeclarations()[0];
                var classSymbol: TypeScript.PullTypeSymbol = declaration.getParentDecl().getSymbol().type;

                typesToSearch = [];
                var extendingTypes = classSymbol.getTypesThatExtendThisType();
                var extendedTypes = classSymbol.getExtendedTypes();
                extendingTypes.forEach(type => {
                    var overrides = this.getOverrides(type, symbol);
                    overrides.forEach(override => {
                        typesToSearch.push(override);
                    });
                });
                extendedTypes.forEach(type => {
                    var overrides = this.getOverrides(type, symbol);
                    overrides.forEach(override => {
                        typesToSearch.push(override);
                    });
                });
            }

            var fileNames = this.compilerState.getFileNames();
            for (var i = 0, len = fileNames.length; i < len; i++) {
                var tempFileName = fileNames[i];
                
                var tempDocument = this.compilerState.getDocument(tempFileName);
                var filter = tempDocument.bloomFilter();

                typesToSearch.forEach(typeToSearch => {
                    var symbolName: string = typeToSearch.getName();
                    if (filter.probablyContains(symbolName)) {
                        result = result.concat(this.getImplementorsInFile(tempFileName, typeToSearch));
                    }
                });
            }
            return result;
        }

        public getOverrides(container: TypeScript.PullTypeSymbol, memberSym: TypeScript.PullSymbol): TypeScript.PullTypeSymbol[]{
            var result: TypeScript.PullTypeSymbol[] = [];
            var members: TypeScript.PullSymbol[];
            if (container.isClass()) {
                members = container.getMembers();
            } else if (container.isInterface()) {
                members = container.getMembers();
            }

            if (members == null)
                return null;

            members.forEach(member => {
                var typeMember = <TypeScript.PullTypeSymbol>member;
                if (typeMember.getName() === memberSym.getName()) {
                    // Not currently checking whether static-ness matches: typeMember.isStatic() === memberSym.isStatic() or whether
                    //  typeMember.isMethod() === memberSym.isMethod() && typeMember.isProperty() === memberSym.isProperty()
                        result.push(typeMember);
                }
            });

            return result;
        }


        private getImplementorsInFile(fileName: string, symbol: TypeScript.PullTypeSymbol): ReferenceEntry[] {
            var result: ReferenceEntry[] = [];
            var symbolName = symbol.getDisplayName();

            var possiblePositions = this.getPossibleSymbolReferencePositions(fileName, symbolName);
            if (possiblePositions && possiblePositions.length > 0) {
                var document = this.compilerState.getDocument(fileName);
                var script = document.script;

                possiblePositions.forEach(p => {
                    var path = this.getAstPathToPosition(script, p);
                    if (path.ast() === null || path.ast().nodeType() !== TypeScript.NodeType.Name) {
                        return;
                    }
                    var searchSymbolInfoAtPosition = this.compilerState.getSymbolInformationFromPath(path, document);
                    if (searchSymbolInfoAtPosition !== null) {
                        
                        var normalizedSymbol: TypeScript.PullSymbol;
                        if (symbol.kind === TypeScript.PullElementKind.Class || symbol.kind === TypeScript.PullElementKind.Interface) {
                            normalizedSymbol = searchSymbolInfoAtPosition.symbol.type;
                        }
                        else {
                            var declaration = searchSymbolInfoAtPosition.symbol.getDeclarations()[0];
                            normalizedSymbol = declaration.getSymbol();
                        }

                        if (normalizedSymbol === symbol) {
                            var isWriteAccess = this.isWriteAccess(path.ast(), path.parent());
                            var referenceAST = FindReferenceHelpers.getCorrectASTForReferencedSymbolName(searchSymbolInfoAtPosition.ast, symbolName);

                            result.push(new ReferenceEntry(this.compilerState.getHostFileName(fileName), referenceAST.minChar, referenceAST.limChar, isWriteAccess));

                        }
                    }
                });

            }
            return result;
        }

        private getReferencesInFile(fileName: string, symbol: TypeScript.PullSymbol): ReferenceEntry[] {
            var result: ReferenceEntry[] = [];
            var symbolName = symbol.getDisplayName();
            
            var possiblePositions = this.getPossibleSymbolReferencePositions(fileName, symbolName);
            if (possiblePositions && possiblePositions.length > 0) {
                var document = this.compilerState.getDocument(fileName);
                var script = document.script;

                possiblePositions.forEach(p => {
                    var path = this.getAstPathToPosition(script, p);
                    if (path.ast() === null || path.ast().nodeType() !== TypeScript.NodeType.Name) {
                        return;
                    }
                    var searchSymbolInfoAtPosition = this.compilerState.getSymbolInformationFromPath(path, document);

                    if (searchSymbolInfoAtPosition !== null) {
                        var referenceAST = FindReferenceHelpers.getCorrectASTForReferencedSymbolName(searchSymbolInfoAtPosition.ast, symbolName);
                        // Compare the length so we filter out strict superstrings of the symbol we are looking for
                        if (referenceAST.limChar - referenceAST.minChar === symbolName.length && FindReferenceHelpers.compareSymbolsForLexicalIdentity(searchSymbolInfoAtPosition.symbol, symbol)) {
                            var isWriteAccess = this.isWriteAccess(path.ast(), path.parent());
                            result.push(new ReferenceEntry(this.compilerState.getHostFileName(fileName), referenceAST.minChar, referenceAST.limChar, isWriteAccess));
                        }
                    }
                });
            }

            return result;
        }

        private isWriteAccess(current: TypeScript.AST, parent: TypeScript.AST): boolean {
            if (parent !== null) {
                var parentNodeType = parent.nodeType();
                switch (parentNodeType) {
                    case TypeScript.NodeType.ClassDeclaration:
                        return (<TypeScript.ClassDeclaration>parent).name === current;

                    case TypeScript.NodeType.InterfaceDeclaration:
                        return (<TypeScript.InterfaceDeclaration>parent).name === current;

                    case TypeScript.NodeType.ModuleDeclaration:
                        return (<TypeScript.ModuleDeclaration>parent).name === current;

                    case TypeScript.NodeType.FunctionDeclaration:
                        return (<TypeScript.FunctionDeclaration>parent).name === current;

                    case TypeScript.NodeType.ImportDeclaration:
                        return (<TypeScript.ImportDeclaration>parent).id === current;

                    case TypeScript.NodeType.VariableDeclarator:
                        var varDeclarator = <TypeScript.VariableDeclarator>parent;
                        return !!(varDeclarator.init && varDeclarator.id === current);

                    case TypeScript.NodeType.Parameter:
                        return true;

                    case TypeScript.NodeType.AssignmentExpression:
                    case TypeScript.NodeType.AddAssignmentExpression:
                    case TypeScript.NodeType.SubtractAssignmentExpression:
                    case TypeScript.NodeType.MultiplyAssignmentExpression:
                    case TypeScript.NodeType.DivideAssignmentExpression:
                    case TypeScript.NodeType.ModuloAssignmentExpression:
                    case TypeScript.NodeType.OrAssignmentExpression:
                    case TypeScript.NodeType.AndAssignmentExpression:
                    case TypeScript.NodeType.ExclusiveOrAssignmentExpression:
                    case TypeScript.NodeType.LeftShiftAssignmentExpression:
                    case TypeScript.NodeType.UnsignedRightShiftAssignmentExpression:
                    case TypeScript.NodeType.SignedRightShiftAssignmentExpression:
                        return (<TypeScript.BinaryExpression>parent).operand1 === current;

                    case TypeScript.NodeType.PreIncrementExpression:
                    case TypeScript.NodeType.PostIncrementExpression:
                    case TypeScript.NodeType.PreDecrementExpression:
                    case TypeScript.NodeType.PostDecrementExpression:
                        return true;
                }
            }

            return false;
        }

        private getPossibleSymbolReferencePositions(fileName: string, symbolName: string): number []{

            var positions: number[] = [];

            /// TODO: Cache symbol existence for files to save text search
            /// TODO: Use a smarter search mechanism to avoid picking up partial matches, matches in comments and in string literals

            var sourceText = this.compilerState.getScriptSnapshot(fileName);
            var text = sourceText.getText(0, sourceText.getLength());

            var position = text.indexOf(symbolName);
            while (position >= 0) {
                positions.push(position);
                position = text.indexOf(symbolName, position + symbolName.length + 1);
            }

            return positions;
        }

        public getSignatureAtPosition(fileName: string, position: number): SignatureInfo {
            this.refresh();

            var document = this.compilerState.getDocument(fileName);

            // First check whether we are in a comment where signature help should not be displayed
            //if (!SignatureInfoHelpers.isSignatureHelpTriggerPosition(document.syntaxTree().sourceUnit(), position)) {
            //    this.logger.log("position is not a valid singature help location");
            //    return null;
            //}

            if (SignatureInfoHelpers.isSignatureHelpBlocker(document.syntaxTree().sourceUnit(), position)) {
                this.logger.log("position is not a valid singature help location");
                return null;
            }

            // Second check if we are inside a generic parameter
            var genericTypeArgumentListInfo = SignatureInfoHelpers.isInPartiallyWrittenTypeArgumentList(document.syntaxTree(), position);
            if (genericTypeArgumentListInfo) {
                // The expression could be messed up because we are parsing a partial generic expression, so set the search path to a place where we know it
                // can find a call expression
                return this.getTypeParameterSignatureFromPartiallyWrittenExpression(document, position, genericTypeArgumentListInfo);
            }

            // Third set the path to find ask the type system about the call expression
            var script = document.script;
            var path = this.getAstPathToPosition(script, position);
            if (path.count() == 0) {
                return null;
            }

            // Find call expression
            while (path.count() >= 2) {
                if (path.ast().nodeType() === TypeScript.NodeType.InvocationExpression ||
                    path.ast().nodeType() === TypeScript.NodeType.ObjectCreationExpression ||  // Valid call or new expressions
                    (path.isDeclaration() && position > path.ast().minChar)) // Its a declaration node - call expression cannot be in parent scope
                {
                    break;
                }

                path.pop();
            }

            if (path.ast().nodeType() !== TypeScript.NodeType.InvocationExpression && path.ast().nodeType() !== TypeScript.NodeType.ObjectCreationExpression) {
                this.logger.log("No call expression or generic arguments found for the given position");
                return null;
            }

            var callExpression = <TypeScript.InvocationExpression>path.ast();
            var isNew = (callExpression.nodeType() === TypeScript.NodeType.ObjectCreationExpression);

            if (position <= callExpression.target.limChar + callExpression.target.trailingTriviaWidth || position > callExpression.arguments.limChar + callExpression.arguments.trailingTriviaWidth) {
                this.logger.log("Outside argument list");
                return null;
            }

            // Resolve symbol
            var callSymbolInfo = this.compilerState.getCallInformationFromPath(path, document);
            if (!callSymbolInfo || !callSymbolInfo.targetSymbol || !callSymbolInfo.resolvedSignatures) {
                this.logger.log("Could not find symbol for call expression");
                return null;
            }

            // Build the result
            var result = new SignatureInfo();

            result.formal = SignatureInfoHelpers.getSignatureInfoFromSignatureSymbol(callSymbolInfo.targetSymbol, callSymbolInfo.resolvedSignatures, callSymbolInfo.enclosingScopeSymbol, this.compilerState);
            result.actual = SignatureInfoHelpers.getActualSignatureInfoFromCallExpression(callExpression, position, genericTypeArgumentListInfo);
            result.activeFormal = (callSymbolInfo.resolvedSignatures && callSymbolInfo.candidateSignature) ? callSymbolInfo.resolvedSignatures.indexOf(callSymbolInfo.candidateSignature) : -1;

            if (result.actual === null || result.formal === null || result.activeFormal === null) {
                this.logger.log("Can't compute actual and/or formal signature of the call expression");
                return null;
            }

            return result;
        }

        private getTypeParameterSignatureFromPartiallyWrittenExpression(document: TypeScript.Document, position: number, genericTypeArgumentListInfo : IPartiallyWrittenTypeArgumentListInformation): SignatureInfo {
            var script = document.script;

            // Get the identifier information
            var path = this.getAstPathToPosition(script, genericTypeArgumentListInfo.genericIdentifer.start());
            if (path.count() == 0 || path.ast().nodeType() !== TypeScript.NodeType.Name) {
                throw new Error("getTypeParameterSignatureAtPosition: " + TypeScript.getLocalizedText(TypeScript.DiagnosticCode.Looking_up_path_for_identifier_token_did_not_result_in_an_identifer, null));
            }

            var symbolInformation = this.compilerState.getSymbolInformationFromPath(path, document);

            if (!symbolInformation.symbol) {
                return null;
            }

            // TODO: are we in an new expression?
            var isNew = SignatureInfoHelpers.isTargetOfObjectCreationExpression(genericTypeArgumentListInfo.genericIdentifer);

            var typeSymbol = symbolInformation.symbol.type;

            if (typeSymbol.kind === TypeScript.PullElementKind.FunctionType ||
                (isNew && typeSymbol.kind === TypeScript.PullElementKind.ConstructorType)) {

                var signatures = isNew ? typeSymbol.getConstructSignatures() : typeSymbol.getCallSignatures();

                // Build the result
                var result = new SignatureInfo();

                result.formal = SignatureInfoHelpers.getSignatureInfoFromSignatureSymbol(symbolInformation.symbol, signatures, symbolInformation.enclosingScopeSymbol, this.compilerState);
                result.actual = SignatureInfoHelpers.getActualSignatureInfoFromPartiallyWritenGenericExpression(position, genericTypeArgumentListInfo);
                result.activeFormal = 0;

                return result;
            }
            else if (typeSymbol.isGeneric()){
                // The symbol is a generic type

                // Get the class symbol for constuctor symbol
                if (typeSymbol.kind === TypeScript.PullElementKind.ConstructorType) {
                    typeSymbol = typeSymbol.getAssociatedContainerType();
                }

                // Build the result
                var result = new SignatureInfo();

                result.formal = SignatureInfoHelpers.getSignatureInfoFromGenericSymbol(typeSymbol, symbolInformation.enclosingScopeSymbol, this.compilerState);
                result.actual = SignatureInfoHelpers.getActualSignatureInfoFromPartiallyWritenGenericExpression(position, genericTypeArgumentListInfo);
                result.activeFormal = 0;

                return result;
            }

            // Nothing to handle
            return null;
        }

        public getDefinitionAtPosition(fileName: string, position: number): DefinitionInfo[] {
            this.refresh();

            var document = this.compilerState.getDocument(fileName);
            var script = document.script;

            var path = this.getAstPathToPosition(script, position);
            if (path.count() == 0) {
                return null;
            }

            var symbolInfo = this.compilerState.getSymbolInformationFromPath(path, document);
            if (symbolInfo == null || symbolInfo.symbol == null) {
                this.logger.log("No identifier at the specified location.");
                return null;
            }

            var declarations = symbolInfo.symbol.getDeclarations();
            if (declarations == null || declarations.length === 0) {
                this.logger.log("Could not find declaration for symbol.");
                return null;
            }

            var symbolName = symbolInfo.symbol.getDisplayName();
            var symbolKind = this.mapPullElementKind(symbolInfo.symbol.kind, symbolInfo.symbol);
            var container = symbolInfo.symbol.getContainer();
            var containerName = container ? container.fullName() : "";
            var containerKind = container ? this.mapPullElementKind(container.kind, container): "";

            var result: DefinitionInfo[] = [];
            var lastAddedSingature: { isDefinition: boolean; index: number; } = null;
            for (var i = 0, n = declarations.length; i < n; i++) {
                var declaration = declarations[i];
                var span = declaration.getSpan();

                var nextEntryIndex = result.length;

                var signature = declaration.getSignatureSymbol();
                if (signature) {
                    // This is either a signature of an overload, definition or an ambient function signature.
                    // We want to filter them so that we only have one entry for all signatures. 
                    // If a definition exits, we should pick it, if not (e.g. ambient methods case) just use the last of the signatures.
                    if (lastAddedSingature && !lastAddedSingature.isDefinition) {
                        // The last entry was a signature overload. overwrite it with the new signature.
                        nextEntryIndex = lastAddedSingature.index;
                    }
                    lastAddedSingature = { isDefinition: signature.isDefinition(), index: nextEntryIndex };
                }

                result[nextEntryIndex] = new DefinitionInfo(this.compilerState.getHostFileName(declaration.getScriptName()), span.start(), span.end(), symbolKind, symbolName, containerKind, containerName);
            }

            return result;
        }

        public getNavigateToItems(searchValue: string): NavigateToItem[] {
            return null;
        }

        public getSyntacticDiagnostics(fileName: string): TypeScript.Diagnostic[] {
            this.compilerState.refresh();
            return this.compilerState.getSyntacticDiagnostics(fileName);
        }

        public getSemanticDiagnostics(fileName: string): TypeScript.Diagnostic[] {
            this.compilerState.refresh();
            return this.compilerState.getSemanticDiagnostics(fileName);
        }

        public getEmitOutput(fileName: string): EmitOutput {
            this.compilerState.refresh();
            return this.compilerState.getEmitOutput(fileName);
        }

        ///
        /// Return the stack of AST nodes containing "position"
        ///
        private getAstPathToPosition(script: TypeScript.AST, pos: number, useTrailingTriviaAsLimChar = true): TypeScript.AstPath {
            if (this.logger.information()) {
                this.logger.log("getAstPathToPosition(" + script + ", " + pos + ")");
            }

            return TypeScript.getAstPathToPosition(script, pos, useTrailingTriviaAsLimChar);
        }

        private getFullNameOfSymbol(symbol: TypeScript.PullSymbol, enclosingScopeSymbol: TypeScript.PullSymbol) {
            var container = symbol.getContainer();
            if (this.isLocal(symbol) ||
                symbol.kind == TypeScript.PullElementKind.Parameter) {
                // Local var
                return symbol.getScopedName(enclosingScopeSymbol, true);
            }

            var symbolKind = symbol.kind;
            if (symbol.kind == TypeScript.PullElementKind.Primitive) {
                // Primitive type symbols - do not use symbol name
                return "";
            }

            if (symbolKind == TypeScript.PullElementKind.ConstructorType) {
                symbol = (<TypeScript.PullTypeSymbol>symbol).getAssociatedContainerType();
            }

            if (symbolKind != TypeScript.PullElementKind.Property &&
                symbolKind != TypeScript.PullElementKind.EnumMember &&
                symbolKind != TypeScript.PullElementKind.Method &&
                symbolKind != TypeScript.PullElementKind.TypeParameter &&
                !symbol.hasFlag(TypeScript.PullElementFlags.Exported)) {
                // Non exported variable/function
                return symbol.getScopedName(enclosingScopeSymbol, true);
            }

            return symbol.fullName(enclosingScopeSymbol);
        }

        //
        // New Pull stuff
        //

        private getTypeInfoEligiblePath(fileName: string, position: number, isConstructorValidPosition: boolean) {
            this.refresh();

            var document = this.compilerState.getDocument(fileName);
            var script = document.script;

            var path = this.getAstPathToPosition(script, position, false);
            if (path.count() == 0) {
                return null;
            }

            var cur = path.ast();
            switch (cur.nodeType()) {
                default:
                    return null;
                case TypeScript.NodeType.FunctionDeclaration:
                    var funcDecl = <TypeScript.FunctionDeclaration>cur;
                    // constructor keyword
                    if (!isConstructorValidPosition || !funcDecl.isConstructor || !(position >= funcDecl.minChar && position <= funcDecl.minChar + 11 /*constructor*/)) {
                        return null;
                    }
                case TypeScript.NodeType.MemberAccessExpression:
                case TypeScript.NodeType.SuperExpression:
                case TypeScript.NodeType.StringLiteral:
                case TypeScript.NodeType.ThisExpression:
                case TypeScript.NodeType.Name:
                    return path;
            }
        }

        public getTypeAtPosition(fileName: string, position: number): TypeInfo {
            var path = this.getTypeInfoEligiblePath(fileName, position, true);
            if (!path) {
                return null;
            }

            var document = this.compilerState.getDocument(fileName);
            var ast: TypeScript.AST;
            var symbol: TypeScript.PullSymbol;
            var typeSymbol: TypeScript.PullTypeSymbol;
            var enclosingScopeSymbol: TypeScript.PullSymbol;
            var isCallExpression: boolean = false;
            var resolvedSignatures: TypeScript.PullSignatureSymbol[];
            var candidateSignature: TypeScript.PullSignatureSymbol;
            var isConstructorCall: boolean;

            if (path.isNameOfClass() || path.isNameOfInterface() || path.isNameOfFunction() || path.isNameOfVariable()) {
                // Skip the name and get to the declaration
                path.pop();
            }
            
            if (path.isDeclaration()) {
                var declarationInformation = this.compilerState.getDeclarationSymbolInformation(path, document);

                ast = declarationInformation.ast;
                symbol = declarationInformation.symbol;
                enclosingScopeSymbol = declarationInformation.enclosingScopeSymbol;

                if (path.ast().nodeType() === TypeScript.NodeType.FunctionDeclaration) {
                    var funcDecl = <TypeScript.FunctionDeclaration>(path.ast());
                    if (symbol && symbol.kind != TypeScript.PullElementKind.Property) {
                        var signatureInfo = TypeScript.PullHelpers.getSignatureForFuncDecl(funcDecl, this.compilerState.getSemanticInfoChain().getUnit(fileName));
                        isCallExpression = true;
                        candidateSignature = signatureInfo.signature;
                        resolvedSignatures = signatureInfo.allSignatures;
                    }
                }
            }
            else if (path.isCallExpression() || path.isCallExpressionTarget()) {
                // If this is a call we need to get the call singuatures as well
                // Move the cursor to point to the call expression
                while (!path.isCallExpression()) {
                    path.pop();
                }

                // Get the call expression symbol
                var callExpressionInformation = this.compilerState.getCallInformationFromPath(path, document);

                if (!callExpressionInformation.targetSymbol) {
                    return null;
                }

                ast = callExpressionInformation.ast;
                symbol = callExpressionInformation.targetSymbol;
                enclosingScopeSymbol = callExpressionInformation.enclosingScopeSymbol;

                // Check if this is a property or a variable, if so do not treat it as a fuction, but rather as a variable with function type
                var isPropertyOrVar = symbol.kind == TypeScript.PullElementKind.Property || symbol.kind == TypeScript.PullElementKind.Variable;
                typeSymbol = symbol.type;
                if (isPropertyOrVar) {
                    if (typeSymbol.getName() != "") {
                        symbol = typeSymbol;
                    }
                    isPropertyOrVar = (typeSymbol.kind != TypeScript.PullElementKind.Interface && typeSymbol.kind != TypeScript.PullElementKind.ObjectType) || typeSymbol.getName() == "";
                }

                if (!isPropertyOrVar) {
                    isCallExpression = true;
                    resolvedSignatures = callExpressionInformation.resolvedSignatures;
                    candidateSignature = callExpressionInformation.candidateSignature;
                    isConstructorCall = callExpressionInformation.isConstructorCall;
                }
            }
            else {
                var symbolInformation = this.compilerState.getSymbolInformationFromPath(path, document);

                if (!symbolInformation.symbol) {
                    return null;
                }

                ast = symbolInformation.ast;
                symbol = symbolInformation.symbol;
                enclosingScopeSymbol = symbolInformation.enclosingScopeSymbol;

               
                if (symbol.kind === TypeScript.PullElementKind.Method || symbol.kind == TypeScript.PullElementKind.Function) {
                    typeSymbol = symbol.type;
                    if (typeSymbol) {
                        isCallExpression = true;
                        resolvedSignatures = typeSymbol.getCallSignatures();
                    }
                }
            }

            if (resolvedSignatures && (!candidateSignature || candidateSignature.isDefinition())) {
                for (var i = 0, len = resolvedSignatures.length; i < len; i++) {
                    if (len > 1 && resolvedSignatures[i].isDefinition()) {
                        continue;
                    }

                    candidateSignature = resolvedSignatures[i];
                    break;
                }
            }

            var memberName = isCallExpression
                ? TypeScript.PullSignatureSymbol.getSignatureTypeMemberName(candidateSignature, resolvedSignatures, enclosingScopeSymbol)
                : symbol.getTypeNameEx(enclosingScopeSymbol, true);
            var kind = this.mapPullElementKind(symbol.kind, symbol, !isCallExpression, isCallExpression, isConstructorCall);
            var docComment = this.compilerState.getDocComments(candidateSignature || symbol, !isCallExpression);
            var symbolName = this.getFullNameOfSymbol(symbol, enclosingScopeSymbol);
            var minChar = ast ? ast.minChar : -1;
            var limChar = ast ? ast.limChar : -1;

            return new TypeInfo(memberName, docComment, symbolName, kind, minChar, limChar);
        }

        public getCompletionsAtPosition(fileName: string, position: number, isMemberCompletion: boolean): CompletionInfo {
            this.refresh();

            var document = this.compilerState.getDocument(fileName);
            var script = document.script;

            if (CompletionHelpers.isCompletionListBlocker(document.syntaxTree().sourceUnit(), position)) {
                this.logger.log("Returning an empty list because completion was blocked.");
                return null;
            }

            var path = this.getAstPathToPosition(script, position);

            var isRightOfDot = false;
            if (path.count() >= 1 &&
                path.asts[path.top].nodeType() === TypeScript.NodeType.MemberAccessExpression
                && (<TypeScript.BinaryExpression>path.asts[path.top]).operand1.limChar < position) {
                isRightOfDot = true;
                path.push((<TypeScript.BinaryExpression>path.asts[path.top]).operand1);
            }
            else if (path.count() >= 2 &&
                    path.asts[path.top].nodeType() === TypeScript.NodeType.Name &&
                    path.asts[path.top - 1].nodeType() === TypeScript.NodeType.MemberAccessExpression &&
                    (<TypeScript.BinaryExpression>path.asts[path.top - 1]).operand2 === path.asts[path.top]) {
                isRightOfDot = true;
                path.pop();
                path.push((<TypeScript.BinaryExpression>path.asts[path.top]).operand1);
            }

            // Get the completions
            var entries = new TypeScript.IdentiferNameHashTable<CachedCompletionEntryDetails>();

            // Right of dot member completion list
            if (isRightOfDot) {
                var members = this.compilerState.getVisibleMemberSymbolsFromPath(path, document);
                if (!members) {
                    return null;
                }

                isMemberCompletion = true;
                this.getCompletionEntriesFromSymbols(members, entries);
            }
            else {
                var containingObjectLiteral = CompletionHelpers.getContainingObjectLiteralApplicableForCompletion(document.syntaxTree().sourceUnit(), position);

                // Object literal expression, look up possible property names from contextual type
                if (containingObjectLiteral) {
                    var searchPosition = Math.min(position, containingObjectLiteral.end());
                    path = this.getAstPathToPosition(script, searchPosition);
                    // Get the object literal node

                    while (path.ast().nodeType() !== TypeScript.NodeType.ObjectLiteralExpression) {
                        path.pop();
                    }

                    if (!path.ast() || path.ast().nodeType() !== TypeScript.NodeType.ObjectLiteralExpression) {
                        throw TypeScript.Errors.invalidOperation("AST Path look up did not result in the same node as Fidelity Syntax Tree look up.");
                    }

                    isMemberCompletion = true;

                    // Try to get the object members form contextual typing
                    var contextualMembers = this.compilerState.geContextualMembersFromPath(path, document);
                    if (contextualMembers && contextualMembers.symbols && contextualMembers.symbols.length > 0) {
                        // get existing members
                        var existingMembers = this.compilerState.getVisibleMemberSymbolsFromPath(path, document);

                        // Add filtterd items to the completion list
                        this.getCompletionEntriesFromSymbols({
                            symbols: CompletionHelpers.filterContextualMembersList(contextualMembers.symbols, existingMembers),
                            enclosingScopeSymbol: contextualMembers.enclosingScopeSymbol
                        }, entries);
                    }
                }
                // Get scope memebers
                else {
                    isMemberCompletion = false;
                    var decls = this.compilerState.getVisibleDeclsFromPath(path, document);
                    this.getCompletionEntriesFromDecls(decls, entries);
                }
            }

            // Add keywords if this is not a member completion list
            if (!isMemberCompletion) {
                this.getCompletionEntriesForKeywords(KeywordCompletions.getKeywordCompltions(), entries);
            }

            // Prepare the completion result
            var completions = new CompletionInfo();
            completions.isMemberCompletion = isMemberCompletion;
            completions.entries = [];
            entries.map((key, value) => {
                completions.entries.push({
                    name: value.name,
                    kind: value.kind,
                    kindModifiers: value.kindModifiers
                });
            }, null);

            // Store this completion list as the active completion list
            this.activeCompletionSession = new CompletionSession(fileName, position, entries);

            return completions;
        }

        private getCompletionEntriesFromSymbols(symbolInfo: TypeScript.PullVisibleSymbolsInfo, result: TypeScript.IdentiferNameHashTable<CachedCompletionEntryDetails>): void {
            for (var i = 0, n = symbolInfo.symbols.length; i < n; i++) {
                var symbol = symbolInfo.symbols[i];

                var symbolDisplayName = CompletionHelpers.getValidCompletionEntryDisplayName(symbol.getDisplayName(), this.compilerState.compilationSettings().codeGenTarget);
                if (!symbolDisplayName) {
                    continue;
                }

                var symbolKind = symbol.kind;

                var exitingEntry = result.lookup(symbolDisplayName);

                if (exitingEntry && (symbolKind & TypeScript.PullElementKind.SomeValue)) {
                    // We have two decls with the same name. Do not overwrite types and containers with thier variable delcs.
                    continue;
                }

                var entry: CachedCompletionEntryDetails;
                var kindName = this.mapPullElementKind(symbolKind, symbol, true);
                var kindModifiersName = this.getScriptElementKindModifiers(symbol);

                if (symbol.isResolved) {
                    // If the symbol has already been resolved, cache the needed information for completion details.
                    var typeName = symbol.getTypeName(symbolInfo.enclosingScopeSymbol, true);
                    var fullSymbolName = this.getFullNameOfSymbol(symbol, symbolInfo.enclosingScopeSymbol);

                    var type = symbol.type;
                    var symbolForDocComments = symbol;
                    if (type && type.hasOnlyOverloadCallSignatures()) {
                        symbolForDocComments = type.getCallSignatures()[0];
                    }

                    var docComments = this.compilerState.getDocComments(symbolForDocComments, true);

                    entry = new ResolvedCompletionEntry(symbolDisplayName, kindName, kindModifiersName, typeName, fullSymbolName, docComments);
                }
                else {
                    entry = new DeclReferenceCompletionEntry(symbolDisplayName, kindName, kindModifiersName, symbol.getDeclarations()[0]);
                }

                result.addOrUpdate(symbolDisplayName, entry);
            }
        }

        private getCompletionEntriesFromDecls(decls: TypeScript.PullDecl[], result: TypeScript.IdentiferNameHashTable<CachedCompletionEntryDetails>): void {
            for (var i = 0, n = decls.length; i < n; i++) {
                var decl = decls[i];

                var declDisplaylName = CompletionHelpers.getValidCompletionEntryDisplayName(decl.getDisplayName(), this.compilerState.compilationSettings().codeGenTarget);
                if (!declDisplaylName) {
                    continue;
                }

                var declKind = decl.kind;

                var exitingEntry = result.lookup(declDisplaylName);

                if (exitingEntry && (declKind & TypeScript.PullElementKind.SomeValue)) {
                    // We have two decls with the same name. Do not overwrite types and containers with thier variable delcs.
                    continue;
                }

                var kindName = this.mapPullElementKind(declKind, /*symbol*/ null, true);
                var kindModifiersName = this.getScriptElementKindModifiersFromFlgas(decl.flags);

                var entry = new DeclReferenceCompletionEntry(declDisplaylName, kindName, kindModifiersName, decl);

                result.addOrUpdate(declDisplaylName, entry);
            }
        }

        private getCompletionEntriesForKeywords(keywords: ResolvedCompletionEntry[], result: TypeScript.IdentiferNameHashTable<CompletionEntryDetails>): void {
            for (var i = 0, n = keywords.length; i < n; i++) {
                var keyword = keywords[i];
                result.addOrUpdate(keyword.name, keyword); 
            }
        }

        public getCompletionEntryDetails(fileName: string, position: number, entryName: string): CompletionEntryDetails {
            // Ensure that the current active completion session is still valid for this request
            if (!this.activeCompletionSession ||
                this.activeCompletionSession.fileName !== fileName ||
                this.activeCompletionSession.position !== position) {
                    return null;
            }

            var entry = this.activeCompletionSession.entries.lookup(entryName);
            if (!entry) {
                return null;
            }

            if (!entry.isResolved()) {
                // This entry has not been resolved yet. Resolve it.
                var unResolvedEntry = <DeclReferenceCompletionEntry>(entry);
                var decl = unResolvedEntry.decl;

                var document = this.compilerState.getDocument(fileName);
                var path = this.getAstPathToPosition(document.script, position);
                var symbolInfo = this.compilerState.pullGetDeclInformation(decl, path, document);

                if (!symbolInfo) {
                    return null;
                }

                var symbol = symbolInfo.symbol;
                var typeName = symbol.getTypeName(symbolInfo.enclosingScopeSymbol, true);
                var fullSymbolName = this.getFullNameOfSymbol(symbol, symbolInfo.enclosingScopeSymbol);

                var type = symbol.type;
                var symbolForDocComments = symbol;
                if (type && type.hasOnlyOverloadCallSignatures()) {
                    symbolForDocComments = type.getCallSignatures()[0];
                }

                var docComment = this.compilerState.getDocComments(symbolForDocComments, true);

                // Store the information for next lookup
                unResolvedEntry.resolve(typeName, fullSymbolName, docComment);
            }

            return {
                name: entry.name,
                kind: entry.kind,
                kindModifiers: entry.kindModifiers,
                type: entry.type,
                fullSymbolName: entry.fullSymbolName,
                docComment: entry.docComment
            };
        }

        private isLocal(symbol: TypeScript.PullSymbol) {
            var container = symbol.getContainer();
            if (container) {
                var containerKind = container.kind;
                if (containerKind & (TypeScript.PullElementKind.SomeFunction | TypeScript.PullElementKind.FunctionType)) {
                    return true;
                }

                if (containerKind == TypeScript.PullElementKind.ConstructorType && !symbol.hasFlag(TypeScript.PullElementFlags.Static)) {
                    return true;
                }
            }

            return false;
        }

        private getModuleOrEnumKind(symbol: TypeScript.PullSymbol) {
            if (symbol) {
                var declarations = symbol.getDeclarations();
                for (var i = 0; i < declarations.length; i++) {
                    var declKind = declarations[i].kind;
                    if (declKind == TypeScript.PullElementKind.Container) {
                        return ScriptElementKind.moduleElement;
                    } else if (declKind == TypeScript.PullElementKind.Enum) {
                        return ScriptElementKind.enumElement;
                    } else if (declKind == TypeScript.PullElementKind.Variable) {
                        var declFlags = declarations[i].flags;
                        if (declFlags & TypeScript.PullElementFlags.InitializedModule) {
                            return ScriptElementKind.moduleElement;
                        } else if (declFlags & TypeScript.PullElementFlags.InitializedEnum) {
                            return ScriptElementKind.enumElement;
                        }
                    }
                }
            }
            return ScriptElementKind.unknown;
        }

        private mapPullElementKind(kind: TypeScript.PullElementKind, symbol?: TypeScript.PullSymbol, useConstructorAsClass?: boolean, varIsFunction?: boolean, functionIsConstructor?: boolean): string {
            if (functionIsConstructor) {
                return ScriptElementKind.constructorImplementationElement;
            }

            if (varIsFunction) {
                switch (kind) {
                    case TypeScript.PullElementKind.Container:
                    case TypeScript.PullElementKind.DynamicModule:
                    case TypeScript.PullElementKind.TypeAlias:
                    case TypeScript.PullElementKind.Interface:
                    case TypeScript.PullElementKind.Class:
                    case TypeScript.PullElementKind.Parameter:
                        return ScriptElementKind.functionElement;
                    case TypeScript.PullElementKind.Variable:
                        return (symbol && this.isLocal(symbol)) ? ScriptElementKind.localFunctionElement : ScriptElementKind.functionElement;
                    case TypeScript.PullElementKind.Property:
                        return ScriptElementKind.memberFunctionElement;
                    case TypeScript.PullElementKind.Function:
                        return (symbol && this.isLocal(symbol)) ? ScriptElementKind.localFunctionElement : ScriptElementKind.functionElement;
                    case TypeScript.PullElementKind.ConstructorMethod:
                        return ScriptElementKind.constructorImplementationElement;
                    case TypeScript.PullElementKind.Method:
                        return ScriptElementKind.memberFunctionElement;
                    case TypeScript.PullElementKind.FunctionExpression:
                        return ScriptElementKind.localFunctionElement;
                    case TypeScript.PullElementKind.GetAccessor:
                        return ScriptElementKind.memberGetAccessorElement;
                    case TypeScript.PullElementKind.SetAccessor:
                        return ScriptElementKind.memberSetAccessorElement;
                    case TypeScript.PullElementKind.CallSignature:
                        return ScriptElementKind.callSignatureElement;
                    case TypeScript.PullElementKind.ConstructSignature:
                        return ScriptElementKind.constructSignatureElement;
                    case TypeScript.PullElementKind.IndexSignature:
                        return ScriptElementKind.indexSignatureElement;
                    case TypeScript.PullElementKind.TypeParameter:
                        return ScriptElementKind.typeParameterElement;
                    case TypeScript.PullElementKind.Primitive:
                        return ScriptElementKind.primitiveType;
                }
            } else {
                switch (kind) {
                    case TypeScript.PullElementKind.Script:
                        return ScriptElementKind.scriptElement;
                    case TypeScript.PullElementKind.Container:
                    case TypeScript.PullElementKind.DynamicModule:
                    case TypeScript.PullElementKind.TypeAlias:
                        return ScriptElementKind.moduleElement;
                    case TypeScript.PullElementKind.Interface:
                        return ScriptElementKind.interfaceElement;
                    case TypeScript.PullElementKind.Class:
                        return ScriptElementKind.classElement;
                    case TypeScript.PullElementKind.Enum:
                        return ScriptElementKind.enumElement;
                    case TypeScript.PullElementKind.Variable:
                        var scriptElementKind = this.getModuleOrEnumKind(symbol);
                        if (scriptElementKind != ScriptElementKind.unknown) {
                            return scriptElementKind;
                        }
                        return (symbol && this.isLocal(symbol)) ? ScriptElementKind.localVariableElement : ScriptElementKind.variableElement;
                    case TypeScript.PullElementKind.Parameter:
                        return ScriptElementKind.parameterElement;
                    case TypeScript.PullElementKind.Property:
                        return ScriptElementKind.memberVariableElement;
                    case TypeScript.PullElementKind.Function:
                        return (symbol && this.isLocal(symbol)) ? ScriptElementKind.localFunctionElement : ScriptElementKind.functionElement;
                    case TypeScript.PullElementKind.ConstructorMethod:
                        return useConstructorAsClass ? ScriptElementKind.classElement : ScriptElementKind.constructorImplementationElement;
                    case TypeScript.PullElementKind.Method:
                        return ScriptElementKind.memberFunctionElement;
                    case TypeScript.PullElementKind.FunctionExpression:
                        return ScriptElementKind.localFunctionElement;
                    case TypeScript.PullElementKind.GetAccessor:
                        return ScriptElementKind.memberGetAccessorElement;
                    case TypeScript.PullElementKind.SetAccessor:
                        return ScriptElementKind.memberSetAccessorElement;
                    case TypeScript.PullElementKind.CallSignature:
                        return ScriptElementKind.callSignatureElement;
                    case TypeScript.PullElementKind.ConstructSignature:
                        return ScriptElementKind.constructSignatureElement;
                    case TypeScript.PullElementKind.IndexSignature:
                        return ScriptElementKind.indexSignatureElement;
                    case TypeScript.PullElementKind.EnumMember:
                        return ScriptElementKind.memberVariableElement;
                    case TypeScript.PullElementKind.TypeParameter:
                        return ScriptElementKind.typeParameterElement;
                    case TypeScript.PullElementKind.Primitive:
                        return ScriptElementKind.primitiveType;
                }
            }

            return ScriptElementKind.unknown;
        }

        private getScriptElementKindModifiers(symbol: TypeScript.PullSymbol): string {
            var result: string[] = [];

            if (symbol.hasFlag(TypeScript.PullElementFlags.Exported)) {
                result.push(ScriptElementKindModifier.exportedModifier);
            }
            if (symbol.hasFlag(TypeScript.PullElementFlags.Ambient)) {
                result.push(ScriptElementKindModifier.ambientModifier);
            }
            if (symbol.hasFlag(TypeScript.PullElementFlags.Public)) {
                result.push(ScriptElementKindModifier.publicMemberModifier);
            }
            if (symbol.hasFlag(TypeScript.PullElementFlags.Private)) {
                result.push(ScriptElementKindModifier.privateMemberModifier);
            }
            if (symbol.hasFlag(TypeScript.PullElementFlags.Static)) {
                result.push(ScriptElementKindModifier.staticModifier);
            }

            return result.length > 0 ? result.join(',') : ScriptElementKindModifier.none;
        }

        private getScriptElementKindModifiersFromFlgas(flags: TypeScript.PullElementFlags): string {
            var result: string[] = [];

            if (flags & TypeScript.PullElementFlags.Exported) {
                result.push(ScriptElementKindModifier.exportedModifier);
            }

            if (flags & TypeScript.PullElementFlags.Ambient) {
                result.push(ScriptElementKindModifier.ambientModifier);
            }

            if (flags & TypeScript.PullElementFlags.Public) {
                result.push(ScriptElementKindModifier.publicMemberModifier);
            }

            if (flags & TypeScript.PullElementFlags.Private) {
                result.push(ScriptElementKindModifier.privateMemberModifier);
            }

            if (flags & TypeScript.PullElementFlags.Static) {
                result.push(ScriptElementKindModifier.staticModifier);
            }

            return result.length > 0 ? result.join(',') : ScriptElementKindModifier.none;
        }

        // 
        // Syntactic Single-File features
        //

        public getNameOrDottedNameSpan(fileName: string, startPos: number, endPos: number): SpanInfo {
            var path = this.getTypeInfoEligiblePath(fileName, startPos, false);

            if (!path) {
                return null;
            }

            while (path.count() > 0) {
                if (path.isMemberOfMemberAccessExpression()) {
                    path.pop();
                } else {
                    break;
                }
            }
            var cur = path.ast();
            var spanInfo = new SpanInfo(cur.minChar, cur.limChar);
            return spanInfo;
        }

        public getBreakpointStatementAtPosition(fileName: string, pos: number): SpanInfo {
            this.minimalRefresh();
            var syntaxtree = this.getSyntaxTreeInternal(fileName);
            return Services.Breakpoints.getBreakpointLocation(syntaxtree, pos);
        }

        public getFormattingEditsForRange(fileName: string, minChar: number, limChar: number, options: FormatCodeOptions): TextEdit[] {
            this.minimalRefresh();

            var manager = this.getFormattingManager(fileName, options);

            return manager.formatSelection(minChar, limChar);
        }

        public getFormattingEditsForDocument(fileName: string, minChar: number, limChar: number, options: FormatCodeOptions): TextEdit[] {
            this.minimalRefresh();

            var manager = this.getFormattingManager(fileName, options);

            return manager.formatDocument(minChar, limChar);
        }

        public getFormattingEditsOnPaste(fileName: string, minChar: number, limChar: number, options: FormatCodeOptions): TextEdit[] {
            this.minimalRefresh();

            var manager = this.getFormattingManager(fileName, options);

            return manager.formatOnPaste(minChar, limChar);
        }

        public getFormattingEditsAfterKeystroke(fileName: string, position: number, key: string, options: FormatCodeOptions): TextEdit[] {
            this.minimalRefresh();

            var manager = this.getFormattingManager(fileName, options);

            if (key === "}") {
                return manager.formatOnClosingCurlyBrace(position);
            }
            else if (key === ";") {
                return manager.formatOnSemicolon(position);
            }
            else if (key === "\n") {
                return manager.formatOnEnter(position);
            }

            return [];
        }

        private getFormattingManager(fileName: string, options: FormatCodeOptions) {
            // Ensure rules are initialized and up to date wrt to formatting options
            if (this.formattingRulesProvider == null) {
                this.formattingRulesProvider = new TypeScript.Formatting.RulesProvider(this.logger);
            }

            this.formattingRulesProvider.ensureUpToDate(options);

            // Get the Syntax Tree
            var syntaxTree = this.getSyntaxTreeInternal(fileName);

            // Convert IScriptSnapshot to ITextSnapshot
            var scriptSnapshot = this.compilerState.getScriptSnapshot(fileName);
            var scriptText = TypeScript.SimpleText.fromScriptSnapshot(scriptSnapshot);
            var textSnapshot = new TypeScript.Formatting.TextSnapshot(scriptText);

            var manager = new TypeScript.Formatting.FormattingManager(syntaxTree, textSnapshot, this.formattingRulesProvider, options);

            return manager;
        }

        public getOutliningRegions(fileName: string): TypeScript.TextSpan[] {
            this.minimalRefresh();

            var syntaxTree = this.getSyntaxTree(fileName);

            return OutliningElementsCollector.collectElements(syntaxTree.sourceUnit());
        }

        // Given a script name and position in the script, return a string representing 
        // the desired smart indent text (assuming the line is empty).
        // Return "null" in case the smart indent cannot be determined.
        public getIndentationAtPosition(fileName: string, position: number, editorOptions: EditorOptions): number {
            this.minimalRefresh();

            var syntaxTree = this.getSyntaxTree(fileName);

            var scriptSnapshot = this.compilerState.getScriptSnapshot(fileName);
            var scriptText = TypeScript.SimpleText.fromScriptSnapshot(scriptSnapshot);
            var textSnapshot = new TypeScript.Formatting.TextSnapshot(scriptText);
            var options = new FormattingOptions(!editorOptions.ConvertTabsToSpaces, editorOptions.TabSize, editorOptions.IndentSize, editorOptions.NewLineCharacter)

            return TypeScript.Formatting.SingleTokenIndenter.getIndentationAmount(position, syntaxTree.sourceUnit(), textSnapshot, options);
        }

        // Given a script name and position in the script, return a pair of text range if the 
        // position corresponds to a "brace matchin" characters (e.g. "{" or "(", etc.)
        // If the position is not on any range, return "null".
        public getBraceMatchingAtPosition(fileName: string, position: number): TypeScript.TextSpan[] {
            this.minimalRefresh();

            var syntaxTree = this.getSyntaxTreeInternal(fileName);

            return BraceMatcher.getMatchSpans(syntaxTree, position);
        }

        public getScriptLexicalStructure(fileName: string): NavigateToItem[] {
            this.minimalRefresh();

            var syntaxTree = this.getSyntaxTreeInternal(fileName);
            var items: NavigateToItem[] = [];
            var visitor = new GetScriptLexicalStructureWalker(items, fileName);
            syntaxTree.sourceUnit().accept(visitor);

            return items;
        }

        public getSyntaxTree(fileName: string): TypeScript.SyntaxTree {
            this.minimalRefresh();

            return this.getSyntaxTreeInternal(fileName);
        }

        //
        // Manage Single file syntax tree state
        //
        private getSyntaxTreeInternal(fileName: string): TypeScript.SyntaxTree {
            var version = this.compilerState.getScriptVersion(fileName);
            var syntaxTree: TypeScript.SyntaxTree = null;

            if (this.currentFileSyntaxTree === null || this.currentFileName !== fileName) {
                syntaxTree = this.createSyntaxTree(fileName);
            }
            else if (this.currentFileVersion !== version) {
                syntaxTree = this.updateSyntaxTree(fileName, this.currentFileSyntaxTree, this.currentFileVersion);
            }

            if (syntaxTree !== null) {
                // All done, ensure state is up to date
                this.currentFileVersion = version;
                this.currentFileName = fileName;
                this.currentFileSyntaxTree = syntaxTree;
            }

            return this.currentFileSyntaxTree;
        }

        private createSyntaxTree(fileName: string): TypeScript.SyntaxTree {
            var scriptSnapshot = this.compilerState.getScriptSnapshot(fileName);
            var text = TypeScript.SimpleText.fromScriptSnapshot(scriptSnapshot);

            var syntaxTree = TypeScript.Parser.parse(fileName, text, TypeScript.isDTSFile(fileName),
                TypeScript.getParseOptions(this.compilerState.getHostCompilationSettings()));

            return syntaxTree
        }

        private updateSyntaxTree(fileName: string, previousSyntaxTree: TypeScript.SyntaxTree, previousFileVersion: number): TypeScript.SyntaxTree {
            var editRange = this.compilerState.getScriptTextChangeRangeSinceVersion(fileName, previousFileVersion);

            // If "no changes", tree is good to go as is
            if (editRange === null) {
                return previousSyntaxTree;
            }

            // Debug.assert(newLength >= 0);

            var newScriptSnapshot = this.compilerState.getScriptSnapshot(fileName);
            var newSegmentedScriptSnapshot = TypeScript.SimpleText.fromScriptSnapshot(newScriptSnapshot);

            var nextSyntaxTree = TypeScript.Parser.incrementalParse(
                previousSyntaxTree, editRange, newSegmentedScriptSnapshot);

            return nextSyntaxTree;
        }
    }
}