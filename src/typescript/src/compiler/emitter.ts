//
// Copyright (c) Microsoft Corporation.  All rights reserved.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

///<reference path='typescript.ts' />

module TypeScript {
    export enum EmitContainer {
        Prog,
        Module,
        DynamicModule,
        Class,
        Constructor,
        Function,
        Args,
        Interface,
    }

    export class EmitState {
        public column: number;
        public line: number;
        public container: EmitContainer;

        constructor() {
            this.column = 0;
            this.line = 0;
            this.container = EmitContainer.Prog;
        }
    }

    export class EmitOptions {
        public ioHost: EmitterIOHost = null;
        public outputMany: boolean = true;
        public commonDirectoryPath = "";

        constructor(public compilationSettings: CompilationSettings) {
        }

        public mapOutputFileName(document: Document, extensionChanger: (fname: string, wholeFileNameReplaced: boolean) => string) {
            if (this.outputMany || document.script.topLevelMod) {
                var updatedFileName = document.fileName;
                if (this.compilationSettings.outDirOption !== "") {
                    // Replace the common directory path with the option specified
                    updatedFileName = document.fileName.replace(this.commonDirectoryPath, "");
                    updatedFileName = this.compilationSettings.outDirOption + updatedFileName;
                }
                return extensionChanger(updatedFileName, false);
            } else {
                return extensionChanger(this.compilationSettings.outFileOption, true);
            }
        }

        public decodeSourceMapOptions(document: Document, jsFilePath: string, oldSourceMapSourceInfo?: SourceMapSourceInfo): SourceMapSourceInfo {
            var sourceMapSourceInfo = new SourceMapSourceInfo(oldSourceMapSourceInfo);

            var tsFilePath = switchToForwardSlashes(document.fileName);

            // Decode mapRoot and sourceRoot
            if (!oldSourceMapSourceInfo) {
                // Js File Name = pretty name of js file
                var prettyJsFileName = TypeScript.getPrettyName(jsFilePath, false, true);
                var prettyMapFileName = prettyJsFileName + SourceMapper.MapFileExtension;
                sourceMapSourceInfo.jsFileName = prettyJsFileName;

                // Figure out sourceMapPath and sourceMapDirectory
                if (this.compilationSettings.mapRoot) {
                    if (this.outputMany || document.script.topLevelMod) {
                        var sourceMapPath = tsFilePath.replace(this.commonDirectoryPath, "");
                        sourceMapPath = this.compilationSettings.mapRoot + sourceMapPath;
                        sourceMapPath = TypeScriptCompiler.mapToJSFileName(sourceMapPath, false) + SourceMapper.MapFileExtension;
                        sourceMapSourceInfo.sourceMapPath = sourceMapPath;

                        if (isRelative(sourceMapSourceInfo.sourceMapPath)) {
                            sourceMapPath = this.commonDirectoryPath + sourceMapSourceInfo.sourceMapPath;
                        }
                        sourceMapSourceInfo.sourceMapDirectory = getRootFilePath(sourceMapPath);
                    } else {
                        sourceMapSourceInfo.sourceMapPath = this.compilationSettings.mapRoot + prettyMapFileName;
                        sourceMapSourceInfo.sourceMapDirectory = this.compilationSettings.mapRoot;
                        if (isRelative(sourceMapSourceInfo.sourceMapDirectory)) {
                            sourceMapSourceInfo.sourceMapDirectory = getRootFilePath(jsFilePath) + this.compilationSettings.mapRoot;
                        }
                    }
                } else {
                    sourceMapSourceInfo.sourceMapPath = prettyMapFileName;
                    sourceMapSourceInfo.sourceMapDirectory = getRootFilePath(jsFilePath);
                }
                sourceMapSourceInfo.sourceRoot =  this.compilationSettings.sourceRoot;
            }

            if (this.compilationSettings.sourceRoot) {
                // Use the relative path corresponding to the common directory path
                sourceMapSourceInfo.tsFilePath = getRelativePathToFixedPath(this.commonDirectoryPath, tsFilePath);
            } else {
                // Source locations relative to map file location
                sourceMapSourceInfo.tsFilePath = getRelativePathToFixedPath(sourceMapSourceInfo.sourceMapDirectory, tsFilePath);
            }
            return sourceMapSourceInfo;
        }
    }

    export class Indenter {
        static indentStep: number = 4;
        static indentStepString: string = "    ";
        static indentStrings: string[] = [];
        public indentAmt: number = 0;

        public increaseIndent() {
            this.indentAmt += Indenter.indentStep;
        }

        public decreaseIndent() {
            this.indentAmt -= Indenter.indentStep;
        }

        public getIndent() {
            var indentString = Indenter.indentStrings[this.indentAmt];
            if (indentString === undefined) {
                indentString = "";
                for (var i = 0; i < this.indentAmt; i = i + Indenter.indentStep) {
                    indentString += Indenter.indentStepString;
                }
                Indenter.indentStrings[this.indentAmt] = indentString;
            }
            return indentString;
        }
    }

    export interface BoundDeclInfo {
        boundDecl: BoundDecl;
        pullDecl: PullDecl;
    }

    export class Emitter {
        public globalThisCapturePrologueEmitted = false;
        public extendsPrologueEmitted = false;
        public thisClassNode: ClassDeclaration = null;
        public thisFunctionDeclaration: FunctionDeclaration = null;
        public moduleName = "";
        public emitState = new EmitState();
        public indenter = new Indenter();
        public modAliasId: string = null;
        public firstModAlias: string = null;
        public allSourceMappers: SourceMapper[] = [];
        public sourceMapper: SourceMapper = null;
        public captureThisStmtString = "var _this = this;";
        public varListCountStack: number[] = [0];
        private declStack: PullDecl[] = [];
        private resolvingContext = new PullTypeResolutionContext();
        private exportAssignmentIdentifier: string = null;

        public document: Document = null;
        private copyrightElement: AST = null;

        constructor(public emittingFileName: string,
            public outfile: ITextWriter,
            public emitOptions: EmitOptions,
            private semanticInfoChain: SemanticInfoChain) {
                globalSemanticInfoChain = semanticInfoChain;
                globalBinder.semanticInfoChain = semanticInfoChain;
        }

        private pushDecl(decl: PullDecl) {
            if (decl) {
                this.declStack[this.declStack.length] = decl;
            }
        }

        private popDecl(decl: PullDecl) {
            if (decl) {
                this.declStack.length--;
            }
        }

        private getEnclosingDecl() {
            var declStackLen = this.declStack.length;
            var enclosingDecl = declStackLen > 0 ? this.declStack[declStackLen - 1] : null;
            return enclosingDecl;
        }

        public setExportAssignmentIdentifier(id: string) {
            this.exportAssignmentIdentifier = id;
        }

        public getExportAssignmentIdentifier() {
            return this.exportAssignmentIdentifier;
        }

        public setDocument(document: Document) {
            this.document = document;
        }

        public importStatementShouldBeEmitted(importDeclAST: ImportDeclaration, unitPath?: string): boolean {
            var importDecl = this.semanticInfoChain.getDeclForAST(importDeclAST, this.document.fileName);
            var pullSymbol = <PullTypeAliasSymbol>importDecl.getSymbol();
            if (!importDeclAST.isExternalImportDeclaration()) { 
                if (pullSymbol.getExportAssignedValueSymbol()) {
                    return true;
                } 
                var containerSymbol = pullSymbol.getExportAssignedContainerSymbol();
                if (containerSymbol && containerSymbol.getInstanceSymbol()) {
                    return true;
                }
            }

            return pullSymbol.isUsedAsValue;
        }

        public emitImportDeclaration(importDeclAST: ImportDeclaration) {
            if (this.importStatementShouldBeEmitted(importDeclAST)) {
                var prevModAliasId = this.modAliasId;
                var prevFirstModAlias = this.firstModAlias;

                this.emitComments(importDeclAST, true);

                var importDecl = this.semanticInfoChain.getDeclForAST(importDeclAST, this.document.fileName);
                var importSymbol = <PullTypeAliasSymbol>importDecl.getSymbol();

                var parentSymbol = importSymbol.getContainer();
                var parentKind = parentSymbol ? parentSymbol.kind : PullElementKind.None;
                var associatedParentSymbol = parentSymbol ? parentSymbol.getAssociatedContainerType() : null;
                var associatedParentSymbolKind = associatedParentSymbol ? associatedParentSymbol.kind : PullElementKind.None;

                var needsPropertyAssignment = false;
                var usePropertyAssignmentInsteadOfVarDecl = false;
                var moduleNamePrefix: string;

                if (hasFlag(importDecl.flags, PullElementFlags.Exported) &&
                    (parentKind == PullElementKind.Container ||
                    parentKind === PullElementKind.DynamicModule ||
                    associatedParentSymbolKind === PullElementKind.Container ||
                    associatedParentSymbolKind === PullElementKind.DynamicModule)) {
                    if (importSymbol.getExportAssignedTypeSymbol() || importSymbol.getExportAssignedContainerSymbol()) {
                        // Type or container assignment that is exported
                        needsPropertyAssignment = true;
                    } else {
                        var valueSymbol = importSymbol.getExportAssignedValueSymbol();
                        if (valueSymbol &&
                            (valueSymbol.kind == PullElementKind.Method || valueSymbol.kind == PullElementKind.Function)) {
                            needsPropertyAssignment = true;
                        } else {
                            usePropertyAssignmentInsteadOfVarDecl = true;
                        }
                    }

                    // Calculate what name prefix to use
                    if (this.emitState.container === EmitContainer.DynamicModule) {
                        moduleNamePrefix = "exports."
                        }
                    else {
                        moduleNamePrefix = this.moduleName + ".";
                    }
                }

                this.recordSourceMappingStart(importDeclAST);
                if (usePropertyAssignmentInsteadOfVarDecl) {
                    this.writeToOutput(moduleNamePrefix);
                } else {
                    this.writeToOutput("var ");
                }
                this.writeToOutput(importDeclAST.id.actualText + " = ");
                this.modAliasId = importDeclAST.id.actualText;
                this.firstModAlias = importDeclAST.firstAliasedModToString();
                var aliasAST = importDeclAST.alias.nodeType() === NodeType.TypeRef ? (<TypeReference>importDeclAST.alias).term : importDeclAST.alias;

                this.emitJavascript(aliasAST, false);
                this.recordSourceMappingEnd(importDeclAST);
                this.writeToOutput(";");

                if (needsPropertyAssignment) {
                    this.writeLineToOutput("");
                    this.emitIndent();
                    this.recordSourceMappingStart(importDeclAST);
                    this.writeToOutput(moduleNamePrefix + importDeclAST.id.actualText + " = " + importDeclAST.id.actualText);
                    this.recordSourceMappingEnd(importDeclAST);
                    this.writeToOutput(";");
                }
                this.emitComments(importDeclAST, false);

                this.modAliasId = prevModAliasId;
                this.firstModAlias = prevFirstModAlias;
            }
        }

