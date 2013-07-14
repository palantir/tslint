// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='..\typescript.ts' />

module TypeScript {
    export class TypeComparisonInfo {
        public onlyCaptureFirstError = false;
        public flags: TypeRelationshipFlags = TypeRelationshipFlags.SuccessfulComparison;
        public message = "";
        public stringConstantVal: AST = null;
        private indent = 1;

        constructor(sourceComparisonInfo?: TypeComparisonInfo) {
            if (sourceComparisonInfo) {
                this.flags = sourceComparisonInfo.flags;
                this.onlyCaptureFirstError = sourceComparisonInfo.onlyCaptureFirstError;
                this.stringConstantVal = sourceComparisonInfo.stringConstantVal;
                this.indent = sourceComparisonInfo.indent + 1;
            }
        }

        public addMessage(message) {
            if (!this.onlyCaptureFirstError && this.message) {
                this.message = getDiagnosticMessage(DiagnosticCode._0__NL__1_TB__2, [this.message, this.indent, message]);
            }
            else {
                this.message = getDiagnosticMessage(DiagnosticCode._0_TB__1, [this.indent, message]);
            }
        }

        public setMessage(message) {
            this.message = getDiagnosticMessage(DiagnosticCode._0_TB__1, [this.indent, message]);
        }
    }

    export class PullTypeCheckContext {
        public enclosingDeclStack: PullDecl[] = [];
        public enclosingDeclReturnStack: boolean[] = [];
        public semanticInfo: SemanticInfo = null;
        public inSuperConstructorCall = false;
        public inSuperConstructorTarget = false;
        public seenSuperConstructorCall = false;
        public inConstructorArguments = false;
        public inImportDeclaration = false;

        constructor(public compiler: TypeScriptCompiler, public script: Script, public scriptName: string) {
        }

        public pushEnclosingDecl(decl: PullDecl) {
            this.enclosingDeclStack[this.enclosingDeclStack.length] = decl;
            this.enclosingDeclReturnStack[this.enclosingDeclReturnStack.length] = false;
        }

        public popEnclosingDecl() {
            this.enclosingDeclStack.length--;
            this.enclosingDeclReturnStack.length--;
        }

        public getEnclosingDecl(kind: PullElementKind = PullElementKind.All) {
            for (var i = this.enclosingDeclStack.length - 1; i >= 0; i--) {
                var decl = this.enclosingDeclStack[i];
                if (decl.getKind() & kind) {
                    return decl;
                }
            }

            return null;
        }

        public getEnclosingNonLambdaDecl() {
            for (var i = this.enclosingDeclStack.length - 1; i >= 0; i--) {
                var decl = this.enclosingDeclStack[i];
                if (!(decl.getKind() === PullElementKind.FunctionExpression && (decl.getFlags() & PullElementFlags.FatArrow))) {
                    return decl;
                }
            }

            return null;
        }

        public getEnclosingClassDecl(): PullDecl {
            return this.getEnclosingDecl(PullElementKind.Class);
        }

        public getEnclosingDeclHasReturn() {
            return this.enclosingDeclReturnStack[this.enclosingDeclReturnStack.length - 1];
        }

        public setEnclosingDeclHasReturn() {
            return this.enclosingDeclReturnStack[this.enclosingDeclReturnStack.length - 1] = true;
        }
    }

    export class PullTypeChecker {

        static globalPullTypeCheckPhase = 0;

        public resolver: PullTypeResolver = null;

        private context: PullTypeResolutionContext = new PullTypeResolutionContext();

        constructor(private compilationSettings: CompilationSettings,
            public semanticInfoChain: SemanticInfoChain) {
        }

        public setUnit(unitPath: string) {
            this.resolver = new PullTypeResolver(this.compilationSettings, this.semanticInfoChain, unitPath);
        }

        private getScriptDecl(fileName: string): PullDecl {
            return this.semanticInfoChain.getUnit(fileName).getTopLevelDecls()[0];
        }

        private checkForResolutionError(typeSymbol: PullTypeSymbol, decl: PullDecl): void {
            if (typeSymbol && typeSymbol.isError()) {
                decl.addDiagnostic((<PullErrorTypeSymbol>typeSymbol).getDiagnostic());
            }
        }

        private postError(offset: number, length: number, fileName: string, diagnosticCode: DiagnosticCode, arguments: any[], enclosingDecl: PullDecl) {
            enclosingDecl.addDiagnostic(new SemanticDiagnostic(fileName, offset, length, diagnosticCode, arguments));
        }

        private validateVariableDeclarationGroups(enclosingDecl: PullDecl, typeCheckContext: PullTypeCheckContext) {
            var declGroups: PullDecl[][] = enclosingDecl.getVariableDeclGroups();
            var decl: PullDecl;
            var firstSymbol: PullSymbol;
            var symbol: PullSymbol;
            var boundDeclAST: AST;

            for (var i = 0; i < declGroups.length; i++) {
                for (var j = 0; j < declGroups[i].length; j++) {
                    decl = declGroups[i][j];
                    symbol = decl.getSymbol();
                    boundDeclAST = this.semanticInfoChain.getASTForDecl(decl);
                    this.resolver.resolveAST(boundDeclAST, /*inContextuallyTypedAssignment:*/false, enclosingDecl, this.context);
                    if (!j) {
                        firstSymbol = decl.getSymbol();

                        if (this.resolver.isAnyOrEquivalent(this.resolver.widenType(firstSymbol.getType()))) {
                            return;
                        }
                        continue;
                    }

                    if (!this.resolver.typesAreIdentical(symbol.getType(), firstSymbol.getType())) {
                        this.postError(boundDeclAST.minChar, boundDeclAST.getLength(), typeCheckContext.scriptName, DiagnosticCode.Subsequent_variable_declarations_must_have_the_same_type___Variable__0__must_be_of_type__1___but_here_has_type___2_, [symbol.getDisplayName(), firstSymbol.getType().toString(), symbol.getType().toString()], enclosingDecl);
                    }
                }
            }
        }

        // declarations

        private typeCheckAST(ast: AST, typeCheckContext: PullTypeCheckContext, inContextuallyTypedAssignment): PullTypeSymbol {

            if (!ast) {
                return null;
            }

            if (ast.typeCheckPhase >= PullTypeChecker.globalPullTypeCheckPhase) {
                return null;
            }
            else {
                ast.typeCheckPhase = PullTypeChecker.globalPullTypeCheckPhase;
            }

            switch (ast.nodeType) {

                // lists
                case NodeType.List:
                    return this.typeCheckList(<ASTList>ast, typeCheckContext);

                // decarations

                case NodeType.VariableDeclarator:
                case NodeType.Parameter:
                    return this.typeCheckBoundDecl(ast, typeCheckContext);

                case NodeType.FunctionDeclaration:
                    return this.typeCheckFunction(<FunctionDeclaration>ast, typeCheckContext, inContextuallyTypedAssignment);

                case NodeType.ClassDeclaration:
                    return this.typeCheckClass(ast, typeCheckContext);

                case NodeType.InterfaceDeclaration:
                    return this.typeCheckInterface(ast, typeCheckContext);

                case NodeType.ModuleDeclaration:
                    return this.typeCheckModule(ast, typeCheckContext);

                case NodeType.TypeParameter:
                    return this.typeCheckTypeParameter(<TypeParameter>ast, typeCheckContext);

                case NodeType.ImportDeclaration:
                    return this.typeCheckImportDeclaration(<ImportDeclaration>ast, typeCheckContext);

                // expressions

                // assignment
                case NodeType.AssignmentExpression:
                    return this.typeCheckAssignment(<BinaryExpression>ast, typeCheckContext);

                case NodeType.GenericType:
                    return this.typeCheckGenericType(<GenericType>ast, typeCheckContext);

                case NodeType.ObjectLiteralExpression:
                    return this.typeCheckObjectLiteral(ast, typeCheckContext, inContextuallyTypedAssignment);

                case NodeType.ArrayLiteralExpression:
                    return this.typeCheckArrayLiteral(ast, typeCheckContext, inContextuallyTypedAssignment);

                case NodeType.ThisExpression:
                    return this.typeCheckThisExpression(<ThisExpression>ast, typeCheckContext);

                case NodeType.SuperExpression:
                    return this.typeCheckSuperExpression(<Expression>ast, typeCheckContext);

                case NodeType.InvocationExpression:
                    return this.typeCheckCallExpression(<CallExpression>ast, typeCheckContext);

                case NodeType.ObjectCreationExpression:
                    return this.typeCheckObjectCreationExpression(<CallExpression>ast, typeCheckContext);

                case NodeType.CastExpression:
                    return this.typeCheckTypeAssertion(<UnaryExpression>ast, typeCheckContext);

                case NodeType.TypeRef:
                    return this.typeCheckTypeReference(<TypeReference>ast, typeCheckContext);

                case NodeType.ExportAssignment:
                    return this.typeCheckExportAssignment(ast, typeCheckContext);

                // boolean operations
                case NodeType.NotEqualsWithTypeConversionExpression:
                case NodeType.EqualsWithTypeConversionExpression:
                case NodeType.EqualsExpression:
                case NodeType.NotEqualsExpression:
                case NodeType.LessThanExpression:
                case NodeType.LessThanOrEqualExpression:
                case NodeType.GreaterThanOrEqualExpression:
                case NodeType.GreaterThanExpression:
                    return this.typeCheckLogicalOperation(<BinaryExpression>ast, typeCheckContext);

                case NodeType.CommaExpression:
                    return this.typeCheckCommaExpression(<BinaryExpression>ast, typeCheckContext);

                case NodeType.AddExpression:
                case NodeType.AddAssignmentExpression:
                    return this.typeCheckBinaryAdditionOperation(<BinaryExpression>ast, typeCheckContext);

                case NodeType.SubtractExpression:
                case NodeType.MultiplyExpression:
                case NodeType.DivideExpression:
                case NodeType.ModuloExpression:
                case NodeType.BitwiseOrExpression:
                case NodeType.BitwiseAndExpression:
                case NodeType.LeftShiftExpression:
                case NodeType.SignedRightShiftExpression:
                case NodeType.UnsignedRightShiftExpression:
                case NodeType.BitwiseExclusiveOrExpression:
                case NodeType.ExclusiveOrAssignmentExpression:
                case NodeType.LeftShiftAssignmentExpression:
                case NodeType.SignedRightShiftAssignmentExpression:
                case NodeType.UnsignedRightShiftAssignmentExpression:
                case NodeType.SubtractAssignmentExpression:
                case NodeType.MultiplyAssignmentExpression:
                case NodeType.DivideAssignmentExpression:
                case NodeType.ModuloAssignmentExpression:
                case NodeType.OrAssignmentExpression:
                case NodeType.AndAssignmentExpression:
                    return this.typeCheckBinaryArithmeticOperation(<BinaryExpression>ast, typeCheckContext);

                case NodeType.PlusExpression:
                case NodeType.NegateExpression:
                case NodeType.BitwiseNotExpression:
                case NodeType.PostIncrementExpression:
                case NodeType.PreIncrementExpression:
                case NodeType.PostDecrementExpression:
                case NodeType.PreDecrementExpression:
                    return this.typeCheckUnaryArithmeticOperation(<UnaryExpression>ast, typeCheckContext, inContextuallyTypedAssignment);

                case NodeType.ElementAccessExpression:
                    return this.typeCheckElementAccessExpression(<BinaryExpression>ast, typeCheckContext);

                case NodeType.LogicalNotExpression:
                    return this.typeCheckLogicalNotExpression(<UnaryExpression>ast, typeCheckContext, inContextuallyTypedAssignment);

                case NodeType.LogicalOrExpression:
                case NodeType.LogicalAndExpression:
                    return this.typeCheckLogicalAndOrExpression(<BinaryExpression>ast, typeCheckContext);

                case NodeType.TypeOfExpression:
                    return this.typeCheckTypeOf(ast, typeCheckContext);

                case NodeType.ConditionalExpression:
                    return this.typeCheckConditionalExpression(<ConditionalExpression>ast, typeCheckContext);

                case NodeType.VoidExpression:
                    return this.typeCheckVoidExpression(<UnaryExpression>ast, typeCheckContext);

                case NodeType.ThrowStatement:
                    return this.typeCheckThrowStatement(<ThrowStatement>ast, typeCheckContext);

                case NodeType.DeleteExpression:
                    return this.typeCheckDeleteExpression(<UnaryExpression>ast, typeCheckContext);

                case NodeType.RegularExpressionLiteral:
                    return this.typeCheckRegExpExpression(ast, typeCheckContext);

                case NodeType.InExpression:
                    return this.typeCheckInExpression(<BinaryExpression>ast, typeCheckContext);

                case NodeType.InstanceOfExpression:
                    return this.typeCheckInstanceOfExpression(<BinaryExpression>ast, typeCheckContext);

                case NodeType.ParenthesizedExpression:
                    return this.typeCheckParenthesizedExpression(<ParenthesizedExpression>ast, typeCheckContext);

                // statements
                case NodeType.ForStatement:
                    return this.typeCheckForStatement(<ForStatement>ast, typeCheckContext);

                case NodeType.ForInStatement:
                    return this.typeCheckForInStatement(ast, typeCheckContext);

                case NodeType.WhileStatement:
                    return this.typeCheckWhileStatement(<WhileStatement>ast, typeCheckContext);

                case NodeType.DoStatement:
                    return this.typeCheckDoStatement(<DoStatement>ast, typeCheckContext);

                case NodeType.IfStatement:
                    return this.typeCheckIfStatement(<IfStatement>ast, typeCheckContext);

                case NodeType.Block:
                    return this.typeCheckBlock(<Block>ast, typeCheckContext);

                case NodeType.VariableDeclaration:
                    return this.typeCheckVariableDeclaration(<VariableDeclaration>ast, typeCheckContext);

                case NodeType.VariableStatement:
                    return this.typeCheckVariableStatement(<VariableStatement>ast, typeCheckContext);

                case NodeType.WithStatement:
                    return this.typeCheckWithStatement(<WithStatement>ast, typeCheckContext);

                case NodeType.TryStatement:
                    return this.typeCheckTryStatement(<TryStatement>ast, typeCheckContext);

                case NodeType.CatchClause:
                    return this.typeCheckCatchClause(<CatchClause>ast, typeCheckContext);

                case NodeType.ReturnStatement:
                    return this.typeCheckReturnStatement(<ReturnStatement>ast, typeCheckContext);

                case NodeType.Name:
                    return this.typeCheckNameExpression(ast, typeCheckContext);

                case NodeType.MemberAccessExpression:
                    return this.typeCheckMemberAccessExpression(<BinaryExpression>ast, typeCheckContext);

                case NodeType.SwitchStatement:
                    return this.typeCheckSwitchStatement(<SwitchStatement>ast, typeCheckContext);

                case NodeType.ExpressionStatement:
                    return this.typeCheckExpressionStatement(<ExpressionStatement>ast, typeCheckContext, inContextuallyTypedAssignment);

                case NodeType.CaseClause:
                    return this.typeCheckCaseClause(<CaseClause>ast, typeCheckContext);

                case NodeType.LabeledStatement:
                    return this.typeCheckLabeledStatement(<LabeledStatement>ast, typeCheckContext);

                // primitives
                case NodeType.NumericLiteral:
                    return this.semanticInfoChain.numberTypeSymbol;

                case NodeType.StringLiteral:
                    return this.semanticInfoChain.stringTypeSymbol;

                case NodeType.NullLiteral:
                    return this.semanticInfoChain.nullTypeSymbol;

                case NodeType.TrueLiteral:
                case NodeType.FalseLiteral:
                    return this.semanticInfoChain.booleanTypeSymbol;

                case NodeType.TypeParameter:
                    return this.typeCheckTypeParameter(<TypeParameter>ast, typeCheckContext);

                default:
                    break;
            }

            return null;
        }

        //
        // Validation
        //

        // scripts
        public typeCheckScript(script: Script, scriptName: string, compiler: TypeScriptCompiler) {

            var unit = this.semanticInfoChain.getUnit(scriptName);

            if (unit.getTypeChecked()) {
                return;
            }

            var typeCheckContext = new PullTypeCheckContext(compiler, script, scriptName);

            this.setUnit(scriptName);

            typeCheckContext.semanticInfo = typeCheckContext.compiler.semanticInfoChain.getUnit(typeCheckContext.scriptName);
            var scriptDecl = typeCheckContext.semanticInfo.getTopLevelDecls()[0];
            typeCheckContext.pushEnclosingDecl(scriptDecl);

            PullTypeChecker.globalPullTypeCheckPhase++;

            this.typeCheckAST(script.moduleElements, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);

            this.validateVariableDeclarationGroups(scriptDecl, typeCheckContext);

            typeCheckContext.popEnclosingDecl();

            unit.setTypeChecked();
        }

        // lists
        private typeCheckList(list: ASTList, typeCheckContext: PullTypeCheckContext) {
            if (!list) {
                return null;
            }

            for (var i = 0; i < list.members.length; i++) {
                this.typeCheckAST(list.members[i], typeCheckContext, /*inContextuallyTypedAssignment:*/ false);
            }
        }

        private reportDiagnostics(symbolAndDiagnostics: SymbolAndDiagnostics<PullSymbol>, enclosingDecl: PullDecl): void {
            if (symbolAndDiagnostics && symbolAndDiagnostics.diagnostics) {
                for (var i = 0, n = symbolAndDiagnostics.diagnostics.length; i < n; i++) {
                    this.context.postDiagnostic(symbolAndDiagnostics.diagnostics[i], enclosingDecl, /*addToDecl:*/ true);
                }
            }
        }

        private resolveSymbolAndReportDiagnostics(ast: AST, inContextuallyTypedAssignment: boolean, enclosingDecl: PullDecl): PullSymbol {
            var symbolAndDiagnostics = this.resolver.resolveAST(ast, inContextuallyTypedAssignment, enclosingDecl, this.context);

            this.reportDiagnostics(symbolAndDiagnostics, enclosingDecl);
            return symbolAndDiagnostics && symbolAndDiagnostics.symbol;
        }

