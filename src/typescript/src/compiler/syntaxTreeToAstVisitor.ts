/// <reference path='ast.ts' />

module TypeScript {
    export class SyntaxTreeToAstVisitor implements ISyntaxVisitor {
        public position = 0;

        public previousTokenTrailingComments: Comment[] = null;

        private static protoString = "__proto__";
        private static protoSubstitutionString = "#__proto__";

        constructor(private fileName: string,
                    public lineMap: LineMap,
                    private compilationSettings: CompilationSettings) {
        }

        public static visit(syntaxTree: SyntaxTree, fileName: string, compilationSettings: CompilationSettings, incrementalAST: boolean): Script {
            var visitor = incrementalAST
                ? new SyntaxTreeToIncrementalAstVisitor(fileName, syntaxTree.lineMap(), compilationSettings)
                : new SyntaxTreeToAstVisitor(fileName, syntaxTree.lineMap(), compilationSettings);
            return syntaxTree.sourceUnit().accept(visitor);
        }

        public movePast(element: ISyntaxElement): void {
            if (element !== null) {
                this.position += element.fullWidth();
            }
        }

        private moveTo(element1: ISyntaxNodeOrToken, element2: ISyntaxElement): void {
            if (element2 !== null) {
                this.position += Syntax.childOffset(element1, element2);
            }
        }

        private setCommentsAndSpan(ast: AST, fullStart: number, node: SyntaxNode): void {
            var firstToken = node.firstToken();
            var lastToken = node.lastToken();

            this.setSpan2(ast, fullStart, node, firstToken, lastToken);
            ast.setPreComments(this.convertTokenLeadingComments(firstToken, fullStart));
            ast.setPostComments(this.convertNodeTrailingComments(node, lastToken, fullStart));
        }

        private copySpan(from: IASTSpan, to: IASTSpan): void {
            to.minChar = from.minChar;
            to.limChar = from.limChar;
            to.trailingTriviaWidth = from.trailingTriviaWidth;
        }

        public setSpan(span: IASTSpan, fullStart: number, element: ISyntaxElement): void {
            this.setSpan2(span, fullStart, element, element.firstToken(), element.lastToken());
        }

        public setSpan2(span: IASTSpan, fullStart: number, element: ISyntaxElement, firstToken: ISyntaxToken, lastToken: ISyntaxToken): void {
            var leadingTriviaWidth = firstToken ? firstToken.leadingTriviaWidth() : 0;
            var trailingTriviaWidth = lastToken ? lastToken.trailingTriviaWidth() : 0;

            var desiredMinChar = fullStart + leadingTriviaWidth;
            var desiredLimChar = fullStart + element.fullWidth() - trailingTriviaWidth;

            this.setSpanExplicit(span, desiredMinChar, desiredLimChar);

            span.trailingTriviaWidth = trailingTriviaWidth;
        }

        public setSpanExplicit(span: IASTSpan, start: number, end: number): void {
            // Have a new span, just set it to the lim/min we were given.
            span.minChar = start;
            span.limChar = end;
        }

        public identifierFromToken(token: ISyntaxToken, isOptional: boolean): Identifier {
            var result: Identifier = null;
            if (token.fullWidth() === 0) {
                result = new MissingIdentifier();
            }
            else if (token.kind() === SyntaxKind.IdentifierName) {
                var tokenText = token.text();
                var text = tokenText === SyntaxTreeToAstVisitor.protoString
                    ? SyntaxTreeToAstVisitor.protoSubstitutionString
                    : null;

                result = new Identifier(tokenText, text);
            }
            else {
                var tokenText = token.text();
                result = new Identifier(tokenText, tokenText);
            }

            if (isOptional) {
                result.setFlags(result.getFlags() | ASTFlags.OptionalName);
            }

            var start = this.position + token.leadingTriviaWidth();
            this.setSpanExplicit(result, start, start + token.width());

            return result;
        }

        public visitSyntaxList(node: ISyntaxList): ASTList {
            var start = this.position;
            var array = new Array(node.childCount());

            for (var i = 0, n = node.childCount(); i < n; i++) {
                array[i] = node.childAt(i).accept(this);
            }
            
            var result = new ASTList(array);
            this.setSpan(result, start, node);

            return result;
        }

        public visitSeparatedSyntaxList(list: ISeparatedSyntaxList): ASTList {
            var start = this.position;
            var array = new Array(list.nonSeparatorCount());

            for (var i = 0, n = list.childCount(); i < n; i++) {
                if (i % 2 === 0) {
                    array[i / 2] = list.childAt(i).accept(this);
                    this.previousTokenTrailingComments = null;
                }
                else {
                    var separatorToken = <ISyntaxToken>list.childAt(i);
                    this.previousTokenTrailingComments = this.convertTokenTrailingComments(
                        separatorToken, this.position + separatorToken.leadingTriviaWidth() + separatorToken.width());
                    this.movePast(separatorToken);
                }
            }

            var result = new ASTList(array, list.separatorCount());
            this.setSpan(result, start, list);

            result.setPostComments(this.previousTokenTrailingComments);
            this.previousTokenTrailingComments = null;

            return result;
        }

        private createRef(text: string, minChar: number): Identifier {
            var id = new Identifier(text, null);
            id.minChar = minChar;
            return id;
        }

        private convertComment(trivia: ISyntaxTrivia, commentStartPosition: number, hasTrailingNewLine: boolean): Comment {
            var comment = new Comment(trivia.fullText(), trivia.kind() === SyntaxKind.MultiLineCommentTrivia, hasTrailingNewLine);

            comment.minChar = commentStartPosition;
            comment.limChar = commentStartPosition + trivia.fullWidth();

            return comment;
        }

        private convertComments(triviaList: ISyntaxTriviaList, commentStartPosition: number): Comment[] {
            var result: Comment[] = [];

            for (var i = 0, n = triviaList.count(); i < n; i++) {
                var trivia = triviaList.syntaxTriviaAt(i);

                if (trivia.isComment()) {
                    var hasTrailingNewLine = ((i + 1) < n) && triviaList.syntaxTriviaAt(i + 1).isNewLine();
                    result.push(this.convertComment(trivia, commentStartPosition, hasTrailingNewLine));
                }

                commentStartPosition += trivia.fullWidth();
            }

            return result;
        }

        private mergeComments(comments1: Comment[], comments2: Comment[]): Comment[] {
            if (comments1 === null) {
                return comments2;
            }

            if (comments2 === null) {
                return comments1;
            }

            return comments1.concat(comments2);
        }

        private convertTokenLeadingComments(token: ISyntaxToken, commentStartPosition: number): Comment[] {
            if (token === null) {
                return null;
            }

            var preComments = token.hasLeadingComment()
                ? this.convertComments(token.leadingTrivia(), commentStartPosition)
                : null;

            var previousTokenTrailingComments = this.previousTokenTrailingComments;
            this.previousTokenTrailingComments = null;

            return this.mergeComments(previousTokenTrailingComments, preComments);
        }

        private convertTokenTrailingComments(token: ISyntaxToken, commentStartPosition: number): Comment[] {
            if (token === null || !token.hasTrailingComment() || token.hasTrailingNewLine()) {
                return null;
            }

            return this.convertComments(token.trailingTrivia(), commentStartPosition);
        }

        private convertNodeTrailingComments(node: SyntaxNode, lastToken: ISyntaxToken, nodeStart: number): Comment[]{
            // Bail out quickly before doing any expensive math computation.
            if (lastToken === null || !lastToken.hasTrailingComment() || lastToken.hasTrailingNewLine()) {
                return null;
            }

            return this.convertComments(lastToken.trailingTrivia(), nodeStart + node.fullWidth() - lastToken.trailingTriviaWidth());
        }

        public visitToken(token: ISyntaxToken): AST {
            var fullStart = this.position;

            var result: AST;
            if (token.kind() === SyntaxKind.ThisKeyword) {
                result = new ThisExpression();
            }
            else if (token.kind() === SyntaxKind.SuperKeyword) {
                result = new SuperExpression();
            }
            else if (token.kind() === SyntaxKind.TrueKeyword) {
                result = new LiteralExpression(NodeType.TrueLiteral);
            }
            else if (token.kind() === SyntaxKind.FalseKeyword) {
                result = new LiteralExpression(NodeType.FalseLiteral);
            }
            else if (token.kind() === SyntaxKind.NullKeyword) {
                result = new LiteralExpression(NodeType.NullLiteral);
            }
            else if (token.kind() === SyntaxKind.StringLiteral) {
                result = new StringLiteral(token.text(), token.valueText());
            }
            else if (token.kind() === SyntaxKind.RegularExpressionLiteral) {
                result = new RegexLiteral(token.text());
            }
            else if (token.kind() === SyntaxKind.NumericLiteral) {
                var preComments = this.convertTokenLeadingComments(token, fullStart);

                var value = token.text().indexOf(".") > 0 ? parseFloat(token.text()) : parseInt(token.text());
                result = new NumberLiteral(value, token.text());

                result.setPreComments(preComments);
            }
            else {
                result = this.identifierFromToken(token, /*isOptional:*/ false);
            }

            this.movePast(token);

            var start = fullStart + token.leadingTriviaWidth();
            this.setSpanExplicit(result, start, start + token.width());
            return result;
        }

        private getLeadingComments(node: SyntaxNode): ISyntaxTrivia[] {
            var firstToken = node.firstToken();
            var result: ISyntaxTrivia[] = [];

            if (firstToken.hasLeadingComment()) {
                var leadingTrivia = firstToken.leadingTrivia();

                for (var i = 0, n = leadingTrivia.count(); i < n; i++) {
                    var trivia = leadingTrivia.syntaxTriviaAt(i);

                    if (trivia.isComment()) {
                        result.push(trivia);
                    }
                }
            }

            return result;
        }

        private hasTopLevelImportOrExport(node: SourceUnitSyntax): boolean {
            // TODO: implement this.

            var firstToken: ISyntaxToken;

            for (var i = 0, n = node.moduleElements.childCount(); i < n; i++) {
                var moduleElement = node.moduleElements.childAt(i);

                firstToken = moduleElement.firstToken();
                if (firstToken !== null && firstToken.kind() === SyntaxKind.ExportKeyword) {
                    return true;
                }

                if (moduleElement.kind() === SyntaxKind.ImportDeclaration) {
                    var importDecl = <ImportDeclarationSyntax>moduleElement;
                    if (importDecl.moduleReference.kind() === SyntaxKind.ExternalModuleReference) {
                        return true;
                    }
                }
            }

            var leadingComments = this.getLeadingComments(node);
            for (var i = 0, n = leadingComments.length; i < n; i++) {
                var trivia = leadingComments[i];

                if (getImplicitImport(trivia.fullText())) {
                    return true;
                }
            }

            return false;
        }