        public setSourceMappings(mapper: SourceMapper) {
            this.allSourceMappers.push(mapper);
            this.sourceMapper = mapper;
        }

        private updateLineAndColumn(s: string) {
            var lineNumbers = TextUtilities.parseLineStarts(TextFactory.createText(s));
            if (lineNumbers.length > 1) {
                // There are new lines in the string, update the line and column number accordingly
                this.emitState.line += lineNumbers.length - 1;
                this.emitState.column = s.length - lineNumbers[lineNumbers.length - 1];
            } else {
                // No new lines in the string
                this.emitState.column += s.length;
            }
        }

        public writeToOutput(s: string) {
            this.outfile.Write(s);
            this.updateLineAndColumn(s);
        }

        public writeToOutputTrimmable(s: string) {
            this.writeToOutput(s);
        }

        public writeLineToOutput(s: string) {
            this.outfile.WriteLine(s);
            this.updateLineAndColumn(s);
            this.emitState.column = 0;
            this.emitState.line++;
        }

        public writeCaptureThisStatement(ast: AST) {
            this.emitIndent();
            this.recordSourceMappingStart(ast);
            this.writeToOutput(this.captureThisStmtString);
            this.recordSourceMappingEnd(ast);
            this.writeLineToOutput("");
        }

        public setInVarBlock(count: number) {
            this.varListCountStack[this.varListCountStack.length - 1] = count;
        }

        public setContainer(c: number): number {
            var temp = this.emitState.container;
            this.emitState.container = c;
            return temp;
        }

        private getIndentString() {
            return this.indenter.getIndent();
        }

        public emitIndent() {
            this.writeToOutput(this.getIndentString());
        }

        public emitComment(comment: Comment) {
            if (this.emitOptions.compilationSettings.removeComments) {
                return;
            }

            var text = comment.getText();
            var emitColumn = this.emitState.column;

            if (emitColumn === 0) {
                this.emitIndent();
            }

            if (comment.isBlockComment) {
                this.recordSourceMappingStart(comment);
                this.writeToOutput(text[0]);

                if (text.length > 1 || comment.endsLine) {
                    for (var i = 1; i < text.length; i++) {
                        this.writeLineToOutput("");
                        this.emitIndent();
                        this.writeToOutput(text[i]);
                    }
                    this.recordSourceMappingEnd(comment);
                    this.writeLineToOutput("");
                    // Fall through
                } else {
                    this.recordSourceMappingEnd(comment);
                    this.writeToOutput(" ");
                    return;
                }
            }
            else {
                this.recordSourceMappingStart(comment);
                this.writeToOutput(text[0]);
                this.recordSourceMappingEnd(comment);
                this.writeLineToOutput("");
                // Fall through
            }

            if (emitColumn != 0) {
                // If we were indented before, stay indented after.
                this.emitIndent();
            }
        }

        public emitComments(ast: AST, pre: boolean) {
            var comments: Comment[];
            if (pre) {
                var preComments = ast.preComments();
                if (preComments && ast === this.copyrightElement) {
                    // We're emitting the comments for the first script element.  Skip any 
                    // copyright comments, as we'll already have emitted those.
                    var copyrightComments = this.getCopyrightComments();
                    comments = preComments.slice(copyrightComments.length);
                }
                else {
                    comments = preComments;
                }
            }
            else {
                comments = ast.postComments();
            }

            this.emitCommentsArray(comments);
        }

        public emitCommentsArray(comments: Comment[]): void {
            if (!this.emitOptions.compilationSettings.removeComments && comments) {
                for (var i = 0, n = comments.length; i < n; i++) {
                    this.emitComment(comments[i]);
                }
            }
        }

        public emitObjectLiteral(objectLiteral: UnaryExpression) {
            var useNewLines = !hasFlag(objectLiteral.getFlags(), ASTFlags.SingleLine);

            this.writeToOutput("{");
            var list = <ASTList>objectLiteral.operand;
            if (list.members.length > 0) {
                if (useNewLines) {
                    this.writeLineToOutput("");
                }
                else {
                    this.writeToOutput(" ");
                }

                this.indenter.increaseIndent();
                this.emitCommaSeparatedList(list, useNewLines);
                this.indenter.decreaseIndent();
                if (useNewLines) {
                    this.emitIndent();
                }
                else {
                    this.writeToOutput(" ");
                }
            }
            this.writeToOutput("}");
        }

        public emitArrayLiteral(arrayLiteral: UnaryExpression) {
            var useNewLines = !hasFlag(arrayLiteral.getFlags(), ASTFlags.SingleLine);

            this.writeToOutput("[");
            var list = <ASTList>arrayLiteral.operand;
            if (list.members.length > 0) {
                if (useNewLines) {
                    this.writeLineToOutput("");
                }

                this.indenter.increaseIndent();
                this.emitCommaSeparatedList(list, useNewLines);
                this.indenter.decreaseIndent();
                if (useNewLines) {
                    this.emitIndent();
                }
            }
            this.writeToOutput("]");
        }

        public emitNew(objectCreationExpression: ObjectCreationExpression, target: AST, args: ASTList) {
            this.writeToOutput("new ");
            if (target.nodeType() === NodeType.TypeRef) {
                var typeRef = <TypeReference>target;
                if (typeRef.arrayCount) {
                    this.writeToOutput("Array()");
                }
                else {
                    typeRef.term.emit(this);
                    this.writeToOutput("()");
                }
            }
            else {
                target.emit(this);
                this.recordSourceMappingStart(args);
                this.writeToOutput("(");
                this.emitCommaSeparatedList(args);
                this.recordSourceMappingStart(objectCreationExpression.closeParenSpan);
                this.writeToOutput(")");
                this.recordSourceMappingEnd(objectCreationExpression.closeParenSpan);
                this.recordSourceMappingEnd(args);
            }
        }

        public getVarDeclFromIdentifier(boundDeclInfo: BoundDeclInfo): BoundDeclInfo {
            CompilerDiagnostics.assert(boundDeclInfo.boundDecl && boundDeclInfo.boundDecl.init &&
                boundDeclInfo.boundDecl.init.nodeType() === NodeType.Name,
                "The init expression of bound declaration when emitting as constant has to be indentifier");

            var init = boundDeclInfo.boundDecl.init;
            var ident = <Identifier>init;

            var pullSymbol = this.semanticInfoChain.getSymbolForAST(boundDeclInfo.boundDecl, this.document.fileName);

            if (pullSymbol) {
                var pullDecls = pullSymbol.getDeclarations();
                if (pullDecls.length === 1) {
                    var pullDecl = pullDecls[0];
                    var ast = this.semanticInfoChain.getASTForDecl(pullDecl);
                    if (ast && ast.nodeType() === NodeType.VariableDeclarator) {
                        return { boundDecl: <VariableDeclarator>ast, pullDecl: pullDecl };
                    }
                }
            }

            return null;
        }

        public getConstantDecl(dotExpr: BinaryExpression): BoundDeclInfo {
            var pullSymbol = this.semanticInfoChain.getSymbolForAST(dotExpr, this.document.fileName);
            if (pullSymbol && pullSymbol.hasFlag(PullElementFlags.Constant)) {
                var pullDecls = pullSymbol.getDeclarations();
                if (pullDecls.length === 1) {
                    var pullDecl = pullDecls[0];
                    var ast = this.semanticInfoChain.getASTForDecl(pullDecl);
                    if (ast && ast.nodeType() === NodeType.VariableDeclarator) {
                        return { boundDecl: <VariableDeclarator>ast, pullDecl: pullDecl };
                    }
                }
            }

            return null;
        }

        public tryEmitConstant(dotExpr: BinaryExpression) {
            if (!this.emitOptions.compilationSettings.propagateEnumConstants) {
                return false;
            }
            var propertyName = <Identifier>dotExpr.operand2;
            var boundDeclInfo = this.getConstantDecl(dotExpr);
            if (boundDeclInfo) {
                var value = boundDeclInfo.boundDecl.constantValue;
                if (value !== null) {
                    this.writeToOutput(value.toString());
                    var comment = " /* ";
                    comment += propertyName.actualText;
                    comment += " */";
                    this.writeToOutput(comment);
                    return true;
                }
            }

            return false;
        }