        // variable and argument declarations
        // validate:
        //  - lhs and rhs types agree (if lhs has no type annotation)
        private typeCheckBoundDecl(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            var boundDeclAST = <BoundDecl>ast;

            var enclosingDecl = typeCheckContext.getEnclosingDecl();

            var typeExprSymbol: PullTypeSymbol = null;

            if (boundDeclAST.typeExpr) {
                typeExprSymbol = this.typeCheckAST(boundDeclAST.typeExpr, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);

                if (typeExprSymbol.isNamedTypeSymbol() &&
                    typeExprSymbol.isGeneric() &&
                    !typeExprSymbol.isTypeParameter() &&
                    !this.resolver.isArrayOrEquivalent(typeExprSymbol) &&
                    typeExprSymbol.isResolved() &&
                    typeExprSymbol.getTypeParameters().length &&
                    typeExprSymbol.getTypeArguments() == null &&
                    !typeExprSymbol.getIsSpecialized() &&
                    this.resolver.isTypeRefWithoutTypeArgs(<TypeReference>boundDeclAST.typeExpr)) {

                    this.postError(boundDeclAST.typeExpr.minChar, boundDeclAST.typeExpr.getLength(), typeCheckContext.scriptName, DiagnosticCode.Generic_type_references_must_include_all_type_arguments, null, enclosingDecl);
                    typeExprSymbol = this.resolver.specializeTypeToAny(typeExprSymbol, enclosingDecl, this.context);
                }
            }

            // if there's a type expr and an initializer, resolve the initializer
            if (boundDeclAST.init) {
                if (typeExprSymbol) {
                    this.context.pushContextualType(typeExprSymbol, this.context.inProvisionalResolution(), null);
                }

                var initTypeSymbol = this.typeCheckAST(boundDeclAST.init, typeCheckContext, !!typeExprSymbol);

                if (typeExprSymbol) {
                    this.context.popContextualType();
                }

                if (typeExprSymbol && typeExprSymbol.isContainer()) {

                    var exportedTypeSymbol = (<PullContainerTypeSymbol>typeExprSymbol).getExportAssignedTypeSymbol();

                    if (exportedTypeSymbol) {
                        typeExprSymbol = exportedTypeSymbol;
                    }
                    else {
                        var instanceTypeSymbol = (<PullContainerTypeSymbol>typeExprSymbol.getType()).getInstanceSymbol().getType();

                        if (!instanceTypeSymbol || !PullHelpers.symbolIsEnum(instanceTypeSymbol)) {
                            this.postError(boundDeclAST.minChar, boundDeclAST.getLength(), typeCheckContext.scriptName, DiagnosticCode.Tried_to_set_variable_type_to_module_type__0__, [typeExprSymbol.toString()], enclosingDecl);
                            typeExprSymbol = null;
                        }
                        else {
                            typeExprSymbol = instanceTypeSymbol.getType();
                        }
                    }
                }

                if (initTypeSymbol && initTypeSymbol.isContainer()) {
                    instanceTypeSymbol = (<PullContainerTypeSymbol>initTypeSymbol.getType()).getInstanceSymbol().getType();

                    if (!instanceTypeSymbol) {
                        this.postError(boundDeclAST.minChar, boundDeclAST.getLength(), typeCheckContext.scriptName, DiagnosticCode.Tried_to_set_variable_type_to_uninitialized_module_type__0__, [initTypeSymbol.toString()], enclosingDecl);
                        initTypeSymbol = null;
                    }
                    else {
                        initTypeSymbol = instanceTypeSymbol.getType();
                    }
                }

                if (initTypeSymbol && typeExprSymbol) {
                    var comparisonInfo = new TypeComparisonInfo();

                    var isAssignable = this.resolver.sourceIsAssignableToTarget(initTypeSymbol, typeExprSymbol, this.context, comparisonInfo);

                    if (!isAssignable) {
                        if (comparisonInfo.message) {
                            this.postError(boundDeclAST.minChar, boundDeclAST.getLength(), typeCheckContext.scriptName, DiagnosticCode.Cannot_convert__0__to__1__NL__2, [initTypeSymbol.toString(), typeExprSymbol.toString(), comparisonInfo.message], enclosingDecl);
                        } else {
                            this.postError(boundDeclAST.minChar, boundDeclAST.getLength(), typeCheckContext.scriptName, DiagnosticCode.Cannot_convert__0__to__1_, [initTypeSymbol.toString(), typeExprSymbol.toString()], enclosingDecl);
                        }
                    }
                }
            }

            // now resolve the actual symbol, but supress the errors since we've already surfaced them above
            var prevSupressErrors = this.context.suppressErrors;
            this.context.suppressErrors = true;
            var decl: PullDecl = this.resolver.getDeclForAST(boundDeclAST);

            var varTypeSymbol = this.resolveSymbolAndReportDiagnostics(boundDeclAST, false, enclosingDecl).getType();

            if (typeExprSymbol && typeExprSymbol.isContainer() && varTypeSymbol.isError()) {
                this.checkForResolutionError(varTypeSymbol, decl);
            }

            this.context.suppressErrors = prevSupressErrors;

            var declSymbol = decl.getSymbol();

            // Check if variable satisfies type privacy
            if (declSymbol.getKind() != PullElementKind.Parameter &&
                (declSymbol.getKind() != PullElementKind.Property || declSymbol.getContainer().isNamedTypeSymbol())) {
                this.checkTypePrivacy(declSymbol, varTypeSymbol, typeCheckContext, (typeSymbol: PullTypeSymbol) =>
                    this.variablePrivacyErrorReporter(declSymbol, typeSymbol, typeCheckContext));
            }

            return varTypeSymbol;
        }

        private typeCheckImportDeclaration(importDeclaration: ImportDeclaration, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            var result = <PullTypeSymbol>this.resolveSymbolAndReportDiagnostics(importDeclaration, /*inContextuallyTypedAssignment:*/ false, typeCheckContext.getEnclosingDecl());

            var savedInImportDeclaration = typeCheckContext.inImportDeclaration;
            typeCheckContext.inImportDeclaration = true;
            this.typeCheckAST(importDeclaration.alias, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);
            typeCheckContext.inImportDeclaration = savedInImportDeclaration;

            return result;
        }

        // functions 
        // validate:
        //  - use of super calls 
        //  - signatures agree in optionality
        //  - getter/setter type agreement
        //  - body members expr
        //  - getter/setter flags agree
        //  - getters have no parameters 
        //  - getters return a value
        //  - setters return no value
        // PULLTODO: split up into separate functions for constructors, indexers, expressions, signatures, etc.
        private typeCheckFunction(funcDeclAST: FunctionDeclaration, typeCheckContext: PullTypeCheckContext, inContextuallyTypedAssignment): PullTypeSymbol {
            if (funcDeclAST.isConstructor || hasFlag(funcDeclAST.getFunctionFlags(), FunctionFlags.ConstructMember)) {
                return this.typeCheckConstructor(funcDeclAST, typeCheckContext, inContextuallyTypedAssignment);
            }
            else if (hasFlag(funcDeclAST.getFunctionFlags(), FunctionFlags.IndexerMember)) {
                return this.typeCheckIndexer(funcDeclAST, typeCheckContext, inContextuallyTypedAssignment);
            }
            else if (funcDeclAST.isAccessor()) {
                return this.typeCheckAccessor(funcDeclAST, typeCheckContext, inContextuallyTypedAssignment);
            }

            var enclosingDecl = typeCheckContext.getEnclosingDecl();

            var functionSymbol = this.resolveSymbolAndReportDiagnostics(funcDeclAST, inContextuallyTypedAssignment, enclosingDecl);
            var functionDecl = typeCheckContext.semanticInfo.getDeclForAST(funcDeclAST);

            typeCheckContext.pushEnclosingDecl(functionDecl);

            this.typeCheckAST(funcDeclAST.typeArguments, typeCheckContext, inContextuallyTypedAssignment);
            this.typeCheckAST(funcDeclAST.arguments, typeCheckContext, inContextuallyTypedAssignment);
            this.typeCheckAST(funcDeclAST.returnTypeAnnotation, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);
            this.typeCheckAST(funcDeclAST.block, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);

            var hasReturn = typeCheckContext.getEnclosingDeclHasReturn();

            this.validateVariableDeclarationGroups(functionDecl, typeCheckContext);

            typeCheckContext.popEnclosingDecl();

            var functionSignature = functionDecl.getSignatureSymbol();

            // check for optionality
            var parameters = functionSignature.getParameters();

            if (parameters.length) {
                for (var i = 0; i < parameters.length; i++) {
                    this.checkForResolutionError(parameters[i].getType(), enclosingDecl);
                }
            }


            var returnType = functionSignature.getReturnType();

            this.checkForResolutionError(returnType, enclosingDecl);

            if (funcDeclAST.block && funcDeclAST.returnTypeAnnotation != null && !hasReturn) {
                var isVoidOrAny = this.resolver.isAnyOrEquivalent(returnType) || returnType === this.semanticInfoChain.voidTypeSymbol;

                if (!isVoidOrAny && !(funcDeclAST.block.statements.members.length > 0 && funcDeclAST.block.statements.members[0].nodeType === NodeType.ThrowStatement)) {
                    var funcName = functionDecl.getDisplayName();
                    funcName = funcName ? "'" + funcName + "'" : "expression";

                    this.postError(funcDeclAST.returnTypeAnnotation.minChar, funcDeclAST.returnTypeAnnotation.getLength(), typeCheckContext.scriptName, DiagnosticCode.Function__0__declared_a_non_void_return_type__but_has_no_return_expression, [funcName], typeCheckContext.getEnclosingDecl());
                }
            }

            this.typeCheckFunctionOverloads(funcDeclAST, typeCheckContext);
            this.checkFunctionTypePrivacy(funcDeclAST, inContextuallyTypedAssignment, typeCheckContext);

            return functionSymbol ? functionSymbol.getType() : null;
        }

        private typeCheckFunctionOverloads(funcDecl: FunctionDeclaration, typeCheckContext: PullTypeCheckContext, signature?: PullSignatureSymbol, allSignatures?: PullSignatureSymbol[]) {
            if (!signature) {
                var functionSignatureInfo = PullHelpers.getSignatureForFuncDecl(funcDecl, typeCheckContext.semanticInfo);
                signature = functionSignatureInfo.signature;
                allSignatures = functionSignatureInfo.allSignatures;
            }
            var functionDeclaration = typeCheckContext.semanticInfo.getDeclForAST(funcDecl);
            var funcSymbol = functionDeclaration.getSymbol();

            // Find the definition signature for this signature group
            var definitionSignature: PullSignatureSymbol = null;
            for (var i = allSignatures.length - 1; i >= 0; i--) {
                if (allSignatures[i].isDefinition()) {
                    definitionSignature = allSignatures[i];
                    break;
                }
            }

            if (!signature.isDefinition()) {
                // Check for if the signatures are identical, check with the signatures before the current current one
                for (var i = 0; i < allSignatures.length; i++) {
                    if (allSignatures[i] === signature) {
                        break;
                    }

                    if (this.resolver.signaturesAreIdentical(allSignatures[i], signature)) {
                        if (funcDecl.isConstructor) {
                            this.postError(funcDecl.minChar, funcDecl.getLength(), typeCheckContext.scriptName, DiagnosticCode.Duplicate_constructor_overload_signature, null, typeCheckContext.getEnclosingDecl());
                        } else if (funcDecl.isConstructMember()) {
                            this.postError(funcDecl.minChar, funcDecl.getLength(), typeCheckContext.scriptName, DiagnosticCode.Duplicate_overload_construct_signature, null, typeCheckContext.getEnclosingDecl());
                        } else if (funcDecl.isCallMember()) {
                            this.postError(funcDecl.minChar, funcDecl.getLength(), typeCheckContext.scriptName, DiagnosticCode.Duplicate_overload_call_signature, null, typeCheckContext.getEnclosingDecl());
                        } else {
                            this.postError(funcDecl.minChar, funcDecl.getLength(), typeCheckContext.scriptName, DiagnosticCode.Duplicate_overload_signature_for__0_, [funcSymbol.getScopedNameEx().toString()], typeCheckContext.getEnclosingDecl());
                        }

                        break;
                    }
                }
            }

            // Verify assignment compatibility or in case of constantOverload signature, if its subtype of atleast one signature
            var isConstantOverloadSignature = signature.isStringConstantOverloadSignature();
            if (isConstantOverloadSignature) {
                if (signature.isDefinition()) {
                    // Report error - definition signature cannot specify constant type
                    this.postError(funcDecl.minChar, funcDecl.getLength(), typeCheckContext.scriptName, DiagnosticCode.Overload_signature_implementation_cannot_use_specialized_type, null, typeCheckContext.getEnclosingDecl());
                } else {
                    var resolutionContext = new PullTypeResolutionContext();
                    var foundSubtypeSignature = false;
                    for (var i = 0; i < allSignatures.length; i++) {
                        if (allSignatures[i].isDefinition() || allSignatures[i] === signature) {
                            continue;
                        }

                        if (!allSignatures[i].isResolved()) {
                            this.resolver.resolveDeclaredSymbol(allSignatures[i], typeCheckContext.getEnclosingDecl(), resolutionContext);
                        }
                        
                        if (allSignatures[i].isStringConstantOverloadSignature()) {
                            continue;
                        }

                        if (this.resolver.signatureIsSubtypeOfTarget(signature, allSignatures[i], resolutionContext)) {
                            foundSubtypeSignature = true;
                            break;
                        }
                    }
                    
                    if (!foundSubtypeSignature) {
                        // Could not find the overload signature subtype
                        this.postError(funcDecl.minChar, funcDecl.getLength(), typeCheckContext.scriptName, DiagnosticCode.Specialized_overload_signature_is_not_subtype_of_any_non_specialized_signature, null, typeCheckContext.getEnclosingDecl());
                    }
                }
            } else if (definitionSignature && definitionSignature != signature) {
                var comparisonInfo = new TypeComparisonInfo();
                var resolutionContext = new PullTypeResolutionContext();
                if (!definitionSignature.isResolved()) {
                    this.resolver.resolveDeclaredSymbol(definitionSignature, typeCheckContext.getEnclosingDecl(), resolutionContext);
                }

                if (!this.resolver.signatureIsAssignableToTarget(definitionSignature, signature, resolutionContext, comparisonInfo)) {
                    // definition signature is not assignable to functionSignature then its incorrect overload signature
                    if (comparisonInfo.message) {
                        this.postError(funcDecl.minChar, funcDecl.getLength(), typeCheckContext.scriptName, DiagnosticCode.Overload_signature_is_not_compatible_with_function_definition__NL__0, [comparisonInfo.message], typeCheckContext.getEnclosingDecl());
                    } else {
                        this.postError(funcDecl.minChar, funcDecl.getLength(), typeCheckContext.scriptName, DiagnosticCode.Overload_signature_is_not_compatible_with_function_definition, null, typeCheckContext.getEnclosingDecl());
                    }
                }
            }

            var signatureForVisibilityCheck = definitionSignature;
            if (!definitionSignature) {
                if (allSignatures[0] === signature) {
                    return;
                }
                signatureForVisibilityCheck = allSignatures[0];
            }

            if (!funcDecl.isConstructor && !funcDecl.isConstructMember() && signature != signatureForVisibilityCheck) {
                var errorCode: DiagnosticCode;
                // verify it satisfies all the properties of first signature
                if (signatureForVisibilityCheck.hasFlag(PullElementFlags.Private) != signature.hasFlag(PullElementFlags.Private)) {
                    errorCode = DiagnosticCode.Overload_signatures_must_all_be_public_or_private;
                }
                else if (signatureForVisibilityCheck.hasFlag(PullElementFlags.Exported) != signature.hasFlag(PullElementFlags.Exported)) {
                    errorCode = DiagnosticCode.Overload_signatures_must_all_be_exported_or_local;
                }
                else if (signatureForVisibilityCheck.hasFlag(PullElementFlags.Ambient) != signature.hasFlag(PullElementFlags.Ambient)) {
                    errorCode = DiagnosticCode.Overload_signatures_must_all_be_ambient_or_non_ambient;
                }
                else if (signatureForVisibilityCheck.hasFlag(PullElementFlags.Optional) != signature.hasFlag(PullElementFlags.Optional)) {
                    errorCode = DiagnosticCode.Overload_signatures_must_all_be_optional_or_required;
                }

                if (errorCode) {
                    this.postError(funcDecl.minChar, funcDecl.getLength(), typeCheckContext.scriptName, errorCode, null, typeCheckContext.getEnclosingDecl());
                }
            }
        }

        private typeCheckTypeParameter(typeParameter: TypeParameter, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            if (typeParameter.constraint) {
                var constraintType = this.typeCheckAST(typeParameter.constraint, typeCheckContext, /*inContextuallyTypedAssignment:*/false);

                if (constraintType && !constraintType.isError() && constraintType.isPrimitive()) {
                    this.postError(typeParameter.constraint.minChar, typeParameter.constraint.getLength(), typeCheckContext.scriptName,
                        DiagnosticCode.Type_parameter_constraint_cannot_be_a_primitive_type, null, typeCheckContext.getEnclosingDecl());
                }
            }

            return <PullTypeSymbol>this.resolveSymbolAndReportDiagnostics(typeParameter, /*inContextuallyTypedAssignment:*/false, typeCheckContext.getEnclosingDecl());
        }

        private typeCheckAccessor(ast: AST, typeCheckContext: PullTypeCheckContext, inContextuallyTypedAssignment): PullTypeSymbol {
            var funcDeclAST = <FunctionDeclaration>ast;

            var enclosingDecl = typeCheckContext.getEnclosingDecl();

            var accessorSymbol = <PullAccessorSymbol>this.resolveSymbolAndReportDiagnostics(ast, inContextuallyTypedAssignment, enclosingDecl);
            this.checkForResolutionError(accessorSymbol.getType(), enclosingDecl);

            var isGetter = hasFlag(funcDeclAST.getFunctionFlags(), FunctionFlags.GetAccessor);
            var isSetter = !isGetter;

            var getter = accessorSymbol.getGetter();
            var setter = accessorSymbol.getSetter();

            var functionDecl = typeCheckContext.semanticInfo.getDeclForAST(funcDeclAST);
            typeCheckContext.pushEnclosingDecl(functionDecl);

            this.typeCheckAST(funcDeclAST.arguments, typeCheckContext, inContextuallyTypedAssignment);

            this.typeCheckAST(funcDeclAST.block, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);

            var hasReturn = typeCheckContext.getEnclosingDeclHasReturn();

            this.validateVariableDeclarationGroups(functionDecl, typeCheckContext);

            typeCheckContext.popEnclosingDecl();

            var functionSignature = functionDecl.getSignatureSymbol();

            // check for optionality
            var parameters = functionSignature.getParameters();

            var returnType = functionSignature.getReturnType();

            this.checkForResolutionError(returnType, enclosingDecl);

            var funcNameAST = funcDeclAST.name;

            if (isGetter && !hasReturn) {
                if (!(funcDeclAST.block.statements.members.length > 0 && funcDeclAST.block.statements.members[0].nodeType === NodeType.ThrowStatement)) {
                    this.postError(funcNameAST.minChar, funcNameAST.getLength(), typeCheckContext.scriptName, DiagnosticCode.Getters_must_return_a_value, null, typeCheckContext.getEnclosingDecl());
                }
            }

            // Setter with return value is checked in typeCheckReturnExpression

            if (getter && setter) {
                var getterDecl = getter.getDeclarations()[0];
                var setterDecl = setter.getDeclarations()[0];

                var getterIsPrivate = getterDecl.getFlags() & PullElementFlags.Private;
                var setterIsPrivate = setterDecl.getFlags() & PullElementFlags.Private;

                if (getterIsPrivate != setterIsPrivate) {
                    this.postError(funcNameAST.minChar, funcNameAST.getLength(), typeCheckContext.scriptName, DiagnosticCode.Getter_and_setter_accessors_do_not_agree_in_visibility, null, typeCheckContext.getEnclosingDecl());
                }
            }

            this.checkFunctionTypePrivacy(funcDeclAST, inContextuallyTypedAssignment, typeCheckContext);

            return null;
        }