        private getAmdDependency(comment: string): string {
            var amdDependencyRegEx = /^\/\/\/\s*<amd-dependency\s+path=('|")(.+?)\1/gim;
            var match = amdDependencyRegEx.exec(comment);
            return match ? match[2] : null;
        }

        public visitSourceUnit(node: SourceUnitSyntax): Script {
            var start = this.position;

            var bod = this.visitSyntaxList(node.moduleElements);

            var topLevelMod: ModuleDeclaration = null;
            if (this.hasTopLevelImportOrExport(node)) {
                var correctedFileName = switchToForwardSlashes(this.fileName);
                var id: Identifier = new Identifier(correctedFileName, correctedFileName);
                topLevelMod = new ModuleDeclaration(id, bod, null);
                this.setSpanExplicit(topLevelMod, start, this.position);

                var moduleFlags = topLevelMod.getModuleFlags() | ModuleFlags.IsDynamic | ModuleFlags.IsWholeFile | ModuleFlags.Exported;
                if (isDTSFile(this.fileName)) {
                    moduleFlags |= ModuleFlags.Ambient;
                }

                topLevelMod.setModuleFlags(moduleFlags);

                topLevelMod.prettyName = getPrettyName(correctedFileName);

                var leadingComments = this.getLeadingComments(node);
                for (var i = 0, n = leadingComments.length; i < n; i++) {
                    var trivia = leadingComments[i];
                    var amdDependency = this.getAmdDependency(trivia.fullText());
                    if (amdDependency) {
                        topLevelMod.amdDependencies.push(amdDependency);
                    }
                }

                bod = new ASTList([topLevelMod]);
                this.setSpanExplicit(bod, start, this.position);
            }

            var result = new Script();
            this.setSpanExplicit(result, start, start + node.fullWidth());

            result.moduleElements = bod;
            result.topLevelMod = topLevelMod;
            result.isDeclareFile = isDTSFile(this.fileName);

            return result;
        }

        public visitExternalModuleReference(node: ExternalModuleReferenceSyntax): any {
            this.moveTo(node, node.stringLiteral);
            var result = this.identifierFromToken(node.stringLiteral, /*isOptional:*/ false);
            this.movePast(node.stringLiteral);
            this.movePast(node.closeParenToken);

            return result;
        }

        public visitModuleNameModuleReference(node: ModuleNameModuleReferenceSyntax): any {
            return node.moduleName.accept(this);
        }

        public visitClassDeclaration(node: ClassDeclarationSyntax): ClassDeclaration {
            var start = this.position;

            this.moveTo(node, node.identifier);
            var name = this.identifierFromToken(node.identifier, /*isOptional:*/ false);
            this.movePast(node.identifier);

            var typeParameters = node.typeParameterList === null ? null : node.typeParameterList.accept(this);
            var extendsList: ASTList = null;
            var implementsList: ASTList = null;

            for (var i = 0, n = node.heritageClauses.childCount(); i < n; i++) {
                var heritageClause = <HeritageClauseSyntax>node.heritageClauses.childAt(i);
                if (heritageClause.extendsOrImplementsKeyword.tokenKind === SyntaxKind.ExtendsKeyword) {
                    extendsList = heritageClause.accept(this);
                }
                else {
                    implementsList = heritageClause.accept(this);
                }
            }

            this.movePast(node.openBraceToken);
            var members = this.visitSyntaxList(node.classElements);
            var closeBracePosition = this.position;
            this.movePast(node.closeBraceToken);
            var closeBraceSpan = new ASTSpan();
            this.setSpan(closeBraceSpan, closeBracePosition, node.closeBraceToken);

            var result = new ClassDeclaration(name, typeParameters, members, extendsList, implementsList, closeBraceSpan);
            this.setCommentsAndSpan(result, start, node);

            for (var i = 0; i < members.members.length; i++) {
                var member = members.members[i];
                if (member.nodeType() === NodeType.FunctionDeclaration) {
                    var funcDecl = <FunctionDeclaration>member;

                    if (funcDecl.isConstructor) {
                        funcDecl.classDecl = result;

                        result.constructorDecl = funcDecl;
                    }
                }
            }

            this.completeClassDeclaration(node, result);

            return result;
        }

        public completeClassDeclaration(node: ClassDeclarationSyntax, result: ClassDeclaration): void {
            var flags = result.getVarFlags();
            if (SyntaxUtilities.containsToken(node.modifiers, SyntaxKind.ExportKeyword)) {
                flags = flags | VariableFlags.Exported;
            }

            if (SyntaxUtilities.containsToken(node.modifiers, SyntaxKind.DeclareKeyword)) {
                flags = flags | VariableFlags.Ambient;
            }

            result.setVarFlags(flags);
        }

        public visitInterfaceDeclaration(node: InterfaceDeclarationSyntax): InterfaceDeclaration {
            var start = this.position;

            this.moveTo(node, node.identifier);
            var name = this.identifierFromToken(node.identifier, /*isOptional:*/ false);
            this.movePast(node.identifier);
            var typeParameters = node.typeParameterList === null ? null : node.typeParameterList.accept(this);

            var extendsList: ASTList = null;

            for (var i = 0, n = node.heritageClauses.childCount(); i < n; i++) {
                var heritageClause = <HeritageClauseSyntax>node.heritageClauses.childAt(i);
                if (i === 0) {
                    extendsList = heritageClause.accept(this);
                }
                else {
                    this.movePast(heritageClause);
                }
            }

            this.movePast(node.body.openBraceToken);
            var members = this.visitSeparatedSyntaxList(node.body.typeMembers);

            this.movePast(node.body.closeBraceToken);

            var result = new InterfaceDeclaration(name, typeParameters, members, extendsList, null, /*isObjectTypeLiteral:*/ false);
            this.setCommentsAndSpan(result, start, node);

            this.completeInterfaceDeclaration(node, result);

            return result;
        }

        public completeInterfaceDeclaration(node: InterfaceDeclarationSyntax, result: InterfaceDeclaration): void {
            if (SyntaxUtilities.containsToken(node.modifiers, SyntaxKind.ExportKeyword)) {
                result.setVarFlags(result.getVarFlags() | VariableFlags.Exported);
            }
        }

        public visitHeritageClause(node: HeritageClauseSyntax): ASTList {
            var start = this.position;
            var array = new Array(node.typeNames.nonSeparatorCount());

            this.movePast(node.extendsOrImplementsKeyword);
            for (var i = 0, n = node.typeNames.childCount(); i < n; i++) {
                if (i % 2 === 1) {
                    this.movePast(node.typeNames.childAt(i));
                }
                else {
                    var type = this.visitType(node.typeNames.childAt(i)).term;
                    array[i / 2] = type;
                }
            }

            var result = new ASTList(array);
            this.setSpan(result, start, node);

            return result;
        }

        private getModuleNames(node: ModuleDeclarationSyntax): Identifier[] {
            var result: Identifier[] = [];

            if (node.stringLiteral !== null) {
                result.push(this.identifierFromToken(node.stringLiteral, /*isOptional:*/false));
                this.movePast(node.stringLiteral);
            }
            else {
                this.getModuleNamesHelper(node.moduleName, result);
            }

            return result;
        }

        private getModuleNamesHelper(name: INameSyntax, result: Identifier[]): void {
            if (name.kind() === SyntaxKind.QualifiedName) {
                var qualifiedName = <QualifiedNameSyntax>name;
                this.getModuleNamesHelper(qualifiedName.left, result);
                this.movePast(qualifiedName.dotToken);
                result.push(this.identifierFromToken(qualifiedName.right, /*isOptional:*/ false));
                this.movePast(qualifiedName.right);
            }
            else {
                result.push(this.identifierFromToken(<ISyntaxToken>name, /*isOptional:*/ false));
                this.movePast(name);
            }
        }

        public visitModuleDeclaration(node: ModuleDeclarationSyntax): ModuleDeclaration {
            var start = this.position;

            var firstToken = node.firstToken();
            var preComments = this.convertTokenLeadingComments(firstToken, start);
            var postComments = this.convertNodeTrailingComments(node, node.closeBraceToken, start);

            this.moveTo(node, node.moduleKeyword);
            this.movePast(node.moduleKeyword);
            var names = this.getModuleNames(node);
            this.movePast(node.openBraceToken);

            var members = this.visitSyntaxList(node.moduleElements);

            var closeBracePosition = this.position;
            this.movePast(node.closeBraceToken);
            var closeBraceSpan = new ASTSpan();
            this.setSpan(closeBraceSpan, closeBracePosition, node.closeBraceToken);

            for (var i = names.length - 1; i >= 0; i--) {
                var innerName = names[i];

                var result = new ModuleDeclaration(innerName, members, closeBraceSpan);
                this.setSpan(result, start, node);

                result.setPreComments(preComments);
                result.setPostComments(postComments);

                preComments = null;
                postComments = null;

                // mark the inner module declarations as exported
                // outer module is exported if export key word or parsing ambient module
                if (i || SyntaxUtilities.containsToken(node.modifiers, SyntaxKind.ExportKeyword)) {
                    result.setModuleFlags(result.getModuleFlags() | ModuleFlags.Exported);
                }

                // REVIEW: will also possibly need to re-parent comments as well

                members = new ASTList([result]);
            }

            this.completeModuleDeclaration(node, result);

            this.setSpan(result, start, node);
            return result;
        }

        public completeModuleDeclaration(node: ModuleDeclarationSyntax, result: ModuleDeclaration): void {
            // mark ambient if declare keyword or parsing ambient module or parsing declare file
            if (SyntaxUtilities.containsToken(node.modifiers, SyntaxKind.DeclareKeyword)) {
                result.setModuleFlags(result.getModuleFlags() | ModuleFlags.Ambient);
            }
        }

        private hasDotDotDotParameter(parameters: ISeparatedSyntaxList): boolean {
            for (var i = 0, n = parameters.nonSeparatorCount(); i < n; i++) {
                if ((<ParameterSyntax>parameters.nonSeparatorAt(i)).dotDotDotToken) {
                    return true;
                }
            }

            return false;
        }

        public visitFunctionDeclaration(node: FunctionDeclarationSyntax): FunctionDeclaration {
            var start = this.position;

            this.moveTo(node, node.identifier);
            var name = this.identifierFromToken(node.identifier, /*isOptional:*/ false);

            this.movePast(node.identifier);

            var typeParameters = node.callSignature.typeParameterList === null ? null : node.callSignature.typeParameterList.accept(this);
            var parameters = node.callSignature.parameterList.accept(this);

            var returnType = node.callSignature.typeAnnotation
                ? node.callSignature.typeAnnotation.accept(this)
                : null;

            var block = node.block ? node.block.accept(this) : null;

            this.movePast(node.semicolonToken);

            var result = new FunctionDeclaration(name, block, false, typeParameters, parameters, returnType, this.hasDotDotDotParameter(node.callSignature.parameterList.parameters));
            this.setCommentsAndSpan(result, start, node);

            if (node.semicolonToken) {
                result.setFunctionFlags(result.getFunctionFlags() | FunctionFlags.Signature);
            }

            this.completeFunctionDeclaration(node, result);

            return result;
        }

        public completeFunctionDeclaration(node: FunctionDeclarationSyntax, result: FunctionDeclaration): void {
            var flags = result.getFunctionFlags();
            if (SyntaxUtilities.containsToken(node.modifiers, SyntaxKind.ExportKeyword)) {
                flags = flags | FunctionFlags.Exported;
            }

            if (SyntaxUtilities.containsToken(node.modifiers, SyntaxKind.DeclareKeyword)) {
                flags = flags | FunctionFlags.Ambient;
            }

            result.setFunctionFlags(flags);
        }

        public visitEnumDeclaration(node: EnumDeclarationSyntax): ModuleDeclaration {
            var start = this.position;

            this.moveTo(node, node.identifier);
            var name = this.identifierFromToken(node.identifier, /*isOptional:*/ false);
            this.movePast(node.identifier);

            this.movePast(node.openBraceToken);
            var array: VariableStatement[] = new Array(node.enumElements.nonSeparatorCount());

            var declarators: VariableDeclarator[] = [];

            for (var i = 0, n = node.enumElements.childCount(); i < n; i++) {
                if (i % 2 === 1) {
                    this.movePast(node.enumElements.childAt(i));
                }
                else {
                    var enumElement = <EnumElementSyntax>node.enumElements.childAt(i);
                    var enumElementFullStart = this.position;
                    var memberStart = this.position + enumElement.leadingTriviaWidth();

                    var memberName = this.identifierFromToken(enumElement.propertyName, /*isOptional:*/ false);
                    this.movePast(enumElement.propertyName);
                    
                    var init = enumElement.equalsValueClause !== null ? enumElement.equalsValueClause.accept(this) : null;

                    var declarator = new VariableDeclarator(memberName, new TypeReference(this.createRef(name.actualText, -1), 0), init);
                    declarator.constantValue = this.determineConstantValue(enumElement.equalsValueClause, declarators);

                    declarator.setVarFlags(declarator.getVarFlags() | VariableFlags.Property);
                    this.setSpanExplicit(declarator, memberStart, this.position);
                    declarator.setPreComments(this.convertTokenLeadingComments(enumElement.firstToken(), enumElementFullStart));
                    declarator.setPostComments(this.convertNodeTrailingComments(enumElement, enumElement.lastToken(), enumElementFullStart));

                    declarators.push(declarator);

                    var declaration = new VariableDeclaration(new ASTList([declarator]));
                    this.setSpanExplicit(declaration, memberStart, this.position);

                    var statement = new VariableStatement(declaration);
                    statement.setFlags(ASTFlags.EnumElement);
                    this.setSpanExplicit(statement, memberStart, this.position);

                    array[i / 2] = statement;

                    // all enum members are exported
                    declarator.setVarFlags(declarator.getVarFlags() | VariableFlags.Exported);
                }
            }

            var members = new ASTList(array);

            var closeBracePosition = this.position;
            this.movePast(node.closeBraceToken);
            var closeBraceSpan = new ASTSpan();
            this.setSpan(closeBraceSpan, closeBracePosition, node.closeBraceToken);

            var result = new ModuleDeclaration(name, members, closeBraceSpan);
            this.setCommentsAndSpan(result, start, node);

            var flags = result.getModuleFlags() | ModuleFlags.IsEnum;

            if (SyntaxUtilities.containsToken(node.modifiers, SyntaxKind.ExportKeyword)) {
                flags = flags | ModuleFlags.Exported;
            }

            result.setModuleFlags(flags);

            return result;
        }

        private determineConstantValue(equalsValue: EqualsValueClauseSyntax, declarators: VariableDeclarator[]): number {
            var value = equalsValue === null ? null : equalsValue.value;
            if (value === null) {
                // If they provided no value, then our constant value is 0 if we're the first 
                // element, or one greater than the last constant value.
                if (declarators.length === 0) {
                    return 0;
                }
                else {
                    var lastConstantValue = ArrayUtilities.last(declarators).constantValue;
                    return lastConstantValue !== null ? lastConstantValue + 1 : null;
                }
            }
            else {
                return this.computeConstantValue(value, declarators);
            }
        }

        private computeConstantValue(expression: IExpressionSyntax, declarators: VariableDeclarator[]): number {
            if (Syntax.isIntegerLiteral(expression)) {
                // Always produce a value for an integer literal.
                var token: ISyntaxToken;
                switch (expression.kind()) {
                    case SyntaxKind.PlusExpression:
                    case SyntaxKind.NegateExpression:
                        token = <ISyntaxToken>(<PrefixUnaryExpressionSyntax>expression).operand;
                        break;
                    default:
                        token = <ISyntaxToken>expression;
                }

                var value = token.value();
                return value && expression.kind() === SyntaxKind.NegateExpression ? -value : value;
            }
            else if (this.compilationSettings.propagateEnumConstants) {
                switch (expression.kind()) {
                    case SyntaxKind.IdentifierName:
                        // If it's a name, see if we already had an enum value named this.  If so,
                        // return that value.
                        var variableDeclarator = ArrayUtilities.firstOrDefault(declarators, d => d.id.text() === (<ISyntaxToken>expression).valueText());
                        return variableDeclarator ? variableDeclarator.constantValue : null;

                    case SyntaxKind.LeftShiftExpression:
                        // Handle the common case of a left shifted value.
                        var binaryExpression = <BinaryExpressionSyntax>expression;
                        return this.computeConstantValue(binaryExpression.left, declarators) << this.computeConstantValue(binaryExpression.right, declarators);
                }

                // TODO: add more cases.
                return null;
            }
            else {
                // Wasn't an integer literal, and we're not aggressively propagating constants.
                // There is no constant value for this expression.
                return null;
            }
        }

        public visitEnumElement(node: EnumElementSyntax): void {
            // Processing enum elements should be handled from inside visitEnumDeclaration.
            throw Errors.invalidOperation();
        }

        public visitImportDeclaration(node: ImportDeclarationSyntax): ImportDeclaration {
            var start = this.position;

            this.moveTo(node, node.identifier);
            var name = this.identifierFromToken(node.identifier, /*isOptional:*/ false);
            this.movePast(node.identifier);
            this.movePast(node.equalsToken);
            var alias = node.moduleReference.accept(this);
            this.movePast(node.semicolonToken);

            var result = new ImportDeclaration(name, alias);
            this.setCommentsAndSpan(result, start, node);

            var flags = result.getVarFlags();
            if (SyntaxUtilities.containsToken(node.modifiers, SyntaxKind.ExportKeyword)) {
                flags = flags | VariableFlags.Exported;
            }
            result.setVarFlags(flags);

            return result;
        }

        public visitExportAssignment(node: ExportAssignmentSyntax): ExportAssignment {
            var start = this.position;

            this.moveTo(node, node.identifier);
            var name = this.identifierFromToken(node.identifier, /*isOptional:*/ false);
            this.movePast(node.identifier);
            this.movePast(node.semicolonToken);

            var result = new ExportAssignment(name);
            this.setSpan(result, start, node);

            return result;
        }

        public visitVariableStatement(node: VariableStatementSyntax): VariableStatement {
            var start = this.position;

            var preComments: Comment[] = null;
            if (node.modifiers.childCount() > 0) {
                preComments = this.convertTokenLeadingComments(node.modifiers.firstToken(), start);
            }

            this.moveTo(node, node.variableDeclaration);

            var declaration = node.variableDeclaration.accept(this);
            this.movePast(node.semicolonToken);

            for (var i = 0, n = declaration.declarators.members.length; i < n; i++) {
                var varDecl = <VariableDeclarator>declaration.declarators.members[i];

                if (i === 0) {
                    varDecl.setPreComments(this.mergeComments(preComments, varDecl.preComments()));
                }

                var flags = varDecl.getVarFlags();
                if (SyntaxUtilities.containsToken(node.modifiers, SyntaxKind.ExportKeyword)) {
                    flags = flags | VariableFlags.Exported;
                }

                if (SyntaxUtilities.containsToken(node.modifiers, SyntaxKind.DeclareKeyword)) {
                    flags = flags | VariableFlags.Ambient;
                }

                varDecl.setVarFlags(flags);
            }

            var result = new VariableStatement(declaration);
            this.setSpan(result, start, node);

            return result;
        }

        public visitVariableDeclaration(node: VariableDeclarationSyntax): VariableDeclaration {
            var start = this.position;

            var firstToken = node.firstToken();
            var preComments = this.convertTokenLeadingComments(firstToken, start);
            var postComments = this.convertNodeTrailingComments(node, node.lastToken(), start);

            this.moveTo(node, node.variableDeclarators);
            var variableDecls = this.visitSeparatedSyntaxList(node.variableDeclarators);

            for (var i = 0; i < variableDecls.members.length; i++) {
                if (i === 0) {
                    variableDecls.members[i].setPreComments(preComments);
                    variableDecls.members[i].setPostComments(postComments);
                }
            }

            var result = new VariableDeclaration(variableDecls);
            this.setSpan(result, start, node);

            return result;
        }

        public visitVariableDeclarator(node: VariableDeclaratorSyntax): VariableDeclarator {
            var start = this.position;
            var name = this.identifierFromToken(node.identifier, /*isOptional:*/ false);
            this.movePast(node.identifier);
            var typeExpr = node.typeAnnotation ? node.typeAnnotation.accept(this) : null;
            var init = node.equalsValueClause ? node.equalsValueClause.accept(this) : null;

            var result = new VariableDeclarator(name, typeExpr, init);
            this.setSpan(result, start, node);

            if (init && init.nodeType() === NodeType.FunctionDeclaration) {
                var funcDecl = <FunctionDeclaration>init;
                funcDecl.hint = name.actualText;
            }

            return result;
        }

        public visitEqualsValueClause(node: EqualsValueClauseSyntax): AST {
            var afterEqualsComments = this.convertTokenTrailingComments(node.equalsToken,
                this.position + node.equalsToken.leadingTriviaWidth() + node.equalsToken.width());

            this.movePast(node.equalsToken);
            var result: AST = node.value.accept(this);
            result.setPreComments(this.mergeComments(afterEqualsComments, result.preComments()));

            return result;
        }

        private getUnaryExpressionNodeType(kind: SyntaxKind): NodeType {
            switch (kind) {
                case SyntaxKind.PlusExpression: return NodeType.PlusExpression;
                case SyntaxKind.NegateExpression: return NodeType.NegateExpression;
                case SyntaxKind.BitwiseNotExpression: return NodeType.BitwiseNotExpression;
                case SyntaxKind.LogicalNotExpression: return NodeType.LogicalNotExpression;
                case SyntaxKind.PreIncrementExpression: return NodeType.PreIncrementExpression;
                case SyntaxKind.PreDecrementExpression: return NodeType.PreDecrementExpression;
                default:
                    throw Errors.invalidOperation();
            }
        }

        public visitPrefixUnaryExpression(node: PrefixUnaryExpressionSyntax): UnaryExpression {
            var start = this.position;

            this.movePast(node.operatorToken);
            var operand = node.operand.accept(this);

            var result = new UnaryExpression(this.getUnaryExpressionNodeType(node.kind()), operand, null);
            this.setSpan(result, start, node);

            return result;
        }

        private isOnSingleLine(start: number, end: number): boolean {
            return this.lineMap.getLineNumberFromPosition(start) === this.lineMap.getLineNumberFromPosition(end);
        }

        public visitArrayLiteralExpression(node: ArrayLiteralExpressionSyntax): UnaryExpression {
            var start = this.position;
            var openStart = this.position + node.openBracketToken.leadingTriviaWidth();
            this.movePast(node.openBracketToken);

            var expressions = this.visitSeparatedSyntaxList(node.expressions);

            var closeStart = this.position + node.closeBracketToken.leadingTriviaWidth();
            this.movePast(node.closeBracketToken);

            var result = new UnaryExpression(NodeType.ArrayLiteralExpression, expressions, null);
            this.setSpan(result, start, node);

            if (this.isOnSingleLine(openStart, closeStart)) {
                result.setFlags(result.getFlags() | ASTFlags.SingleLine);
            }

            return result;
        }

        public visitOmittedExpression(node: OmittedExpressionSyntax): OmittedExpression {
            var start = this.position;

            var result = new OmittedExpression();
            this.setSpan(result, start, node);

            return result;
        }

        public visitParenthesizedExpression(node: ParenthesizedExpressionSyntax): ParenthesizedExpression {
            var start = this.position;

            this.movePast(node.openParenToken);
            var expr = node.expression.accept(this);
            this.movePast(node.closeParenToken);

            var result = new ParenthesizedExpression(expr);
            this.setSpan(result, start, node);

            return result;
        }

        private getArrowFunctionStatements(body: ISyntaxNodeOrToken): Block {
            if (body.kind() === SyntaxKind.Block) {
                return body.accept(this);
            }
            else {
                var expression = body.accept(this);
                var returnStatement = new ReturnStatement(expression);

                // Copy any comments before the body of the arrow function to the return statement.
                // This is necessary for emitting correctness so we don't emit something like this:
                //
                //      return
                //          // foo
                //          this.foo();
                //
                // Because of ASI, this gets parsed as "return;" which is *not* what we want for
                // proper semantics.  Also, we can no longer use this expression incrementally.
                var preComments = expression.preComments();
                if (preComments) {
                    (<any>body)._ast = undefined;
                    returnStatement.setPreComments(preComments);
                    expression.setPreComments(null);
                }
                
                var statements = new ASTList([returnStatement]);

                var block = new Block(statements, statements.members[0]);
                return block;
            }
        }

        public visitSimpleArrowFunctionExpression(node: SimpleArrowFunctionExpressionSyntax): FunctionDeclaration {
            var start = this.position;

            var identifier = this.identifierFromToken(node.identifier, /*isOptional:*/ false);
            this.movePast(node.identifier);
            this.movePast(node.equalsGreaterThanToken);

            var parameter = new Parameter(identifier, null, null, false);
            this.setSpanExplicit(parameter, identifier.minChar, identifier.limChar);

            var parameters = new ASTList([parameter]);

            var statements = this.getArrowFunctionStatements(node.body);

            var result = new FunctionDeclaration(null, statements, /*isConstructor:*/ false, null, parameters, null, false);
            this.setSpan(result, start, node);

            result.setFunctionFlags(result.getFunctionFlags() | FunctionFlags.IsFunctionExpression | FunctionFlags.IsFatArrowFunction);

            return result;
        }

        public visitParenthesizedArrowFunctionExpression(node: ParenthesizedArrowFunctionExpressionSyntax): FunctionDeclaration {
            var start = this.position;

            var typeParameters = node.callSignature.typeParameterList === null ? null : node.callSignature.typeParameterList.accept(this);
            var parameters = node.callSignature.parameterList.accept(this);
            var returnType = node.callSignature.typeAnnotation ? node.callSignature.typeAnnotation.accept(this) : null;
            this.movePast(node.equalsGreaterThanToken);

            var block = this.getArrowFunctionStatements(node.body);

            var result = new FunctionDeclaration(null, block, /*isConstructor:*/ false, typeParameters, parameters, returnType, this.hasDotDotDotParameter(node.callSignature.parameterList.parameters));
            this.setCommentsAndSpan(result, start, node);

            result.setFunctionFlags(result.getFunctionFlags() | FunctionFlags.IsFunctionExpression | FunctionFlags.IsFatArrowFunction);

            return result;
        }

        public visitType(type: ITypeSyntax): TypeReference {
            var result: TypeReference;
            if (type.isToken()) {
                var start = this.position;
                result = new TypeReference(type.accept(this), 0);
                this.setSpan(result, start, type);
            }
            else {
                result = type.accept(this);
            }

            return result;
        }

        public visitTypeQuery(node: TypeQuerySyntax): TypeReference {
            var start = this.position;
            this.movePast(node.typeOfKeyword);
            var name = node.name.accept(this);

            var typeQuery = new TypeQuery(name);
            this.setSpan(typeQuery, start, node);

            var result = new TypeReference(typeQuery, 0);
            this.copySpan(typeQuery, result);

            return result;
        }

        public visitQualifiedName(node: QualifiedNameSyntax): TypeReference {
            var start = this.position;
            var left = this.visitType(node.left).term;
            this.movePast(node.dotToken);
            var right = this.identifierFromToken(node.right, /*isOptional:*/ false);
            this.movePast(node.right);

            var term = new BinaryExpression(NodeType.MemberAccessExpression, left, right);
            this.setSpan(term, start, node);

            var result = new TypeReference(term, 0);
            this.copySpan(term, result);

            return result;
        }

        public visitTypeArgumentList(node: TypeArgumentListSyntax): ASTList {
            var array = new Array(node.typeArguments.nonSeparatorCount());

            this.movePast(node.lessThanToken);

            var start = this.position;

            for (var i = 0, n = node.typeArguments.childCount(); i < n; i++) {
                if (i % 2 === 1) {
                    this.movePast(node.typeArguments.childAt(i));
                }
                else {
                    array[i / 2] = this.visitType(node.typeArguments.childAt(i));
                }
            }
            this.movePast(node.greaterThanToken);
            
            var result = new ASTList(array);
            this.setSpan(result, start, node.typeArguments);

            return result;
        }

        public visitConstructorType(node: ConstructorTypeSyntax): TypeReference {
            var start = this.position;

            this.movePast(node.newKeyword);
            var typeParameters = node.typeParameterList === null ? null : node.typeParameterList.accept(this);
            var parameters = node.parameterList.accept(this);
            this.movePast(node.equalsGreaterThanToken);
            var returnType = node.type ? this.visitType(node.type) : null;

            var funcDecl = new FunctionDeclaration(null, null, false, typeParameters, parameters, returnType, this.hasDotDotDotParameter(node.parameterList.parameters));
            this.setSpan(funcDecl, start, node);

            funcDecl.setFunctionFlags(funcDecl.getFunctionFlags() | FunctionFlags.Signature | FunctionFlags.ConstructMember);

            funcDecl.setFlags(funcDecl.getFlags() | ASTFlags.TypeReference);
            funcDecl.hint = "_construct";
            funcDecl.classDecl = null;

            var result = new TypeReference(funcDecl, 0);
            this.copySpan(funcDecl, result);

            return result;
        }

        public visitFunctionType(node: FunctionTypeSyntax): TypeReference {
            var start = this.position;
            var typeParameters = node.typeParameterList === null ? null : node.typeParameterList.accept(this);
            var parameters = node.parameterList.accept(this);
            this.movePast(node.equalsGreaterThanToken);
            var returnType = node.type ? this.visitType(node.type) : null;

            var funcDecl = new FunctionDeclaration(null, null, false, typeParameters, parameters, returnType, this.hasDotDotDotParameter(node.parameterList.parameters));
            this.setSpan(funcDecl, start, node);

            funcDecl.setFlags(funcDecl.getFunctionFlags() | FunctionFlags.Signature);
            funcDecl.setFlags(funcDecl.getFlags() | ASTFlags.TypeReference);

            var result = new TypeReference(funcDecl, 0);
            this.copySpan(funcDecl, result);

            return result;
        }

        public visitObjectType(node: ObjectTypeSyntax): TypeReference {
            var start = this.position;

            this.movePast(node.openBraceToken);
            var typeMembers = this.visitSeparatedSyntaxList(node.typeMembers);
            this.movePast(node.closeBraceToken);

            var interfaceDecl = new InterfaceDeclaration(
                new Identifier("__anonymous", "__anonymous"), null, typeMembers, null, null, /*isObjectTypeLiteral:*/ true);
            this.setSpan(interfaceDecl, start, node);

            interfaceDecl.setFlags(interfaceDecl.getFlags() | ASTFlags.TypeReference);

            var result = new TypeReference(interfaceDecl, 0);
            this.copySpan(interfaceDecl, result);

            return result;
        }

        public visitArrayType(node: ArrayTypeSyntax): TypeReference {
            var start = this.position;

            var result: TypeReference;
            var underlying = this.visitType(node.type);
            this.movePast(node.openBracketToken);
            this.movePast(node.closeBracketToken);

            if (underlying.nodeType() === NodeType.TypeRef) {
                result = <TypeReference>underlying;
                result.arrayCount++;
            }
            else {
                result = new TypeReference(underlying, 1);
            }

            result.setFlags(result.getFlags() | ASTFlags.TypeReference);

            this.setSpan(result, start, node);
            return result;
        }

        public visitGenericType(node: GenericTypeSyntax): TypeReference {
            var start = this.position;

            var underlying = this.visitType(node.name).term;
            var typeArguments = node.typeArgumentList.accept(this);

            var genericType = new GenericType(underlying, typeArguments);
            this.setSpan(genericType, start, node);

            genericType.setFlags(genericType.getFlags() | ASTFlags.TypeReference);

            var result = new TypeReference(genericType, 0);
            this.copySpan(genericType, result);

            return result;
        }

        public visitTypeAnnotation(node: TypeAnnotationSyntax): TypeReference {
            this.movePast(node.colonToken);
            return this.visitType(node.type);
        }

        public visitBlock(node: BlockSyntax): Block {
            var start = this.position;

            this.movePast(node.openBraceToken);
            var statements = this.visitSyntaxList(node.statements);
            var closeBracePosition = this.position;

            var closeBraceLeadingComments = this.convertTokenLeadingComments(node.closeBraceToken, this.position);
            this.movePast(node.closeBraceToken);
            var closeBraceSpan = new ASTSpan();
            this.setSpan(closeBraceSpan, closeBracePosition, node.closeBraceToken);

            var result = new Block(statements, closeBraceSpan);
            this.setSpan(result, start, node);

            result.closeBraceLeadingComments = closeBraceLeadingComments;

            return result;
        }

        public visitParameter(node: ParameterSyntax): Parameter {
            var start = this.position;

            this.moveTo(node, node.identifier);
            var identifier = this.identifierFromToken(node.identifier, !!node.questionToken);
            this.movePast(node.identifier);
            this.movePast(node.questionToken);
            var typeExpr = node.typeAnnotation ? node.typeAnnotation.accept(this) : null;
            var init = node.equalsValueClause ? node.equalsValueClause.accept(this) : null;

            var result = new Parameter(identifier, typeExpr, init, !!node.questionToken);
            this.setCommentsAndSpan(result, start, node);

            if (node.publicOrPrivateKeyword) {
                if (node.publicOrPrivateKeyword.kind() === SyntaxKind.PublicKeyword) {
                    result.setVarFlags(result.getVarFlags() | VariableFlags.Property| VariableFlags.Public);
                }
                else {
                    result.setVarFlags(result.getVarFlags() | VariableFlags.Property| VariableFlags.Private);
                }
            }

            if (node.equalsValueClause || node.dotDotDotToken) {
                result.setFlags(result.getFlags() | ASTFlags.OptionalName);
            }

            return result;
        }

        public visitMemberAccessExpression(node: MemberAccessExpressionSyntax): BinaryExpression {
            var start = this.position;

            var expression: AST = node.expression.accept(this);
            this.movePast(node.dotToken);
            var name = this.identifierFromToken(node.name, /*isOptional:*/ false);
            this.movePast(node.name);

            var result = new BinaryExpression(NodeType.MemberAccessExpression, expression, name);
            this.setSpan(result, start, node);

            return result;
        }

        public visitPostfixUnaryExpression(node: PostfixUnaryExpressionSyntax): UnaryExpression {
            var start = this.position;

            var operand = node.operand.accept(this);
            this.movePast(node.operatorToken);

            var result = new UnaryExpression(node.kind() === SyntaxKind.PostIncrementExpression ? NodeType.PostIncrementExpression : NodeType.PostDecrementExpression, operand, null);
            this.setSpan(result, start, node);

            return result;
        }

        public visitElementAccessExpression(node: ElementAccessExpressionSyntax): BinaryExpression {
            var start = this.position;

            var expression = node.expression.accept(this);
            this.movePast(node.openBracketToken);
            var argumentExpression = node.argumentExpression.accept(this);
            this.movePast(node.closeBracketToken);

            var result = new BinaryExpression(NodeType.ElementAccessExpression, expression, argumentExpression);
            this.setSpan(result, start, node);

            return result;
        }

        private convertArgumentListArguments(node: ArgumentListSyntax) {
            if (node === null) {
                return null;
            }

            var start = this.position;

            this.movePast(node.openParenToken);

            var result = this.visitSeparatedSyntaxList(node.arguments);

            if (node.arguments.fullWidth() === 0 && node.closeParenToken.fullWidth() === 0) {
                // If the argument list was empty, and closing paren is missing, set the argument ofsets to be the open paren trivia
                var openParenTokenEnd = start + node.openParenToken.leadingTriviaWidth() + node.openParenToken.width();
                this.setSpanExplicit(result, openParenTokenEnd, openParenTokenEnd + node.openParenToken.trailingTriviaWidth());
            }

            var closeParenPos = this.position;
            this.movePast(node.closeParenToken);
            var closeParenSpan = new ASTSpan();
            this.setSpan(closeParenSpan, closeParenPos, node.closeParenToken);
            
            return {
                argumentList: result,
                closeParenSpan: closeParenSpan
            };
        }

        public visitInvocationExpression(node: InvocationExpressionSyntax): InvocationExpression {
            var start = this.position;

            var expression = node.expression.accept(this);
            var typeArguments = node.argumentList.typeArgumentList !== null
                ? node.argumentList.typeArgumentList.accept(this)
                : null;
            var argumentList = this.convertArgumentListArguments(node.argumentList);

            var result = new InvocationExpression(expression, typeArguments,
                argumentList ? argumentList.argumentList : null, argumentList ? argumentList.closeParenSpan : null);
            this.setSpan(result, start, node);

            return result;
        }

        public visitArgumentList(node: ArgumentListSyntax): ASTList {
            // Processing argument lists should be handled from inside visitInvocationExpression or 
            // visitObjectCreationExpression.
            throw Errors.invalidOperation();
        }

        private getBinaryExpressionNodeType(node: BinaryExpressionSyntax): NodeType {
            switch (node.kind()) {
                case SyntaxKind.CommaExpression: return NodeType.CommaExpression;
                case SyntaxKind.AssignmentExpression: return NodeType.AssignmentExpression;
                case SyntaxKind.AddAssignmentExpression: return NodeType.AddAssignmentExpression;
                case SyntaxKind.SubtractAssignmentExpression: return NodeType.SubtractAssignmentExpression;
                case SyntaxKind.MultiplyAssignmentExpression: return NodeType.MultiplyAssignmentExpression;
                case SyntaxKind.DivideAssignmentExpression: return NodeType.DivideAssignmentExpression;
                case SyntaxKind.ModuloAssignmentExpression: return NodeType.ModuloAssignmentExpression;
                case SyntaxKind.AndAssignmentExpression: return NodeType.AndAssignmentExpression;
                case SyntaxKind.ExclusiveOrAssignmentExpression: return NodeType.ExclusiveOrAssignmentExpression;
                case SyntaxKind.OrAssignmentExpression: return NodeType.OrAssignmentExpression;
                case SyntaxKind.LeftShiftAssignmentExpression: return NodeType.LeftShiftAssignmentExpression;
                case SyntaxKind.SignedRightShiftAssignmentExpression: return NodeType.SignedRightShiftAssignmentExpression;
                case SyntaxKind.UnsignedRightShiftAssignmentExpression: return NodeType.UnsignedRightShiftAssignmentExpression;
                case SyntaxKind.LogicalOrExpression: return NodeType.LogicalOrExpression;
                case SyntaxKind.LogicalAndExpression: return NodeType.LogicalAndExpression;
                case SyntaxKind.BitwiseOrExpression: return NodeType.BitwiseOrExpression;
                case SyntaxKind.BitwiseExclusiveOrExpression: return NodeType.BitwiseExclusiveOrExpression;
                case SyntaxKind.BitwiseAndExpression: return NodeType.BitwiseAndExpression;
                case SyntaxKind.EqualsWithTypeConversionExpression: return NodeType.EqualsWithTypeConversionExpression;
                case SyntaxKind.NotEqualsWithTypeConversionExpression: return NodeType.NotEqualsWithTypeConversionExpression;
                case SyntaxKind.EqualsExpression: return NodeType.EqualsExpression;
                case SyntaxKind.NotEqualsExpression: return NodeType.NotEqualsExpression;
                case SyntaxKind.LessThanExpression: return NodeType.LessThanExpression;
                case SyntaxKind.GreaterThanExpression: return NodeType.GreaterThanExpression;
                case SyntaxKind.LessThanOrEqualExpression: return NodeType.LessThanOrEqualExpression;
                case SyntaxKind.GreaterThanOrEqualExpression: return NodeType.GreaterThanOrEqualExpression;
                case SyntaxKind.InstanceOfExpression: return NodeType.InstanceOfExpression;
                case SyntaxKind.InExpression: return NodeType.InExpression;
                case SyntaxKind.LeftShiftExpression: return NodeType.LeftShiftExpression;
                case SyntaxKind.SignedRightShiftExpression: return NodeType.SignedRightShiftExpression;
                case SyntaxKind.UnsignedRightShiftExpression: return NodeType.UnsignedRightShiftExpression;
                case SyntaxKind.MultiplyExpression: return NodeType.MultiplyExpression;
                case SyntaxKind.DivideExpression: return NodeType.DivideExpression;
                case SyntaxKind.ModuloExpression: return NodeType.ModuloExpression;
                case SyntaxKind.AddExpression: return NodeType.AddExpression;
                case SyntaxKind.SubtractExpression: return NodeType.SubtractExpression;
            }

            throw Errors.invalidOperation();
        }

        public visitBinaryExpression(node: BinaryExpressionSyntax): BinaryExpression {
            var start = this.position;

            var nodeType = this.getBinaryExpressionNodeType(node);
            var left = node.left.accept(this);
            this.movePast(node.operatorToken);
            var right = node.right.accept(this);

            var result = new BinaryExpression(nodeType, left, right);
            this.setSpan(result, start, node);

            if (right.nodeType() === NodeType.FunctionDeclaration) {
                var id = left.nodeType() === NodeType.MemberAccessExpression ? (<BinaryExpression>left).operand2 : left;
                var idHint: string = id.nodeType() === NodeType.Name ? id.actualText : null;

                var funcDecl = <FunctionDeclaration>right;
                funcDecl.hint = idHint;
            }

            return result;
        }

        public visitConditionalExpression(node: ConditionalExpressionSyntax): ConditionalExpression {
            var start = this.position;

            var condition = node.condition.accept(this);
            this.movePast(node.questionToken);
            var whenTrue = node.whenTrue.accept(this);
            this.movePast(node.colonToken);
            var whenFalse = node.whenFalse.accept(this);

            var result = new ConditionalExpression(condition, whenTrue, whenFalse);
            this.setSpan(result, start, node);

            return result;
        }

        public visitConstructSignature(node: ConstructSignatureSyntax): FunctionDeclaration {
            var start = this.position;

            this.movePast(node.newKeyword);
            var typeParameters = node.callSignature.typeParameterList === null ? null : node.callSignature.typeParameterList.accept(this);
            var parameters = node.callSignature.parameterList.accept(this);
            var returnType = node.callSignature.typeAnnotation ? node.callSignature.typeAnnotation.accept(this) : null;

            var result = new FunctionDeclaration(null, null, /*isConstructor:*/ false, typeParameters, parameters, returnType, this.hasDotDotDotParameter(node.callSignature.parameterList.parameters));
            this.setCommentsAndSpan(result, start, node);

            result.hint = "_construct";
            result.setFunctionFlags(result.getFunctionFlags() | FunctionFlags.ConstructMember | FunctionFlags.Method | FunctionFlags.Signature);

            return result;
        }

        public visitMethodSignature(node: MethodSignatureSyntax): FunctionDeclaration {
            var start = this.position;

            var name = this.identifierFromToken(node.propertyName, !!node.questionToken);
            this.movePast(node.propertyName);
            this.movePast(node.questionToken);

            var typeParameters = node.callSignature.typeParameterList ? node.callSignature.typeParameterList.accept(this) : null;
            var parameters = node.callSignature.parameterList.accept(this);
            var returnType = node.callSignature.typeAnnotation ? node.callSignature.typeAnnotation.accept(this) : null;

            var result = new FunctionDeclaration(name, null, false, typeParameters, parameters, returnType, this.hasDotDotDotParameter(node.callSignature.parameterList.parameters));
            this.setCommentsAndSpan(result, start, node);

            result.setFunctionFlags(result.getFunctionFlags() | FunctionFlags.Method | FunctionFlags.Signature);

            return result;
        }

        public visitIndexSignature(node: IndexSignatureSyntax): FunctionDeclaration {
            var start = this.position;

            this.movePast(node.openBracketToken);

            var parameter = node.parameter.accept(this);

            this.movePast(node.closeBracketToken);
            var returnType = node.typeAnnotation ? node.typeAnnotation.accept(this) : null;

            var name = new Identifier("__item", "__item");
            this.setSpanExplicit(name, start, start);   // 0 length name.

            var parameters = new ASTList([parameter]);

            var result = new FunctionDeclaration(name, null, /*isConstructor:*/ false, null, parameters, returnType, false);
            this.setCommentsAndSpan(result, start, node);

            result.setFunctionFlags(result.getFunctionFlags() | FunctionFlags.IndexerMember | FunctionFlags.Method | FunctionFlags.Signature);

            return result;
        }

        public visitPropertySignature(node: PropertySignatureSyntax): VariableDeclarator {
            var start = this.position;

            var name = this.identifierFromToken(node.propertyName, !!node.questionToken);
            this.movePast(node.propertyName);
            this.movePast(node.questionToken);
            var typeExpr = node.typeAnnotation ? node.typeAnnotation.accept(this) : null;

            var result = new VariableDeclarator(name, typeExpr, null);
            this.setCommentsAndSpan(result, start, node);

            result.setVarFlags(result.getVarFlags() | VariableFlags.Property);

            return result;
        }

        public visitParameterList(node: ParameterListSyntax): ASTList {
            var start = this.position;

            var openParenToken = node.openParenToken;
            this.previousTokenTrailingComments = this.convertTokenTrailingComments(
                openParenToken, start + openParenToken.leadingTriviaWidth() + openParenToken.width());

            this.movePast(node.openParenToken);
            var result = this.visitSeparatedSyntaxList(node.parameters);
            this.movePast(node.closeParenToken);

            return result;
        }

        public visitCallSignature(node: CallSignatureSyntax): FunctionDeclaration {
            var start = this.position;

            var typeParameters = node.typeParameterList === null ? null : node.typeParameterList.accept(this);
            var parameters = node.parameterList.accept(this);
            var returnType = node.typeAnnotation ? node.typeAnnotation.accept(this) : null;

            var result = new FunctionDeclaration(null, null, /*isConstructor:*/ false, typeParameters, parameters, returnType, this.hasDotDotDotParameter(node.parameterList.parameters));
            this.setCommentsAndSpan(result, start, node);

            result.hint = "_call";
            result.setFunctionFlags(result.getFunctionFlags() | FunctionFlags.CallMember | FunctionFlags.Method | FunctionFlags.Signature);

            return result;
        }

        public visitTypeParameterList(node: TypeParameterListSyntax): ASTList {
            this.movePast(node.lessThanToken);
            var result = this.visitSeparatedSyntaxList(node.typeParameters);
            this.movePast(node.greaterThanToken);

            return result;
        }

        public visitTypeParameter(node: TypeParameterSyntax): TypeParameter {
            var start = this.position;

            var identifier = this.identifierFromToken(node.identifier, /*isOptional:*/ false);
            this.movePast(node.identifier);
            var constraint = node.constraint ? node.constraint.accept(this) : null;

            var result = new TypeParameter(identifier, constraint);
            this.setSpan(result, start, node);

            return result;
        }

        public visitConstraint(node: ConstraintSyntax): TypeReference {
            this.movePast(node.extendsKeyword);
            return this.visitType(node.type);
        }

        public visitIfStatement(node: IfStatementSyntax): IfStatement {
            var start = this.position;

            this.moveTo(node, node.condition);
            var condition = node.condition.accept(this);
            this.movePast(node.closeParenToken);
            var thenBod = node.statement.accept(this);
            var elseBod = node.elseClause ? node.elseClause.accept(this) : null;

            var result = new IfStatement(condition, thenBod, elseBod);
            this.setSpan(result, start, node);

            return result;
        }

        public visitElseClause(node: ElseClauseSyntax): AST {
            this.movePast(node.elseKeyword);
            return node.statement.accept(this);
        }

        public visitExpressionStatement(node: ExpressionStatementSyntax): ExpressionStatement {
            var start = this.position;

            var expression = node.expression.accept(this);
            this.movePast(node.semicolonToken);

            var result = new ExpressionStatement(expression);
            this.setCommentsAndSpan(result, start, node);

            return result;
        }

        public visitConstructorDeclaration(node: ConstructorDeclarationSyntax): FunctionDeclaration {
            var start = this.position;

            this.moveTo(node, node.parameterList);
            var parameters = node.parameterList.accept(this);

            var block = node.block ? node.block.accept(this) : null;

            this.movePast(node.semicolonToken);

            var result = new FunctionDeclaration(null, block, /*isConstructor:*/ true, null, parameters, null, this.hasDotDotDotParameter(node.parameterList.parameters));
            this.setCommentsAndSpan(result, start, node);

            if (node.semicolonToken) {
                result.setFunctionFlags(result.getFunctionFlags() | FunctionFlags.Signature);
            }

            return result;
        }

        public visitMemberFunctionDeclaration(node: MemberFunctionDeclarationSyntax): FunctionDeclaration {
            var start = this.position;

            this.moveTo(node, node.propertyName);
            var name = this.identifierFromToken(node.propertyName, /*isOptional:*/ false);
            
            this.movePast(node.propertyName);

            var typeParameters = node.callSignature.typeParameterList === null ? null : node.callSignature.typeParameterList.accept(this);
            var parameters = node.callSignature.parameterList.accept(this);
            var returnType = node.callSignature.typeAnnotation
                ? node.callSignature.typeAnnotation.accept(this)
                : null;

            var block = node.block ? node.block.accept(this) : null;
            this.movePast(node.semicolonToken);

            var result = new FunctionDeclaration(name, block, /*isConstructor:*/ false, typeParameters, parameters, returnType, this.hasDotDotDotParameter(node.callSignature.parameterList.parameters));
            this.setCommentsAndSpan(result, start, node);

            var flags = result.getFunctionFlags();
            if (node.semicolonToken) {
                flags = flags | FunctionFlags.Signature;
            }

            if (SyntaxUtilities.containsToken(node.modifiers, SyntaxKind.PrivateKeyword)) {
                flags = flags | FunctionFlags.Private;
            }
            else {
                flags = flags | FunctionFlags.Public;
            }

            if (SyntaxUtilities.containsToken(node.modifiers, SyntaxKind.StaticKeyword)) {
                flags = flags | FunctionFlags.Static;
            }

            flags = flags | FunctionFlags.Method;
            result.setFunctionFlags(flags);

            return result;
        }

        public visitMemberAccessorDeclaration(node: MemberAccessorDeclarationSyntax, typeAnnotation: TypeAnnotationSyntax): FunctionDeclaration {
            var start = this.position;

            this.moveTo(node, node.propertyName);
            var name = this.identifierFromToken(node.propertyName, /*isOptional:*/ false);
            this.movePast(node.propertyName);
            var parameters = node.parameterList.accept(this);
            var returnType = typeAnnotation ? typeAnnotation.accept(this) : null;

            var block = node.block ? node.block.accept(this) : null;
            var result = new FunctionDeclaration(name, block, /*isConstructor:*/ false, null, parameters, returnType, this.hasDotDotDotParameter(node.parameterList.parameters));
            this.setCommentsAndSpan(result, start, node);

            if (SyntaxUtilities.containsToken(node.modifiers, SyntaxKind.PrivateKeyword)) {
                result.setFunctionFlags(result.getFunctionFlags() | FunctionFlags.Private);
            }
            else {
                result.setFunctionFlags(result.getFunctionFlags() | FunctionFlags.Public);
            }

            if (SyntaxUtilities.containsToken(node.modifiers, SyntaxKind.StaticKeyword)) {
                result.setFunctionFlags(result.getFunctionFlags() | FunctionFlags.Static);
            }

            result.setFunctionFlags(result.getFunctionFlags() | FunctionFlags.Method);

            return result;
        }

        public visitGetMemberAccessorDeclaration(node: GetMemberAccessorDeclarationSyntax): FunctionDeclaration {
            var result = this.visitMemberAccessorDeclaration(node, node.typeAnnotation);

            result.setFunctionFlags(result.getFunctionFlags() | FunctionFlags.GetAccessor);
            result.hint = "get" + result.name.actualText;

            return result;
        }

        public visitSetMemberAccessorDeclaration(node: SetMemberAccessorDeclarationSyntax): FunctionDeclaration {
            var result = this.visitMemberAccessorDeclaration(node, null);

            result.setFunctionFlags(result.getFunctionFlags() | FunctionFlags.SetAccessor);
            result.hint = "set" + result.name.actualText;

            return result;
        }

        public visitMemberVariableDeclaration(node: MemberVariableDeclarationSyntax): VariableDeclarator {
            var start = this.position;

            this.moveTo(node, node.variableDeclarator);
            this.moveTo(node.variableDeclarator, node.variableDeclarator.identifier);

            var name = this.identifierFromToken(node.variableDeclarator.identifier, /*isOptional:*/ false);
            this.movePast(node.variableDeclarator.identifier);
            var typeExpr = node.variableDeclarator.typeAnnotation ? node.variableDeclarator.typeAnnotation.accept(this) : null;
            var init = node.variableDeclarator.equalsValueClause ? node.variableDeclarator.equalsValueClause.accept(this) : null;
            this.movePast(node.semicolonToken);

            var result = new VariableDeclarator(name, typeExpr, init);
            this.setCommentsAndSpan(result, start, node);

            if (SyntaxUtilities.containsToken(node.modifiers, SyntaxKind.StaticKeyword)) {
                result.setVarFlags(result.getVarFlags() | VariableFlags.Static);
            }

            if (SyntaxUtilities.containsToken(node.modifiers, SyntaxKind.PrivateKeyword)) {
                result.setVarFlags(result.getVarFlags() | VariableFlags.Private);
            }
            else {
                result.setVarFlags(result.getVarFlags() | VariableFlags.Public);
            }

            result.setVarFlags(result.getVarFlags() | VariableFlags.ClassProperty);

            return result;
        }

        public visitThrowStatement(node: ThrowStatementSyntax): ThrowStatement {
            var start = this.position;

            this.movePast(node.throwKeyword);
            var expression = node.expression.accept(this);
            this.movePast(node.semicolonToken);

            var result = new ThrowStatement(expression);
            this.setSpan(result, start, node);

            return result;
        }

        public visitReturnStatement(node: ReturnStatementSyntax): ReturnStatement {
            var start = this.position;

            this.movePast(node.returnKeyword);
            var expression = node.expression ? node.expression.accept(this) : null;
            this.movePast(node.semicolonToken);

            var result = new ReturnStatement(expression);
            this.setCommentsAndSpan(result, start, node);

            return result;
        }

        public visitObjectCreationExpression(node: ObjectCreationExpressionSyntax): ObjectCreationExpression {
            var start = this.position;

            this.movePast(node.newKeyword);
            var expression = node.expression.accept(this);
            var typeArgumentList = node.argumentList === null || node.argumentList.typeArgumentList === null ? null : node.argumentList.typeArgumentList.accept(this);
            var argumentList = this.convertArgumentListArguments(node.argumentList);

            var result = new ObjectCreationExpression(expression, typeArgumentList,
                argumentList ? argumentList.argumentList : null, argumentList ? argumentList.closeParenSpan : null);
            this.setSpan(result, start, node);

            if (expression.nodeType() === NodeType.TypeRef) {
                var typeRef = <TypeReference>expression;

                if (typeRef.arrayCount === 0) {
                    var term = typeRef.term;
                    if (term.nodeType() === NodeType.MemberAccessExpression || term.nodeType() === NodeType.Name) {
                        expression = term;
                    }
                }
            }

            return result;
        }

        public visitSwitchStatement(node: SwitchStatementSyntax): SwitchStatement {
            var start = this.position;

            this.movePast(node.switchKeyword);
            this.movePast(node.openParenToken);
            var expression = node.expression.accept(this);
            this.movePast(node.closeParenToken);
            var closeParenPosition = this.position;
            this.movePast(node.openBraceToken);

            var array = new Array(node.switchClauses.childCount());
            var defaultCase: CaseClause = null;

            for (var i = 0, n = node.switchClauses.childCount(); i < n; i++) {
                var switchClause = node.switchClauses.childAt(i);
                var translated = switchClause.accept(this);

                if (switchClause.kind() === SyntaxKind.DefaultSwitchClause) {
                    defaultCase = translated;
                }

                array[i] = translated;
            }

            var span = new ASTSpan();
            span.minChar = start;
            span.limChar = closeParenPosition;

            this.movePast(node.closeBraceToken);

            var result = new SwitchStatement(expression, new ASTList(array), defaultCase, span);
            this.setSpan(result, start, node);

            return result;
        }

        public visitCaseSwitchClause(node: CaseSwitchClauseSyntax): CaseClause {
            var start = this.position;

            this.movePast(node.caseKeyword);
            var expression = node.expression.accept(this);
            this.movePast(node.colonToken);
            var statements = this.visitSyntaxList(node.statements);

            var result = new CaseClause(expression, statements);
            this.setSpan(result, start, node);

            return result;
        }

        public visitDefaultSwitchClause(node: DefaultSwitchClauseSyntax): CaseClause {
            var start = this.position;

            this.movePast(node.defaultKeyword);
            this.movePast(node.colonToken);
            var statements = this.visitSyntaxList(node.statements);

            var result = new CaseClause(null, statements);
            this.setSpan(result, start, node);

            return result;
        }

        public visitBreakStatement(node: BreakStatementSyntax): Jump {
            var start = this.position;

            this.movePast(node.breakKeyword);
            this.movePast(node.identifier);
            this.movePast(node.semicolonToken);
            var identifier = node.identifier ? node.identifier.valueText() : null;

            var result = new Jump(NodeType.BreakStatement, identifier);
            this.setSpan(result, start, node);

            return result;
        }

        public visitContinueStatement(node: ContinueStatementSyntax): Jump {
            var start = this.position;

            this.movePast(node.continueKeyword);
            this.movePast(node.identifier);
            this.movePast(node.semicolonToken);

            var result = new Jump(NodeType.ContinueStatement, node.identifier ? node.identifier.valueText() : null);
            this.setSpan(result, start, node);

            return result;
        }

        public visitForStatement(node: ForStatementSyntax): ForStatement {
            var start = this.position;

            this.movePast(node.forKeyword);
            this.movePast(node.openParenToken);
            var init = node.variableDeclaration
                ? node.variableDeclaration.accept(this)
                : node.initializer
                ? node.initializer.accept(this)
                : null;
            this.movePast(node.firstSemicolonToken);
            var cond = node.condition ? node.condition.accept(this) : null;
            this.movePast(node.secondSemicolonToken);
            var incr = node.incrementor ? node.incrementor.accept(this) : null;
            this.movePast(node.closeParenToken);
            var body = node.statement.accept(this);

            var result = new ForStatement(init, cond, incr, body);
            this.setSpan(result, start, node);

            return result;
        }

        public visitForInStatement(node: ForInStatementSyntax): ForInStatement {
            var start = this.position;

            this.movePast(node.forKeyword);
            this.movePast(node.openParenToken);
            var init = node.variableDeclaration ? node.variableDeclaration.accept(this) : node.left.accept(this);
            if (node.variableDeclaration) {
                var variableDeclaration: VariableDeclaration = init;
                for (var i = 0, n = variableDeclaration.declarators.members.length; i < n; i++) {
                    var boundDecl = <BoundDecl>variableDeclaration.declarators.members[i];
                    boundDecl.setVarFlags(boundDecl.getVarFlags() | VariableFlags.ForInVariable);
                }
            }

            this.movePast(node.inKeyword);
            var expression = node.expression.accept(this);
            this.movePast(node.closeParenToken);
            var body = node.statement.accept(this);

            var result = new ForInStatement(init, expression, body);
            this.setSpan(result, start, node);

            return result;
        }

        public visitWhileStatement(node: WhileStatementSyntax): WhileStatement {
            var start = this.position;

            this.moveTo(node, node.condition);
            var condition = node.condition.accept(this);
            this.movePast(node.closeParenToken);
            var statement = node.statement.accept(this);

            var result = new WhileStatement(condition, statement);
            this.setSpan(result, start, node);

            return result;
        }

        public visitWithStatement(node: WithStatementSyntax): WithStatement {
            var start = this.position;

            this.moveTo(node, node.condition);
            var condition = node.condition.accept(this);
            this.movePast(node.closeParenToken);
            var statement = node.statement.accept(this);

            var result = new WithStatement(condition, statement);
            this.setSpan(result, start, node);

            return result;
        }

        public visitCastExpression(node: CastExpressionSyntax): UnaryExpression {
            var start = this.position;

            this.movePast(node.lessThanToken);
            var castTerm = this.visitType(node.type);
            this.movePast(node.greaterThanToken);
            var expression = node.expression.accept(this);

            var result = new UnaryExpression(NodeType.CastExpression, expression, castTerm);
            this.setSpan(result, start, node);

            return result;
        }

        public visitObjectLiteralExpression(node: ObjectLiteralExpressionSyntax): UnaryExpression {
            var start = this.position;

            var openStart = this.position + node.openBraceToken.leadingTriviaWidth();
            this.movePast(node.openBraceToken);

            var propertyAssignments = this.visitSeparatedSyntaxList(node.propertyAssignments);

            var closeStart = this.position + node.closeBraceToken.leadingTriviaWidth();
            this.movePast(node.closeBraceToken);

            var result = new UnaryExpression(NodeType.ObjectLiteralExpression, propertyAssignments, null);
            this.setCommentsAndSpan(result, start, node);

            if (this.isOnSingleLine(openStart, closeStart)) {
                result.setFlags(result.getFlags() | ASTFlags.SingleLine);
            }

            return result;
        }

        public visitSimplePropertyAssignment(node: SimplePropertyAssignmentSyntax): BinaryExpression {
            var start = this.position;

            var left = node.propertyName.accept(this);

            var afterColonComments = this.convertTokenTrailingComments(
                node.colonToken, this.position + node.colonToken.leadingTriviaWidth() + node.colonToken.width());

            this.movePast(node.colonToken);
            var right: AST = node.expression.accept(this);
            right.setPreComments(this.mergeComments(afterColonComments, right.preComments()));

            var result = new BinaryExpression(NodeType.Member, left, right);
            this.setCommentsAndSpan(result, start, node);

            if (right.nodeType() === NodeType.FunctionDeclaration) {
                var funcDecl = <FunctionDeclaration>right;
                funcDecl.hint = left.text();
            }

            return result;
        }

        public visitFunctionPropertyAssignment(node: FunctionPropertyAssignmentSyntax): BinaryExpression {
            var start = this.position;

            var left: Identifier = node.propertyName.accept(this);
            var functionDeclaration = <FunctionDeclaration>node.callSignature.accept(this);
            var block = node.block.accept(this);

            functionDeclaration.hint = left.text();
            functionDeclaration.block = block;
            functionDeclaration.setFunctionFlags(FunctionFlags.IsFunctionProperty);

            var result = new BinaryExpression(NodeType.Member, left, functionDeclaration);
            this.setSpan(result, start, node);

            return result;
        }

        public visitGetAccessorPropertyAssignment(node: GetAccessorPropertyAssignmentSyntax): BinaryExpression {
            var start = this.position;

            this.moveTo(node, node.propertyName);
            var name = this.identifierFromToken(node.propertyName, /*isOptional:*/ false);
            var functionName = this.identifierFromToken(node.propertyName, /*isOptional:*/ false);
            this.movePast(node.propertyName);
            this.movePast(node.openParenToken);
            this.movePast(node.closeParenToken);
            var returnType = node.typeAnnotation
                ? node.typeAnnotation.accept(this)
                : null;

            var block = node.block ? node.block.accept(this) : null;

            var funcDecl = new FunctionDeclaration(functionName, block, /*isConstructor:*/ false, null, new ASTList([]), returnType, false);
            this.setSpan(funcDecl, start, node);

            funcDecl.setFunctionFlags(funcDecl.getFunctionFlags() | FunctionFlags.GetAccessor | FunctionFlags.IsFunctionExpression);
            funcDecl.hint = "get" + node.propertyName.valueText();

            var result = new BinaryExpression(NodeType.Member, name, funcDecl);
            this.copySpan(funcDecl, result);

            return result;
        }

        public visitSetAccessorPropertyAssignment(node: SetAccessorPropertyAssignmentSyntax): BinaryExpression {
            var start = this.position;

            this.moveTo(node, node.propertyName);
            var name = this.identifierFromToken(node.propertyName, /*isOptional:*/ false);
            var functionName = this.identifierFromToken(node.propertyName, /*isOptional:*/ false);
            this.movePast(node.propertyName);
            this.movePast(node.openParenToken);
            var parameter = node.parameter.accept(this);
            this.movePast(node.closeParenToken);

            var parameters = new ASTList([parameter]);

            var block = node.block ? node.block.accept(this) : null;

            var funcDecl = new FunctionDeclaration(functionName, block, /*isConstructor:*/ false, null, parameters, null, false);
            this.setSpan(funcDecl, start, node);

            funcDecl.setFunctionFlags(funcDecl.getFunctionFlags() | FunctionFlags.SetAccessor | FunctionFlags.IsFunctionExpression);
            funcDecl.hint = "set" + node.propertyName.valueText();

            var result = new BinaryExpression(NodeType.Member, name, funcDecl);
            this.copySpan(funcDecl, result);

            return result;
        }

        public visitFunctionExpression(node: FunctionExpressionSyntax): FunctionDeclaration {
            var start = this.position;

            this.movePast(node.functionKeyword);
            var name = node.identifier === null ? null : this.identifierFromToken(node.identifier, /*isOptional:*/ false);
            this.movePast(node.identifier);
            var typeParameters = node.callSignature.typeParameterList === null ? null : node.callSignature.typeParameterList.accept(this);
            var parameters = node.callSignature.parameterList.accept(this);
            var returnType = node.callSignature.typeAnnotation
                ? node.callSignature.typeAnnotation.accept(this)
                : null;

            var block = node.block ? node.block.accept(this) : null;

            var result = new FunctionDeclaration(name, block, false, typeParameters, parameters, returnType, this.hasDotDotDotParameter(node.callSignature.parameterList.parameters));
            this.setCommentsAndSpan(result, start, node);

            result.setFunctionFlags(result.getFunctionFlags() | FunctionFlags.IsFunctionExpression);

            return result;
        }

        public visitEmptyStatement(node: EmptyStatementSyntax): EmptyStatement {
            var start = this.position;

            this.movePast(node.semicolonToken);

            var result = new EmptyStatement();
            this.setSpan(result, start, node);

            return result;
        }

        public visitTryStatement(node: TryStatementSyntax): TryStatement {
            var start = this.position;

            this.movePast(node.tryKeyword);
            var tryBody = node.block.accept(this);

            var catchClause: CatchClause = null;
            if (node.catchClause !== null) {
                catchClause = node.catchClause.accept(this);
            }

            var finallyBody: Block = null;
            if (node.finallyClause !== null) {
                finallyBody = node.finallyClause.accept(this);
            }

            var result = new TryStatement(tryBody, catchClause, finallyBody);
            this.setSpan(result, start, node);

            return result;
        }

        public visitCatchClause(node: CatchClauseSyntax): CatchClause {
            var start = this.position;

            this.movePast(node.catchKeyword);
            this.movePast(node.openParenToken);
            var identifier = this.identifierFromToken(node.identifier, /*isOptional:*/ false);
            this.movePast(node.identifier);
            var typeExpr = node.typeAnnotation ? node.typeAnnotation.accept(this) : null;
            this.movePast(node.closeParenToken);
            var block = node.block.accept(this);

            var varDecl = new VariableDeclarator(identifier, typeExpr, null);
            this.setSpanExplicit(varDecl, identifier.minChar, identifier.limChar);

            var result = new CatchClause(varDecl, block);
            this.setSpan(result, start, node);

            return result;
        }

        public visitFinallyClause(node: FinallyClauseSyntax): Block {
            this.movePast(node.finallyKeyword);
            return node.block.accept(this);
        }

        public visitLabeledStatement(node: LabeledStatementSyntax): LabeledStatement {
            var start = this.position;

            var identifier = this.identifierFromToken(node.identifier, /*isOptional:*/ false);
            this.movePast(node.identifier);
            this.movePast(node.colonToken);
            var statement = node.statement.accept(this);

            var result = new LabeledStatement(identifier, statement);
            this.setSpan(result, start, node);

            return result;
        }

        public visitDoStatement(node: DoStatementSyntax): DoStatement {
            var start = this.position;

            this.movePast(node.doKeyword);
            var statement = node.statement.accept(this);
            var whileSpan = new ASTSpan();
            this.setSpan(whileSpan, this.position, node.whileKeyword);

            this.movePast(node.whileKeyword);
            this.movePast(node.openParenToken);
            var condition = node.condition.accept(this);
            this.movePast(node.closeParenToken);
            this.movePast(node.semicolonToken);

            var result = new DoStatement(statement, condition, whileSpan);
            this.setSpan(result, start, node);

            return result;
        }

        public visitTypeOfExpression(node: TypeOfExpressionSyntax): UnaryExpression {
            var start = this.position;

            this.movePast(node.typeOfKeyword);
            var expression = node.expression.accept(this);

            var result = new UnaryExpression(NodeType.TypeOfExpression, expression, null);
            this.setSpan(result, start, node);

            return result;
        }

        public visitDeleteExpression(node: DeleteExpressionSyntax): UnaryExpression {
            var start = this.position;

            this.movePast(node.deleteKeyword);
            var expression = node.expression.accept(this);

            var result = new UnaryExpression(NodeType.DeleteExpression, expression, null);
            this.setSpan(result, start, node);

            return result;
        }

        public visitVoidExpression(node: VoidExpressionSyntax): UnaryExpression {
            var start = this.position;

            this.movePast(node.voidKeyword);
            var expression = node.expression.accept(this);

            var result = new UnaryExpression(NodeType.VoidExpression, expression, null);
            this.setSpan(result, start, node);

            return result;
        }

        public visitDebuggerStatement(node: DebuggerStatementSyntax): DebuggerStatement {
            var start = this.position;

            this.movePast(node.debuggerKeyword);
            this.movePast(node.semicolonToken);

            var result = new DebuggerStatement();
            this.setSpan(result, start, node);

            return result;
        }
    }