        public emitCall(callNode: InvocationExpression, target: AST, args: ASTList) {
            if (!this.emitSuperCall(callNode)) {
                if (target.nodeType() === NodeType.FunctionDeclaration) {
                    this.writeToOutput("(");
                }
                if (callNode.target.nodeType() === NodeType.SuperExpression && this.emitState.container === EmitContainer.Constructor) {
                    this.writeToOutput("_super.call");
                }
                else {
                    this.emitJavascript(target, false);
                }
                if (target.nodeType() === NodeType.FunctionDeclaration) {
                    this.writeToOutput(")");
                }
                this.recordSourceMappingStart(args);
                this.writeToOutput("(");
                if (callNode.target.nodeType() === NodeType.SuperExpression && this.emitState.container === EmitContainer.Constructor) {
                    this.writeToOutput("this");
                    if (args && args.members.length) {
                        this.writeToOutput(", ");
                    }
                }
                this.emitCommaSeparatedList(args);
                this.recordSourceMappingStart(callNode.closeParenSpan);
                this.writeToOutput(")");
                this.recordSourceMappingEnd(callNode.closeParenSpan);
                this.recordSourceMappingEnd(args);
            }
        }

        public emitInnerFunction(funcDecl: FunctionDeclaration, printName: boolean, includePreComments = true) {

            /// REVIEW: The code below causes functions to get pushed to a newline in cases where they shouldn't
            /// such as: 
            ///     Foo.prototype.bar = 
            ///         function() {
            ///         };
            /// Once we start emitting comments, we should pull this code out to place on the outer context where the function
            /// is used.
            //if (funcDecl.preComments!=null && funcDecl.preComments.length>0) {
            //    this.writeLineToOutput("");
            //    this.increaseIndent();
            //    emitIndent();
            //}

            var pullDecl = this.semanticInfoChain.getDeclForAST(funcDecl, this.document.fileName);
            this.pushDecl(pullDecl);

            // We have no way of knowing if the current function is used as an expression or a statement, so as to enusre that the emitted
            // JavaScript is always valid, add an extra parentheses for unparenthesized function expressions
            var shouldParenthesize = false;// hasFlag(funcDecl.getFunctionFlags(), FunctionFlags.IsFunctionExpression) && !funcDecl.isAccessor() && (hasFlag(funcDecl.getFlags(), ASTFlags.ExplicitSemicolon) || hasFlag(funcDecl.getFlags(), ASTFlags.AutomaticSemicolon));

            if (includePreComments) {
                this.emitComments(funcDecl, true);
            }

            if (shouldParenthesize) {
                this.writeToOutput("(");
            }
            this.recordSourceMappingStart(funcDecl);
            var accessorSymbol = funcDecl.isAccessor() ? PullHelpers.getAccessorSymbol(funcDecl, this.semanticInfoChain, this.document.fileName) : null;
            var container = accessorSymbol ? accessorSymbol.getContainer() : null;
            var containerKind = container ? container.kind : PullElementKind.None;
            if (!(funcDecl.isAccessor() && containerKind !== PullElementKind.Class && containerKind !== PullElementKind.ConstructorType)) {
                this.writeToOutput("function ");
            }

            if (funcDecl.isConstructor) {
                this.writeToOutput(this.thisClassNode.name.actualText);
            }

            if (printName) {
                var id = funcDecl.getNameText();
                if (id && !funcDecl.isAccessor()) {
                    if (funcDecl.name) {
                        this.recordSourceMappingStart(funcDecl.name);
                    }
                    this.writeToOutput(id);
                    if (funcDecl.name) {
                        this.recordSourceMappingEnd(funcDecl.name);
                    }
                }
            }

            this.writeToOutput("(");
            var argsLen = 0;
            if (funcDecl.arguments) {
                this.emitComments(funcDecl.arguments, true);

                var tempContainer = this.setContainer(EmitContainer.Args);
                argsLen = funcDecl.arguments.members.length;
                var printLen = argsLen;
                if (funcDecl.variableArgList) {
                    printLen--;
                }
                for (var i = 0; i < printLen; i++) {
                    var arg = <Parameter>funcDecl.arguments.members[i];
                    arg.emit(this);

                    if (i < (printLen - 1)) {
                        this.writeToOutput(", ");
                    }
                }
                this.setContainer(tempContainer);

                this.emitComments(funcDecl.arguments, false);
            }
            this.writeLineToOutput(") {");

            if (funcDecl.isConstructor) {
                this.recordSourceMappingNameStart("constructor");
            } else if (funcDecl.isGetAccessor()) {
                this.recordSourceMappingNameStart("get_" + funcDecl.getNameText());
            } else if (funcDecl.isSetAccessor()) {
                this.recordSourceMappingNameStart("set_" + funcDecl.getNameText());
            } else {
                this.recordSourceMappingNameStart(funcDecl.getNameText());
            }
            this.indenter.increaseIndent();

            this.emitDefaultValueAssignments(funcDecl);
            this.emitRestParameterInitializer(funcDecl);

            if (this.shouldCaptureThis(funcDecl)) {
                this.writeCaptureThisStatement(funcDecl);
            }

            if (funcDecl.isConstructor) {
                this.emitConstructorStatements(funcDecl);
            }
            else {
                this.emitModuleElements(funcDecl.block.statements);
            }

            this.emitCommentsArray(funcDecl.block.closeBraceLeadingComments);

            this.indenter.decreaseIndent();
            this.emitIndent();
            this.recordSourceMappingStart(funcDecl.block.closeBraceSpan);
            this.writeToOutput("}");

            this.recordSourceMappingNameEnd();
            this.recordSourceMappingEnd(funcDecl.block.closeBraceSpan);
            this.recordSourceMappingEnd(funcDecl);

            if (shouldParenthesize) {
                this.writeToOutput(")");
            }

            // The extra call is to make sure the caller's funcDecl end is recorded, since caller wont be able to record it
            this.recordSourceMappingEnd(funcDecl);

            this.emitComments(funcDecl, false);

            this.popDecl(pullDecl);
        }

        private emitDefaultValueAssignments(funcDecl: FunctionDeclaration): void {
            var n = funcDecl.arguments.members.length;
            if (funcDecl.variableArgList) {
                n--;
            }

            for (var i = 0; i < n; i++) {
                var arg = <Parameter>funcDecl.arguments.members[i];
                if (arg.init) {
                    this.emitIndent();
                    this.recordSourceMappingStart(arg);
                    this.writeToOutput("if (typeof " + arg.id.actualText + " === \"undefined\") { ");//
                    this.recordSourceMappingStart(arg.id);
                    this.writeToOutput(arg.id.actualText);
                    this.recordSourceMappingEnd(arg.id);
                    this.writeToOutput(" = ");
                    this.emitJavascript(arg.init, false);
                    this.writeLineToOutput("; }");
                    this.recordSourceMappingEnd(arg);
                }
            }
        }

        private emitRestParameterInitializer(funcDecl: FunctionDeclaration): void  {
            if (funcDecl.variableArgList) {
                var n = funcDecl.arguments.members.length;
                var lastArg = <Parameter>funcDecl.arguments.members[n - 1];
                this.emitIndent();
                this.recordSourceMappingStart(lastArg);
                this.writeToOutput("var ");
                this.recordSourceMappingStart(lastArg.id);
                this.writeToOutput(lastArg.id.actualText);
                this.recordSourceMappingEnd(lastArg.id);
                this.writeLineToOutput(" = [];");
                this.recordSourceMappingEnd(lastArg);
                this.emitIndent();
                this.writeToOutput("for (");
                this.recordSourceMappingStart(lastArg);
                this.writeToOutput("var _i = 0;");
                this.recordSourceMappingEnd(lastArg);
                this.writeToOutput(" ");
                this.recordSourceMappingStart(lastArg);
                this.writeToOutput("_i < (arguments.length - " + (n - 1) + ")");
                this.recordSourceMappingEnd(lastArg);
                this.writeToOutput("; ");
                this.recordSourceMappingStart(lastArg);
                this.writeToOutput("_i++");
                this.recordSourceMappingEnd(lastArg);
                this.writeLineToOutput(") {");
                this.indenter.increaseIndent();
                this.emitIndent();

                this.recordSourceMappingStart(lastArg);
                this.writeToOutput(lastArg.id.actualText + "[_i] = arguments[_i + " + (n - 1) + "];");
                this.recordSourceMappingEnd(lastArg);
                this.writeLineToOutput("");
                this.indenter.decreaseIndent();
                this.emitIndent();
                this.writeLineToOutput("}");
            }
        }

        private getImportDecls(fileName: string): PullDecl[] {
            var semanticInfo = this.semanticInfoChain.getUnit(this.document.fileName);
            var result: PullDecl[] = [];

            var queue: PullDecl[] = semanticInfo.getTopLevelDecls();

            while (queue.length > 0) {
                var decl = queue.shift();

                if (decl.kind & PullElementKind.TypeAlias) {
                    var importStatementAST = <ImportDeclaration>semanticInfo.getASTForDecl(decl);
                    if (importStatementAST.alias.nodeType() === NodeType.Name) { // name or dynamic module name
                        var text = (<Identifier>importStatementAST.alias).actualText;
                        if (isQuoted(text)) { // dynamic module name (string literal)
                            var symbol = decl.getSymbol();
                            var typeSymbol = symbol && symbol.type;
                            if (typeSymbol && typeSymbol !== this.semanticInfoChain.anyTypeSymbol && !typeSymbol.isError()) {
                                result.push(decl);
                            }
                        }
                    }
                }

                // visit children
                queue = queue.concat(decl.getChildDecls());
            }

            return result;
        }