        private typeCheckConstructor(funcDeclAST: FunctionDeclaration, typeCheckContext: PullTypeCheckContext, inContextuallyTypedAssignment: boolean): PullTypeSymbol {

            var enclosingDecl = typeCheckContext.getEnclosingDecl();

            var functionSymbol = this.resolveSymbolAndReportDiagnostics(funcDeclAST, inContextuallyTypedAssignment, enclosingDecl);

            var functionDecl = typeCheckContext.semanticInfo.getDeclForAST(funcDeclAST);
            typeCheckContext.pushEnclosingDecl(functionDecl);

            // In case of constructor signatures, type check constructor type arguments
            this.typeCheckAST(funcDeclAST.typeArguments, typeCheckContext, inContextuallyTypedAssignment);

            typeCheckContext.inConstructorArguments = true;
            this.typeCheckAST(funcDeclAST.arguments, typeCheckContext, inContextuallyTypedAssignment);
            typeCheckContext.inConstructorArguments = false;

            // Reset the flag
            typeCheckContext.seenSuperConstructorCall = false;

            // In case of constructor signatures, type check return annotation
            this.typeCheckAST(funcDeclAST.returnTypeAnnotation, typeCheckContext,/*inContextuallyTypedAssignment:*/ false);

            this.typeCheckAST(funcDeclAST.block, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);

            this.validateVariableDeclarationGroups(functionDecl, typeCheckContext);

            typeCheckContext.popEnclosingDecl();

            var constructorSignature = functionDecl.getSignatureSymbol();

            // check for optionality
            var parameters = constructorSignature.getParameters();

            if (parameters.length) {
                for (var i = 0, n = parameters.length; i < n; i++) {
                    this.checkForResolutionError(parameters[i].getType(), enclosingDecl);
                }
            }

            this.checkForResolutionError(constructorSignature.getReturnType(), enclosingDecl);

            if (functionDecl.getSignatureSymbol() && functionDecl.getSignatureSymbol().isDefinition() && this.enclosingClassIsDerived(typeCheckContext)) {
                // Constructors for derived classes must contain a call to the class's 'super' constructor
                if (!typeCheckContext.seenSuperConstructorCall) {
                    this.postError(funcDeclAST.minChar, 11 /* "constructor" */, typeCheckContext.scriptName,
                        DiagnosticCode.Constructors_for_derived_classes_must_contain_a__super__call, null, enclosingDecl);
                }
                // The first statement in the body of a constructor must be a super call if both of the following are true:
                //  • The containing class is a derived class.
                //  • The constructor declares parameter properties or the containing class declares instance member variables with initializers.
                else if (this.superCallMustBeFirstStatementInConstructor(functionDecl, enclosingDecl)) {
                    var firstStatement = this.getFirstStatementFromFunctionDeclAST(funcDeclAST)
                    if (!firstStatement || !this.isSuperCallNode(firstStatement)) {
                        this.postError(funcDeclAST.minChar, 11 /* "constructor" */, typeCheckContext.scriptName,
                            DiagnosticCode.A__super__call_must_be_the_first_statement_in_the_constructor_when_a_class_contains_intialized_properties_or_has_parameter_properties, null, enclosingDecl);
                    }
                }
            }

            this.typeCheckFunctionOverloads(funcDeclAST, typeCheckContext);
            this.checkFunctionTypePrivacy(funcDeclAST, inContextuallyTypedAssignment, typeCheckContext);
            return functionSymbol ? functionSymbol.getType() : null;
        }

        private typeCheckIndexer(ast: AST, typeCheckContext: PullTypeCheckContext, inContextuallyTypedAssignment): PullTypeSymbol {

            var enclosingDecl = typeCheckContext.getEnclosingDecl();

            // resolve the index signature, even though we won't be needing its type
            this.resolver.resolveAST(ast, inContextuallyTypedAssignment, enclosingDecl, this.context);

            var funcDeclAST = <FunctionDeclaration>ast;

            var functionDecl = typeCheckContext.semanticInfo.getDeclForAST(funcDeclAST);
            typeCheckContext.pushEnclosingDecl(functionDecl);

            this.typeCheckAST(funcDeclAST.arguments, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);

            this.typeCheckAST(funcDeclAST.returnTypeAnnotation, typeCheckContext,/*inContextuallyTypedAssignment:*/ false);

            typeCheckContext.popEnclosingDecl();

            var indexSignature = functionDecl.getSignatureSymbol();
            var parameters = indexSignature.getParameters();

            if (parameters.length) {
                var parameterType: PullTypeSymbol = null;

                for (var i = 0; i < parameters.length; i++) {
                    this.checkForResolutionError(parameters[i].getType(), enclosingDecl);
                }
            }

            this.checkForResolutionError(indexSignature.getReturnType(), enclosingDecl);
            this.checkFunctionTypePrivacy(funcDeclAST, inContextuallyTypedAssignment, typeCheckContext);

            var isNumericIndexer = parameters[0].getType() === this.semanticInfoChain.numberTypeSymbol;

            // Make sure that a numeric index signature is a subtype of the string indexer, or vice versa
            var allIndexSignatures = enclosingDecl.getSymbol().getType().getIndexSignatures();
            for (var i = 0; i < allIndexSignatures.length; i++) {
                if (!allIndexSignatures[i].isResolved()) {
                    this.resolver.resolveDeclaredSymbol(allIndexSignatures[i], allIndexSignatures[i].getDeclarations()[0].getParentDecl(), this.context);
                }
                if (allIndexSignatures[i].getParameters()[0].getType() !== parameters[0].getType()) {
                    var stringIndexSignature: PullSignatureSymbol;
                    var numberIndexSignature: PullSignatureSymbol;
                    if (isNumericIndexer) {
                        numberIndexSignature = indexSignature;
                        stringIndexSignature = allIndexSignatures[i];
                    }
                    else {
                        numberIndexSignature = allIndexSignatures[i];
                        stringIndexSignature = indexSignature;

                        // If we are a string indexer sharing a container with a number index signature, the number will report the error
                        // TODO: use indexSignature.getContainer() and allIndexSignatures[i].getContainer() once the symbol container relationship stabilizes
                        if (enclosingDecl.getSymbol() === numberIndexSignature.getDeclarations()[0].getParentDecl().getSymbol()) {
                            break;
                        }
                    }
                    var comparisonInfo = new TypeComparisonInfo();
                    var resolutionContext = new PullTypeResolutionContext();
                    if (!this.resolver.sourceIsSubtypeOfTarget(numberIndexSignature.getReturnType(), stringIndexSignature.getReturnType(), resolutionContext, comparisonInfo)) {
                        if (comparisonInfo.message) {
                            this.postError(funcDeclAST.minChar, funcDeclAST.getLength(), typeCheckContext.scriptName, DiagnosticCode.Numeric_indexer_type___0___must_be_a_subtype_of_string_indexer_type___1____NL__2,
                                [numberIndexSignature.getReturnType().toString(), stringIndexSignature.getReturnType().toString(), comparisonInfo.message], typeCheckContext.getEnclosingDecl());
                        } else {
                            this.postError(funcDeclAST.minChar, funcDeclAST.getLength(), typeCheckContext.scriptName, DiagnosticCode.Numeric_indexer_type___0___must_be_a_subtype_of_string_indexer_type___1__,
                                [numberIndexSignature.getReturnType().toString(), stringIndexSignature.getReturnType().toString()], typeCheckContext.getEnclosingDecl());
                        }
                    }
                    break;
                }
            }

            // Check that property names comply with indexer constraints (both string and numeric)
            var allMembers = enclosingDecl.getSymbol().getType().getAllMembers(PullElementKind.All, /*includePrivate*/ true);
            for (var i = 0; i < allMembers.length; i++) {
                var name = allMembers[i].getName();
                if (name) {
                    if (!allMembers[i].isResolved()) {
                        this.resolver.resolveDeclaredSymbol(allMembers[i], allMembers[i].getDeclarations()[0].getParentDecl(), this.context);
                    }
                    // Skip members in the same container, they will be checked during their member type check
                    if (enclosingDecl.getSymbol() !== allMembers[i].getContainer()) {
                        // Check if the member name is numerical
                        var isMemberNumeric = isFinite(+name);
                        if (isNumericIndexer === isMemberNumeric) {
                            this.checkThatMemberIsSubtypeOfIndexer(allMembers[i], indexSignature, funcDeclAST, typeCheckContext, isNumericIndexer);
                        }
                    }
                }
            }

            return null;
        }

        private typeCheckMembersAgainstIndexer(containerType: PullTypeSymbol, typeCheckContext: PullTypeCheckContext) {
            // Check all the members defined in this symbol's declarations (no base classes)
            var indexSignatures = containerType.getIndexSignatures();
            if (indexSignatures.length > 0) {
                var members = typeCheckContext.getEnclosingDecl().getChildDecls();
                for (var i = 0; i < members.length; i++) {
                    // Nothing to check if the member has no name or is a signature
                    var member = members[i];
                    if (!member.getName() || member.getKind() & PullElementKind.SomeSignature) {
                        continue;
                    }

                    // Get all index signatures, and check against the first that matters for this field name (string vs number)
                    var isMemberNumeric = isFinite(+member.getName());
                    for (var j = 0; j < indexSignatures.length; j++) {
                        if (!indexSignatures[j].isResolved()) {
                            this.resolver.resolveDeclaredSymbol(indexSignatures[j], indexSignatures[j].getDeclarations()[0].getParentDecl(), this.context);
                        }
                        if ((indexSignatures[j].getParameters()[0].getType() === this.semanticInfoChain.numberTypeSymbol) === isMemberNumeric) {
                            this.checkThatMemberIsSubtypeOfIndexer(member.getSymbol(), indexSignatures[j], this.semanticInfoChain.getASTForDecl(member), typeCheckContext, isMemberNumeric);
                            break;
                        }
                    }
                }
            }
        }

        private checkThatMemberIsSubtypeOfIndexer(member: PullSymbol, indexSignature: PullSignatureSymbol, astForError: AST, typeCheckContext: PullTypeCheckContext, isNumeric: boolean) {
            var comparisonInfo = new TypeComparisonInfo();
            var resolutionContext = new PullTypeResolutionContext();
            if (!this.resolver.sourceIsSubtypeOfTarget(member.getType(), indexSignature.getReturnType(), resolutionContext, comparisonInfo)) {
                if (isNumeric) {
                    if (comparisonInfo.message) {
                        this.postError(astForError.minChar, astForError.getLength(), typeCheckContext.scriptName, DiagnosticCode.All_numerically_named_properties_must_be_subtypes_of_numeric_indexer_type___0____NL__1,
                            [indexSignature.getReturnType().toString(), comparisonInfo.message], typeCheckContext.getEnclosingDecl());
                    } else {
                        this.postError(astForError.minChar, astForError.getLength(), typeCheckContext.scriptName, DiagnosticCode.All_numerically_named_properties_must_be_subtypes_of_numeric_indexer_type___0__,
                            [indexSignature.getReturnType().toString()], typeCheckContext.getEnclosingDecl());
                    }
                }
                else {
                    if (comparisonInfo.message) {
                        this.postError(astForError.minChar, astForError.getLength(), typeCheckContext.scriptName, DiagnosticCode.All_named_properties_must_be_subtypes_of_string_indexer_type___0____NL__1,
                            [indexSignature.getReturnType().toString(), comparisonInfo.message], typeCheckContext.getEnclosingDecl());
                    } else {
                        this.postError(astForError.minChar, astForError.getLength(), typeCheckContext.scriptName, DiagnosticCode.All_named_properties_must_be_subtypes_of_string_indexer_type___0__,
                            [indexSignature.getReturnType().toString()], typeCheckContext.getEnclosingDecl());
                    }
                }
            }
        }

        private typeCheckIfTypeMemberPropertyOkToOverride(typeSymbol: PullTypeSymbol, extendedType: PullTypeSymbol,
            typeMember: PullSymbol, extendedTypeMember: PullSymbol, comparisonInfo: TypeComparisonInfo) {

            if (!typeSymbol.isClass()) {
                return true;
            }

            var typeMemberKind = typeMember.getKind();
            var extendedMemberKind = extendedTypeMember.getKind();

            if (typeMemberKind === extendedMemberKind) {
                return true;
            }

            var errorCode: DiagnosticCode;
            if (typeMemberKind === PullElementKind.Property) {
                if (typeMember.isAccessor()) {
                    errorCode = DiagnosticCode.Class__0__defines_instance_member_accessor__1___but_extended_class__2__defines_it_as_instance_member_function;
                } else {
                    errorCode = DiagnosticCode.Class__0__defines_instance_member_property__1___but_extended_class__2__defines_it_as_instance_member_function;
                }
            } else if (typeMemberKind === PullElementKind.Method) {
                if (extendedTypeMember.isAccessor()) {
                    errorCode = DiagnosticCode.Class__0__defines_instance_member_function__1___but_extended_class__2__defines_it_as_instance_member_accessor;
                } else {
                    errorCode = DiagnosticCode.Class__0__defines_instance_member_function__1___but_extended_class__2__defines_it_as_instance_member_property;
                }
            }

            var message = getDiagnosticMessage(errorCode, [typeSymbol.toString(), typeMember.getScopedNameEx().toString(), extendedType.toString()]);
            comparisonInfo.addMessage(message);
            return false;
        }

        private typeCheckIfTypeExtendsType(typeDecl: TypeDeclaration, typeSymbol: PullTypeSymbol,
            extendedType: PullTypeSymbol, typeCheckContext: PullTypeCheckContext) {
            var typeMembers = typeSymbol.getMembers();

            var resolutionContext = new PullTypeResolutionContext();
            var comparisonInfo = new TypeComparisonInfo();
            var foundError = false;

            // Check members
            for (var i = 0; i < typeMembers.length; i++) {
                var propName = typeMembers[i].getName();
                var extendedTypeProp = extendedType.findMember(propName);
                if (extendedTypeProp) {
                    foundError = !this.typeCheckIfTypeMemberPropertyOkToOverride(typeSymbol, extendedType, typeMembers[i], extendedTypeProp, comparisonInfo);

                    if (!foundError) {
                        foundError = !this.resolver.sourcePropertyIsSubtypeOfTargetProperty(typeSymbol, extendedType, typeMembers[i], extendedTypeProp, resolutionContext, comparisonInfo);
                    }

                    if (foundError) {
                        break;
                    }
                }
            }

            // Check call signatures
            if (!foundError && typeSymbol.hasOwnCallSignatures()) {
                foundError = !this.resolver.sourceCallSignaturesAreSubtypeOfTargetCallSignatures(typeSymbol, extendedType, resolutionContext, comparisonInfo);
            }

            // Check construct signatures
            if (!foundError && typeSymbol.hasOwnConstructSignatures()) {
                foundError = !this.resolver.sourceConstructSignaturesAreSubtypeOfTargetConstructSignatures(typeSymbol, extendedType, resolutionContext, comparisonInfo);
            }

            // Check index signatures
            if (!foundError && typeSymbol.hasOwnIndexSignatures()) {
                foundError = !this.resolver.sourceIndexSignaturesAreSubtypeOfTargetIndexSignatures(typeSymbol, extendedType, resolutionContext, comparisonInfo);
            }

            if (!foundError && typeSymbol.isClass()) {
                // If there is base class verify the constructor type is subtype of base class
                var typeConstructorType = (<PullClassTypeSymbol>typeSymbol).getConstructorMethod().getType();
                var typeConstructorTypeMembers = typeConstructorType.getMembers();
                if (typeConstructorTypeMembers.length) {
                    var extendedConstructorType = (<PullClassTypeSymbol>extendedType).getConstructorMethod().getType();
                    var comparisonInfoForPropTypeCheck = new TypeComparisonInfo(comparisonInfo);

                    // Verify that all the overriden members of the constructor type are compatible
                    for (var i = 0; i < typeConstructorTypeMembers.length; i++) {
                        var propName = typeConstructorTypeMembers[i].getName();
                        var extendedConstructorTypeProp = extendedConstructorType.findMember(propName);
                        if (extendedConstructorTypeProp) {
                            if (!extendedConstructorTypeProp.isResolved()) {
                                var extendedClassAst = typeCheckContext.semanticInfo.getASTForSymbol(extendedType);
                                var extendedClassDecl = typeCheckContext.semanticInfo.getDeclForAST(extendedClassAst);
                                this.resolver.resolveDeclaredSymbol(extendedConstructorTypeProp, extendedClassDecl, resolutionContext);
                            }

                            // check if type of property is subtype of extended type's property type
                            var typeConstructorTypePropType = typeConstructorTypeMembers[i].getType();
                            var extendedConstructorTypePropType = extendedConstructorTypeProp.getType();
                            if (!this.resolver.sourceIsSubtypeOfTarget(typeConstructorTypePropType, extendedConstructorTypePropType, resolutionContext, comparisonInfoForPropTypeCheck)) {
                                var propMessage: string;
                                if (comparisonInfoForPropTypeCheck.message) {
                                    propMessage = getDiagnosticMessage(DiagnosticCode.Types_of_static_property__0__of_class__1__and_class__2__are_incompatible__NL__3,
                                        [extendedConstructorTypeProp.getScopedNameEx().toString(), typeSymbol.toString(), extendedType.toString(), comparisonInfoForPropTypeCheck.message]);
                                } else {
                                    propMessage = getDiagnosticMessage(DiagnosticCode.Types_of_static_property__0__of_class__1__and_class__2__are_incompatible,
                                        [extendedConstructorTypeProp.getScopedNameEx().toString(), typeSymbol.toString(), extendedType.toString()]);
                                }
                                comparisonInfo.addMessage(propMessage);
                                foundError = true;
                                break;
                            }
                        }
                    }
                }
            }

            if (foundError) {
                var errorCode: DiagnosticCode;
                if (typeSymbol.isClass()) {
                    errorCode = DiagnosticCode.Class__0__cannot_extend_class__1__NL__2;
                } else {
                    if (extendedType.isClass()) {
                        errorCode = DiagnosticCode.Interface__0__cannot_extend_class__1__NL__2;
                    } else {
                        errorCode = DiagnosticCode.Interface__0__cannot_extend_interface__1__NL__2;
                    }
                }

                this.postError(typeDecl.name.minChar, typeDecl.name.getLength(), typeCheckContext.scriptName, errorCode, [typeSymbol.getScopedName(), extendedType.getScopedName(), comparisonInfo.message], typeCheckContext.getEnclosingDecl());
            }
        }