    class SyntaxTreeToIncrementalAstVisitor extends SyntaxTreeToAstVisitor {
        private applyDelta(ast: TypeScript.AST, delta: number) {
            if (delta === 0) {
                return;
            }

            var applyDelta = (ast: TypeScript.AST) => {
                if (ast.minChar !== -1) {
                    ast.minChar += delta;
                }
                if (ast.limChar !== -1) {
                    ast.limChar += delta;
                }
            };

            var applyDeltaToComments = (comments: TypeScript.Comment[]) => {
                if (comments && comments.length > 0) {
                    for (var i = 0; i < comments.length; i++) {
                        var comment = comments[i];
                        applyDelta(comment);
                    }
                }
            };

            var pre = function (cur: TypeScript.AST, parent: TypeScript.AST, walker: TypeScript.IAstWalker) {
                // Apply delta to this node
                applyDelta(cur);
                applyDeltaToComments(cur.preComments());
                applyDeltaToComments(cur.postComments());

                return cur;
            };

            TypeScript.getAstWalkerFactory().walk(ast, pre);
        }

        public setSpanExplicit(span: IASTSpan, start: number, end: number): void {
            if (span.minChar !== -1) {
                // Have an existing span.  We need to adjust it so that it starts at the provided
                // desiredMinChar.

                var delta = start - span.minChar;
                this.applyDelta(<AST>span, delta);

                span.limChar = end;
            }
            else {
                super.setSpanExplicit(span, start, end);
            }
        }

