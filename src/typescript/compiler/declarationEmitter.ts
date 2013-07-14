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
    export class TextWriter implements ITextWriter {
        private contents = "";
        public onNewLine = true;
        constructor(private ioHost: EmitterIOHost, private path: string, private writeByteOrderMark: boolean) {
        }

        public Write(s: string) {
            this.contents += s;
            this.onNewLine = false;
        }

        public WriteLine(s: string) {
            this.contents += s;
            this.contents += "\r\n";
            this.onNewLine = true;
        }

        public Close() {
            try {
                this.ioHost.writeFile(this.path, this.contents, this.writeByteOrderMark);
            }
            catch (e) {
                Emitter.throwEmitterError(e);
            }
        }
    }
    
    export class DeclarationEmitter implements AstWalkerWithDetailCallback.AstWalkerDetailCallback {
        public fileName: string = null;
        private declFile: TextWriter = null;
        private indenter = new Indenter();
        private declarationContainerStack: AST[] = [];
        private isDottedModuleName: boolean[] = [];
        private dottedModuleEmit: string;
        private ignoreCallbackAst: AST = null;
        private singleDeclFile: TextWriter = null;
        private varListCount: number = 0;

        constructor(private emittingFileName: string,
                    private semanticInfoChain: SemanticInfoChain,
                    public emitOptions: EmitOptions,
                    private writeByteOrderMark: boolean) {
            this.declFile = new TextWriter(emitOptions.ioHost, emittingFileName, writeByteOrderMark);
        }

        public widenType(type: PullTypeSymbol) {
            if (type === this.semanticInfoChain.undefinedTypeSymbol || type === this.semanticInfoChain.nullTypeSymbol) {
                return this.semanticInfoChain.anyTypeSymbol;
            }

            return type;
        }

        public close() {
            try {
                this.declFile.Close();
            }
            catch (e) {
                Emitter.throwEmitterError(e);
            }
        }

        public emitDeclarations(script: TypeScript.Script): void {
            AstWalkerWithDetailCallback.walk(script, this);
        }

        public getAstDeclarationContainer() {
            return this.declarationContainerStack[this.declarationContainerStack.length - 1];
        }

        private emitDottedModuleName() {
            return (this.isDottedModuleName.length === 0) ? false : this.isDottedModuleName[this.isDottedModuleName.length - 1];
        }

        private getIndentString(declIndent = false) {
            if (this.emitOptions.compilationSettings.minWhitespace) {
                return "";
            }
            else {
                return this.indenter.getIndent();
            }
        }

        private emitIndent() {
            this.declFile.Write(this.getIndentString());
        }

        private canEmitSignature(declFlags: DeclFlags, declAST: AST, canEmitGlobalAmbientDecl: boolean = true, useDeclarationContainerTop: boolean = true) {
            var container: AST;
            if (useDeclarationContainerTop) {
                container = this.getAstDeclarationContainer();
            }
            else {
                container = this.declarationContainerStack[this.declarationContainerStack.length - 2];
            }

            if (container.nodeType === NodeType.ModuleDeclaration && !hasFlag(declFlags, DeclFlags.Exported)) {
                var declSymbol = this.semanticInfoChain.getSymbolAndDiagnosticsForAST(declAST, this.fileName).symbol;
                return declSymbol && declSymbol.isExternallyVisible();
            }

            if (!canEmitGlobalAmbientDecl && container.nodeType === NodeType.Script && hasFlag(declFlags, DeclFlags.Ambient)) {
                return false;
            }

            return true;
        }

        private canEmitPrePostAstSignature(declFlags: DeclFlags, astWithPrePostCallback: AST, preCallback: boolean) {
            if (this.ignoreCallbackAst) {
                CompilerDiagnostics.assert(this.ignoreCallbackAst !== astWithPrePostCallback, "Ignore Callback AST mismatch");
                this.ignoreCallbackAst = null;
                return false;
            }
            else if (preCallback &&
                !this.canEmitSignature(declFlags, astWithPrePostCallback, true, preCallback)) {
                this.ignoreCallbackAst = astWithPrePostCallback;
                return false;
            }

            return true;
        }

        private getDeclFlagsString(declFlags: DeclFlags, typeString: string) {
            var result = this.getIndentString();

            // Static/public/private/global declare
            if (hasFlag(declFlags, DeclFlags.Static)) {
                if (hasFlag(declFlags, DeclFlags.Private)) {
                    result += "private ";
                }
                result += "static ";
            }
            else {
                if (hasFlag(declFlags, DeclFlags.Private)) {
                    result += "private ";
                }
                else if (hasFlag(declFlags, DeclFlags.Public)) {
                    result += "public ";
                }
                else {
                    var emitDeclare = !hasFlag(declFlags, DeclFlags.Exported);

                    // Emit export only for global export statements. 
                    // The container for this would be dynamic module which is whole file
                    var container = this.getAstDeclarationContainer();
                    if (container.nodeType === NodeType.ModuleDeclaration &&
                        hasFlag((<ModuleDeclaration>container).getModuleFlags(), ModuleFlags.IsWholeFile) &&
                        hasFlag(declFlags, DeclFlags.Exported)) {
                        result += "export ";
                        emitDeclare = true;
                    }

                    // Emit declare if not interface declaration && is not from module
                    if (emitDeclare && typeString !== "interface") {
                        result += "declare ";
                    }

                    result += typeString + " ";
                }
            }

            return result;
        }

        private emitDeclFlags(declFlags: DeclFlags, typeString: string) {
            this.declFile.Write(this.getDeclFlagsString(declFlags, typeString));
        }

        private canEmitTypeAnnotationSignature(declFlag: DeclFlags = DeclFlags.None) {
            // Private declaration, shouldnt emit type any time.
            return !hasFlag(declFlag, DeclFlags.Private);
        }

        private pushDeclarationContainer(ast: AST) {
            this.declarationContainerStack.push(ast);
        }

        private popDeclarationContainer(ast: AST) {
            CompilerDiagnostics.assert(ast !== this.getAstDeclarationContainer(), 'Declaration container mismatch');
            this.declarationContainerStack.pop();
        }

        public emitTypeNamesMember(memberName: MemberName, emitIndent: boolean = false) {
            if (memberName.prefix === "{ ") {
                if (emitIndent) {
                    this.emitIndent();
                }

                this.declFile.WriteLine("{");
                this.indenter.increaseIndent();
                emitIndent = true;
            }
            else if (memberName.prefix !== "") {
                if (emitIndent) {
                    this.emitIndent();
                }

                this.declFile.Write(memberName.prefix);
                emitIndent = false;
            }

            if (memberName.isString()) {
                if (emitIndent) {
                    this.emitIndent();
                }

                this.declFile.Write((<MemberNameString>memberName).text);
            }
            else if (memberName.isArray()) {
                var ar = <MemberNameArray>memberName;
                for (var index = 0; index < ar.entries.length; index++) {
                    this.emitTypeNamesMember(ar.entries[index], emitIndent);
                    if (ar.delim === "; ") {
                        this.declFile.WriteLine(";");
                    }
                }
            }

            if (memberName.suffix === "}") {
                this.indenter.decreaseIndent();
                this.emitIndent();
                this.declFile.Write(memberName.suffix);
            }
            else {
                this.declFile.Write(memberName.suffix);
            }
        }

        private emitTypeSignature(type: PullTypeSymbol) {
            var declarationContainerAst = this.getAstDeclarationContainer();
            var declarationContainerDecl = this.semanticInfoChain.getDeclForAST(declarationContainerAst, this.fileName);
            var declarationPullSymbol = declarationContainerDecl.getSymbol();
            var typeNameMembers = type.getScopedNameEx(declarationPullSymbol);
            this.emitTypeNamesMember(typeNameMembers);
        }

        private emitComment(comment: Comment) {
            var text = comment.getText();
            if (this.declFile.onNewLine) {
                this.emitIndent();
            }
            else if (!comment.isBlockComment) {
                this.declFile.WriteLine("");
                this.emitIndent();
            }
            
            this.declFile.Write(text[0]);

            for (var i = 1; i < text.length; i++) {
                this.declFile.WriteLine("");
                this.emitIndent();
                this.declFile.Write(text[i]);
            }

            if (comment.endsLine || !comment.isBlockComment) {
                this.declFile.WriteLine("");
            }
            else {
                this.declFile.Write(" ");
            }
        }

        private emitDeclarationComments(ast: AST, endLine?: boolean);
        private emitDeclarationComments(astOrSymbol, endLine = true) {
            if (!this.emitOptions.compilationSettings.emitComments) {
                return;
            }

            var declComments = <Comment[]>astOrSymbol.getDocComments();
            this.writeDeclarationComments(declComments, endLine);
        }

        public writeDeclarationComments(declComments: Comment[], endLine = true) {
            if (declComments.length > 0) {
                for (var i = 0; i < declComments.length; i++) {
                    this.emitComment(declComments[i]);
                }

                if (endLine) {
                    if (!this.declFile.onNewLine) {
                        this.declFile.WriteLine("");
                    }
                }
                else {
                    if (this.declFile.onNewLine) {
                        this.emitIndent();
                    }
                }
            }
        }

        public emitTypeOfBoundDecl(boundDecl: BoundDecl) {
            var decl = this.semanticInfoChain.getDeclForAST(boundDecl, this.fileName);
            var pullSymbol = decl.getSymbol();
            var type = this.widenType(pullSymbol.getType());
            if (!type) {
                // PULLTODO
                return;
            }

            if (boundDecl.typeExpr || // Specified type expression
                (boundDecl.init && type !== this.semanticInfoChain.anyTypeSymbol)) { // Not infered any
                this.declFile.Write(": ");
                this.emitTypeSignature(type);
            }
        }

        public VariableDeclaratorCallback(pre: boolean, varDecl: VariableDeclarator): boolean {
            if (pre && this.canEmitSignature(ToDeclFlags(varDecl.getVarFlags()), varDecl, false)) {
                var interfaceMember = (this.getAstDeclarationContainer().nodeType === NodeType.InterfaceDeclaration);
                this.emitDeclarationComments(varDecl);
                if (!interfaceMember) {
                    // If it is var list of form var a, b, c = emit it only if count > 0 - which will be when emitting first var
                    // If it is var list of form  var a = varList count will be 0
                    if (this.varListCount >= 0) {
                        this.emitDeclFlags(ToDeclFlags(varDecl.getVarFlags()), "var");
                        this.varListCount = -this.varListCount;
                    }

                    this.declFile.Write(varDecl.id.actualText);
                }
                else {
                    this.emitIndent();
                    this.declFile.Write(varDecl.id.actualText);
                    if (hasFlag(varDecl.id.getFlags(), ASTFlags.OptionalName)) {
                        this.declFile.Write("?");
                    }
                }

                if (this.canEmitTypeAnnotationSignature(ToDeclFlags(varDecl.getVarFlags()))) {
                    this.emitTypeOfBoundDecl(varDecl);
                }

                // emitted one var decl
                if (this.varListCount > 0) {
                    this.varListCount--;
                }
                else if (this.varListCount < 0) {
                    this.varListCount++;
                }

                // Write ; or ,
                if (this.varListCount < 0) {
                    this.declFile.Write(", ");
                }
                else {
                    this.declFile.WriteLine(";");
                }
            }
            return false;
        }

        public BlockCallback(pre: boolean, block: Block): boolean {
            return false;
        }

        public VariableStatementCallback(pre: boolean, variableDeclaration: VariableDeclaration): boolean {
            return true;
        }

        public VariableDeclarationCallback(pre: boolean, variableDeclaration: VariableDeclaration): boolean {
            if (pre) {
                this.varListCount = variableDeclaration.declarators.members.length;
            }
            else {
                this.varListCount = 0;
            }
            return true;
        }

        private emitArgDecl(argDecl: Parameter, funcDecl: FunctionDeclaration) {
            this.indenter.increaseIndent();

            this.emitDeclarationComments(argDecl, false);
            this.declFile.Write(argDecl.id.actualText);
            if (argDecl.isOptionalArg()) {
                this.declFile.Write("?");
            }
            
            this.indenter.decreaseIndent();

            if (this.canEmitTypeAnnotationSignature(ToDeclFlags(funcDecl.getFunctionFlags()))) {
                this.emitTypeOfBoundDecl(argDecl);
            }
        }

        public isOverloadedCallSignature(funcDecl: FunctionDeclaration) {
            var functionDecl = this.semanticInfoChain.getDeclForAST(funcDecl, this.fileName);
            var funcSymbol = functionDecl.getSymbol();
            var funcTypeSymbol = funcSymbol.getType();
            var signatures = funcTypeSymbol.getCallSignatures();
            return signatures && signatures.length > 1;
        }

        public FunctionDeclarationCallback(pre: boolean, funcDecl: FunctionDeclaration): boolean {
            if (!pre) {
                return false;
            }

            if (funcDecl.isAccessor()) {
                return this.emitPropertyAccessorSignature(funcDecl);
            }

            var isInterfaceMember = (this.getAstDeclarationContainer().nodeType === NodeType.InterfaceDeclaration);

            var funcSymbol = this.semanticInfoChain.getSymbolAndDiagnosticsForAST(funcDecl, this.fileName).symbol;
            var funcTypeSymbol = funcSymbol.getType();
            if (funcDecl.block) {
                var constructSignatures = funcTypeSymbol.getConstructSignatures();
                if (constructSignatures && constructSignatures.length > 1) {
                    return false;
                }
                else if (this.isOverloadedCallSignature(funcDecl)) {
                    // This means its implementation of overload signature. do not emit
                    return false;
                }
            }
            else if (!isInterfaceMember && hasFlag(funcDecl.getFunctionFlags(), FunctionFlags.Private) && this.isOverloadedCallSignature(funcDecl)) {
                // Print only first overload of private function
                var callSignatures = funcTypeSymbol.getCallSignatures();
                Debug.assert(callSignatures && callSignatures.length > 1);
                var firstSignature = callSignatures[0].isDefinition() ? callSignatures[1] : callSignatures[0];
                var firstSignatureDecl = firstSignature.getDeclarations()[0];
                var firstFuncDecl = <FunctionDeclaration>this.semanticInfoChain.getASTForDecl(firstSignatureDecl);
                if (firstFuncDecl !== funcDecl) {
                    return false;
                }
            }

            if (!this.canEmitSignature(ToDeclFlags(funcDecl.getFunctionFlags()), funcDecl, false)) {
                return false;
            }

            var funcSignature = this.semanticInfoChain.getDeclForAST(funcDecl, this.fileName).getSignatureSymbol();
            this.emitDeclarationComments(funcDecl);
            if (funcDecl.isConstructor) {
                this.emitIndent();
                this.declFile.Write("constructor");
                this.emitTypeParameters(funcDecl.typeArguments, funcSignature);
            }
            else {
                var id = funcDecl.getNameText();
                if (!isInterfaceMember) {
                    this.emitDeclFlags(ToDeclFlags(funcDecl.getFunctionFlags()), "function");
                    if (id !== "__missing" || !funcDecl.name || !funcDecl.name.isMissing()) {
                        this.declFile.Write(id);
                    }
                    else if (funcDecl.isConstructMember()) {
                        this.declFile.Write("new");
                    }

                    this.emitTypeParameters(funcDecl.typeArguments, funcSignature);
                }
                else {
                    this.emitIndent();
                    if (funcDecl.isConstructMember()) {
                        this.declFile.Write("new");
                        this.emitTypeParameters(funcDecl.typeArguments, funcSignature);
                    }
                    else if (!funcDecl.isCallMember() && !funcDecl.isIndexerMember()) {
                        this.declFile.Write(id);
                        this.emitTypeParameters(funcDecl.typeArguments, funcSignature);
                        if (hasFlag(funcDecl.name.getFlags(), ASTFlags.OptionalName)) {
                            this.declFile.Write("? ");
                        }
                    }
                    else {
                        this.emitTypeParameters(funcDecl.typeArguments, funcSignature);
                    }
                }
            }

            if (!funcDecl.isIndexerMember()) {
                this.declFile.Write("(");
            }
            else {
                this.declFile.Write("[");
            }

            if (funcDecl.arguments) {
                var argsLen = funcDecl.arguments.members.length;
                if (funcDecl.variableArgList) {
                    argsLen--;
                }

                for (var i = 0; i < argsLen; i++) {
                    var argDecl = <Parameter>funcDecl.arguments.members[i];
                    this.emitArgDecl(argDecl, funcDecl);
                    if (i < (argsLen - 1)) {
                        this.declFile.Write(", ");
                    }
                }
            }

            if (funcDecl.variableArgList) {
                var lastArg = <Parameter>funcDecl.arguments.members[funcDecl.arguments.members.length - 1];
                if (funcDecl.arguments.members.length > 1) {
                    this.declFile.Write(", ...");
                }
                else {
                    this.declFile.Write("...");
                }

                this.emitArgDecl(lastArg, funcDecl);
            }

            if (!funcDecl.isIndexerMember()) {
                this.declFile.Write(")");
            }
            else {
                this.declFile.Write("]");
            }

            if (!funcDecl.isConstructor &&
                this.canEmitTypeAnnotationSignature(ToDeclFlags(funcDecl.getFunctionFlags()))) {
                var returnType = funcSignature.getReturnType();
                if (funcDecl.returnTypeAnnotation ||
                    (returnType && returnType !== this.semanticInfoChain.anyTypeSymbol)) {
                    this.declFile.Write(": ");
                    this.emitTypeSignature(returnType);
                }
            }

            this.declFile.WriteLine(";");

            return false;
        }

        public emitBaseExpression(bases: ASTList, index: number) {
            var baseTypeAndDiagnostics = this.semanticInfoChain.getSymbolAndDiagnosticsForAST(bases.members[index], this.fileName);
            var baseType = baseTypeAndDiagnostics && <PullTypeSymbol>baseTypeAndDiagnostics.symbol;
            this.emitTypeSignature(baseType);
        }

        private emitBaseList(typeDecl: TypeDeclaration, useExtendsList: boolean) {
            var bases = useExtendsList ? typeDecl.extendsList : typeDecl.implementsList;
            if (bases && (bases.members.length > 0)) {
                var qual = useExtendsList ? "extends" : "implements";
                this.declFile.Write(" " + qual + " ");
                var basesLen = bases.members.length;
                for (var i = 0; i < basesLen; i++) {
                    if (i > 0) {
                        this.declFile.Write(", ");
                    }
                    this.emitBaseExpression(bases, i);
                }
            }
        }

        private emitAccessorDeclarationComments(funcDecl: FunctionDeclaration) {
            if (!this.emitOptions.compilationSettings.emitComments) {
                return;
            }

            var accessors = PullHelpers.getGetterAndSetterFunction(funcDecl, this.semanticInfoChain, this.fileName);
            var comments: Comment[] = [];
            if (accessors.getter) {
                comments = comments.concat(accessors.getter.getDocComments());
            }
            if (accessors.setter) {
                comments = comments.concat(accessors.setter.getDocComments());
            }
            this.writeDeclarationComments(comments);
        }

        public emitPropertyAccessorSignature(funcDecl: FunctionDeclaration) {
            var accessorSymbol = PullHelpers.getAccessorSymbol(funcDecl, this.semanticInfoChain, this.fileName);
            if (!hasFlag(funcDecl.getFunctionFlags(), FunctionFlags.GetAccessor) && accessorSymbol.getGetter()) {
                // Setter is being used to emit the type info. 
                return false;
            }

            this.emitAccessorDeclarationComments(funcDecl);
            this.emitDeclFlags(ToDeclFlags(funcDecl.getFunctionFlags()), "var");
            this.declFile.Write(funcDecl.name.actualText);
            if (this.canEmitTypeAnnotationSignature(ToDeclFlags(funcDecl.getFunctionFlags()))) {
                this.declFile.Write(" : ");
                var type = accessorSymbol.getType();
                this.emitTypeSignature(type);
            }
            this.declFile.WriteLine(";");

            return false;
        }

        private emitClassMembersFromConstructorDefinition(funcDecl: FunctionDeclaration) {
            if (funcDecl.arguments) {
                var argsLen = funcDecl.arguments.members.length; if (funcDecl.variableArgList) { argsLen--; }

                for (var i = 0; i < argsLen; i++) {
                    var argDecl = <Parameter>funcDecl.arguments.members[i];
                    if (hasFlag(argDecl.getVarFlags(), VariableFlags.Property)) {
                        this.emitDeclarationComments(argDecl);
                        this.emitDeclFlags(ToDeclFlags(argDecl.getVarFlags()), "var");
                        this.declFile.Write(argDecl.id.actualText);

                        if (this.canEmitTypeAnnotationSignature(ToDeclFlags(argDecl.getVarFlags()))) {
                            this.emitTypeOfBoundDecl(argDecl);
                        }
                        this.declFile.WriteLine(";");
                    }
                }
            }
        }

        public ClassDeclarationCallback(pre: boolean, classDecl: ClassDeclaration): boolean {
            if (!this.canEmitPrePostAstSignature(ToDeclFlags(classDecl.getVarFlags()), classDecl, pre)) {
                return false;
            }

            if (pre) {
                var className = classDecl.name.actualText;
                this.emitDeclarationComments(classDecl);
                this.emitDeclFlags(ToDeclFlags(classDecl.getVarFlags()), "class");
                this.declFile.Write(className);
                this.pushDeclarationContainer(classDecl);
                this.emitTypeParameters(classDecl.typeParameters);
                this.emitBaseList(classDecl, true);
                this.emitBaseList(classDecl, false);
                this.declFile.WriteLine(" {");

                this.indenter.increaseIndent();
                if (classDecl.constructorDecl) {
                    this.emitClassMembersFromConstructorDefinition(classDecl.constructorDecl);
                }
            }
            else {
                this.indenter.decreaseIndent();
                this.popDeclarationContainer(classDecl);

                this.emitIndent();
                this.declFile.WriteLine("}");
            }

            return true;
        }

        private emitTypeParameters(typeParams: ASTList, funcSignature?: PullSignatureSymbol) {
            if (!typeParams || !typeParams.members.length) {
                return;
            }

            this.declFile.Write("<");
            var containerAst = this.getAstDeclarationContainer();
            var containerDecl = this.semanticInfoChain.getDeclForAST(containerAst, this.fileName);
            var containerSymbol = <PullTypeSymbol>containerDecl.getSymbol();
            var typars: PullTypeSymbol[];
            if (funcSignature) {
                typars = funcSignature.getTypeParameters();
            }
            else {
                typars = containerSymbol.getTypeArguments();
                if (!typars || !typars.length) {
                    typars = containerSymbol.getTypeParameters();
                }
            }

            for (var i = 0; i < typars.length; i++) {
                if (i) {
                    this.declFile.Write(", ");
                }

                var memberName = typars[i].getScopedNameEx(containerSymbol, true);
                this.emitTypeNamesMember(memberName);
            }

            this.declFile.Write(">");
        }

        public InterfaceDeclarationCallback(pre: boolean, interfaceDecl: InterfaceDeclaration): boolean {
            if (!this.canEmitPrePostAstSignature(ToDeclFlags(interfaceDecl.getVarFlags()), interfaceDecl, pre)) {
                return false;
            }

            if (pre) {
                var interfaceName = interfaceDecl.name.actualText;
                this.emitDeclarationComments(interfaceDecl);
                this.emitDeclFlags(ToDeclFlags(interfaceDecl.getVarFlags()), "interface");
                this.declFile.Write(interfaceName);
                this.pushDeclarationContainer(interfaceDecl);
                this.emitTypeParameters(interfaceDecl.typeParameters);
                this.emitBaseList(interfaceDecl, true);
                this.declFile.WriteLine(" {");

                this.indenter.increaseIndent();
            }
            else {
                this.indenter.decreaseIndent();
                this.popDeclarationContainer(interfaceDecl);

                this.emitIndent();
                this.declFile.WriteLine("}");
            }

            return true;
        }

        public ImportDeclarationCallback(pre: boolean, importDeclAST: ImportDeclaration): boolean {
            if (pre) {
                var importDecl = this.semanticInfoChain.getDeclForAST(importDeclAST, this.fileName);
                var importSymbol = <PullTypeAliasSymbol>importDecl.getSymbol();
                if (importSymbol.getTypeUsedExternally() || PullContainerTypeSymbol.usedAsSymbol(importSymbol.getContainer(), importSymbol)) {
                    this.emitDeclarationComments(importDeclAST);
                    this.emitIndent();
                    this.declFile.Write("import ");

                    this.declFile.Write(importDeclAST.id.actualText + " = ");
                    if (importDeclAST.isDynamicImport) {
                        this.declFile.WriteLine("require(" + importDeclAST.getAliasName() + ");");
                    }
                    else {
                        this.declFile.WriteLine(importDeclAST.getAliasName() + ";");
                    }
                }
            }

            return false;
        }

        private emitEnumSignature(moduleDecl: ModuleDeclaration) {
            if (!this.canEmitSignature(ToDeclFlags(moduleDecl.getModuleFlags()), moduleDecl)) {
                return false;
            }

            this.emitDeclarationComments(moduleDecl);
            this.emitDeclFlags(ToDeclFlags(moduleDecl.getModuleFlags()), "enum");
            this.declFile.WriteLine(moduleDecl.name.actualText + " {");

            this.indenter.increaseIndent();
            var membersLen = moduleDecl.members.members.length;
            for (var j = 0; j < membersLen; j++) {
                var memberDecl: AST = moduleDecl.members.members[j];
                if (memberDecl.nodeType === NodeType.VariableStatement && !hasFlag(memberDecl.getFlags(), ASTFlags.EnumMapElement)) {
                    var variableStatement = <VariableStatement>memberDecl;
                    this.emitDeclarationComments(memberDecl);
                    this.emitIndent();
                    this.declFile.WriteLine((<VariableDeclarator>variableStatement.declaration.declarators.members[0]).id.actualText + ",");
                }
            }
            this.indenter.decreaseIndent();

            this.emitIndent();
            this.declFile.WriteLine("}");

            return false;
        }

        public ModuleDeclarationCallback(pre: boolean, moduleDecl: ModuleDeclaration): boolean {
            if (hasFlag(moduleDecl.getModuleFlags(), ModuleFlags.IsWholeFile)) {
                // This is dynamic modules and we are going to outputing single file, 
                // we need to change the declFile because dynamic modules are always emitted to their corresponding .d.ts
                if (hasFlag(moduleDecl.getModuleFlags(), ModuleFlags.IsDynamic)) {
                    if (pre) {
                        if (!this.emitOptions.outputMany) {
                            this.singleDeclFile = this.declFile;
                            CompilerDiagnostics.assert(this.indenter.indentAmt === 0, "Indent has to be 0 when outputing new file");
                            // Create new file
                            var declareFileName = this.emitOptions.mapOutputFileName(this.fileName, TypeScriptCompiler.mapToDTSFileName);
                            var useUTF8InOutputfile = moduleDecl.containsUnicodeChar || (this.emitOptions.compilationSettings.emitComments && moduleDecl.containsUnicodeCharInComment);

                            // Creating files can cause exceptions, they will be caught higher up in TypeScriptCompiler.emit
                            this.declFile = new TextWriter(this.emitOptions.ioHost, declareFileName, this.writeByteOrderMark);
                        }
                        this.pushDeclarationContainer(moduleDecl);
                    }
                    else {
                        if (!this.emitOptions.outputMany) {
                            CompilerDiagnostics.assert(this.singleDeclFile !== this.declFile, "singleDeclFile cannot be null as we are going to revert back to it");
                            CompilerDiagnostics.assert(this.indenter.indentAmt === 0, "Indent has to be 0 when outputing new file");

                            // Creating files can cause exceptions, they will be caught higher up in TypeScriptCompiler.emit
                            try {
                                this.declFile.Close();
                            }
                            catch (e) {
                                Emitter.throwEmitterError(e);
                            }

                            this.declFile = this.singleDeclFile;
                        }

                        this.popDeclarationContainer(moduleDecl);
                    }
                }

                return true;
            }

            if (moduleDecl.isEnum()) {
                if (pre) {
                    this.emitEnumSignature(moduleDecl);
                }
                return false;
            }

            if (!this.canEmitPrePostAstSignature(ToDeclFlags(moduleDecl.getModuleFlags()), moduleDecl, pre)) {
                return false;
            }

            if (pre) {
                if (this.emitDottedModuleName()) {
                    this.dottedModuleEmit += ".";
                }
                else {
                    this.dottedModuleEmit = this.getDeclFlagsString(ToDeclFlags(moduleDecl.getModuleFlags()), "module");
                }

                this.dottedModuleEmit += moduleDecl.name.actualText;

                var isCurrentModuleDotted = (moduleDecl.members.members.length === 1 &&
                    moduleDecl.members.members[0].nodeType === NodeType.ModuleDeclaration &&
                    !(<ModuleDeclaration>moduleDecl.members.members[0]).isEnum() &&
                    hasFlag((<ModuleDeclaration>moduleDecl.members.members[0]).getModuleFlags(), ModuleFlags.Exported));

                // Module is dotted only if it does not have doc comments for it
                var moduleDeclComments = moduleDecl.getDocComments();
                isCurrentModuleDotted = isCurrentModuleDotted && (moduleDeclComments === null || moduleDeclComments.length === 0);

                this.isDottedModuleName.push(isCurrentModuleDotted);
                this.pushDeclarationContainer(moduleDecl);

                if (!isCurrentModuleDotted) {
                    this.emitDeclarationComments(moduleDecl);
                    this.declFile.Write(this.dottedModuleEmit);
                    this.declFile.WriteLine(" {");
                    this.indenter.increaseIndent();
                }
            }
            else {
                if (!this.emitDottedModuleName()) {
                    this.indenter.decreaseIndent();
                    this.emitIndent();
                    this.declFile.WriteLine("}");
                }

                this.popDeclarationContainer(moduleDecl);
                this.isDottedModuleName.pop();
            }

            return true;
        }

        public ExportAssignmentCallback(pre: boolean, ast: AST): boolean {
            if (pre) {
                this.emitIndent();
                this.declFile.Write("export = ");
                this.declFile.Write((<ExportAssignment>ast).id.actualText);
                this.declFile.WriteLine(";");
            } 

            return false;
        }

        public ScriptCallback(pre: boolean, script: Script): boolean {
            if (pre) {
                if (this.emitOptions.outputMany) {
                    for (var i = 0; i < script.referencedFiles.length; i++) {
                        var referencePath = script.referencedFiles[i].path;
                        var declareFileName: string;
                        if (isRooted(referencePath)) {
                            declareFileName = this.emitOptions.mapOutputFileName(referencePath, TypeScriptCompiler.mapToDTSFileName)
                        }
                        else {
                            declareFileName = getDeclareFilePath(script.referencedFiles[i].path);
                        }
                        this.declFile.WriteLine('/// <reference path="' + declareFileName + '" />');
                    }
                }
                this.pushDeclarationContainer(script);
            }
            else {
                this.popDeclarationContainer(script);
            }
            return true;
        }

        public DefaultCallback(pre: boolean, ast: AST): boolean {
            return !ast.isStatement();
        }
    }
}