        private typeCheckIfClassImplementsType(classDecl: TypeDeclaration, classSymbol: PullTypeSymbol,
            implementedType: PullTypeSymbol, typeCheckContext: PullTypeCheckContext) {

            var resolutionContext = new PullTypeResolutionContext();
            var comparisonInfo = new TypeComparisonInfo();
            var foundError = !this.resolver.sourceMembersAreSubtypeOfTargetMembers(classSymbol, implementedType, resolutionContext, comparisonInfo);
            if (!foundError) {
                foundError = !this.resolver.sourceCallSignaturesAreSubtypeOfTargetCallSignatures(classSymbol, implementedType, resolutionContext, comparisonInfo);
                if (!foundError) {
                    foundError = !this.resolver.sourceConstructSignaturesAreSubtypeOfTargetConstructSignatures(classSymbol, implementedType, resolutionContext, comparisonInfo);
                    if (!foundError) {
                        foundError = !this.resolver.sourceIndexSignaturesAreSubtypeOfTargetIndexSignatures(classSymbol, implementedType, resolutionContext, comparisonInfo);
                    }
                }
            }

            // Report error
            if (foundError) {
                var errorCode = implementedType.isClass() ?
                    DiagnosticCode.Class__0__declares_class__1__but_does_not_implement_it__NL__2 :
                    DiagnosticCode.Class__0__declares_interface__1__but_does_not_implement_it__NL__2;

                this.postError(classDecl.name.minChar, classDecl.name.getLength(), typeCheckContext.scriptName, errorCode, [classSymbol.getScopedName(), implementedType.getScopedName(), comparisonInfo.message], typeCheckContext.getEnclosingDecl());
            }
        }

        private typeCheckBase(typeDeclAst: TypeDeclaration,
                              typeSymbol: PullTypeSymbol, baseDeclAST: AST,
                              isExtendedType: boolean,
                              typeCheckContext: PullTypeCheckContext) {

            var typeDecl = typeCheckContext.semanticInfo.getDeclForAST(typeDeclAst);
            var contextForBaseTypeResolution = new PullTypeResolutionContext();
            contextForBaseTypeResolution.isResolvingClassExtendedType = true;

            var baseType = <PullTypeSymbol>this.typeCheckAST(new TypeReference(baseDeclAST, 0), typeCheckContext, /*inContextuallyTypedAssignment*/ false);
            contextForBaseTypeResolution.isResolvingClassExtendedType = false;

            var typeDeclIsClass = typeSymbol.isClass();

            if (!typeSymbol.isValidBaseKind(baseType, isExtendedType)) {
                // Report error about invalid base kind
                if (baseType.isError()) {
                    var error = (<PullErrorTypeSymbol>baseType).getDiagnostic();
                    if (error) {
                        this.postError(baseDeclAST.minChar, baseDeclAST.getLength(), typeCheckContext.scriptName, error.diagnosticCode(), error.arguments(), typeCheckContext.getEnclosingDecl());
                    }
                } else if (isExtendedType) {
                    if (typeDeclIsClass) {
                        this.postError(baseDeclAST.minChar, baseDeclAST.getLength(), typeCheckContext.scriptName, DiagnosticCode.A_class_may_only_extend_another_class, null, typeCheckContext.getEnclosingDecl());
                    } else {
                        this.postError(baseDeclAST.minChar, baseDeclAST.getLength(), typeCheckContext.scriptName, DiagnosticCode.An_interface_may_only_extend_another_class_or_interface, null, typeCheckContext.getEnclosingDecl());
                    }
                } else {
                    this.postError(baseDeclAST.minChar, baseDeclAST.getLength(), typeCheckContext.scriptName, DiagnosticCode.A_class_may_only_implement_another_class_or_interface, null, typeCheckContext.getEnclosingDecl());
                }
                return;
            }

            // Check if its a recursive extend/implement type
            if ((<PullTypeSymbol>baseType.getRootSymbol()).hasBase(<PullTypeSymbol>typeSymbol.getRootSymbol())) {
                typeSymbol.setHasBaseTypeConflict();
                baseType.setHasBaseTypeConflict();
                // Report error
                this.postError(typeDeclAst.name.minChar,
                    typeDeclAst.name.getLength(),
                    typeCheckContext.scriptName,
                    typeDeclIsClass ? DiagnosticCode.Class__0__is_recursively_referenced_as_a_base_type_of_itself : DiagnosticCode.Interface__0__is_recursively_referenced_as_a_base_type_of_itself, [typeSymbol.getScopedName()],
                    typeCheckContext.getEnclosingDecl());
                return;
            }

            if (isExtendedType) {
                // Verify all own overriding members are subtype
                this.typeCheckIfTypeExtendsType(typeDeclAst, typeSymbol, baseType, typeCheckContext);
            } else {
                // If class implementes interface or class, verify all the public members are implemented
                this.typeCheckIfClassImplementsType(typeDeclAst, typeSymbol, baseType, typeCheckContext);
            }

            // Privacy error:
            this.checkTypePrivacy(typeSymbol, baseType, typeCheckContext, (errorTypeSymbol: PullTypeSymbol) =>
                this.baseListPrivacyErrorReporter(typeDeclAst, typeSymbol, baseDeclAST, isExtendedType, errorTypeSymbol, typeCheckContext));
        }

        private typeCheckBases(typeDeclAst: TypeDeclaration, typeSymbol: PullTypeSymbol, typeCheckContext: PullTypeCheckContext) {
            if (!typeDeclAst.extendsList && !typeDeclAst.implementsList) {
                return;
            }

            for (var i = 0; i < typeDeclAst.extendsList.members.length; i++) {
                this.typeCheckBase(typeDeclAst, typeSymbol, typeDeclAst.extendsList.members[i], true, typeCheckContext);
            }

            if (typeSymbol.isClass()) {
                for (var i = 0; i < typeDeclAst.implementsList.members.length; i++) {
                    this.typeCheckBase(typeDeclAst, typeSymbol, typeDeclAst.implementsList.members[i], false, typeCheckContext);
                }
            }
            else if (typeDeclAst.implementsList) {
                this.postError(typeDeclAst.implementsList.minChar, typeDeclAst.implementsList.getLength(), typeCheckContext.scriptName, DiagnosticCode.An_interface_cannot_implement_another_type, null, typeCheckContext.getEnclosingDecl());
            }
        }

        // Classes
        // validate:
        //  - mutually recursive base classes
        //  - duplicate implemented interfaces
        //  - mutually recursive type parameters
        //  - bases are interfaces or classes
        //  - properties satisfy implemented interfaces
        //  - properties of base class and implemented interfaces agree
        //  - type of overridden member is subtype of original
        //  - method does not overrided field, or vice-versa
        //  - body members
        private typeCheckClass(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            var classAST = <ClassDeclaration>ast;
            // resolving the class also resolves its members...
            var classSymbol = <PullClassTypeSymbol>this.resolveSymbolAndReportDiagnostics(ast, false, typeCheckContext.getEnclosingDecl()).getType();
            this.checkForResolutionError(classSymbol, typeCheckContext.getEnclosingDecl());

            this.typeCheckAST(classAST.typeParameters, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);

            var classDecl = typeCheckContext.semanticInfo.getDeclForAST(classAST);
            typeCheckContext.pushEnclosingDecl(classDecl);

            // Type check the type paramter list if any exists
            this.typeCheckAST(classAST.typeParameters, typeCheckContext, /*inContextuallyTypedAssignment*/ false);

            this.typeCheckBases(classAST, classSymbol, typeCheckContext);

            // Type check the members
            this.typeCheckAST(classAST.members, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);

            if (!classSymbol.hasBaseTypeConflict()) {
                this.typeCheckMembersAgainstIndexer(classSymbol, typeCheckContext);
            }

            typeCheckContext.popEnclosingDecl();

            return classSymbol;
        }

        // Interfaces
        // validate:
        //  - mutually recursive bases
        //  - duplicate implemented or extended interfaces
        //  - mutually recursive type parameters
        //  - properties of extended interfaces do not conflict
        //  - bases are interfaces or classes
        //  - declarations agree in generic parameters 
        private typeCheckInterface(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            var interfaceAST = <InterfaceDeclaration>ast;
            // resolving the interface also resolves its members...
            var interfaceType = this.resolveSymbolAndReportDiagnostics(ast, /*inContextuallyTypedAssignment:*/false, typeCheckContext.getEnclosingDecl()).getType();
            this.checkForResolutionError(interfaceType, typeCheckContext.getEnclosingDecl());

            var interfaceDecl = typeCheckContext.semanticInfo.getDeclForAST(interfaceAST);
            typeCheckContext.pushEnclosingDecl(interfaceDecl);

            // Type check the type paramter list if any exists
            this.typeCheckAST(interfaceAST.typeParameters, typeCheckContext, /*inContextuallyTypedAssignment*/ false);

            this.typeCheckBases(<InterfaceDeclaration>ast, interfaceType, typeCheckContext);

            // Type check the members
            this.typeCheckAST(interfaceAST.members, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);

            if (!interfaceType.hasBaseTypeConflict()) {
                this.typeCheckMembersAgainstIndexer(interfaceType, typeCheckContext);
            }

            typeCheckContext.popEnclosingDecl();

            return interfaceType;
        }

        // Modules
        // validate:
        //  - No type parameters?
        private typeCheckModule(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            // we resolve here because resolving a module *does not* resolve its MemberScopeContext
            // PULLREVIEW: Perhaps it should?
            var moduleDeclAST = <ModuleDeclaration>ast;
            var moduleType = <PullTypeSymbol>this.resolveSymbolAndReportDiagnostics(ast, false, typeCheckContext.getEnclosingDecl());

            this.checkForResolutionError(moduleType, typeCheckContext.getEnclosingDecl());

            var moduleDecl = typeCheckContext.semanticInfo.getDeclForAST(moduleDeclAST);
            typeCheckContext.pushEnclosingDecl(moduleDecl);

            var modName = (<Identifier>moduleDeclAST.name).text;
            var isDynamic = isQuoted(modName) || hasFlag(moduleDeclAST.getModuleFlags(), ModuleFlags.IsDynamic);

            // Resolve the export assignment first to make sure 
            if (isDynamic && moduleDeclAST.members && moduleDeclAST.members.members) {
                for (var i = moduleDeclAST.members.members.length - 1; i >= 0; i--) {
                    if (moduleDeclAST.members.members[i] && moduleDeclAST.members.members[i].nodeType == NodeType.ExportAssignment) {
                        this.typeCheckAST(moduleDeclAST.members.members[i], typeCheckContext, false);
                        break;
                    }
                }
            }
            this.typeCheckAST(moduleDeclAST.members, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);

            this.validateVariableDeclarationGroups(moduleDecl, typeCheckContext);

            typeCheckContext.popEnclosingDecl();

            return moduleType;
        }

        private checkAssignability(ast: AST, source: PullTypeSymbol, target: PullTypeSymbol, typeCheckContext: PullTypeCheckContext): void {
            var comparisonInfo = new TypeComparisonInfo();

            var isAssignable = this.resolver.sourceIsAssignableToTarget(source, target, this.context, comparisonInfo);

            if (!isAssignable) {
                var enclosingDecl = typeCheckContext.getEnclosingDecl();
                if (comparisonInfo.message) {
                    this.postError(ast.minChar, ast.getLength(), typeCheckContext.scriptName, DiagnosticCode.Cannot_convert__0__to__1__NL__2, [source.toString(), target.toString(), comparisonInfo.message], enclosingDecl);
                } else {
                    this.postError(ast.minChar, ast.getLength(), typeCheckContext.scriptName, DiagnosticCode.Cannot_convert__0__to__1_, [source.toString(), target.toString()], enclosingDecl);
                }
            }
        }

        private isValidLHS(ast: AST, expressionSymbol: PullSymbol): boolean {
            var expressionTypeSymbol = expressionSymbol.getType();

            if (ast.nodeType === NodeType.ElementAccessExpression ||
                this.resolver.isAnyOrEquivalent(expressionTypeSymbol)) {
                return true;
            }
            else if (!expressionSymbol.isType() || expressionTypeSymbol.isArray()) {
                return ((expressionSymbol.getKind() & PullElementKind.SomeLHS) != 0) && !expressionSymbol.hasFlag(TypeScript.PullElementFlags.Enum);
            }

            return false;
        }

        // expressions

        // Assignment
        // validate:
        //  - lhs and rhs types agree
        //  - lhs is a valid value type
        private typeCheckAssignment(binaryExpression: BinaryExpression, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            var enclosingDecl = typeCheckContext.getEnclosingDecl();

            this.typeCheckAST(binaryExpression.operand1, typeCheckContext, false);

            var leftExpr = this.resolveSymbolAndReportDiagnostics(binaryExpression.operand1, /*inContextuallyTypedAssignment:*/false, typeCheckContext.getEnclosingDecl());
            var leftType = leftExpr.getType();
            this.checkForResolutionError(leftType, enclosingDecl);
            leftType = this.resolver.widenType(leftExpr.getType()); //this.typeCheckAST(assignmentAST.operand1, typeCheckContext);

            this.context.pushContextualType(leftType, this.context.inProvisionalResolution(), null);
            var rightType = this.resolver.widenType(this.typeCheckAST(binaryExpression.operand2, typeCheckContext, true));
            this.context.popContextualType();

            // Check if LHS is a valid target
            if (!this.isValidLHS(binaryExpression.operand1, leftExpr)) {
                this.postError(binaryExpression.operand1.minChar, binaryExpression.operand1.getLength(), typeCheckContext.scriptName, DiagnosticCode.Invalid_left_hand_side_of_assignment_expression, null, enclosingDecl);
            }

            this.checkAssignability(binaryExpression.operand1, rightType, leftType, typeCheckContext);
            return rightType;
        }

        // Generic Type references
        // validate:
        //
        private typeCheckGenericType(genericType: GenericType, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            // validate:
            //  - mutually recursive type parameters and constraints
            var savedResolvingTypeReference = this.context.resolvingTypeReference;
            this.context.resolvingTypeReference = true;
            this.typeCheckAST(genericType.name, typeCheckContext, /*inContextuallyTypedAssignment*/false);
            this.context.resolvingTypeReference = savedResolvingTypeReference;

            this.typeCheckAST(genericType.typeArguments, typeCheckContext, /*inContextuallyTypedAssignment*/false);

            return this.resolveSymbolAndReportDiagnostics(genericType, /*inContextuallyTypedAssignment*/false, typeCheckContext.getEnclosingDecl()).getType();
        }

        // Object literals
        // validate:
        //
        private typeCheckObjectLiteral(ast: AST, typeCheckContext: PullTypeCheckContext, inContextuallyTypedAssignment): PullTypeSymbol {
            var objectLitAST = <UnaryExpression>ast;
            var enclosingDecl = typeCheckContext.getEnclosingDecl();

            // PULLTODO: We're really resolving these expressions twice - need a better way...
            var objectLitType = this.resolveSymbolAndReportDiagnostics(ast, inContextuallyTypedAssignment, enclosingDecl).getType();
            var memberDecls = <ASTList>objectLitAST.operand;

            var contextualType = this.context.getContextualType();
            var memberType: PullTypeSymbol;


            // PULLTODO: Contextually type the members
            if (memberDecls) {
                var member: PullSymbol = null;

                for (var i = 0; i < memberDecls.members.length; i++) {
                    var binex = <BinaryExpression>memberDecls.members[i];

                    if (contextualType) {
                        var text: string;
                        if (binex.operand1.nodeType === NodeType.Name) {
                            text = (<Identifier>binex.operand1).text;
                        }
                        else if (binex.operand1.nodeType === NodeType.StringLiteral) {
                            text = (<StringLiteral>binex.operand1).text;
                        }

                        member = contextualType.findMember(text);

                        if (member) {
                            this.context.pushContextualType(member.getType(), this.context.inProvisionalResolution(), null);
                        }
                    }

                    this.typeCheckAST(binex.operand2, typeCheckContext, member != null);

                    if (member) {
                        this.context.popContextualType();
                        member = null;
                    }
                }
            }

            this.checkForResolutionError(objectLitType, enclosingDecl);

            return objectLitType;
        }

        // Array literals
        // validate:
        //  - incompatible types in expression
        private typeCheckArrayLiteral(ast: AST, typeCheckContext: PullTypeCheckContext, inContextuallyTypedAssignment): PullTypeSymbol {
            var arrayLiteralAST = <UnaryExpression>ast;
            var enclosingDecl = typeCheckContext.getEnclosingDecl();

            // PULLTODO: We're really resolving these expressions twice - need a better way...
            var type = this.resolveSymbolAndReportDiagnostics(ast, inContextuallyTypedAssignment, enclosingDecl).getType();
            var memberASTs = <ASTList>arrayLiteralAST.operand;

            // Find the contextual member type
            var contextualType = this.context.getContextualType();
            var contextualMemberType: PullTypeSymbol = null;
            if (contextualType && contextualType.isArray()) {
                contextualMemberType = contextualType.getElementType();
            }

            if (memberASTs && memberASTs.members && memberASTs.members.length) {
                var elementTypes: PullTypeSymbol[] = [];

                if (contextualMemberType) {
                    this.context.pushContextualType(contextualMemberType, this.context.inProvisionalResolution(), null);
                }

                for (var i = 0; i < memberASTs.members.length; i++) {
                    elementTypes[elementTypes.length] = this.typeCheckAST(memberASTs.members[i], typeCheckContext, /*inContextuallyTypedAssignment*/ false);
                }

                if (contextualMemberType) {
                    this.context.popContextualType();
                }
            }

            this.checkForResolutionError(type, enclosingDecl);

            return type;
        }

        private enclosingClassIsDerived(typeCheckContext: PullTypeCheckContext): boolean {
            var enclosingClass = typeCheckContext.getEnclosingDecl(PullElementKind.Class);

            if (enclosingClass) {
                var classSymbol = <PullClassTypeSymbol>enclosingClass.getSymbol();
                if (classSymbol.getExtendedTypes().length > 0) {
                    return true;
                }
            }

            return false;
        }

        private isSuperCallNode(node: AST): boolean {
            if (node && node.nodeType === NodeType.ExpressionStatement) {
                var expressionStatement = <ExpressionStatement>node;
                if (expressionStatement.expression && expressionStatement.expression.nodeType === NodeType.InvocationExpression) {
                    var callExpression = <CallExpression>expressionStatement.expression;
                    if (callExpression.target && callExpression.target.nodeType === NodeType.SuperExpression) {
                        return true;
                    }
                }
            }
            return false;
        }

        private getFirstStatementFromFunctionDeclAST(funcDeclAST: FunctionDeclaration): AST {
            if (funcDeclAST.block && funcDeclAST.block.statements && funcDeclAST.block.statements.members) {
                return funcDeclAST.block.statements.members[0];
            }

            return null;
        }