        public getModuleImportAndDependencyList(moduleDecl: ModuleDeclaration) {
            var importList = "";
            var dependencyList = "";

            var semanticInfo = this.semanticInfoChain.getUnit(this.document.fileName);
            var importDecls = this.getImportDecls(this.document.fileName);

            // all dependencies are quoted
            if (importDecls.length) {
                for (var i = 0; i < importDecls.length; i++) {
                    var importStatementDecl = importDecls[i];
                    var importStatementSymbol = <PullTypeAliasSymbol>importStatementDecl.getSymbol();
                    var importStatementAST = <ImportDeclaration>semanticInfo.getASTForDecl(importStatementDecl);

                    if (importStatementSymbol.isUsedAsValue) {
                        if (i <= importDecls.length - 1) {
                            dependencyList += ", ";
                            importList += ", ";
                        }

                        importList += "__" + importStatementDecl.name + "__";
                        dependencyList += importStatementAST.firstAliasedModToString();
                    }
                }
            }

            // emit any potential amd dependencies
            for (var i = 0; i < moduleDecl.amdDependencies.length; i++) {
                dependencyList += ", \"" + moduleDecl.amdDependencies[i] + "\"";
            }

            return {
                importList: importList,
                dependencyList: dependencyList
            };
        }

        public shouldCaptureThis(ast: AST) {
            if (ast.nodeType() === NodeType.Script) {
                var scriptDecl = this.semanticInfoChain.getUnit(this.document.fileName).getTopLevelDecls()[0];
                return (scriptDecl.flags & PullElementFlags.MustCaptureThis) === PullElementFlags.MustCaptureThis;
            }

            var decl = this.semanticInfoChain.getDeclForAST(ast, this.document.fileName);
            if (decl) {
                return (decl.flags & PullElementFlags.MustCaptureThis) === PullElementFlags.MustCaptureThis;
            }

            return false;
        }

        public emitModule(moduleDecl: ModuleDeclaration) {
            var pullDecl = this.semanticInfoChain.getDeclForAST(moduleDecl, this.document.fileName);
            this.pushDecl(pullDecl);

            var svModuleName = this.moduleName;
            this.moduleName = moduleDecl.name.actualText;
            if (isTSFile(this.moduleName )) {
                this.moduleName = this.moduleName.substring(0, this.moduleName.length - ".ts".length);
            }

            var isDynamicMod = hasFlag(moduleDecl.getModuleFlags(), ModuleFlags.IsDynamic);
            var prevOutFile = this.outfile;
            var prevOutFileName = this.emittingFileName;
            var prevAllSourceMappers = this.allSourceMappers;
            var prevSourceMapper = this.sourceMapper;
            var prevColumn = this.emitState.column;
            var prevLine = this.emitState.line;
            var temp = this.setContainer(EmitContainer.Module);
            var isExported = hasFlag(pullDecl.flags, PullElementFlags.Exported);
            var isWholeFile = hasFlag(moduleDecl.getModuleFlags(), ModuleFlags.IsWholeFile);

            // prologue
            if (isDynamicMod) {

                // if the external module has an "export =" identifier, we'll
                // set it in the ExportAssignment emit method
                this.setExportAssignmentIdentifier(null);
                this.setContainer(EmitContainer.DynamicModule); // discard the previous 'Module' container

                this.recordSourceMappingStart(moduleDecl);
                if (this.emitOptions.compilationSettings.moduleGenTarget === ModuleGenTarget.Asynchronous) { // AMD
                    var dependencyList = "[\"require\", \"exports\"";
                    var importList = "require, exports";

                    var importAndDependencyList = this.getModuleImportAndDependencyList(moduleDecl);
                    importList += importAndDependencyList.importList;
                    dependencyList += importAndDependencyList.dependencyList + "]";

                    this.writeLineToOutput("define(" + dependencyList + "," + " function(" + importList + ") {");
                }
            }
            else {
                if (!isExported) {
                    this.recordSourceMappingStart(moduleDecl);
                    this.writeToOutput("var ");
                    this.recordSourceMappingStart(moduleDecl.name);
                    this.writeToOutput(this.moduleName);
                    this.recordSourceMappingEnd(moduleDecl.name);
                    this.writeLineToOutput(";");
                    this.recordSourceMappingEnd(moduleDecl);
                    this.emitIndent();
                }

                this.writeToOutput("(");
                this.recordSourceMappingStart(moduleDecl);
                this.writeToOutput("function (");
                this.recordSourceMappingStart(moduleDecl.name);
                this.writeToOutput(this.moduleName);
                this.recordSourceMappingEnd(moduleDecl.name);
                this.writeLineToOutput(") {");
            }

            if (!isWholeFile) {
                this.recordSourceMappingNameStart(this.moduleName);
            }

            // body - don't indent for Node
            if (!isDynamicMod || this.emitOptions.compilationSettings.moduleGenTarget === ModuleGenTarget.Asynchronous) {
                this.indenter.increaseIndent();
            }

            if (this.shouldCaptureThis(moduleDecl)) {
                this.writeCaptureThisStatement(moduleDecl);
            }

            this.emitModuleElements(moduleDecl.members);
            if (!isDynamicMod || this.emitOptions.compilationSettings.moduleGenTarget === ModuleGenTarget.Asynchronous) {
                this.indenter.decreaseIndent();
            }
            this.emitIndent();

            // epilogue
            if (isDynamicMod) {
                var exportAssignmentIdentifier = this.getExportAssignmentIdentifier();
                var exportAssignmentValueSymbol = (<PullContainerTypeSymbol>pullDecl.getSymbol()).getExportAssignedValueSymbol();

                if (this.emitOptions.compilationSettings.moduleGenTarget === ModuleGenTarget.Asynchronous) { // AMD
                    if (exportAssignmentIdentifier && exportAssignmentValueSymbol && !(exportAssignmentValueSymbol.kind & PullElementKind.SomeTypeReference)) {
                        // indent was decreased for AMD above
                        this.indenter.increaseIndent();
                        this.emitIndent();
                        this.writeLineToOutput("return " + exportAssignmentIdentifier + ";");
                        this.indenter.decreaseIndent();
                    }
                    this.writeToOutput("});");
                }
                else if (exportAssignmentIdentifier && exportAssignmentValueSymbol && !(exportAssignmentValueSymbol.kind & PullElementKind.SomeTypeReference)) {
                    this.emitIndent();
                    this.writeLineToOutput("module.exports = " + exportAssignmentIdentifier + ";");
                }

                if (!isWholeFile) {
                    this.recordSourceMappingNameEnd();
                }
                this.recordSourceMappingEnd(moduleDecl);

                // close the module outfile, and restore the old one
                if (this.outfile !== prevOutFile) {
                    this.emitSourceMapsAndClose();
                    if (prevSourceMapper !== null) {
                        this.allSourceMappers = prevAllSourceMappers;
                        this.sourceMapper = prevSourceMapper;
                        this.emitState.column = prevColumn;
                        this.emitState.line = prevLine;
                    }
                    this.outfile = prevOutFile;
                    this.emittingFileName = prevOutFileName;
                }
            }
            else {
                var parentIsDynamic = temp === EmitContainer.DynamicModule;
                this.recordSourceMappingStart(moduleDecl.endingToken);
                if (temp === EmitContainer.Prog && isExported) {
                    this.writeToOutput("}");
                    if (!isWholeFile) {
                        this.recordSourceMappingNameEnd();
                    }
                    this.recordSourceMappingEnd(moduleDecl.endingToken);
                    this.writeToOutput(")(this." + this.moduleName + " || (this." + this.moduleName + " = {}));");
                }
                else if (isExported || temp === EmitContainer.Prog) {
                    var dotMod = svModuleName !== "" ? (parentIsDynamic ? "exports" : svModuleName) + "." : svModuleName;
                    this.writeToOutput("}");
                    if (!isWholeFile) {
                        this.recordSourceMappingNameEnd();
                    }
                    this.recordSourceMappingEnd(moduleDecl.endingToken);
                    this.writeToOutput(")(" + dotMod + this.moduleName + " || (" + dotMod + this.moduleName + " = {}));");
                }
                else if (!isExported && temp !== EmitContainer.Prog) {
                    this.writeToOutput("}");
                    if (!isWholeFile) {
                        this.recordSourceMappingNameEnd();
                    }
                    this.recordSourceMappingEnd(moduleDecl.endingToken);
                    this.writeToOutput(")(" + this.moduleName + " || (" + this.moduleName + " = {}));");
                }
                else {
                    this.writeToOutput("}");
                    if (!isWholeFile) {
                        this.recordSourceMappingNameEnd();
                    }
                    this.recordSourceMappingEnd(moduleDecl.endingToken);
                    this.writeToOutput(")();");
                }

                this.recordSourceMappingEnd(moduleDecl);
                if (temp !== EmitContainer.Prog && isExported) {
                    this.recordSourceMappingStart(moduleDecl);
                    if (parentIsDynamic) {
                        this.writeLineToOutput("");
                        this.emitIndent();
                        this.writeToOutput("var " + this.moduleName + " = exports." + this.moduleName + ";");
                    } else {
                        this.writeLineToOutput("");
                        this.emitIndent();
                        this.writeToOutput("var " + this.moduleName + " = " + svModuleName + "." + this.moduleName + ";");
                    }
                    this.recordSourceMappingEnd(moduleDecl);
                }
            }

            this.setContainer(temp);
            this.moduleName = svModuleName;

            this.popDecl(pullDecl);
        }

        public emitEnumElement(varDecl: VariableDeclarator): void {
            // <EnumName>[<EnumName>["<MemberName>"] = <MemberValue>] = "<MemberName>";
            this.emitComments(varDecl, true);
            this.recordSourceMappingStart(varDecl);
            var name = varDecl.id.actualText;
            var quoted = isQuoted(name);
            this.writeToOutput(this.moduleName);
            this.writeToOutput('[');
            this.writeToOutput(this.moduleName);
            this.writeToOutput('[');
            this.writeToOutput(quoted ? name : '"' + name + '"');
            this.writeToOutput('] = ');

            if (varDecl.init) {
                varDecl.init.emit(this);
            }
            else if (varDecl.constantValue !== null) {
                this.writeToOutput(varDecl.constantValue.toString());
            }
            else {
                this.writeToOutput("null");
            }

            this.writeToOutput('] = ');
            this.writeToOutput(quoted ? name : '"' + name + '"');
            this.recordSourceMappingEnd(varDecl);
            this.emitComments(varDecl, false);
            this.writeToOutput(';');
        }