        private getAndMovePastAST(element: ISyntaxElement): any {
            if (this.previousTokenTrailingComments !== null) {
                return null;
            }

            var result = (<any>element)._ast;
            if (!result) {
                return null;
            }

            // We previous mapped this element to an AST node.  Return the AST node (with its 
            // positions properly updated), and move past it.
            var start = this.position;
            this.movePast(element);
            this.setSpan(result, start, element);
            return result;
        }

        private setAST(element: ISyntaxElement, ast: IASTSpan): void {
            (<any>element)._ast = ast;
        }

        public visitSyntaxList(list: ISyntaxList): ASTList {
            var result: ASTList = this.getAndMovePastAST(list);
            if (!result) {
                result = super.visitSyntaxList(list);

                if (list.childCount() > 0) {
                    // Don't cache 0 lengthed lists as we only have a single sentinel value for them
                    this.setAST(list, result);
                }
            }

            return result;
        }

        public visitSeparatedSyntaxList(list: ISeparatedSyntaxList): ASTList {
            var result: ASTList = this.getAndMovePastAST(list);
            if (!result) {
                result = super.visitSeparatedSyntaxList(list);

                if (list.childCount() > 0) {
                    // Don't cache 0 lengthed lists as we only have a single sentinel value for them
                    this.setAST(list, result);
                }
            }

            return result;
        }