        private superCallMustBeFirstStatementInConstructor(enclosingConstructor: PullDecl, enclosingClass: PullDecl): boolean {
            /*
            The first statement in the body of a constructor must be a super call if both of the following are true:
                •	The containing class is a derived class.
                •	The constructor declares parameter properties or the containing class declares instance member variables with initializers.
            In such a required super call, it is a compile-time error for argument expressions to reference this.
            */
            if (enclosingConstructor && enclosingClass) {
                var classSymbol = <PullClassTypeSymbol>enclosingClass.getSymbol();
                if (classSymbol.getExtendedTypes().length === 0) {
                    return false;
                }

                var classMembers = classSymbol.getMembers();
                for (var i = 0, n1 = classMembers.length; i < n1; i++) {
                    var member = classMembers[i];

                    if (member.getKind() === PullElementKind.Property) {
                        var declarations = member.getDeclarations();
                        for (var j = 0, n2 = declarations.length; j < n2; j++) {
                            var declaration = declarations[j];
                            var ast = this.semanticInfoChain.getASTForDecl(declaration);
                            if (ast.nodeType === NodeType.Parameter) {
                                return true;
                            }

                            if (ast.nodeType === NodeType.VariableDeclarator) {
                                var variableDeclarator = <VariableDeclarator>ast;
                                if (variableDeclarator.init) {
                                    return true;
                                }
                            }
                        }
                    }
                }
            }

            return false;
        }

        private checkForThisOrSuperCaptureInArrowFunction(expression: Expression, typeCheckContext: PullTypeCheckContext): void {
            var enclosingDecl = typeCheckContext.getEnclosingDecl();

            var declPath: PullDecl[] = typeCheckContext.enclosingDeclStack;

            // work back up the decl path, until you can find a class
            // PULLTODO: Obviously not completely correct, but this sufficiently unblocks testing of the pull model
            if (declPath.length) {
                var inFatArrow = false;
                for (var i = declPath.length - 1; i >= 0; i--) {
                    var decl = declPath[i];
                    var declKind = decl.getKind();
                    var declFlags = decl.getFlags();

                    if (declKind === PullElementKind.FunctionExpression &&
                        hasFlag(declFlags, PullElementFlags.FatArrow)) {

                        inFatArrow = true;
                        continue;
                    }

                    if (inFatArrow) {
                        if (declKind === PullElementKind.Function ||
                            declKind === PullElementKind.Method ||
                            declKind === PullElementKind.ConstructorMethod ||
                            declKind === PullElementKind.GetAccessor ||
                            declKind === PullElementKind.SetAccessor ||
                            declKind === PullElementKind.FunctionExpression ||
                            declKind === PullElementKind.Class ||
                            declKind === PullElementKind.Container ||
                            declKind === PullElementKind.DynamicModule ||
                            declKind === PullElementKind.Script) {

                            decl.setFlags(decl.getFlags() | PullElementFlags.MustCaptureThis);

                            // If we're accessing 'this' in a class, then the class constructor 
                            // needs to be marked as capturing 'this'.
                            if (declKind === PullElementKind.Class) {
                                decl.getChildDecls().filter(d => d.getKind() === PullElementKind.ConstructorMethod)
                                    .map(d => d.setFlags(d.getFlags() | PullElementFlags.MustCaptureThis));
                            }
                            break;
                        }
                    }
                }
            }
        }

        // 'This' expressions 
        // validate:
        //
        private typeCheckThisExpression(thisExpressionAST: ThisExpression, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            var enclosingDecl = typeCheckContext.getEnclosingDecl();
            var enclosingNonLambdaDecl = typeCheckContext.getEnclosingNonLambdaDecl();

            if (typeCheckContext.inSuperConstructorCall &&
                this.superCallMustBeFirstStatementInConstructor(typeCheckContext.getEnclosingDecl(PullElementKind.ConstructorMethod), typeCheckContext.getEnclosingDecl(PullElementKind.Class))) {

                this.postError(thisExpressionAST.minChar, thisExpressionAST.getLength(), typeCheckContext.scriptName, DiagnosticCode._this__cannot_be_referenced_in_current_location, null, enclosingDecl);
            }
            else if (enclosingNonLambdaDecl) {
                if (enclosingNonLambdaDecl.getKind() === PullElementKind.Class) {
                    this.postError(thisExpressionAST.minChar, thisExpressionAST.getLength(), typeCheckContext.scriptName, DiagnosticCode._this__cannot_be_referenced_in_initializers_in_a_class_body, null, enclosingDecl);
                }
                else if (enclosingNonLambdaDecl.getKind() === PullElementKind.Container || enclosingNonLambdaDecl.getKind() === PullElementKind.DynamicModule) {
                    this.postError(thisExpressionAST.minChar, thisExpressionAST.getLength(), typeCheckContext.scriptName, DiagnosticCode._this__cannot_be_referenced_within_module_bodies, null, enclosingDecl);
                }
                else if (typeCheckContext.inConstructorArguments) {
                    this.postError(thisExpressionAST.minChar, thisExpressionAST.getLength(), typeCheckContext.scriptName, DiagnosticCode._this__cannot_be_referenced_in_constructor_arguments, null, enclosingDecl);
                }
            }

            this.checkForThisOrSuperCaptureInArrowFunction(thisExpressionAST, typeCheckContext);

            return this.resolveSymbolAndReportDiagnostics(thisExpressionAST, /*inContextuallyTypedAssignment:*/false, enclosingDecl).getType();
        }

        // 'Super' expressions 
        // validate:
        //
        private typeCheckSuperExpression(ast: Expression, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            var enclosingDecl = typeCheckContext.getEnclosingDecl();
            var nonLambdaEnclosingDecl = typeCheckContext.getEnclosingNonLambdaDecl();
            var nonLambdaEnclosingDeclKind = nonLambdaEnclosingDecl.getKind();
            var inSuperConstructorTarget = typeCheckContext.inSuperConstructorTarget;

            // Super calls are not permitted outside constructors or in local functions inside constructors.
            if (inSuperConstructorTarget && enclosingDecl.getKind() !== PullElementKind.ConstructorMethod) {
                this.postError(ast.minChar, ast.getLength(), typeCheckContext.scriptName, DiagnosticCode.Super_calls_are_not_permitted_outside_constructors_or_in_local_functions_inside_constructors, null, enclosingDecl);
            }
            // A super property access is permitted only in a constructor, instance member function, or instance member accessor
            else if ((nonLambdaEnclosingDeclKind !== PullElementKind.Method && nonLambdaEnclosingDeclKind !== PullElementKind.GetAccessor && nonLambdaEnclosingDeclKind !== PullElementKind.SetAccessor && nonLambdaEnclosingDeclKind !== PullElementKind.ConstructorMethod) ||
                ((nonLambdaEnclosingDecl.getFlags() & PullElementFlags.Static) !== 0)) {
                this.postError(ast.minChar, ast.getLength(), typeCheckContext.scriptName, DiagnosticCode._super__property_access_is_permitted_only_in_a_constructor__instance_member_function__or_instance_member_accessor_of_a_derived_class, null, enclosingDecl);
            }
            // A super is permitted only in a derived class 
            else if (!this.enclosingClassIsDerived(typeCheckContext)) {
                this.postError(ast.minChar, ast.getLength(), typeCheckContext.scriptName, DiagnosticCode._super__cannot_be_referenced_in_non_derived_classes, null, enclosingDecl);
            }

            this.checkForThisOrSuperCaptureInArrowFunction(ast, typeCheckContext);

            return this.resolveSymbolAndReportDiagnostics(ast, /*inContextuallyTypedAssignment:*/ false, enclosingDecl).getType();
        }

        // Call expressions 
        // validate:
        //
        private typeCheckCallExpression(callExpression: CallExpression, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            // "use of new expression as a statement"
            var enclosingDecl = typeCheckContext.getEnclosingDecl();
            var inSuperConstructorCall = (callExpression.target.nodeType === NodeType.SuperExpression);

            var callResolutionData = new PullAdditionalCallResolutionData();
            var resultTypeAndDiagnostics = this.resolver.resolveCallExpression(callExpression, false, enclosingDecl, this.context, callResolutionData);
            this.reportDiagnostics(resultTypeAndDiagnostics, enclosingDecl);
            var resultType = resultTypeAndDiagnostics.symbol.getType();

            // Type check the type arguments
            this.typeCheckAST(callExpression.typeArguments, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);

            // Type check the target
            if (!resultType.isError()) {
                var savedInSuperConstructorTarget = typeCheckContext.inSuperConstructorTarget;
                if (inSuperConstructorCall) {
                    typeCheckContext.inSuperConstructorTarget = true;
                }

                this.typeCheckAST(callExpression.target, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);

                typeCheckContext.inSuperConstructorTarget = savedInSuperConstructorTarget;
            }

            if (inSuperConstructorCall && enclosingDecl.getKind() === PullElementKind.ConstructorMethod) {
                typeCheckContext.seenSuperConstructorCall = true;
            }

            // Type check the arguments
            var savedInSuperConstructorCall = typeCheckContext.inSuperConstructorCall;
            if (inSuperConstructorCall) {
                typeCheckContext.inSuperConstructorCall = true;
            }

            // Apply contextual typing
            var contextTypes = callResolutionData.actualParametersContextTypeSymbols;
            if (callExpression.arguments) {
                var argumentASTs = callExpression.arguments.members;
                for (var i = 0, n = argumentASTs.length; i < n; i++) {
                    var argumentAST = argumentASTs[i];

                    if (contextTypes && contextTypes[i]) {
                        this.context.pushContextualType(contextTypes[i], this.context.inProvisionalResolution(), null);
                    }

                    this.typeCheckAST(argumentAST, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);

                    if (contextTypes && contextTypes[i]) {
                        this.context.popContextualType();
                    }
                }
            }

            typeCheckContext.inSuperConstructorCall = savedInSuperConstructorCall;

            return resultType;
        }

        // 'New' expressions 
        // validate:
        //
        private typeCheckObjectCreationExpression(callExpression: CallExpression, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            var enclosingDecl = typeCheckContext.getEnclosingDecl();

            var callResolutionData = new PullAdditionalCallResolutionData();
            var resultAndDiagnostics = this.resolver.resolveNewExpression(callExpression, false, enclosingDecl, this.context, callResolutionData);
            this.reportDiagnostics(resultAndDiagnostics, typeCheckContext.getEnclosingDecl());

            var result = resultAndDiagnostics.symbol.getType();

            this.typeCheckAST(callExpression.target, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);

            // Type check the type arguments
            this.typeCheckAST(callExpression.typeArguments, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);

            // Type check the arguments
            var contextTypes = callResolutionData.actualParametersContextTypeSymbols;
            if (callExpression.arguments) {
                var argumentASTs = callExpression.arguments.members;
                for (var i = 0, n = argumentASTs.length; i < n; i++) {
                    var argumentAST = argumentASTs[i];

                    if (contextTypes && contextTypes[i]) {
                        this.context.pushContextualType(contextTypes[i], this.context.inProvisionalResolution(), null);
                    }

                    this.typeCheckAST(argumentAST, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);

                    if (contextTypes && contextTypes[i]) {
                        this.context.popContextualType();
                    }
                }
            }

            return result;
        }

        // Type assertion expressions 
        // validate:
        //  - the type assertion and the expression it's applied to are assignment compatible
        private typeCheckTypeAssertion(ast: UnaryExpression, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            var enclosingDecl = typeCheckContext.getEnclosingDecl();

            var returnType = this.resolveSymbolAndReportDiagnostics(ast, /*inContextuallyTypedAssignment:*/false, enclosingDecl).getType();

            if (returnType.isError()) {
                var symbolName = (<PullErrorTypeSymbol>returnType).getData();
                this.postError(ast.minChar, ast.getLength(), typeCheckContext.scriptName, DiagnosticCode.Could_not_find_symbol__0_, [symbolName], typeCheckContext.getEnclosingDecl());
            }

            this.context.pushContextualType(returnType, this.context.inProvisionalResolution(), null);
            var exprType = this.typeCheckAST(ast.operand, typeCheckContext, true);
            this.context.popContextualType();

            var comparisonInfo = new TypeComparisonInfo();

            var isAssignable = this.resolver.sourceIsAssignableToTarget(returnType, exprType, this.context, comparisonInfo) ||
                this.resolver.sourceIsAssignableToTarget(exprType, returnType, this.context, comparisonInfo);

            if (!isAssignable) {
                var message: string;
                if (comparisonInfo.message) {
                    this.postError(ast.minChar, ast.getLength(), typeCheckContext.scriptName, DiagnosticCode.Cannot_convert__0__to__1__NL__2, [exprType.toString(), returnType.toString(), comparisonInfo.message], typeCheckContext.getEnclosingDecl());
                } else {
                    this.postError(ast.minChar, ast.getLength(), typeCheckContext.scriptName, DiagnosticCode.Cannot_convert__0__to__1_, [exprType.toString(), returnType.toString()], typeCheckContext.getEnclosingDecl());
                }
            }

            return returnType;
        }

        // Logical operations
        // validate:
        //  - lhs and rhs are compatible
        private typeCheckLogicalOperation(binex: BinaryExpression, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            var leftType = this.typeCheckAST(binex.operand1, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);
            var rightType = this.typeCheckAST(binex.operand2, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);

            var comparisonInfo = new TypeComparisonInfo();
            if (!this.resolver.sourceIsAssignableToTarget(leftType, rightType, this.context, comparisonInfo) &&
                !this.resolver.sourceIsAssignableToTarget(rightType, leftType, this.context, comparisonInfo)) {
                    this.postError(binex.minChar, binex.getLength(), typeCheckContext.scriptName,
                        DiagnosticCode.Operator__0__cannot_be_applied_to_types__1__and__2_, [BinaryExpression.getTextForBinaryToken(binex.nodeType), leftType.toString(), rightType.toString()], typeCheckContext.getEnclosingDecl());
            }

            return this.resolveSymbolAndReportDiagnostics(binex, /*inContextuallyTypedAssignment:*/false, typeCheckContext.getEnclosingDecl()).getType();
        }

        // Logical 'And' and 'Or' expressions 
        // validate:
        // - lhs and rhs are compatible
        private typeCheckLogicalAndOrExpression(binex: BinaryExpression, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            this.typeCheckAST(binex.operand1, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);
            this.typeCheckAST(binex.operand2, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);

            return this.resolveSymbolAndReportDiagnostics(binex, /*inContextuallyTypedAssignment:*/false, typeCheckContext.getEnclosingDecl()).getType();
        }


        private typeCheckCommaExpression(binex: BinaryExpression, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            this.typeCheckAST(binex.operand1, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);
            this.typeCheckAST(binex.operand2, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);

            return this.resolveSymbolAndReportDiagnostics(binex, /*inContextuallyTypedAssignment:*/false, typeCheckContext.getEnclosingDecl()).getType();
        }

        private typeCheckBinaryAdditionOperation(binaryExpression: BinaryExpression, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            var enclosingDecl = typeCheckContext.getEnclosingDecl();

            this.resolveSymbolAndReportDiagnostics(binaryExpression, /*inContextuallyTypedAssignment:*/ false, enclosingDecl).getType();

            var lhsType = this.typeCheckAST(binaryExpression.operand1, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);
            var rhsType = this.typeCheckAST(binaryExpression.operand2, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);

            if (PullHelpers.symbolIsEnum(lhsType)) {
                lhsType = this.semanticInfoChain.numberTypeSymbol;
            }
            else if (lhsType === this.semanticInfoChain.nullTypeSymbol || lhsType === this.semanticInfoChain.undefinedTypeSymbol) {
                if (rhsType != this.semanticInfoChain.nullTypeSymbol && rhsType != this.semanticInfoChain.undefinedTypeSymbol) {
                    lhsType = rhsType;
                }
                else {
                    lhsType = this.semanticInfoChain.anyTypeSymbol;
                }
            }

            if (PullHelpers.symbolIsEnum(rhsType)) {
                rhsType = this.semanticInfoChain.numberTypeSymbol;
            }
            else if (rhsType === this.semanticInfoChain.nullTypeSymbol || rhsType === this.semanticInfoChain.undefinedTypeSymbol) {
                if (lhsType != this.semanticInfoChain.nullTypeSymbol && lhsType != this.semanticInfoChain.undefinedTypeSymbol) {
                    rhsType = lhsType;
                }
                else {
                    rhsType = this.semanticInfoChain.anyTypeSymbol;
                }
            }

            var exprType: PullTypeSymbol = null;

            if (lhsType === this.semanticInfoChain.stringTypeSymbol || rhsType === this.semanticInfoChain.stringTypeSymbol) {
                exprType = this.semanticInfoChain.stringTypeSymbol;
            }
            else if (this.resolver.isAnyOrEquivalent(lhsType) || this.resolver.isAnyOrEquivalent(rhsType)) {
                exprType = this.semanticInfoChain.anyTypeSymbol;
            }
            else if (rhsType === this.semanticInfoChain.numberTypeSymbol && lhsType === this.semanticInfoChain.numberTypeSymbol) {
                exprType = this.semanticInfoChain.numberTypeSymbol;
            }

            if (exprType) {
                if (binaryExpression.nodeType === NodeType.AddAssignmentExpression) {
                    // Check if LHS is a valid target
                    var lhsExpression = this.resolveSymbolAndReportDiagnostics(binaryExpression.operand1, /*inContextuallyTypedAssignment:*/false, typeCheckContext.getEnclosingDecl());
                    if (!this.isValidLHS(binaryExpression.operand1, lhsExpression)) {
                        this.postError(binaryExpression.operand1.minChar, binaryExpression.operand1.getLength(), typeCheckContext.scriptName, DiagnosticCode.Invalid_left_hand_side_of_assignment_expression, null, enclosingDecl);
                    }

                    this.checkAssignability(binaryExpression.operand1, exprType, lhsType, typeCheckContext);
                }
            }
            else {
                this.postError(binaryExpression.operand1.minChar, binaryExpression.operand1.getLength(), typeCheckContext.scriptName, DiagnosticCode.Invalid__addition__expression___types_do_not_agree, null, typeCheckContext.getEnclosingDecl());
                exprType = this.semanticInfoChain.anyTypeSymbol;
            }

            return exprType;
        }