        public emitIndex(operand1: AST, operand2: AST) {
            operand1.emit(this);
            this.writeToOutput("[");
            operand2.emit(this);
            this.writeToOutput("]");
        }

        public emitFunction(funcDecl: FunctionDeclaration) {
            if (hasFlag(funcDecl.getFunctionFlags(), FunctionFlags.Signature) /*|| funcDecl.isOverload*/) {
                return;
            }
            var temp: number;
            var tempFnc = this.thisFunctionDeclaration;
            this.thisFunctionDeclaration = funcDecl;

            if (funcDecl.isConstructor) {
                temp = this.setContainer(EmitContainer.Constructor);
            }
            else {
                temp = this.setContainer(EmitContainer.Function);
            }

            var funcName = funcDecl.getNameText();

            if (((temp !== EmitContainer.Constructor) ||
                ((funcDecl.getFunctionFlags() & FunctionFlags.Method) === FunctionFlags.None))) {
                this.recordSourceMappingStart(funcDecl);
                this.emitInnerFunction(funcDecl, (funcDecl.name && !funcDecl.name.isMissing()));
            }
            this.setContainer(temp);
            this.thisFunctionDeclaration = tempFnc;

            if (!hasFlag(funcDecl.getFunctionFlags(), FunctionFlags.Signature)) {
                var pullFunctionDecl = this.semanticInfoChain.getDeclForAST(funcDecl, this.document.fileName);
                if (hasFlag(funcDecl.getFunctionFlags(), FunctionFlags.Static)) {
                    if (this.thisClassNode) {
                        this.writeLineToOutput("");
                        if (funcDecl.isAccessor()) {
                            this.emitPropertyAccessor(funcDecl, this.thisClassNode.name.actualText, false);
                        }
                        else {
                            this.emitIndent();
                            this.recordSourceMappingStart(funcDecl);
                            this.writeToOutput(this.thisClassNode.name.actualText + "." + funcName + " = " + funcName + ";");
                            this.recordSourceMappingEnd(funcDecl);
                        }
                    }
                }
                else if ((this.emitState.container === EmitContainer.Module || this.emitState.container === EmitContainer.DynamicModule) && hasFlag(pullFunctionDecl.flags, PullElementFlags.Exported)) {
                    this.writeLineToOutput("");
                    this.emitIndent();
                    var modName = this.emitState.container === EmitContainer.Module ? this.moduleName : "exports";
                    this.recordSourceMappingStart(funcDecl);
                    this.writeToOutput(modName + "." + funcName + " = " + funcName + ";");
                    this.recordSourceMappingEnd(funcDecl);
                }
            }
        }

        public emitAmbientVarDecl(varDecl: VariableDeclarator) {
            if (varDecl.init) {
                this.emitComments(varDecl, true);
                this.recordSourceMappingStart(varDecl);
                this.recordSourceMappingStart(varDecl.id);
                this.writeToOutput(varDecl.id.actualText);
                this.recordSourceMappingEnd(varDecl.id);
                this.writeToOutput(" = ");
                this.emitJavascript(varDecl.init, false);
                this.recordSourceMappingEnd(varDecl);
                this.emitComments(varDecl, false);
            }
        }

        public varListCount(): number {
            return this.varListCountStack[this.varListCountStack.length - 1];
        }

        // Emits "var " if it is allowed
        public emitVarDeclVar() {
            // If it is var list of form var a, b, c = emit it only if count > 0 - which will be when emitting first var
            // If it is var list of form  var a = varList count will be 0
            if (this.varListCount() >= 0) {
                this.writeToOutput("var ");
                this.setInVarBlock(-this.varListCount());
            }
            return true;
        }

        public onEmitVar() {
            if (this.varListCount() > 0) {
                this.setInVarBlock(this.varListCount() - 1);
            }
            else if (this.varListCount() < 0) {
                this.setInVarBlock(this.varListCount() + 1);
            }
        }

        public emitVariableDeclaration(declaration: VariableDeclaration) {
            var varDecl = <VariableDeclarator>declaration.declarators.members[0];

            var symbol = this.semanticInfoChain.getSymbolForAST(varDecl, this.document.fileName);

            var parentSymbol = symbol ? symbol.getContainer() : null;
            var parentKind = parentSymbol ? parentSymbol.kind : PullElementKind.None;
            var inClass = parentKind === PullElementKind.Class;

            this.emitComments(declaration, true);
            this.recordSourceMappingStart(declaration);
            this.setInVarBlock(declaration.declarators.members.length);

            var pullVarDecl = this.semanticInfoChain.getDeclForAST(varDecl, this.document.fileName);
            var isAmbientWithoutInit = pullVarDecl && hasFlag(pullVarDecl.flags, PullElementFlags.Ambient) && varDecl.init === null;
            if (!isAmbientWithoutInit) {
                for (var i = 0, n = declaration.declarators.members.length; i < n; i++) {
                    var declarator = declaration.declarators.members[i];

                    if (i > 0) {
                        if (inClass) {
                            this.writeToOutputTrimmable(";");
                        }
                        else {
                            this.writeToOutputTrimmable(", ");
                        }
                    }

                    declarator.emit(this);
                }
            }

            this.recordSourceMappingEnd(declaration);
            this.emitComments(declaration, false);
        }

        public emitVariableDeclarator(varDecl: VariableDeclarator) {
            var pullDecl = this.semanticInfoChain.getDeclForAST(varDecl, this.document.fileName);
            this.pushDecl(pullDecl);
            if ((pullDecl.flags & PullElementFlags.Ambient) === PullElementFlags.Ambient) {
                this.emitAmbientVarDecl(varDecl);
                this.onEmitVar();
            }
            else {
                this.emitComments(varDecl, true);
                this.recordSourceMappingStart(varDecl);

                var symbol = this.semanticInfoChain.getSymbolForAST(varDecl, this.document.fileName);
                var parentSymbol = symbol ? symbol.getContainer() : null;
                var parentKind = parentSymbol ? parentSymbol.kind : PullElementKind.None;
                var associatedParentSymbol = parentSymbol ? parentSymbol.getAssociatedContainerType() : null;
                var associatedParentSymbolKind = associatedParentSymbol ? associatedParentSymbol.kind : PullElementKind.None;
                if (parentKind === PullElementKind.Class) {
                    // class
                    if (this.emitState.container !== EmitContainer.Args) {
                        if (varDecl.isStatic()) {
                            this.writeToOutput(parentSymbol.getName() + ".");
                        }
                        else {
                            this.writeToOutput("this.");
                        }
                    }
                }
                else if (PullHelpers.symbolIsModule(parentSymbol) || 
                    PullHelpers.symbolIsEnum(parentSymbol) || 
                    PullHelpers.symbolIsModule(associatedParentSymbol) || 
                    PullHelpers.symbolIsEnum(associatedParentSymbol) ||
                    parentKind === PullElementKind.DynamicModule ||
                    associatedParentSymbolKind === PullElementKind.DynamicModule) {
                    // module
                        if (!hasFlag(pullDecl.flags, PullElementFlags.Exported) && !varDecl.isProperty()) {
                        this.emitVarDeclVar();
                    }
                    else {
                        if (this.emitState.container === EmitContainer.DynamicModule) {
                            this.writeToOutput("exports.");
                        }
                        else {
                            this.writeToOutput(this.moduleName + ".");
                        }
                    }
                }
                else {
                    this.emitVarDeclVar();
                }

                this.recordSourceMappingStart(varDecl.id);
                this.writeToOutput(varDecl.id.actualText);
                this.recordSourceMappingEnd(varDecl.id);
                var hasInitializer = (varDecl.init !== null);
                if (hasInitializer) {
                    this.writeToOutputTrimmable(" = ");

                    // Ensure we have a fresh var list count when recursing into the variable 
                    // initializer.  We don't want our current list of variables to affect how we
                    // emit nested variable lists.
                    this.varListCountStack.push(0);
                    varDecl.init.emit(this);
                    this.varListCountStack.pop();
                }

                if (parentKind === PullElementKind.Class) {
                    // class
                    if (this.emitState.container !== EmitContainer.Args) {
                        this.writeToOutput(";");
                    }
                }

                this.onEmitVar();

                this.recordSourceMappingEnd(varDecl);
                this.emitComments(varDecl, false);
            }
            this.popDecl(pullDecl);
        }

        private symbolIsUsedInItsEnclosingContainer(symbol: PullSymbol, dynamic = false) {
            var symDecls = symbol.getDeclarations();

            if (symDecls.length) {
                var enclosingDecl = this.getEnclosingDecl();
                if (enclosingDecl) {
                    var parentDecl = symDecls[0].getParentDecl();
                    if (parentDecl) {
                        var symbolDeclarationEnclosingContainer = parentDecl;
                        var enclosingContainer = enclosingDecl;

                        // compute the closing container of the symbol's declaration
                        while (symbolDeclarationEnclosingContainer) {
                            if (symbolDeclarationEnclosingContainer.kind === (dynamic ? PullElementKind.DynamicModule : PullElementKind.Container)) {
                                break;
                            }
                            symbolDeclarationEnclosingContainer = symbolDeclarationEnclosingContainer.getParentDecl();
                        }

                        // if the symbol in question is not a global, compute the nearest
                        // enclosing declaration from the point of usage
                        if (symbolDeclarationEnclosingContainer) {
                            while (enclosingContainer) {
                                if (enclosingContainer.kind === (dynamic ? PullElementKind.DynamicModule : PullElementKind.Container)) {
                                    break;
                                }

                                enclosingContainer = enclosingContainer.getParentDecl();
                            }
                        }

                        if (symbolDeclarationEnclosingContainer && enclosingContainer) {
                            var same = symbolDeclarationEnclosingContainer === enclosingContainer;

                            // initialized module object variables are bound to their parent's decls
                            if (!same && symbol.hasFlag(PullElementFlags.InitializedModule)) {
                                same = symbolDeclarationEnclosingContainer === enclosingContainer.getParentDecl();
                            }

                            return same;
                        }
                    }
                }
            }

            return false;
        }