        public visitToken(token: ISyntaxToken): AST {
            var result = this.getAndMovePastAST(token);

            if (!result) {
                result = super.visitToken(token);
                this.setAST(token, result);
            }

            return result;
        }

        public visitClassDeclaration(node: ClassDeclarationSyntax): ClassDeclaration {
            var result: ClassDeclaration = this.getAndMovePastAST(node);
            if (result) {
                this.completeClassDeclaration(node, result);
            }
            else {
                result = super.visitClassDeclaration(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitInterfaceDeclaration(node: InterfaceDeclarationSyntax): InterfaceDeclaration {
            var result: InterfaceDeclaration = this.getAndMovePastAST(node);
            if (result) {
                this.completeInterfaceDeclaration(node, result);
            }
            else {
                result = super.visitInterfaceDeclaration(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitHeritageClause(node: HeritageClauseSyntax): ASTList {
            var result: ASTList = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitHeritageClause(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitModuleDeclaration(node: ModuleDeclarationSyntax): ModuleDeclaration {
            var result: ModuleDeclaration = this.getAndMovePastAST(node);
            if (result) {
                this.completeModuleDeclaration(node, result);
            }
            else {
                result = super.visitModuleDeclaration(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitFunctionDeclaration(node: FunctionDeclarationSyntax): FunctionDeclaration {
            var result: FunctionDeclaration = this.getAndMovePastAST(node);
            if (result) {
                this.completeFunctionDeclaration(node, result);
            }
            else {
                result = super.visitFunctionDeclaration(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitImportDeclaration(node: ImportDeclarationSyntax): ImportDeclaration {
            var result: ImportDeclaration = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitImportDeclaration(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitExportAssignment(node: ExportAssignmentSyntax): ExportAssignment {
            var result: ExportAssignment = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitExportAssignment(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitPrefixUnaryExpression(node: PrefixUnaryExpressionSyntax): UnaryExpression {
            var result: UnaryExpression = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitPrefixUnaryExpression(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitArrayLiteralExpression(node: ArrayLiteralExpressionSyntax): UnaryExpression {
            var result: UnaryExpression = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitArrayLiteralExpression(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitOmittedExpression(node: OmittedExpressionSyntax): OmittedExpression {
            var result: OmittedExpression = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitOmittedExpression(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitParenthesizedExpression(node: ParenthesizedExpressionSyntax): ParenthesizedExpression {
            var result: ParenthesizedExpression = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitParenthesizedExpression(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitSimpleArrowFunctionExpression(node: SimpleArrowFunctionExpressionSyntax): FunctionDeclaration {
            var result: FunctionDeclaration = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitSimpleArrowFunctionExpression(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitParenthesizedArrowFunctionExpression(node: ParenthesizedArrowFunctionExpressionSyntax): FunctionDeclaration {
            var result: FunctionDeclaration = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitParenthesizedArrowFunctionExpression(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitQualifiedName(node: QualifiedNameSyntax): TypeReference {
            var result: TypeReference = this.getAndMovePastAST(node);
            if (!result) {
                var result = super.visitQualifiedName(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitConstructorType(node: ConstructorTypeSyntax): TypeReference {
            var result: TypeReference = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitConstructorType(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitFunctionType(node: FunctionTypeSyntax): TypeReference {
            var result: TypeReference = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitFunctionType(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitObjectType(node: ObjectTypeSyntax): TypeReference {
            var start = this.position;
            var result: TypeReference = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitObjectType(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitArrayType(node: ArrayTypeSyntax): TypeReference {
            var result: TypeReference = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitArrayType(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitGenericType(node: GenericTypeSyntax): TypeReference {
            var result: TypeReference = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitGenericType(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitBlock(node: BlockSyntax): Block {
            var result: Block = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitBlock(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitParameter(node: ParameterSyntax): Parameter {
            var result: Parameter = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitParameter(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitMemberAccessExpression(node: MemberAccessExpressionSyntax): BinaryExpression {
            var result: BinaryExpression = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitMemberAccessExpression(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitPostfixUnaryExpression(node: PostfixUnaryExpressionSyntax): UnaryExpression {
            var result: UnaryExpression = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitPostfixUnaryExpression(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitElementAccessExpression(node: ElementAccessExpressionSyntax): BinaryExpression {
            var result: BinaryExpression = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitElementAccessExpression(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitInvocationExpression(node: InvocationExpressionSyntax): InvocationExpression {
            var result: InvocationExpression = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitInvocationExpression(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitBinaryExpression(node: BinaryExpressionSyntax): BinaryExpression {
            var result: BinaryExpression = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitBinaryExpression(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitConditionalExpression(node: ConditionalExpressionSyntax): ConditionalExpression {
            var result: ConditionalExpression = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitConditionalExpression(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitConstructSignature(node: ConstructSignatureSyntax): FunctionDeclaration {
            var result: FunctionDeclaration = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitConstructSignature(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitMethodSignature(node: MethodSignatureSyntax): FunctionDeclaration {
            var result: FunctionDeclaration = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitMethodSignature(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitIndexSignature(node: IndexSignatureSyntax): FunctionDeclaration {
            var result: FunctionDeclaration = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitIndexSignature(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitPropertySignature(node: PropertySignatureSyntax): VariableDeclarator {
            var result: VariableDeclarator = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitPropertySignature(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitCallSignature(node: CallSignatureSyntax): FunctionDeclaration {
            var result: FunctionDeclaration = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitCallSignature(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitTypeParameter(node: TypeParameterSyntax): TypeParameter {
            var result: TypeParameter = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitTypeParameter(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitIfStatement(node: IfStatementSyntax): IfStatement {
            var result: IfStatement = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitIfStatement(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitExpressionStatement(node: ExpressionStatementSyntax): ExpressionStatement {
            var result: ExpressionStatement = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitExpressionStatement(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitConstructorDeclaration(node: ConstructorDeclarationSyntax): FunctionDeclaration {
            var result: FunctionDeclaration = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitConstructorDeclaration(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitMemberFunctionDeclaration(node: MemberFunctionDeclarationSyntax): FunctionDeclaration {
            var result: FunctionDeclaration = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitMemberFunctionDeclaration(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitMemberAccessorDeclaration(node: MemberAccessorDeclarationSyntax, typeAnnotation: TypeAnnotationSyntax): FunctionDeclaration {
            var result: FunctionDeclaration = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitMemberAccessorDeclaration(node, typeAnnotation);
                this.setAST(node, result);
            }

            return result;
        }

        public visitMemberVariableDeclaration(node: MemberVariableDeclarationSyntax): VariableDeclarator {
            var result: VariableDeclarator = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitMemberVariableDeclaration(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitThrowStatement(node: ThrowStatementSyntax): ThrowStatement {
            var result: ThrowStatement = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitThrowStatement(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitReturnStatement(node: ReturnStatementSyntax): ReturnStatement {
            var result: ReturnStatement = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitReturnStatement(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitObjectCreationExpression(node: ObjectCreationExpressionSyntax): ObjectCreationExpression {
            var result: ObjectCreationExpression = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitObjectCreationExpression(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitSwitchStatement(node: SwitchStatementSyntax): SwitchStatement {
            var result: SwitchStatement = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitSwitchStatement(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitCaseSwitchClause(node: CaseSwitchClauseSyntax): CaseClause {
            var result: CaseClause = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitCaseSwitchClause(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitDefaultSwitchClause(node: DefaultSwitchClauseSyntax): CaseClause {
            var result: CaseClause = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitDefaultSwitchClause(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitBreakStatement(node: BreakStatementSyntax): Jump {
            var result: Jump = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitBreakStatement(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitContinueStatement(node: ContinueStatementSyntax): Jump {
            var result: Jump = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitContinueStatement(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitForStatement(node: ForStatementSyntax): ForStatement {
            var result: ForStatement = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitForStatement(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitForInStatement(node: ForInStatementSyntax): ForInStatement {
            var result: ForInStatement = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitForInStatement(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitWhileStatement(node: WhileStatementSyntax): WhileStatement {
            var result: WhileStatement = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitWhileStatement(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitWithStatement(node: WithStatementSyntax): WithStatement {
            var result: WithStatement = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitWithStatement(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitCastExpression(node: CastExpressionSyntax): UnaryExpression {
            var result: UnaryExpression = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitCastExpression(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitObjectLiteralExpression(node: ObjectLiteralExpressionSyntax): UnaryExpression {
            var result: UnaryExpression = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitObjectLiteralExpression(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitSimplePropertyAssignment(node: SimplePropertyAssignmentSyntax): BinaryExpression {
            var result: BinaryExpression = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitSimplePropertyAssignment(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitFunctionPropertyAssignment(node: FunctionPropertyAssignmentSyntax): BinaryExpression {
            var result: BinaryExpression = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitFunctionPropertyAssignment(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitGetAccessorPropertyAssignment(node: GetAccessorPropertyAssignmentSyntax): BinaryExpression {
            var result: BinaryExpression = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitGetAccessorPropertyAssignment(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitSetAccessorPropertyAssignment(node: SetAccessorPropertyAssignmentSyntax): BinaryExpression {
            var result: BinaryExpression = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitSetAccessorPropertyAssignment(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitFunctionExpression(node: FunctionExpressionSyntax): FunctionDeclaration {
            var result: FunctionDeclaration = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitFunctionExpression(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitEmptyStatement(node: EmptyStatementSyntax): EmptyStatement {
            var result: EmptyStatement = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitEmptyStatement(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitTryStatement(node: TryStatementSyntax): TryStatement {
            var result: TryStatement = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitTryStatement(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitCatchClause(node: CatchClauseSyntax): CatchClause {
            var result: CatchClause = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitCatchClause(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitLabeledStatement(node: LabeledStatementSyntax): LabeledStatement {
            var result: LabeledStatement = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitLabeledStatement(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitDoStatement(node: DoStatementSyntax): DoStatement {
            var result: DoStatement = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitDoStatement(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitTypeOfExpression(node: TypeOfExpressionSyntax): UnaryExpression {
            var result: UnaryExpression = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitTypeOfExpression(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitDeleteExpression(node: DeleteExpressionSyntax): UnaryExpression {
            var result: UnaryExpression = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitDeleteExpression(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitVoidExpression(node: VoidExpressionSyntax): UnaryExpression {
            var result: UnaryExpression = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitVoidExpression(node);
                this.setAST(node, result);
            }

            return result;
        }

        public visitDebuggerStatement(node: DebuggerStatementSyntax): DebuggerStatement {
            var result: DebuggerStatement = this.getAndMovePastAST(node);
            if (!result) {
                result = super.visitDebuggerStatement(node);
                this.setAST(node, result);
            }

            return result;
        }
    }
}