        // Binary arithmetic expressions 
        // validate:
        //  - lhs and rhs are compatible
        private typeCheckBinaryArithmeticOperation(binaryExpression: BinaryExpression, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            var enclosingDecl = typeCheckContext.getEnclosingDecl();

            this.resolveSymbolAndReportDiagnostics(binaryExpression, /*inContextuallyTypedAssignment:*/false, enclosingDecl).getType();

            var lhsType = this.typeCheckAST(binaryExpression.operand1, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);
            var rhsType = this.typeCheckAST(binaryExpression.operand2, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);

            var lhsIsFit = this.resolver.isAnyOrEquivalent(lhsType) || lhsType === this.semanticInfoChain.numberTypeSymbol || PullHelpers.symbolIsEnum(lhsType);
            var rhsIsFit = this.resolver.isAnyOrEquivalent(rhsType) || rhsType === this.semanticInfoChain.numberTypeSymbol || PullHelpers.symbolIsEnum(rhsType);

            if (!rhsIsFit) {
                this.postError(binaryExpression.operand1.minChar, binaryExpression.operand1.getLength(), typeCheckContext.scriptName, DiagnosticCode.The_right_hand_side_of_an_arithmetic_operation_must_be_of_type__any____number__or_an_enum_type, null, typeCheckContext.getEnclosingDecl());
            }

            if (!lhsIsFit) {
                this.postError(binaryExpression.operand2.minChar, binaryExpression.operand2.getLength(), typeCheckContext.scriptName, DiagnosticCode.The_left_hand_side_of_an_arithmetic_operation_must_be_of_type__any____number__or_an_enum_type, null, typeCheckContext.getEnclosingDecl());
            }

            // If we havne't already reported an error, then check for assignment compatibility.
            if (rhsIsFit && lhsIsFit) {
                switch (binaryExpression.nodeType) {
                    case NodeType.LeftShiftAssignmentExpression:
                    case NodeType.SignedRightShiftAssignmentExpression:
                    case NodeType.UnsignedRightShiftAssignmentExpression:
                    case NodeType.SubtractAssignmentExpression:
                    case NodeType.MultiplyAssignmentExpression:
                    case NodeType.DivideAssignmentExpression:
                    case NodeType.ModuloAssignmentExpression:
                    case NodeType.OrAssignmentExpression:
                    case NodeType.AndAssignmentExpression:
                    case NodeType.ExclusiveOrAssignmentExpression:
                        // Check if LHS is a valid target
                        var lhsExpression = this.resolveSymbolAndReportDiagnostics(binaryExpression.operand1, /*inContextuallyTypedAssignment:*/false, typeCheckContext.getEnclosingDecl());
                        if (!this.isValidLHS(binaryExpression.operand1, lhsExpression)) {
                            this.postError(binaryExpression.operand1.minChar, binaryExpression.operand1.getLength(), typeCheckContext.scriptName, DiagnosticCode.Invalid_left_hand_side_of_assignment_expression, null, enclosingDecl);
                        }

                        this.checkAssignability(binaryExpression.operand1, rhsType, lhsType, typeCheckContext);
                        break;
                }
            }

            return this.semanticInfoChain.numberTypeSymbol;
        }

        private typeCheckLogicalNotExpression(unaryExpression: UnaryExpression, typeCheckContext: PullTypeCheckContext, inContextuallyTypedAssignment: boolean): PullTypeSymbol {
            this.typeCheckAST(unaryExpression.operand, typeCheckContext, inContextuallyTypedAssignment);
            return this.semanticInfoChain.booleanTypeSymbol;
        }

        // Unary arithmetic expressions 
        // validate:
        //  -
        private typeCheckUnaryArithmeticOperation(unaryExpression: UnaryExpression, typeCheckContext: PullTypeCheckContext, inContextuallyTypedAssignment: boolean): PullTypeSymbol {
            var operandType = this.typeCheckAST(unaryExpression.operand, typeCheckContext, inContextuallyTypedAssignment);

            switch (unaryExpression.nodeType) {
                case NodeType.PlusExpression:
                case NodeType.NegateExpression:
                case NodeType.BitwiseNotExpression:
                    return this.semanticInfoChain.numberTypeSymbol;
            }

            var operandIsFit = this.resolver.isAnyOrEquivalent(operandType) || operandType === this.semanticInfoChain.numberTypeSymbol || PullHelpers.symbolIsEnum(operandType);

            if (!operandIsFit) {
                this.postError(unaryExpression.operand.minChar, unaryExpression.operand.getLength(), typeCheckContext.scriptName, DiagnosticCode.The_type_of_a_unary_arithmetic_operation_operand_must_be_of_type__any____number__or_an_enum_type, null, typeCheckContext.getEnclosingDecl());
            }

            switch (unaryExpression.nodeType) {
                case NodeType.PostIncrementExpression:
                case NodeType.PreIncrementExpression:
                case NodeType.PostDecrementExpression:
                case NodeType.PreDecrementExpression:
                    // Check that operand is classified as a reference 
                    var expression = this.resolveSymbolAndReportDiagnostics(unaryExpression.operand, /*inContextuallyTypedAssignment:*/false, typeCheckContext.getEnclosingDecl());
                    if (!this.isValidLHS(unaryExpression.operand, expression)) {
                        this.postError(unaryExpression.operand.minChar, unaryExpression.operand.getLength(), typeCheckContext.scriptName, DiagnosticCode.The_operand_of_an_increment_or_decrement_operator_must_be_a_variable__property_or_indexer, null, typeCheckContext.getEnclosingDecl());
                    }

                    break;
            }

            return operandType;
        }

        // Index expression 
        // validate:
        //  -
        private typeCheckElementAccessExpression(binaryExpression: BinaryExpression, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            this.typeCheckAST(binaryExpression.operand1, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);
            this.typeCheckAST(binaryExpression.operand2, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);

            return this.resolveSymbolAndReportDiagnostics(binaryExpression, /*inContextuallyTypedAssignment:*/false, typeCheckContext.getEnclosingDecl()).getType();
        }

        // 'typeof' expression 
        // validate:
        //  -
        private typeCheckTypeOf(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            this.typeCheckAST((<UnaryExpression>ast).operand, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);

            return this.semanticInfoChain.stringTypeSymbol;
        }

        // Type reference expression
        // validate:
        //  -
        private typeCheckTypeReference(typeRef: TypeReference, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            // the type reference can be
            // a name
            // a function
            // an interface
            // a dotted name
            // an array of any of the above

            // Make sure we report errors for the the object type and function type
            // a function
            if (typeRef.term.nodeType === NodeType.FunctionDeclaration) {
                this.typeCheckFunctionTypeSignature(<FunctionDeclaration>typeRef.term, typeCheckContext.getEnclosingDecl(), typeCheckContext);
            }
            // an interface
            else if (typeRef.term.nodeType === NodeType.InterfaceDeclaration) {
                this.typeCheckInterfaceTypeReference(<NamedDeclaration>typeRef.term, typeCheckContext.getEnclosingDecl(), typeCheckContext);
            }
            else {
                var savedResolvingTypeReference = this.context.resolvingTypeReference;
                this.context.resolvingTypeReference = true;
                var type = this.typeCheckAST(typeRef.term, typeCheckContext, /*inContextuallyTypedAssignment*/ false);

                // A type reference must refer to a type.
                if (type && !type.isError() && !typeCheckContext.inImportDeclaration) {
                    if ((type.getKind() & PullElementKind.SomeType) === 0) {
                        // Provide some helper messages for common cases.
                        if (type.getKind() & PullElementKind.SomeContainer) {
                            this.postError(typeRef.minChar, typeRef.getLength(), typeCheckContext.scriptName,
                                DiagnosticCode.Type_reference_cannot_refer_to_container__0_, [type.toString()], typeCheckContext.getEnclosingDecl());
                        }
                        else {
                            this.postError(typeRef.minChar, typeRef.getLength(), typeCheckContext.scriptName,
                                DiagnosticCode.Type_reference_must_refer_to_type, null, typeCheckContext.getEnclosingDecl());
                        }
                    }
                }

                this.context.resolvingTypeReference = savedResolvingTypeReference;
            }

            return this.resolveSymbolAndReportDiagnostics(typeRef, /*inContextuallyTypedAssignment:*/false, typeCheckContext.getEnclosingDecl()).getType();
        }

        
        private typeCheckExportAssignment(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            return this.resolveSymbolAndReportDiagnostics(ast, false, typeCheckContext.getEnclosingDecl()).getType();
        }

        private typeCheckFunctionTypeSignature(funcDeclAST: FunctionDeclaration, enclosingDecl: PullDecl, typeCheckContext: PullTypeCheckContext) {
            var funcDeclSymbolAndDiagnostics = this.resolver.getSymbolAndDiagnosticsForAST(funcDeclAST);
            var funcDeclSymbol = funcDeclSymbolAndDiagnostics && <PullFunctionTypeSymbol>funcDeclSymbolAndDiagnostics.symbol;
            if (!funcDeclSymbol) {
                funcDeclSymbol = <PullFunctionTypeSymbol>this.resolver.resolveFunctionTypeSignature(<FunctionDeclaration>funcDeclAST, enclosingDecl, this.context);
            }
            var functionDecl = typeCheckContext.semanticInfo.getDeclForAST(funcDeclAST);

            typeCheckContext.pushEnclosingDecl(functionDecl);
            this.typeCheckAST(funcDeclAST.arguments, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);
            typeCheckContext.popEnclosingDecl();

            var functionSignature = funcDeclSymbol.getKind() === PullElementKind.ConstructorType ? funcDeclSymbol.getConstructSignatures()[0] : funcDeclSymbol.getCallSignatures()[0];
            var parameters = functionSignature.getParameters();
            for (var i = 0; i < parameters.length; i++) {
                this.checkForResolutionError(parameters[i].getType(), enclosingDecl);
            }

            if (funcDeclAST.returnTypeAnnotation) {
                var returnType = functionSignature.getReturnType();
                this.checkForResolutionError(returnType, enclosingDecl);
            }

            this.typeCheckFunctionOverloads(funcDeclAST, typeCheckContext, functionSignature, [functionSignature]);
            return funcDeclSymbol;
        }

        private typeCheckInterfaceTypeReference(interfaceAST: NamedDeclaration, enclosingDecl: PullDecl, typeCheckContext: PullTypeCheckContext) {
            var interfaceSymbolAndDiagnostics = this.resolver.getSymbolAndDiagnosticsForAST(interfaceAST);
            var interfaceSymbol = interfaceSymbolAndDiagnostics && <PullTypeSymbol>interfaceSymbolAndDiagnostics.symbol;
            if (!interfaceSymbol) {
                interfaceSymbol = this.resolver.resolveInterfaceTypeReference(interfaceAST, enclosingDecl, this.context);
            }

            var interfaceDecl = typeCheckContext.semanticInfo.getDeclForAST(interfaceAST);
            typeCheckContext.pushEnclosingDecl(interfaceDecl);
            this.typeCheckAST(interfaceAST.members, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);
            this.typeCheckMembersAgainstIndexer(interfaceSymbol, typeCheckContext);
            typeCheckContext.popEnclosingDecl();

            return interfaceSymbol;
        }

        // Conditional expressions
        // validate:
        //  -
        private typeCheckConditionalExpression(conditionalExpression: ConditionalExpression, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            this.typeCheckAST(conditionalExpression.operand1, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);
            this.typeCheckAST(conditionalExpression.operand2, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);
            this.typeCheckAST(conditionalExpression.operand3, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);

            return this.resolveSymbolAndReportDiagnostics(conditionalExpression, /*inContextuallyTypedAssignment:*/ false, typeCheckContext.getEnclosingDecl()).getType();
        }

        // new expression types
        private typeCheckThrowStatement(throwStatement: ThrowStatement, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            this.typeCheckAST(throwStatement.expression, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);

            var type = this.resolveSymbolAndReportDiagnostics(throwStatement.expression, /*inContextuallyTypedAssignment:*/ false, typeCheckContext.getEnclosingDecl()).getType();
            this.checkForResolutionError(type, typeCheckContext.getEnclosingDecl());
            return this.semanticInfoChain.voidTypeSymbol;
        }

        private typeCheckDeleteExpression(unaryExpression: UnaryExpression, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            this.typeCheckAST(unaryExpression.operand, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);

            var enclosingDecl = typeCheckContext.getEnclosingDecl();
            var type = this.resolveSymbolAndReportDiagnostics(unaryExpression, /*inContextuallyTypedAssignment:*/ false, enclosingDecl).getType();
            this.checkForResolutionError(type, enclosingDecl);

            return type;
        }

        private typeCheckVoidExpression(unaryExpression: UnaryExpression, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            this.typeCheckAST(unaryExpression.operand, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);

            var enclosingDecl = typeCheckContext.getEnclosingDecl();
            var type = this.resolveSymbolAndReportDiagnostics(unaryExpression, /*inContextuallyTypedAssignment:*/ false, enclosingDecl).getType();
            this.checkForResolutionError(type, enclosingDecl);

            return type;
        }

        private typeCheckRegExpExpression(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            var type = this.resolveSymbolAndReportDiagnostics(ast, /*inContextuallyTypedAssignment:*/false, typeCheckContext.getEnclosingDecl()).getType();
            this.checkForResolutionError(type, typeCheckContext.getEnclosingDecl());
            return type;
        }

        // statements

        private typeCheckForStatement(forStatement: ForStatement, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            this.typeCheckAST(forStatement.init, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);
            this.typeCheckAST(forStatement.cond, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);
            this.typeCheckAST(forStatement.body, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);

            return this.semanticInfoChain.voidTypeSymbol;
        }