        public emitName(name: Identifier, addThis: boolean) {
            this.emitComments(name, true);
            this.recordSourceMappingStart(name);
            if (!name.isMissing()) {
                var pullSymbol = this.semanticInfoChain.getSymbolForAST(name, this.document.fileName);
                if (!pullSymbol) {
                    pullSymbol = this.semanticInfoChain.anyTypeSymbol;
                }
                var pullSymbolAlias = this.semanticInfoChain.getAliasSymbolForAST(name, this.document.fileName);
                if (pullSymbol && pullSymbolAlias) {
                    var symbolToCompare = this.resolvingContext.resolvingTypeReference ?
                        pullSymbolAlias.getExportAssignedTypeSymbol() :
                        pullSymbolAlias.getExportAssignedValueSymbol(); 

                    if (pullSymbol == symbolToCompare) {
                        pullSymbol = pullSymbolAlias;
                        pullSymbolAlias = null;
                    }
                }
                
                var pullSymbolKind = pullSymbol.kind;
                var isLocalAlias = pullSymbolAlias && (pullSymbolAlias.getDeclarations()[0].getParentDecl() == this.getEnclosingDecl());
                if (addThis && (this.emitState.container !== EmitContainer.Args) && pullSymbol) {
                    var pullSymbolContainer = pullSymbol.getContainer();

                    if (pullSymbolContainer) {
                        var pullSymbolContainerKind = pullSymbolContainer.kind;

                        if (pullSymbolContainerKind === PullElementKind.Class) {
                            if (pullSymbol.hasFlag(PullElementFlags.Static)) {
                                // This is static symbol
                                this.writeToOutput(pullSymbolContainer.getName() + ".");
                            }
                            else if (pullSymbolKind === PullElementKind.Property) {
                                this.emitThis();
                                this.writeToOutput(".");
                            }
                        }
                        else if (PullHelpers.symbolIsModule(pullSymbolContainer) || pullSymbolContainerKind === PullElementKind.Enum ||
                                 pullSymbolContainer.hasFlag(PullElementFlags.InitializedModule | PullElementFlags.InitializedEnum)) {
                            // If property or, say, a constructor being invoked locally within the module of its definition
                            if (pullSymbolKind === PullElementKind.Property || pullSymbolKind === PullElementKind.EnumMember) {
                                this.writeToOutput(pullSymbolContainer.getDisplayName() + ".");
                            }
                            else if (pullSymbol.hasFlag(PullElementFlags.Exported) &&
                                     pullSymbolKind === PullElementKind.Variable &&
                                !pullSymbol.hasFlag(PullElementFlags.InitializedModule | PullElementFlags.InitializedEnum)) {
                                this.writeToOutput(pullSymbolContainer.getDisplayName() + ".");
                            }
                            else if (pullSymbol.hasFlag(PullElementFlags.Exported) && !this.symbolIsUsedInItsEnclosingContainer(pullSymbol)) {
                                this.writeToOutput(pullSymbolContainer.getDisplayName() + ".");
                            }
                            // else if (pullSymbol.hasFlag(PullElementFlags.Exported) && 
                            //             pullSymbolKind !== PullElementKind.ConstructorMethod && 
                            //             !pullSymbol.hasFlag(PullElementFlags.ClassConstructorVariable)) {
                            //         this.writeToOutput(pullSymbolContainer.getName() + ".");
                            // }
                        }
                        else if (pullSymbolContainerKind === PullElementKind.DynamicModule ||
                                 pullSymbolContainer.hasFlag(PullElementFlags.InitializedDynamicModule)) {
                            if (pullSymbolKind === PullElementKind.Property) {
                                // If dynamic module
                                this.writeToOutput("exports.");
                            }
                            else if (pullSymbol.hasFlag(PullElementFlags.Exported) &&
                                     !isLocalAlias &&
                                     !pullSymbol.hasFlag(PullElementFlags.ImplicitVariable) &&
                                     pullSymbol.kind !== PullElementKind.ConstructorMethod &&
                                     pullSymbol.kind !== PullElementKind.Class &&
                                     pullSymbol.kind !== PullElementKind.Enum) {
                                this.writeToOutput("exports.");
                            }
                        }
                        else if (pullSymbolKind === PullElementKind.Property) {
                            if (pullSymbolContainer.kind === PullElementKind.Class) {
                                this.emitThis();
                                this.writeToOutput(".");
                            }
                        }
                        else {
                            var pullDecls = pullSymbol.getDeclarations();
                            var emitContainerName = true;
                            for (var i = 0; i < pullDecls.length; i++) {
                                if (pullDecls[i].getScriptName() === this.document.fileName) {
                                    emitContainerName = false;
                                }
                            }
                            if (emitContainerName) {
                                this.writeToOutput(pullSymbolContainer.getName() + ".");
                            }
                        }
                    }
                }

                // If it's a dynamic module, we need to print the "require" invocation
                if (pullSymbol && pullSymbolKind === PullElementKind.DynamicModule) {
                    if (this.emitOptions.compilationSettings.moduleGenTarget === ModuleGenTarget.Asynchronous) {
                        this.writeToOutput("__" + this.modAliasId + "__");
                    }
                    else {
                        var moduleDecl: ModuleDeclaration = <ModuleDeclaration>this.semanticInfoChain.getASTForSymbol(pullSymbol, this.document.fileName);
                        var modPath = name.actualText;
                        var isAmbient = pullSymbol.hasFlag(PullElementFlags.Ambient);
                        modPath = isAmbient ? modPath : this.firstModAlias ? this.firstModAlias : quoteBaseName(modPath);
                        modPath = isAmbient ? modPath : (!isRelative(stripQuotes(modPath)) ? quoteStr("./" + stripQuotes(modPath)) : modPath);
                        this.writeToOutput("require(" + modPath + ")");
                    }
                }
                else {
                    this.writeToOutput(name.actualText);
                }
            }

            this.recordSourceMappingEnd(name);
            this.emitComments(name, false);
        }

        public recordSourceMappingNameStart(name: string) {
            if (this.sourceMapper) {
                var finalName = name;
                if (!name) {
                    finalName = "";
                } else if (this.sourceMapper.currentNameIndex.length > 0) {
                    finalName = this.sourceMapper.names[this.sourceMapper.currentNameIndex[this.sourceMapper.currentNameIndex.length - 1]] + "." + name;
                }

                // We are currently not looking for duplicate but that is possible.
                this.sourceMapper.names.push(finalName);
                this.sourceMapper.currentNameIndex.push(this.sourceMapper.names.length - 1);
            }
        }

        public recordSourceMappingNameEnd() {
            if (this.sourceMapper) {
                this.sourceMapper.currentNameIndex.pop();
            }
        }

        public recordSourceMappingStart(ast: IASTSpan) {
            if (this.sourceMapper && isValidAstNode(ast)) {
                var lineCol = { line: -1, character: -1 };
                var sourceMapping = new SourceMapping();
                sourceMapping.start.emittedColumn = this.emitState.column;
                sourceMapping.start.emittedLine = this.emitState.line;
                // REVIEW: check time consumed by this binary search (about two per leaf statement)
                var lineMap = this.document.lineMap;
                lineMap.fillLineAndCharacterFromPosition(ast.minChar, lineCol);
                sourceMapping.start.sourceColumn = lineCol.character;
                sourceMapping.start.sourceLine = lineCol.line + 1;
                lineMap.fillLineAndCharacterFromPosition(ast.limChar, lineCol);
                sourceMapping.end.sourceColumn = lineCol.character;
                sourceMapping.end.sourceLine = lineCol.line + 1;
                if (this.sourceMapper.currentNameIndex.length > 0) {
                    sourceMapping.nameIndex = this.sourceMapper.currentNameIndex[this.sourceMapper.currentNameIndex.length - 1];
                }
                // Set parent and child relationship
                var siblings = this.sourceMapper.currentMappings[this.sourceMapper.currentMappings.length - 1];
                siblings.push(sourceMapping);
                this.sourceMapper.currentMappings.push(sourceMapping.childMappings);
            }
        }

        public recordSourceMappingEnd(ast: IASTSpan) {
            if (this.sourceMapper && isValidAstNode(ast)) {
                // Pop source mapping childs
                this.sourceMapper.currentMappings.pop();

                // Get the last source mapping from sibling list = which is the one we are recording end for
                var siblings = this.sourceMapper.currentMappings[this.sourceMapper.currentMappings.length - 1];
                var sourceMapping = siblings[siblings.length - 1];

                sourceMapping.end.emittedColumn = this.emitState.column;
                sourceMapping.end.emittedLine = this.emitState.line;
            }
        }

        // Note: may throw exception.
        public emitSourceMapsAndClose(): void {
            // Output a source mapping.  As long as we haven't gotten any errors yet.
            if (this.sourceMapper !== null) {
                SourceMapper.emitSourceMapping(this.allSourceMappers);
            }

            try {
                this.outfile.Close();
            }
            catch (e) {
                Emitter.throwEmitterError(e);
            }
        }

