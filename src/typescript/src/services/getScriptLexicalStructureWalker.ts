module TypeScript.Services {
    export class GetScriptLexicalStructureWalker extends TypeScript.PositionTrackingWalker {
        private nameStack: string[] = [];
        private kindStack: string[] = [];
        private currentMemberVariableDeclaration: TypeScript.MemberVariableDeclarationSyntax = null;
        private currentVariableStatement: TypeScript.VariableStatementSyntax = null;
        private currentInterfaceDeclaration: TypeScript.InterfaceDeclarationSyntax = null;

        constructor(private items: NavigateToItem[], private fileName: string) {
            super();
        }

        static getListsOfAllScriptLexicalStructure(items: NavigateToItem[], fileName: string, unit: TypeScript.SourceUnitSyntax) {
            var visitor = new GetScriptLexicalStructureWalker(items, fileName);
            unit.accept(visitor);
        }

        private createItem(
                node: TypeScript.SyntaxNode,
                modifiers: TypeScript.ISyntaxList,
                kind: string,
                name: string): void {
            var item = new NavigateToItem();
            item.name = name;
            item.kind = kind;
            item.matchKind = MatchKind.exact;
            item.fileName = this.fileName;
            item.kindModifiers = this.getKindModifiers(modifiers);
            item.minChar = this.position() + node.leadingTriviaWidth();
            item.limChar = item.minChar + node.width();
            item.containerName = this.nameStack.join(".");
            item.containerKind = this.kindStack.length === 0 ? "" : TypeScript.ArrayUtilities.last(this.kindStack);

            this.items.push(item);
        }

        private getKindModifiers(modifiers: TypeScript.ISyntaxList): string {
            var result: string[] = [];

            if (TypeScript.SyntaxUtilities.containsToken(modifiers, TypeScript.SyntaxKind.ExportKeyword)) {
                result.push(ScriptElementKindModifier.exportedModifier);
            }

            if (TypeScript.SyntaxUtilities.containsToken(modifiers, TypeScript.SyntaxKind.DeclareKeyword)) {
                result.push(ScriptElementKindModifier.ambientModifier);
            }

            if (TypeScript.SyntaxUtilities.containsToken(modifiers, TypeScript.SyntaxKind.PublicKeyword)) {
                result.push(ScriptElementKindModifier.publicMemberModifier);
            }

            if (TypeScript.SyntaxUtilities.containsToken(modifiers, TypeScript.SyntaxKind.PrivateKeyword)) {
                result.push(ScriptElementKindModifier.privateMemberModifier);
            }

            if (TypeScript.SyntaxUtilities.containsToken(modifiers, TypeScript.SyntaxKind.StaticKeyword)) {
                result.push(ScriptElementKindModifier.staticModifier);
            }

            return result.length > 0 ? result.join(',') : ScriptElementKindModifier.none;
        }

        public visitModuleDeclaration(node: TypeScript.ModuleDeclarationSyntax): void {
            var names = this.getModuleNames(node);
            this.visitModuleDeclarationWorker(node, names, 0);
        }

        private visitModuleDeclarationWorker(node: TypeScript.ModuleDeclarationSyntax, names: string[], nameIndex: number): void {
            if (nameIndex === names.length) {
                // We're after all the module names, descend and process all children.
                super.visitModuleDeclaration(node);
            }
            else {
                // If we have a dotted module (like "module A.B.C"):
                //  1) If we're the outermost module, then use the modifiers provided on the node.
                //  2) For any inner modules, consider it exported.
                var modifiers = nameIndex === 0
                    ? node.modifiers
                    : TypeScript.Syntax.list([TypeScript.Syntax.token(TypeScript.SyntaxKind.ExportKeyword)]);
                var name = names[nameIndex];
                var kind = ScriptElementKind.moduleElement;
                this.createItem(node, node.modifiers, kind, name);

                this.nameStack.push(name);
                this.kindStack.push(kind);

                this.visitModuleDeclarationWorker(node, names, nameIndex + 1);

                this.nameStack.pop();
                this.kindStack.pop();
            }
        }

        private getModuleNames(node: TypeScript.ModuleDeclarationSyntax): string[] {
            var result: string[] = [];

            if (node.stringLiteral) {
                result.push(node.stringLiteral.text());
            }
            else {
                this.getModuleNamesHelper(node.name, result);
            }

            return result;
        }

        private getModuleNamesHelper(name: TypeScript.INameSyntax, result: string[]): void {
            if (name.kind() === TypeScript.SyntaxKind.QualifiedName) {
                var qualifiedName = <TypeScript.QualifiedNameSyntax>name;
                this.getModuleNamesHelper(qualifiedName.left, result);
                result.push(qualifiedName.right.text());
            }
            else {
                result.push((<TypeScript.ISyntaxToken>name).text());
            }
        }

        public visitClassDeclaration(node: TypeScript.ClassDeclarationSyntax): void {
            var name = node.identifier.text();
            var kind = ScriptElementKind.classElement;

            this.createItem(node, node.modifiers, kind, name);

            this.nameStack.push(name);
            this.kindStack.push(kind);

            super.visitClassDeclaration(node);

            this.nameStack.pop();
            this.kindStack.pop();
        }

        public visitInterfaceDeclaration(node: TypeScript.InterfaceDeclarationSyntax): void {
            var name = node.identifier.text();
            var kind = ScriptElementKind.interfaceElement;

            this.createItem(node, node.modifiers, kind, name);

            this.nameStack.push(name);
            this.kindStack.push(kind);

            this.currentInterfaceDeclaration = node;
            super.visitInterfaceDeclaration(node);
            this.currentInterfaceDeclaration = null;

            this.nameStack.pop();
            this.kindStack.pop();
        }

        public visitObjectType(node: TypeScript.ObjectTypeSyntax): void {
            // Ignore an object type if we aren't inside an interface declaration.  We don't want
            // to add some random object type's members to the nav bar.
            if (this.currentInterfaceDeclaration === null) {
                this.skip(node);
            }
            else {
                super.visitObjectType(node);
            }
        }

        public visitEnumDeclaration(node: TypeScript.EnumDeclarationSyntax): void {
            var name = node.identifier.text();
            var kind = ScriptElementKind.enumElement;

            this.createItem(node, node.modifiers, kind, name);

            this.nameStack.push(name);
            this.kindStack.push(kind);

            super.visitEnumDeclaration(node);

            this.nameStack.pop();
            this.kindStack.pop();
        }

        public visitConstructorDeclaration(node: TypeScript.ConstructorDeclarationSyntax): void {
            var item = this.createItem(node, TypeScript.Syntax.emptyList, ScriptElementKind.constructorImplementationElement, "constructor");

            // No need to descend into a constructor;
            this.skip(node);
        }

        public visitMemberFunctionDeclaration(node: TypeScript.MemberFunctionDeclarationSyntax): void {
            var item = this.createItem(node, node.modifiers, ScriptElementKind.memberFunctionElement, node.propertyName.text());

            // No need to descend into a member function;
            this.skip(node);
        }

        public visitGetAccessor(node: TypeScript.GetAccessorSyntax): void {
            var item = this.createItem(node, node.modifiers, ScriptElementKind.memberGetAccessorElement, node.propertyName.text());

            // No need to descend into a member accessor;
            this.skip(node);
        }

        public visitSetAccessor(node: TypeScript.SetAccessorSyntax): void {
            var item = this.createItem(node, node.modifiers, ScriptElementKind.memberSetAccessorElement, node.propertyName.text());

            // No need to descend into a member accessor;
            this.skip(node);
        }

        public visitMemberVariableDeclaration(node: TypeScript.MemberVariableDeclarationSyntax): void {
            this.currentMemberVariableDeclaration = node;
            super.visitMemberVariableDeclaration(node);
            this.currentMemberVariableDeclaration = null;
        }

        public visitVariableStatement(node: TypeScript.VariableStatementSyntax): void {
            this.currentVariableStatement = node;
            super.visitVariableStatement(node);
            this.currentVariableStatement = null;
        }

        public visitVariableDeclarator(node: TypeScript.VariableDeclaratorSyntax): void {
            var modifiers = this.currentMemberVariableDeclaration
                ? this.currentMemberVariableDeclaration.modifiers
                : TypeScript.Syntax.emptyList;
            var kind = this.currentMemberVariableDeclaration
                ? ScriptElementKind.memberVariableElement
                : ScriptElementKind.variableElement;
            var item = this.createItem(node, modifiers, kind, node.propertyName.text());

            // No need to descend into a variable declarator;
            this.skip(node);
        }

        public visitIndexSignature(node: TypeScript.IndexSignatureSyntax): void {
            var item = this.createItem(node, TypeScript.Syntax.emptyList, ScriptElementKind.indexSignatureElement, "[]");

            // No need to descend into an index signature;
            this.skip(node);
        }

        public visitEnumElement(node: TypeScript.EnumElementSyntax): void {
            var item = this.createItem(node, TypeScript.Syntax.emptyList, ScriptElementKind.memberVariableElement, node.propertyName.text());

            // No need to descend into an enum element;
            this.skip(node);
        }

        public visitCallSignature(node: TypeScript.CallSignatureSyntax): void {
            var item = this.createItem(node, TypeScript.Syntax.emptyList, ScriptElementKind.callSignatureElement, "()");

            // No need to descend into a call signature;
            this.skip(node);
        }

        public visitConstructSignature(node: TypeScript.ConstructSignatureSyntax): void {
            var item = this.createItem(node, TypeScript.Syntax.emptyList, ScriptElementKind.constructSignatureElement, "new()");

            // No need to descend into a construct signature;
            this.skip(node);
        }

        public visitMethodSignature(node: TypeScript.MethodSignatureSyntax): void {
            var item = this.createItem(node, TypeScript.Syntax.emptyList, ScriptElementKind.memberFunctionElement, node.propertyName.text());

            // No need to descend into a method signature;
            this.skip(node);
        }

        public visitPropertySignature(node: TypeScript.PropertySignatureSyntax): void {
            var item = this.createItem(node, TypeScript.Syntax.emptyList, ScriptElementKind.memberVariableElement, node.propertyName.text());

            // No need to descend into a property signature;
            this.skip(node);
        }

        public visitFunctionDeclaration(node: TypeScript.FunctionDeclarationSyntax): void {
            var item = this.createItem(node, node.modifiers, ScriptElementKind.functionElement, node.identifier.text());

            // No need to descend into a function declaration;
            this.skip(node);
        }

        // Common statement types.  Don't even bother walking into them as we'll never find anything
        // inside that we'd put in the navbar.

        public visitBlock(node: TypeScript.BlockSyntax): void {
            this.skip(node);
        }

        public visitIfStatement(node: TypeScript.IfStatementSyntax): void {
            this.skip(node);
        }

        public visitExpressionStatement(node: TypeScript.ExpressionStatementSyntax): void {
            this.skip(node);
        }

        public visitThrowStatement(node: TypeScript.ThrowStatementSyntax): void {
            this.skip(node);
        }

        public visitReturnStatement(node: TypeScript.ReturnStatementSyntax): void {
            this.skip(node);
        }

        public visitSwitchStatement(node: TypeScript.SwitchStatementSyntax): void {
            this.skip(node);
        }

        public visitWithStatement(node: TypeScript.WithStatementSyntax): void {
            this.skip(node);
        }

        public visitTryStatement(node: TypeScript.TryStatementSyntax): void {
            this.skip(node);
        }

        public visitLabeledStatement(node: TypeScript.LabeledStatementSyntax): void {
            this.skip(node);
        }
    }
}