        private typeCheckForInStatement(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {

            var forInStatement = <ForInStatement>ast;

            var rhsType = this.resolver.widenType(this.typeCheckAST(forInStatement.obj, typeCheckContext, /*inContextuallyTypedAssignment:*/ false));
            var lval = forInStatement.lval;

            if (lval.nodeType === NodeType.VariableDeclaration) {
                var declaration = <VariableDeclaration>forInStatement.lval;
                var varDecl = <VariableDeclarator>declaration.declarators.members[0];

                if (varDecl.typeExpr) {
                    this.postError(lval.minChar, lval.getLength(), typeCheckContext.scriptName, DiagnosticCode.Variable_declarations_for_for_in_expressions_cannot_contain_a_type_annotation, null, typeCheckContext.getEnclosingDecl());
                }
            }

            var varSym = this.resolveSymbolAndReportDiagnostics(forInStatement.lval, /*inContextuallyTypedAssignment:*/false, typeCheckContext.getEnclosingDecl());
            this.checkForResolutionError(varSym.getType(), typeCheckContext.getEnclosingDecl());

            var isStringOrNumber = varSym.getType() === this.semanticInfoChain.stringTypeSymbol || this.resolver.isAnyOrEquivalent(varSym.getType());

            var isValidRHS = rhsType && (this.resolver.isAnyOrEquivalent(rhsType) || !rhsType.isPrimitive());

            if (!isStringOrNumber) {
                this.postError(lval.minChar, lval.getLength(), typeCheckContext.scriptName, DiagnosticCode.Variable_declarations_for_for_in_expressions_must_be_of_types__string__or__any_, null, typeCheckContext.getEnclosingDecl());
            }

            if (!isValidRHS) {
                this.postError(forInStatement.obj.minChar, forInStatement.obj.getLength(), typeCheckContext.scriptName, DiagnosticCode.The_right_operand_of_a_for_in_expression_must_be_of_type__any____an_object_type_or_a_type_parameter, null, typeCheckContext.getEnclosingDecl());
            }

            this.typeCheckAST(forInStatement.body, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);

            return this.semanticInfoChain.voidTypeSymbol;
        }

        private typeCheckInExpression(binaryExpression: BinaryExpression, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            var lhsType = this.resolver.widenType(this.typeCheckAST(binaryExpression.operand1, typeCheckContext, /*inContextuallyTypedAssignment:*/ false));
            var rhsType = this.resolver.widenType(this.typeCheckAST(binaryExpression.operand2, typeCheckContext, /*inContextuallyTypedAssignment:*/ false));

            var isStringAnyOrNumber = lhsType.getType() === this.semanticInfoChain.stringTypeSymbol ||
                                        this.resolver.isAnyOrEquivalent(lhsType.getType()) ||
                                        this.resolver.isNumberOrEquivalent(lhsType.getType());
            var isValidRHS = rhsType && (this.resolver.isAnyOrEquivalent(rhsType) || !rhsType.isPrimitive());

            if (!isStringAnyOrNumber) {
                this.postError(binaryExpression.operand1.minChar, binaryExpression.operand1.getLength(), typeCheckContext.scriptName, DiagnosticCode.The_left_hand_side_of_an__in__expression_must_be_of_types__string__or__any_, null, typeCheckContext.getEnclosingDecl());
            }

            if (!isValidRHS) {

                this.postError(binaryExpression.operand1.minChar, binaryExpression.operand1.getLength(), typeCheckContext.scriptName, DiagnosticCode.The_right_hand_side_of_an__in__expression_must_be_of_type__any___an_object_type_or_a_type_parameter, null, typeCheckContext.getEnclosingDecl());
            }

            return this.semanticInfoChain.booleanTypeSymbol;
        }

        private typeCheckInstanceOfExpression(binaryExpression: BinaryExpression, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            var lhsType = this.resolver.widenType(this.typeCheckAST(binaryExpression.operand1, typeCheckContext, /*inContextuallyTypedAssignment:*/ false));
            var rhsType = this.typeCheckAST(binaryExpression.operand2, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);

            var isValidLHS = lhsType && (this.resolver.isAnyOrEquivalent(lhsType) || !lhsType.isPrimitive());
            var isValidRHS = rhsType && (this.resolver.isAnyOrEquivalent(rhsType) || rhsType.isClass() || this.resolver.typeIsSubtypeOfFunction(rhsType, this.context))

            if (!isValidLHS) {
                this.postError(binaryExpression.operand1.minChar, binaryExpression.operand1.getLength(), typeCheckContext.scriptName, DiagnosticCode.The_left_hand_side_of_an__instanceOf__expression_must_be_of_type__any___an_object_type_or_a_type_parameter, null, typeCheckContext.getEnclosingDecl());
            }

            if (!isValidRHS) {
                this.postError(binaryExpression.operand1.minChar, binaryExpression.operand1.getLength(), typeCheckContext.scriptName, DiagnosticCode.The_right_hand_side_of_an__instanceOf__expression_must_be_of_type__any__or_a_subtype_of_the__Function__interface_type, null, typeCheckContext.getEnclosingDecl());
            }

            return this.semanticInfoChain.booleanTypeSymbol;
        }

        private typeCheckParenthesizedExpression(parenthesizedExpression: ParenthesizedExpression, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            return this.typeCheckAST(parenthesizedExpression.expression, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);
        }

        private typeCheckWhileStatement(whileStatement: WhileStatement, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            this.typeCheckAST(whileStatement.cond, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);
            this.typeCheckAST(whileStatement.body, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);

            return this.semanticInfoChain.voidTypeSymbol;
        }

        private typeCheckDoStatement(doStatement: DoStatement, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            this.typeCheckAST(doStatement.cond, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);
            this.typeCheckAST(doStatement.body, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);

            return this.semanticInfoChain.voidTypeSymbol;
        }

        private typeCheckIfStatement(ifStatement: IfStatement, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            this.typeCheckAST(ifStatement.cond, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);
            this.typeCheckAST(ifStatement.thenBod, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);
            this.typeCheckAST(ifStatement.elseBod, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);

            return this.semanticInfoChain.voidTypeSymbol;
        }

        private typeCheckBlock(block: Block, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            this.typeCheckAST(block.statements, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);

            return this.semanticInfoChain.voidTypeSymbol;
        }

        private typeCheckVariableDeclaration(variableDeclaration: VariableDeclaration, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            this.typeCheckAST(variableDeclaration.declarators, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);

            return this.semanticInfoChain.voidTypeSymbol;
        }

        private typeCheckVariableStatement(variableStatement: VariableStatement, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            this.typeCheckAST(variableStatement.declaration, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);

            return this.semanticInfoChain.voidTypeSymbol;
        }

        private typeCheckWithStatement(withStatement: WithStatement, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            this.postError(withStatement.expr.minChar, withStatement.expr.getLength(), typeCheckContext.scriptName, DiagnosticCode.All_symbols_within_a__with__block_will_be_resolved_to__any__, null, typeCheckContext.getEnclosingDecl());

            return this.semanticInfoChain.voidTypeSymbol;
        }

        private typeCheckTryStatement(tryStatement: TryStatement, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            this.typeCheckAST(tryStatement.tryBody, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);
            this.typeCheckAST(tryStatement.catchClause, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);
            this.typeCheckAST(tryStatement.finallyBody, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);

            return this.semanticInfoChain.voidTypeSymbol;
        }

        private typeCheckCatchClause(catchClause: CatchClause, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            var catchDecl = this.resolver.getDeclForAST(catchClause);

            typeCheckContext.pushEnclosingDecl(catchDecl);
            this.typeCheckAST(catchClause.body, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);
            typeCheckContext.popEnclosingDecl();

            return this.semanticInfoChain.voidTypeSymbol;
        }

        private typeCheckReturnStatement(returnAST: ReturnStatement, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            typeCheckContext.setEnclosingDeclHasReturn();

            var returnExpr = returnAST.returnExpression;
            var enclosingDecl = typeCheckContext.getEnclosingDecl();

            // push contextual type
            var inContextuallyTypedAssignment = false;
            var enclosingDeclAST: FunctionDeclaration;

            if (enclosingDecl.getKind() & PullElementKind.SomeFunction) {
                enclosingDeclAST = <FunctionDeclaration>this.resolver.getASTForDecl(enclosingDecl);
                if (enclosingDeclAST.returnTypeAnnotation) {
                    // The containing function has a type annotation, propagate it as the contextual type
                    var returnTypeAnnotationSymbol = this.resolver.resolveTypeReference(<TypeReference>enclosingDeclAST.returnTypeAnnotation, enclosingDecl, this.context).symbol;
                    if (returnTypeAnnotationSymbol) {
                        inContextuallyTypedAssignment = true;
                        this.context.pushContextualType(returnTypeAnnotationSymbol, this.context.inProvisionalResolution(), null);
                    }
                }
                else {
                    // No type annotation, check if there is a contextual type enforced on the function, and propagate that
                    var currentContextualType = this.context.getContextualType();
                    if (currentContextualType && currentContextualType.isFunction()) {
                        var currentContextualTypeSignatureSymbol = currentContextualType.getDeclarations()[0].getSignatureSymbol();
                        var currentContextualTypeReturnTypeSymbol = currentContextualTypeSignatureSymbol.getReturnType();
                        if (currentContextualTypeReturnTypeSymbol) {
                            inContextuallyTypedAssignment = true;
                            this.context.pushContextualType(currentContextualTypeReturnTypeSymbol, this.context.inProvisionalResolution(), null);
                        }
                    }
                }
            }

            var returnType = this.typeCheckAST(returnExpr, typeCheckContext, inContextuallyTypedAssignment);

            if (inContextuallyTypedAssignment) {
                this.context.popContextualType();
            }

            if (enclosingDecl.getKind() === PullElementKind.SetAccessor && returnExpr) {
                this.postError(returnExpr.minChar, returnExpr.getLength(), typeCheckContext.scriptName, DiagnosticCode.Setters_cannot_return_a_value, null, typeCheckContext.getEnclosingDecl());
            }

            if (enclosingDecl.getKind() & PullElementKind.SomeFunction) {

                enclosingDeclAST = <FunctionDeclaration>this.resolver.getASTForDecl(enclosingDecl);

                if (enclosingDeclAST.returnTypeAnnotation) {
                    var signatureSymbol = enclosingDecl.getSignatureSymbol();
                    var sigReturnType = signatureSymbol.getReturnType();

                    if (returnType && sigReturnType) {
                        var comparisonInfo = new TypeComparisonInfo();
                        var upperBound: PullTypeSymbol = null;

                        if (returnType.isTypeParameter()) {
                            upperBound = (<PullTypeParameterSymbol>returnType).getConstraint();

                            if (upperBound) {
                                returnType = upperBound;
                            }
                        }

                        if (sigReturnType.isTypeParameter()) {
                            upperBound = (<PullTypeParameterSymbol>sigReturnType).getConstraint();

                            if (upperBound) {
                                sigReturnType = upperBound;
                            }
                        }

                        if (!returnType.isResolved()) {
                            this.resolver.resolveDeclaredSymbol(returnType, enclosingDecl, this.context);
                        }

                        if (!sigReturnType.isResolved()) {
                            this.resolver.resolveDeclaredSymbol(sigReturnType, enclosingDecl, this.context);
                        }

                        var isAssignable = this.resolver.sourceIsAssignableToTarget(returnType, sigReturnType, this.context, comparisonInfo);

                        if (!isAssignable) {
                            if (comparisonInfo.message) {
                                this.postError(returnExpr.minChar, returnExpr.getLength(), typeCheckContext.scriptName, DiagnosticCode.Cannot_convert__0__to__1__NL__2, [returnType.toString(), sigReturnType.toString(), comparisonInfo.message], enclosingDecl);
                            } else {
                                this.postError(returnExpr.minChar, returnExpr.getLength(), typeCheckContext.scriptName, DiagnosticCode.Cannot_convert__0__to__1_, [returnType.toString(), sigReturnType.toString()], enclosingDecl);
                            }
                        }
                    }
                }
            }

            return returnType;
        }

        private typeCheckNameExpression(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            var enclosingDecl = typeCheckContext.getEnclosingDecl();
            var type = this.resolveSymbolAndReportDiagnostics(ast, /*inContextuallyTypedAssignment:*/false, enclosingDecl).getType();
            this.checkForResolutionError(type, enclosingDecl);
            return type;
        }

        private checkForSuperMemberAccess(memberAccessExpression: BinaryExpression,
                                          typeCheckContext: PullTypeCheckContext,
                                          resolvedName: PullSymbol): boolean {
            var enclosingDecl = typeCheckContext.getEnclosingDecl();
            if (resolvedName) {
                if (memberAccessExpression.operand1.nodeType === NodeType.SuperExpression &&
                    !resolvedName.isError() &&
                    resolvedName.getKind() !== PullElementKind.Method) {

                    this.postError(memberAccessExpression.operand2.minChar, memberAccessExpression.operand2.getLength(), typeCheckContext.scriptName,
                        DiagnosticCode.Only_public_instance_methods_of_the_base_class_are_accessible_via_the_super_keyword, [], enclosingDecl);
                    return true;
                }
            }

            return false;
        }

        private checkForPrivateMemberAccess(memberAccessExpression: BinaryExpression,
                                            typeCheckContext: PullTypeCheckContext,
                                            expressionType: PullTypeSymbol,
                                            resolvedName: PullSymbol): boolean {
            var enclosingDecl = typeCheckContext.getEnclosingDecl();
            if (resolvedName) {
                 if (resolvedName.hasFlag(PullElementFlags.Private)) {
                    var memberContainer = resolvedName.getContainer();
                    if (memberContainer && memberContainer.getKind() === PullElementKind.ConstructorType) {
                        memberContainer = memberContainer.getAssociatedContainerType();
                    }

                    if (memberContainer && memberContainer.isClass()) {
                        // We're accessing a private member of a class.  We can only do that if we're 
                        // actually contained within that class.
                        var containingClass = typeCheckContext.getEnclosingClassDecl();
                        if (!containingClass || containingClass.getSymbol() !== memberContainer) {
                            var name = <Identifier>memberAccessExpression.operand2;
                            this.postError(name.minChar, name.getLength(), typeCheckContext.scriptName, DiagnosticCode._0_1__is_inaccessible, [memberContainer.toString(false), name.actualText], enclosingDecl);
                            return true;
                        }
                    }
                }
            }

            return false;
        }

        private checkForStaticMemberAccess(memberAccessExpression: BinaryExpression,
                                           typeCheckContext: PullTypeCheckContext,
                                           expressionType: PullTypeSymbol,
                                           resolvedName: PullSymbol): boolean {
            if (expressionType && resolvedName && !resolvedName.isError()) {
                if (expressionType.isClass() || expressionType.getKind() === PullElementKind.ConstructorType) {
                    var name = <Identifier>memberAccessExpression.operand2;
                    var enclosingDecl = typeCheckContext.getEnclosingDecl();

                    if (resolvedName.hasFlag(PullElementFlags.Static) || this.resolver.isPrototypeMember(memberAccessExpression, enclosingDecl, this.context)) {
                        if (expressionType.getKind() !== PullElementKind.ConstructorType) {
                            var enclosingDecl = typeCheckContext.getEnclosingDecl();
                            this.postError(name.minChar, name.getLength(), typeCheckContext.scriptName,
                                DiagnosticCode.Static_member_cannot_be_accessed_off_an_instance_variable, null, enclosingDecl);
                            return true;
                        }
                    }
                }
            }

            return false;
        }

        private typeCheckMemberAccessExpression(memberAccessExpression: BinaryExpression, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            var enclosingDecl = typeCheckContext.getEnclosingDecl();
            var resolvedName = this.resolveSymbolAndReportDiagnostics(memberAccessExpression, /*inContextuallyTypedAssignment:*/false, enclosingDecl);
            var type = resolvedName.getType();

            this.checkForResolutionError(type, enclosingDecl);
            var prevCanUseTypeSymbol = this.context.canUseTypeSymbol;
            this.context.canUseTypeSymbol = true;
            var expressionType = this.typeCheckAST(memberAccessExpression.operand1, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);
            this.context.canUseTypeSymbol = prevCanUseTypeSymbol;

            // Check for errors, but only report the first one we find to not spam the user.
            this.checkForSuperMemberAccess(memberAccessExpression, typeCheckContext, resolvedName) ||
            this.checkForPrivateMemberAccess(memberAccessExpression, typeCheckContext, expressionType, resolvedName) ||
            this.checkForStaticMemberAccess(memberAccessExpression, typeCheckContext, expressionType, resolvedName);

            return type;
        }

        private typeCheckSwitchStatement(switchStatement: SwitchStatement, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            this.typeCheckAST(switchStatement.val, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);
            this.typeCheckAST(switchStatement.caseList, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);
            this.typeCheckAST(switchStatement.defaultCase, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);

            return this.semanticInfoChain.voidTypeSymbol;
        }

        private typeCheckExpressionStatement(ast: ExpressionStatement, typeCheckContext: PullTypeCheckContext, inContextuallyTypedAssignment: boolean): PullTypeSymbol {
            return this.typeCheckAST(ast.expression, typeCheckContext, inContextuallyTypedAssignment);
        }

        private typeCheckCaseClause(caseClause: CaseClause, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            this.typeCheckAST(caseClause.expr, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);
            this.typeCheckAST(caseClause.body, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);

            return this.semanticInfoChain.voidTypeSymbol;
        }

        private typeCheckLabeledStatement(labeledStatement: LabeledStatement, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            return this.typeCheckAST(labeledStatement.statement, typeCheckContext, /*inContextuallyTypedAssignment:*/ false);
        }

        // Privacy checking

        private checkTypePrivacy(declSymbol: PullSymbol, typeSymbol: PullTypeSymbol, typeCheckContext: PullTypeCheckContext, privacyErrorReporter: (typeSymbol: PullTypeSymbol) => void ) {
            if (!typeSymbol || typeSymbol.getKind() === PullElementKind.Primitive) {
                return;
            }

            if (typeSymbol.isArray()) {
                this.checkTypePrivacy(declSymbol, (<PullArrayTypeSymbol>typeSymbol).getElementType(), typeCheckContext, privacyErrorReporter);
                return;
            }

            if (!typeSymbol.isNamedTypeSymbol()) {
                // Check the privacy of members, constructors, calls, index signatures
                var members = typeSymbol.getMembers();
                for (var i = 0; i < members.length; i++) {
                    this.checkTypePrivacy(declSymbol, members[i].getType(), typeCheckContext, privacyErrorReporter);
                }

                this.checkTypePrivacyOfSignatures(declSymbol, typeSymbol.getCallSignatures(), typeCheckContext, privacyErrorReporter);
                this.checkTypePrivacyOfSignatures(declSymbol, typeSymbol.getConstructSignatures(), typeCheckContext, privacyErrorReporter);
                this.checkTypePrivacyOfSignatures(declSymbol, typeSymbol.getIndexSignatures(), typeCheckContext, privacyErrorReporter);

                return;
            }

            // Check flags for the symbol itself
            if (declSymbol.isExternallyVisible()) {
                // Check if type symbol is externally visible
                var typeSymbolIsVisible = typeSymbol.isExternallyVisible();
                // If Visible check if the type is part of dynamic module
                if (typeSymbolIsVisible) {
                    var typeSymbolPath = typeSymbol.pathToRoot();
                    if (typeSymbolPath.length && typeSymbolPath[typeSymbolPath.length - 1].getKind() === PullElementKind.DynamicModule) {
                        // Type from the dynamic module
                        var declSymbolPath = declSymbol.pathToRoot();
                        if (declSymbolPath.length && declSymbolPath[declSymbolPath.length - 1] != typeSymbolPath[typeSymbolPath.length - 1]) {
                            // Declaration symbol is from different unit
                            // Type may not be visible without import statement
                            typeSymbolIsVisible = false;
                            for (var i = typeSymbolPath.length - 1; i >= 0; i--) {
                                var aliasSymbol = typeSymbolPath[i].getAliasedSymbol(declSymbol);
                                if (aliasSymbol) {
                                    // Visible type.
                                    // Also mark this Import declaration as visible
                                    CompilerDiagnostics.assert(aliasSymbol.getKind() === PullElementKind.TypeAlias, "dynamic module need to be referenced by type alias");
                                    (<PullTypeAliasSymbol>aliasSymbol).setIsTypeUsedExternally();
                                    typeSymbolIsVisible = true;
                                    break;
                                } 
                            }
                        }
                    }
                }

                if (!typeSymbolIsVisible) {
                    // declaration is visible from outside but the type isnt - Report error
                    privacyErrorReporter(typeSymbol);
                }
            }
        }

        private checkTypePrivacyOfSignatures(declSymbol: PullSymbol, signatures: PullSignatureSymbol[], typeCheckContext: PullTypeCheckContext, privacyErrorReporter: (typeSymbol: PullTypeSymbol) => void ) {
            for (var i = 0; i < signatures.length; i++) {
                var signature = signatures[i];
                if (signatures.length && signature.isDefinition()) {
                    continue;
                }

                var typeParams = signature.getTypeParameters();
                for (var j = 0; j < typeParams.length; j++) {
                    this.checkTypePrivacy(declSymbol, typeParams[j], typeCheckContext, privacyErrorReporter);
                }

                var params = signature.getParameters();
                for (var j = 0; j < params.length; j++) {
                    var paramType = params[j].getType();
                    this.checkTypePrivacy(declSymbol, paramType, typeCheckContext, privacyErrorReporter);
                }

                var returnType = signature.getReturnType();
                this.checkTypePrivacy(declSymbol, returnType, typeCheckContext, privacyErrorReporter);
            }
        }

        private baseListPrivacyErrorReporter(declAST: TypeDeclaration, declSymbol: PullTypeSymbol, baseAst: AST, isExtendedType: boolean, typeSymbol: PullTypeSymbol, typeCheckContext: PullTypeCheckContext) {
            var decl: PullDecl = this.resolver.getDeclForAST(declAST);
            var enclosingDecl = typeCheckContext.getEnclosingDecl();
            var messageCode: DiagnosticCode;
            var messageArguments: any[];

            var typeSymbolName = typeSymbol.getScopedName();
            if (typeSymbol.isContainer()) {
                if (!isQuoted(typeSymbolName)) {
                    typeSymbolName = "'" + typeSymbolName + "'";
                }
                if (declAST.nodeType === NodeType.ClassDeclaration) {
                    // Class
                    if (isExtendedType) {
                        messageCode = DiagnosticCode.Exported_class__0__extends_class_from_inaccessible_module__1_;
                        messageArguments = [declSymbol.getScopedName(), typeSymbolName];
                    } else {
                        messageCode = DiagnosticCode.Exported_class__0__implements_interface_from_inaccessible_module__1_;
                        messageArguments = [declSymbol.getScopedName(), typeSymbolName];
                    }
                } else {
                    // Interface
                    messageCode = DiagnosticCode.Exported_interface__0__extends_interface_from_inaccessible_module__1_;
                    messageArguments = [declSymbol.getDisplayName(), typeSymbolName];
                }
            } else {
                if (declAST.nodeType === NodeType.ClassDeclaration) {
                    // Class
                    if (isExtendedType) {
                        messageCode = DiagnosticCode.Exported_class__0__extends_private_class__1_;
                        messageArguments = [declSymbol.getScopedName(), typeSymbolName];
                    } else {
                        messageCode = DiagnosticCode.Exported_class__0__implements_private_interface__1_;
                        messageArguments = [declSymbol.getScopedName(), typeSymbolName];
                    }
                } else {
                    // Interface
                    messageCode = DiagnosticCode.Exported_interface__0__extends_private_interface__1_;
                    messageArguments = [declSymbol.getDisplayName(), typeSymbolName];
                }
            }

            this.context.postError(typeCheckContext.scriptName, baseAst.minChar, baseAst.getLength(), messageCode, messageArguments, enclosingDecl, true);
        }

        private variablePrivacyErrorReporter(declSymbol: PullSymbol, typeSymbol: PullTypeSymbol, typeCheckContext: PullTypeCheckContext) {
            var declAST = <VariableDeclarator>this.resolver.getASTForSymbol(declSymbol);
            var enclosingDecl = typeCheckContext.getEnclosingDecl();

            var isProperty = declSymbol.getKind() === PullElementKind.Property;
            var isPropertyOfClass = false;
            var declParent = declSymbol.getContainer();
            if (declParent && (declParent.getKind() === PullElementKind.Class || declParent.getKind() === PullElementKind.ConstructorMethod)) {
                isPropertyOfClass = true;
            }

            var messageCode: DiagnosticCode;
            var messageArguments: any[];
            var typeSymbolName = typeSymbol.getScopedName();
            if (typeSymbol.isContainer()) {
                if (!isQuoted(typeSymbolName)) {
                    typeSymbolName = "'" + typeSymbolName + "'";
                }

                if (declSymbol.hasFlag(PullElementFlags.Static)) {
                    messageCode = DiagnosticCode.Public_static_property__0__of__exported_class_is_using_inaccessible_module__1_;
                    messageArguments = [declSymbol.getScopedName(), typeSymbolName];
                } else if (isProperty) {
                    if (isPropertyOfClass) {
                        messageCode = DiagnosticCode.Public_property__0__of__exported_class_is_using_inaccessible_module__1_;
                        messageArguments = [declSymbol.getScopedName(), typeSymbolName];
                    } else {
                        messageCode = DiagnosticCode.Property__0__of__exported_interface_is_using_inaccessible_module__1_;
                        messageArguments = [declSymbol.getScopedName(), typeSymbolName];
                    }
                } else {
                    messageCode = DiagnosticCode.Exported_variable__0__is_using_inaccessible_module__1_;
                    messageArguments = [declSymbol.getScopedName(), typeSymbolName];
                }
            } else {
                if (declSymbol.hasFlag(PullElementFlags.Static)) {
                    messageCode = DiagnosticCode.Public_static_property__0__of__exported_class_has_or_is_using_private_type__1_;
                    messageArguments = [declSymbol.getScopedName(), typeSymbolName];
                } else if (isProperty) {
                    if (isPropertyOfClass) {
                        messageCode = DiagnosticCode.Public_property__0__of__exported_class_has_or_is_using_private_type__1_;
                        messageArguments = [declSymbol.getScopedName(), typeSymbolName];
                    } else {
                        messageCode = DiagnosticCode.Property__0__of__exported_interface_has_or_is_using_private_type__1_;
                        messageArguments = [declSymbol.getScopedName(), typeSymbolName];
                    }
                } else {
                    messageCode = DiagnosticCode.Exported_variable__0__has_or_is_using_private_type__1_;
                    messageArguments = [declSymbol.getScopedName(), typeSymbolName];
                }
            }

            this.context.postError(typeCheckContext.scriptName, declAST.minChar, declAST.getLength(), messageCode, messageArguments, enclosingDecl, true);
        }

        private checkFunctionTypePrivacy(funcDeclAST: FunctionDeclaration, inContextuallyTypedAssignment: boolean, typeCheckContext: PullTypeCheckContext) {
            if (inContextuallyTypedAssignment ||
                (funcDeclAST.getFunctionFlags() & FunctionFlags.IsFunctionExpression) ||
                (funcDeclAST.getFunctionFlags() & FunctionFlags.IsFunctionProperty)) {
                return;
            }

            var functionDecl = typeCheckContext.semanticInfo.getDeclForAST(funcDeclAST);
            var functionSymbol = functionDecl.getSymbol();;
            var functionSignature: PullSignatureSymbol;

            var isGetter = funcDeclAST.isGetAccessor();
            var isSetter = funcDeclAST.isSetAccessor();

            if (isGetter || isSetter) {
                var accessorSymbol = <PullAccessorSymbol> functionSymbol;
                functionSignature = (isGetter ? accessorSymbol.getGetter() : accessorSymbol.getSetter()).getType().getCallSignatures()[0];
            } else {
                if (!functionSymbol) {
                    var parentDecl = functionDecl.getParentDecl();
                    functionSymbol = parentDecl.getSymbol();
                    if (functionSymbol && functionSymbol.isType() && !(<PullTypeSymbol>functionSymbol).isNamedTypeSymbol()) {
                        // Call Signature from the non named type
                        return;
                    }
                } else if (functionSymbol.getKind() == PullElementKind.Method && !functionSymbol.getContainer().isNamedTypeSymbol()) {
                    // method of the unnmaed type
                    return;
                }
                functionSignature = functionDecl.getSignatureSymbol();
            }

            // Check function parameters
            if (!isGetter) {
                var funcParams = functionSignature.getParameters();
                for (var i = 0; i < funcParams.length; i++) {
                    this.checkTypePrivacy(functionSymbol, funcParams[i].getType(), typeCheckContext, (typeSymbol: PullTypeSymbol) =>
                        this.functionArgumentTypePrivacyErrorReporter(funcDeclAST, i, funcParams[i], typeSymbol, typeCheckContext));
                }
            }

            // Check return type
            if (!isSetter) {
                this.checkTypePrivacy(functionSymbol, functionSignature.getReturnType(), typeCheckContext, (typeSymbol: PullTypeSymbol) =>
                    this.functionReturnTypePrivacyErrorReporter(funcDeclAST, functionSignature.getReturnType(), typeSymbol, typeCheckContext));
            }
        }

        private functionArgumentTypePrivacyErrorReporter(declAST: FunctionDeclaration, argIndex: number, paramSymbol: PullSymbol, typeSymbol: PullTypeSymbol, typeCheckContext: PullTypeCheckContext) {
            var decl: PullDecl = this.resolver.getDeclForAST(declAST);
            var enclosingDecl = typeCheckContext.getEnclosingDecl();

            var isGetter = declAST.isAccessor() && hasFlag(declAST.getFunctionFlags(), FunctionFlags.GetAccessor);
            var isSetter = declAST.isAccessor() && hasFlag(declAST.getFunctionFlags(), FunctionFlags.SetAccessor);
            var isStatic = (decl.getFlags() & PullElementFlags.Static) === PullElementFlags.Static;
            var isMethod = decl.getKind() === PullElementKind.Method;
            var isMethodOfClass = false;
            var declParent = decl.getParentDecl();
            if (declParent && (declParent.getKind() === PullElementKind.Class || declParent.getKind() === PullElementKind.ConstructorMethod)) {
                isMethodOfClass = true;
            }

            var start = declAST.arguments.members[argIndex].minChar;
            var length = declAST.arguments.members[argIndex].getLength();

            var typeSymbolName = typeSymbol.getScopedName();
            if (typeSymbol.isContainer()) {
                if (!isQuoted(typeSymbolName)) {
                    typeSymbolName = "'" + typeSymbolName + "'";
                }

                if (declAST.isConstructor) {
                    this.context.postError(typeCheckContext.scriptName, start, length, DiagnosticCode.Parameter__0__of_constructor_from_exported_class_is_using_inaccessible_module__1_, [paramSymbol.getScopedName(), typeSymbolName], enclosingDecl, true);
                } else if (isSetter) {
                    if (isStatic) {
                        this.context.postError(typeCheckContext.scriptName, start, length, DiagnosticCode.Parameter__0__of_public_static_property_setter_from_exported_class_is_using_inaccessible_module__1_, [paramSymbol.getScopedName(), typeSymbolName], enclosingDecl, true);
                    } else {
                        this.context.postError(typeCheckContext.scriptName, start, length, DiagnosticCode.Parameter__0__of_public_property_setter_from_exported_class_is_using_inaccessible_module__1_, [paramSymbol.getScopedName(), typeSymbolName], enclosingDecl, true);
                    }
                } else if (declAST.isConstructMember()) {
                    this.context.postError(typeCheckContext.scriptName, start, length, DiagnosticCode.Parameter__0__of_constructor_signature_from_exported_interface_is_using_inaccessible_module__1_, [paramSymbol.getScopedName(), typeSymbolName], enclosingDecl, true);
                } else if (declAST.isCallMember()) {
                    this.context.postError(typeCheckContext.scriptName, start, length, DiagnosticCode.Parameter__0__of_call_signature_from_exported_interface_is_using_inaccessible_module__1_, [paramSymbol.getScopedName(), typeSymbolName], enclosingDecl, true);
                } else if (isMethod) {
                    if (isStatic) {
                        this.context.postError(typeCheckContext.scriptName, start, length, DiagnosticCode.Parameter__0__of_public_static_method_from_exported_class_is_using_inaccessible_module__1_, [paramSymbol.getScopedName(), typeSymbolName], enclosingDecl, true);
                    } else if (isMethodOfClass) {
                        this.context.postError(typeCheckContext.scriptName, start, length, DiagnosticCode.Parameter__0__of_public_method_from_exported_class_is_using_inaccessible_module__1_, [paramSymbol.getScopedName(), typeSymbolName], enclosingDecl, true);
                    } else {
                        this.context.postError(typeCheckContext.scriptName, start, length, DiagnosticCode.Parameter__0__of_method_from_exported_interface_is_using_inaccessible_module__1_, [paramSymbol.getScopedName(), typeSymbolName], enclosingDecl, true);
                    }
                } else if (!isGetter) {
                    this.context.postError(typeCheckContext.scriptName, start, length, DiagnosticCode.Parameter__0__of_exported_function_is_using_inaccessible_module__1_, [paramSymbol.getScopedName(), typeSymbolName], enclosingDecl, true);
                }
            } else {
                if (declAST.isConstructor) {
                    this.context.postError(typeCheckContext.scriptName, start, length, DiagnosticCode.Parameter__0__of_constructor_from_exported_class_has_or_is_using_private_type__1_, [paramSymbol.getScopedName(), typeSymbolName], enclosingDecl, true);
                } else if (isSetter) {
                    if (isStatic) {
                        this.context.postError(typeCheckContext.scriptName, start, length, DiagnosticCode.Parameter__0__of_public_static_property_setter_from_exported_class_has_or_is_using_private_type__1_, [paramSymbol.getScopedName(), typeSymbolName], enclosingDecl, true);
                    } else {
                        this.context.postError(typeCheckContext.scriptName, start, length, DiagnosticCode.Parameter__0__of_public_property_setter_from_exported_class_has_or_is_using_private_type__1_, [paramSymbol.getScopedName(), typeSymbolName], enclosingDecl, true);
                    }
                } else if (declAST.isConstructMember()) {
                    this.context.postError(typeCheckContext.scriptName, start, length, DiagnosticCode.Parameter__0__of_constructor_signature_from_exported_interface_has_or_is_using_private_type__1_, [paramSymbol.getScopedName(), typeSymbolName], enclosingDecl, true);
                } else if (declAST.isCallMember()) {
                    this.context.postError(typeCheckContext.scriptName, start, length, DiagnosticCode.Parameter__0__of_call_signature_from_exported_interface_has_or_is_using_private_type__1_, [paramSymbol.getScopedName(), typeSymbolName], enclosingDecl, true);
                } else if (isMethod) {
                    if (isStatic) {
                        this.context.postError(typeCheckContext.scriptName, start, length, DiagnosticCode.Parameter__0__of_public_static_method_from_exported_class_has_or_is_using_private_type__1_, [paramSymbol.getScopedName(), typeSymbolName], enclosingDecl, true);
                    } else if (isMethodOfClass) {
                        this.context.postError(typeCheckContext.scriptName, start, length, DiagnosticCode.Parameter__0__of_public_method_from_exported_class_has_or_is_using_private_type__1_, [paramSymbol.getScopedName(), typeSymbolName], enclosingDecl, true);
                    } else {
                        this.context.postError(typeCheckContext.scriptName, start, length, DiagnosticCode.Parameter__0__of_method_from_exported_interface_has_or_is_using_private_type__1_, [paramSymbol.getScopedName(), typeSymbolName], enclosingDecl, true);
                    }
                } else if (!isGetter && !declAST.isIndexerMember()) {
                    this.context.postError(typeCheckContext.scriptName, start, length, DiagnosticCode.Parameter__0__of_exported_function_has_or_is_using_private_type__1_, [paramSymbol.getScopedName(), typeSymbolName], enclosingDecl, true);
                }
            }
        }

        private functionReturnTypePrivacyErrorReporter(declAST: FunctionDeclaration, funcReturnType: PullTypeSymbol, typeSymbol: PullTypeSymbol, typeCheckContext: PullTypeCheckContext) {
            var decl: PullDecl = this.resolver.getDeclForAST(declAST);
            var enclosingDecl = typeCheckContext.getEnclosingDecl();

            var isGetter = declAST.isAccessor() && hasFlag(declAST.getFunctionFlags(), FunctionFlags.GetAccessor);
            var isSetter = declAST.isAccessor() && hasFlag(declAST.getFunctionFlags(), FunctionFlags.SetAccessor);
            var isStatic = (decl.getFlags() & PullElementFlags.Static) === PullElementFlags.Static;
            var isMethod = decl.getKind() === PullElementKind.Method;
            var isMethodOfClass = false;
            var declParent = decl.getParentDecl();
            if (declParent && (declParent.getKind() === PullElementKind.Class || declParent.getKind() === PullElementKind.ConstructorMethod)) {
                isMethodOfClass = true;
            }

            var messageCode: DiagnosticCode = null;
            var messageArguments: any[];
            var typeSymbolName = typeSymbol.getScopedName();
            if (typeSymbol.isContainer()) {
                if (!isQuoted(typeSymbolName)) {
                    typeSymbolName = "'" + typeSymbolName + "'";
                }

                if (isGetter) {
                    if (isStatic) {
                        messageCode = DiagnosticCode.Return_type_of_public_static_property_getter_from_exported_class_is_using_inaccessible_module__0_;
                        messageArguments = [typeSymbolName];
                    } else {
                        messageCode = DiagnosticCode.Return_type_of_public_property_getter_from_exported_class_is_using_inaccessible_module__0_;
                        messageArguments = [typeSymbolName];
                    }
                } else if (declAST.isConstructMember()) {
                    messageCode = DiagnosticCode.Return_type_of_constructor_signature_from_exported_interface_is_using_inaccessible_module__0_;
                    messageArguments = [typeSymbolName];
                } else if (declAST.isCallMember()) {
                    messageCode = DiagnosticCode.Return_type_of_call_signature_from_exported_interface_is_using_inaccessible_module__0_;
                    messageArguments = [typeSymbolName];
                } else if (declAST.isIndexerMember()) {
                    messageCode = DiagnosticCode.Return_type_of_index_signature_from_exported_interface_is_using_inaccessible_module__0_;
                    messageArguments = [typeSymbolName];
                } else if (isMethod) {
                    if (isStatic) {
                        messageCode = DiagnosticCode.Return_type_of_public_static_method_from_exported_class_is_using_inaccessible_module__0_;
                        messageArguments = [typeSymbolName];
                    } else if (isMethodOfClass) {
                        messageCode = DiagnosticCode.Return_type_of_public_method_from_exported_class_is_using_inaccessible_module__0_;
                        messageArguments = [typeSymbolName];
                    } else {
                        messageCode = DiagnosticCode.Return_type_of_method_from_exported_interface_is_using_inaccessible_module__0_;
                        messageArguments = [typeSymbolName];
                    }
                } else if (!isSetter && !declAST.isConstructor) {
                    messageCode = DiagnosticCode.Return_type_of_exported_function_is_using_inaccessible_module__0_;
                    messageArguments = [typeSymbolName];
                }
            } else {
                if (isGetter) {
                    if (isStatic) {
                        messageCode = DiagnosticCode.Return_type_of_public_static_property_getter_from_exported_class_has_or_is_using_private_type__0_;
                        messageArguments = [typeSymbolName];
                    } else {
                        messageCode = DiagnosticCode.Return_type_of_public_property_getter_from_exported_class_has_or_is_using_private_type__0_;
                        messageArguments = [typeSymbolName];
                    }
                } else if (declAST.isConstructMember()) {
                    messageCode = DiagnosticCode.Return_type_of_constructor_signature_from_exported_interface_has_or_is_using_private_type__0_;
                    messageArguments = [typeSymbolName];
                } else if (declAST.isCallMember()) {
                    messageCode = DiagnosticCode.Return_type_of_call_signature_from_exported_interface_has_or_is_using_private_type__0_;
                    messageArguments = [typeSymbolName];
                } else if (declAST.isIndexerMember()) {
                    messageCode = DiagnosticCode.Return_type_of_index_signature_from_exported_interface_has_or_is_using_private_type__0_;
                    messageArguments = [typeSymbolName];
                } else if (isMethod) {
                    if (isStatic) {
                        messageCode = DiagnosticCode.Return_type_of_public_static_method_from_exported_class_has_or_is_using_private_type__0_;
                        messageArguments = [typeSymbolName];
                    } else if (isMethodOfClass) {
                        messageCode = DiagnosticCode.Return_type_of_public_method_from_exported_class_has_or_is_using_private_type__0_;
                        messageArguments = [typeSymbolName];
                    } else {
                        messageCode = DiagnosticCode.Return_type_of_method_from_exported_interface_has_or_is_using_private_type__0_;
                        messageArguments = [typeSymbolName];
                    }
                } else if (!isSetter && !declAST.isConstructor) {
                    messageCode = DiagnosticCode.Return_type_of_exported_function_has_or_is_using_private_type__0_;
                    messageArguments = [typeSymbolName];
                }
            }

            if (messageCode) {
                var reportOnFuncDecl = false;
                var contextForReturnTypeResolution = new PullTypeResolutionContext();
                if (declAST.returnTypeAnnotation) {
                    // NOTE: we don't want to report this diagnostics.  They'll already have been 
                    // reported when we first hit the return statement.
                    var returnExpressionSymbolAndDiagnostics = this.resolver.resolveTypeReference(<TypeReference>declAST.returnTypeAnnotation, decl, contextForReturnTypeResolution);
                    var returnExpressionSymbol = returnExpressionSymbolAndDiagnostics && returnExpressionSymbolAndDiagnostics.symbol;
                    if (returnExpressionSymbol === funcReturnType) {
                        // Error coming from return annotation
                        this.context.postError(typeCheckContext.scriptName, declAST.returnTypeAnnotation.minChar, declAST.returnTypeAnnotation.getLength(), messageCode, messageArguments, enclosingDecl, true);
                    }
                }

                if (declAST.block) {
                    var reportErrorOnReturnExpressions = (ast: AST, parent: AST, walker: IAstWalker) => {
                        var go = true;
                        switch (ast.nodeType) {
                            case NodeType.FunctionDeclaration:
                                // don't recurse into a function decl - we don't want to confuse a nested
                                // return type with the top-level function's return type
                                go = false;
                                break;

                            case NodeType.ReturnStatement:
                                var returnStatement: ReturnStatement = <ReturnStatement>ast;
                                var returnExpressionSymbol = this.resolver.resolveAST(returnStatement.returnExpression, false, decl, contextForReturnTypeResolution).symbol.getType();
                                // Check if return statement's type matches the one that we concluded
                                if (returnExpressionSymbol === funcReturnType) {
                                    this.context.postError(typeCheckContext.scriptName, returnStatement.minChar, returnStatement.getLength(), messageCode, messageArguments, enclosingDecl, true);
                                } else {
                                    reportOnFuncDecl = true;
                                }
                                go = false;
                                break;

                            default:
                                break;
                        }

                        walker.options.goChildren = go;
                        return ast;
                    }

                    getAstWalkerFactory().walk(declAST.block, reportErrorOnReturnExpressions);
                }

                if (reportOnFuncDecl) {
                    // Show on function decl
                    this.context.postError(typeCheckContext.scriptName, declAST.minChar, declAST.getLength(), messageCode, messageArguments, enclosingDecl, true);
                }
            }
        }
    }
}