        private emitParameterPropertyAndMemberVariableAssignments(): void {
            // emit any parameter properties first
            var constructorDecl = this.thisClassNode.constructorDecl;

            if (constructorDecl && constructorDecl.arguments) {
                for (var i = 0, n = constructorDecl.arguments.members.length; i < n; i++) {
                    var arg = <BoundDecl>constructorDecl.arguments.members[i];
                    if ((arg.getVarFlags() & VariableFlags.Property) !== VariableFlags.None) {
                        this.emitIndent();
                        this.recordSourceMappingStart(arg);
                        this.recordSourceMappingStart(arg.id);
                        this.writeToOutput("this." + arg.id.actualText);
                        this.recordSourceMappingEnd(arg.id);
                        this.writeToOutput(" = ");
                        this.recordSourceMappingStart(arg.id);
                        this.writeToOutput(arg.id.actualText);
                        this.recordSourceMappingEnd(arg.id);
                        this.writeLineToOutput(";");
                        this.recordSourceMappingEnd(arg);
                    }
                }
            }

            for (var i = 0, n = this.thisClassNode.members.members.length; i < n; i++) {
                if (this.thisClassNode.members.members[i].nodeType() === NodeType.VariableDeclarator) {
                    var varDecl = <VariableDeclarator>this.thisClassNode.members.members[i];
                    if (!hasFlag(varDecl.getVarFlags(), VariableFlags.Static) && varDecl.init) {
                        this.emitIndent();
                        this.emitVariableDeclarator(varDecl);
                        this.writeLineToOutput("");
                    }
                }
            }
        }

        public emitCommaSeparatedList(list: ASTList, startLine: boolean = false): void {
            if (list === null) {
                return;
            }
            else {
                // this.emitComments(ast, true);
                    // this.emitComments(ast, false);

                for (var i = 0, n = list.members.length; i < n; i++) {
                    var emitNode = list.members[i];
                    this.emitJavascript(emitNode, startLine);

                    if (i < (n - 1)) {
                        this.writeToOutput(startLine ? "," : ", ");
                    }

                    if (startLine) {
                        this.writeLineToOutput("");
                    }
                }
            }
        }

        public emitModuleElements(list: ASTList) {
            if (list === null) {
                return;
            }

            this.emitComments(list, true);
            var lastEmittedNode: AST = null;

            for (var i = 0, n = list.members.length; i < n; i++) {
                var node = list.members[i];

                if (node.shouldEmit()) {
                    this.emitSpaceBetweenConstructs(lastEmittedNode, node);

                    this.emitJavascript(node, true);
                    this.writeLineToOutput("");

                    lastEmittedNode = node;
                }
            }

            this.emitComments(list, false);
        }

        private isDirectivePrologueElement(node: AST) {
            if (node.nodeType() === NodeType.ExpressionStatement) {
                var exprStatement = <ExpressionStatement>node;
                return exprStatement.expression.nodeType() === NodeType.StringLiteral;
            }

            return false;
        }

        // If these two constructs had more than one line between them originally, then emit at 
        // least one blank line between them.
        public emitSpaceBetweenConstructs(node1: AST, node2: AST): void {
            if (node1 === null || node2 === null) {
                return;
            }

            if (node1.minChar === -1 || node1.limChar === -1 || node2.minChar === -1 || node2.limChar === -1) {
                return;
            }

            var lineMap = this.document.lineMap;
            var node1EndLine = lineMap.getLineNumberFromPosition(node1.limChar);
            var node2StartLine = lineMap.getLineNumberFromPosition(node2.minChar);

            if ((node2StartLine - node1EndLine) > 1) {
                this.writeLineToOutput("");
            }
        }

        // We consider a sequence of comments to be a copyright header if there are no blank lines 
        // between them, and there is a blank line after the last one and the node they're attached 
        // to.
        private getCopyrightComments(): Comment[] {
            var preComments = this.copyrightElement.preComments();
            if (preComments) {
                var lineMap = this.document.lineMap;

                var copyrightComments: Comment[] = [];
                var lastComment: Comment = null;

                for (var i = 0, n = preComments.length; i < n; i++) {
                    var comment = preComments[i];

                    if (lastComment) {
                        var lastCommentLine = lineMap.getLineNumberFromPosition(lastComment.limChar);
                        var commentLine = lineMap.getLineNumberFromPosition(comment.minChar);

                        if (commentLine >= lastCommentLine + 2) {
                            // There was a blank line between the last comment and this comment.  This
                            // comment is not part of the copyright comments.  Return what we have so 
                            // far.
                            return copyrightComments;
                        }
                    }

                    copyrightComments.push(comment);
                    lastComment = comment;
                }

                // All comments look like they could have been part of the copyright header.  Make
                // sure there is at least one blank line between it and the node.  If not, it's not
                // a copyright header.
                var lastCommentLine = lineMap.getLineNumberFromPosition(ArrayUtilities.last(copyrightComments).limChar);
                var astLine = lineMap.getLineNumberFromPosition(this.copyrightElement.minChar);
                if (astLine >= lastCommentLine + 2) {
                    return copyrightComments;
                }
            }

            // No usable copyright comments found.
            return [];
        }

        private emitPossibleCopyrightHeaders(script: Script): void {
            var list = script.moduleElements;
            if (list.members.length > 0) {
                var firstElement = list.members[0];
                if (firstElement.nodeType() === NodeType.ModuleDeclaration) {
                    var moduleDeclaration = <ModuleDeclaration>firstElement;
                    if (moduleDeclaration.isWholeFile()) {
                        firstElement = moduleDeclaration.members.members[0];
                    }
                }

                this.copyrightElement = firstElement;
                this.emitCommentsArray(this.getCopyrightComments());
            }
        }

        public emitScriptElements(script: Script) {
            var list = script.moduleElements;

            this.emitPossibleCopyrightHeaders(script);

            // First, emit all the prologue elements.
            for (var i = 0, n = list.members.length; i < n; i++) {
                var node = list.members[i];

                if (!this.isDirectivePrologueElement(node)) {
                    break;
                }

                this.emitJavascript(node, true);
                this.writeLineToOutput("");
            }

            // Now emit __extends or a _this capture if necessary.
            this.emitPrologue(script);
            var lastEmittedNode: AST = null;

                // Now emit the rest of the script elements
            for (; i < n; i++) {
                var node = list.members[i];

                if (node.shouldEmit()) {
                    this.emitSpaceBetweenConstructs(lastEmittedNode, node);

                    this.emitJavascript(node, true);
                    this.writeLineToOutput("");

                    lastEmittedNode = node;
                }
            }
        }

        public emitConstructorStatements(funcDecl: FunctionDeclaration) {
            var list = funcDecl.block.statements;

            if (list === null) {
                return;
            }

            this.emitComments(list, true);

            var emitPropertyAssignmentsAfterSuperCall = this.thisClassNode.extendsList && this.thisClassNode.extendsList.members.length > 0;
            var propertyAssignmentIndex = emitPropertyAssignmentsAfterSuperCall ? 1 : 0;
            var lastEmittedNode: AST = null;

            for (var i = 0, n = list.members.length; i < n; i++) {
                // In some circumstances, class property initializers must be emitted immediately after the 'super' constructor
                // call which, in these cases, must be the first statement in the constructor body
                if (i === propertyAssignmentIndex) {
                    this.emitParameterPropertyAndMemberVariableAssignments();
                }

                var node = list.members[i];

                if (node.shouldEmit()) {
                    this.emitSpaceBetweenConstructs(lastEmittedNode, node);

                    this.emitJavascript(node, true);
                    this.writeLineToOutput("");

                    lastEmittedNode = node;
                }
            }

            if (i === propertyAssignmentIndex) {
                this.emitParameterPropertyAndMemberVariableAssignments();
            }

            this.emitComments(list, false);
        }

        // tokenId is the id the preceding token
        public emitJavascript(ast: AST, startLine: boolean) {
            if (ast === null) {
                return;
            }

            if (startLine &&
                this.indenter.indentAmt > 0) {

                this.emitIndent();
            }

            ast.emit(this);
        }

        public emitPropertyAccessor(funcDecl: FunctionDeclaration, className: string, isProto: boolean) {
            if (!hasFlag(funcDecl.getFunctionFlags(), FunctionFlags.GetAccessor)) {
                var accessorSymbol = PullHelpers.getAccessorSymbol(funcDecl, this.semanticInfoChain, this.document.fileName);
                if (accessorSymbol.getGetter()) {
                    return;
                }
            }

            this.emitIndent();
            this.recordSourceMappingStart(funcDecl);
            this.writeLineToOutput("Object.defineProperty(" + className + (isProto ? ".prototype, \"" : ", \"") + funcDecl.name.actualText + "\"" + ", {");
            this.indenter.increaseIndent();

            var accessors = PullHelpers.getGetterAndSetterFunction(funcDecl, this.semanticInfoChain, this.document.fileName);
            if (accessors.getter) {
                this.emitIndent();
                this.recordSourceMappingStart(accessors.getter);
                this.writeToOutput("get: ");
                this.emitInnerFunction(accessors.getter, false);
                this.writeLineToOutput(",");
            }

            if (accessors.setter) {
                this.emitIndent();
                this.recordSourceMappingStart(accessors.setter);
                this.writeToOutput("set: ");
                this.emitInnerFunction(accessors.setter, false);
                this.writeLineToOutput(",");
            }

            this.emitIndent();
            this.writeLineToOutput("enumerable: true,");
            this.emitIndent();
            this.writeLineToOutput("configurable: true");
            this.indenter.decreaseIndent();
            this.emitIndent();
            this.writeLineToOutput("});");
            this.recordSourceMappingEnd(funcDecl);
        }

        public emitPrototypeMember(funcDecl: FunctionDeclaration, className: string) {
            if (funcDecl.isAccessor()) {
                this.emitPropertyAccessor(funcDecl, className, true);
            }
            else {
                this.emitIndent();
                this.recordSourceMappingStart(funcDecl);
                this.emitComments(funcDecl, true);
                this.writeToOutput(className + ".prototype." + funcDecl.getNameText() + " = ");
                this.emitInnerFunction(funcDecl, /*printName:*/ false, /*includePreComments:*/ false);
                this.writeLineToOutput(";");
            }
        }

        public emitClass(classDecl: ClassDeclaration) {
            var pullDecl = this.semanticInfoChain.getDeclForAST(classDecl, this.document.fileName);
            this.pushDecl(pullDecl);

            var svClassNode = this.thisClassNode;
            this.thisClassNode = classDecl;
            var className = classDecl.name.actualText;
            this.emitComments(classDecl, true);
            var temp = this.setContainer(EmitContainer.Class);

            this.recordSourceMappingStart(classDecl);
            this.writeToOutput("var " + className);

            var hasBaseClass = classDecl.extendsList && classDecl.extendsList.members.length;
            var baseNameDecl: AST = null;
            var baseName: AST = null;
            var varDecl: VariableDeclarator = null;

            if (hasBaseClass) {
                this.writeLineToOutput(" = (function (_super) {");
            } else {
                this.writeLineToOutput(" = (function () {");
            }

            this.recordSourceMappingNameStart(className);
            this.indenter.increaseIndent();

            if (hasBaseClass) {
                baseNameDecl = classDecl.extendsList.members[0];
                baseName = baseNameDecl.nodeType() === NodeType.InvocationExpression ? (<InvocationExpression>baseNameDecl).target : baseNameDecl;
                this.emitIndent();
                this.writeLineToOutput("__extends(" + className + ", _super);");
            }

            this.emitIndent();

            var constrDecl = classDecl.constructorDecl;

            // output constructor
            if (constrDecl) {
                // declared constructor
                constrDecl.emit(this);
                this.writeLineToOutput("");
            }
            else {
                this.recordSourceMappingStart(classDecl);
                // default constructor
                this.indenter.increaseIndent();
                this.writeLineToOutput("function " + classDecl.name.actualText + "() {");
                this.recordSourceMappingNameStart("constructor");
                if (hasBaseClass) {
                    this.emitIndent();
                    this.writeLineToOutput("_super.apply(this, arguments);");
                }

                if (this.shouldCaptureThis(classDecl)) {
                    this.writeCaptureThisStatement(classDecl);
                }

                this.emitParameterPropertyAndMemberVariableAssignments();

                this.indenter.decreaseIndent();
                this.emitIndent();
                this.writeLineToOutput("}");

                this.recordSourceMappingNameEnd();
                this.recordSourceMappingEnd(classDecl);
            }

            this.emitClassMembers(classDecl);

            this.emitIndent();
            this.recordSourceMappingStart(classDecl.endingToken);
            this.writeLineToOutput("return " + className + ";");
            this.recordSourceMappingEnd(classDecl.endingToken);
            this.indenter.decreaseIndent();
            this.emitIndent();
            this.recordSourceMappingStart(classDecl.endingToken);
            this.writeToOutput("}");
            this.recordSourceMappingNameEnd();
            this.recordSourceMappingEnd(classDecl.endingToken);
            this.recordSourceMappingStart(classDecl);
            this.writeToOutput(")(");
            if (hasBaseClass) {
                this.resolvingContext.resolvingTypeReference = true;
                this.emitJavascript(baseName, false);
                this.resolvingContext.resolvingTypeReference = false;
            }
            this.writeToOutput(");");
            this.recordSourceMappingEnd(classDecl);

            if ((temp === EmitContainer.Module || temp === EmitContainer.DynamicModule) && hasFlag(pullDecl.flags, PullElementFlags.Exported)) {
                this.writeLineToOutput("");
                this.emitIndent();
                var modName = temp === EmitContainer.Module ? this.moduleName : "exports";
                this.recordSourceMappingStart(classDecl);
                this.writeToOutput(modName + "." + className + " = " + className + ";");
                this.recordSourceMappingEnd(classDecl);
            }

            this.recordSourceMappingEnd(classDecl);
            this.emitComments(classDecl, false);
            this.setContainer(temp);
            this.thisClassNode = svClassNode;

            this.popDecl(pullDecl);
        }

        private emitClassMembers(classDecl: ClassDeclaration): void {
            // First, emit all the functions.
            var lastEmittedMember: AST = null;

            for (var i = 0, n = classDecl.members.members.length; i < n; i++) {
                var memberDecl = classDecl.members.members[i];

                if (memberDecl.nodeType() === NodeType.FunctionDeclaration) {
                    var fn = <FunctionDeclaration>memberDecl;

                    if (hasFlag(fn.getFunctionFlags(), FunctionFlags.Method) && !fn.isSignature()) {
                        this.emitSpaceBetweenConstructs(lastEmittedMember, fn);

                        if (!hasFlag(fn.getFunctionFlags(), FunctionFlags.Static)) {
                            this.emitPrototypeMember(fn, classDecl.name.actualText);
                        }
                        else { // static functions
                            if (fn.isAccessor()) {
                                this.emitPropertyAccessor(fn, this.thisClassNode.name.actualText, false);
                            }
                            else {
                                this.emitIndent();
                                this.recordSourceMappingStart(fn);
                                this.writeToOutput(classDecl.name.actualText + "." + fn.name.actualText + " = ");
                                this.emitInnerFunction(fn, /*printName:*/ false);
                                this.writeLineToOutput(";");
                            }
                        }

                        lastEmittedMember = fn;
                    }
                }
            }

            // Now emit all the statics.
            for (var i = 0, n = classDecl.members.members.length; i < n; i++) {
                var memberDecl = classDecl.members.members[i];

                if (memberDecl.nodeType() === NodeType.VariableDeclarator) {
                    var varDecl = <VariableDeclarator>memberDecl;

                    if (hasFlag(varDecl.getVarFlags(), VariableFlags.Static) && varDecl.init) {
                        this.emitSpaceBetweenConstructs(lastEmittedMember, varDecl);

                        this.emitIndent();
                        this.recordSourceMappingStart(varDecl);
                        this.writeToOutput(classDecl.name.actualText + "." + varDecl.id.actualText + " = ");
                        varDecl.init.emit(this);

                        this.writeLineToOutput(";");
                        this.recordSourceMappingEnd(varDecl);

                        lastEmittedMember = varDecl;
                    }
                }
            }
        }

        private requiresExtendsBlock(moduleElements: ASTList): boolean {
            for (var i = 0, n = moduleElements.members.length; i < n; i++) {
                var moduleElement = moduleElements.members[i];

                if (moduleElement.nodeType() === NodeType.ModuleDeclaration) {
                    if (this.requiresExtendsBlock((<ModuleDeclaration>moduleElement).members)) {
                        return true;
                    }
                }
                else if (moduleElement.nodeType() === NodeType.ClassDeclaration) {
                    var classDeclaration = <ClassDeclaration>moduleElement;

                    if (classDeclaration.extendsList && classDeclaration.extendsList.members.length > 0) {
                        return true;
                    }
                }
            }

            return false;
        }

        public emitPrologue(script: Script) {
            if (!this.extendsPrologueEmitted) {
                if (this.requiresExtendsBlock(script.moduleElements)) {
                    this.extendsPrologueEmitted = true;
                    this.writeLineToOutput("var __extends = this.__extends || function (d, b) {");
                    this.writeLineToOutput("    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];");
                    this.writeLineToOutput("    function __() { this.constructor = d; }");
                    this.writeLineToOutput("    __.prototype = b.prototype;");
                    this.writeLineToOutput("    d.prototype = new __();");
                    this.writeLineToOutput("};");
                }
            }

            if (!this.globalThisCapturePrologueEmitted) {
                if (this.shouldCaptureThis(script)) {
                    this.globalThisCapturePrologueEmitted = true;
                    this.writeLineToOutput(this.captureThisStmtString);
                }
            }
        }

        public emitSuperReference() {
            this.writeToOutput("_super.prototype");
        }

        public emitSuperCall(callEx: InvocationExpression): boolean {
            if (callEx.target.nodeType() === NodeType.MemberAccessExpression) {
                var dotNode = <BinaryExpression>callEx.target;
                if (dotNode.operand1.nodeType() === NodeType.SuperExpression) {
                    dotNode.emit(this);
                    this.writeToOutput(".call(");
                    this.emitThis();
                    if (callEx.arguments && callEx.arguments.members.length > 0) {
                        this.writeToOutput(", ");
                        this.emitCommaSeparatedList(callEx.arguments);
                    }
                    this.writeToOutput(")");
                    return true;
                }
            }
            return false;
        }

        public emitThis() {
            if (this.thisFunctionDeclaration && !this.thisFunctionDeclaration.isMethod() && (!this.thisFunctionDeclaration.isConstructor)) {
                this.writeToOutput("_this");
            }
            else {
                this.writeToOutput("this");
            }
        }

        public emitBlockOrStatement(node: AST): void {
            if (node.nodeType() === NodeType.Block) {
                node.emit(this);
            }
            else {
                this.writeLineToOutput("");
                this.indenter.increaseIndent();
                this.emitJavascript(node, true);
                this.indenter.decreaseIndent();
            }
        }

        public static throwEmitterError(e: Error): void {
            var error: any = new Error(e.message);
            error.isEmitterError = true;
            throw error;
        }

        public static handleEmitterError(fileName: string, e: Error): Diagnostic[] {
            if ((<any>e).isEmitterError === true) {
                return [new Diagnostic(fileName, 0, 0, DiagnosticCode.Emit_Error_0, [e.message])];
            }

            throw e;
        }
    }
}