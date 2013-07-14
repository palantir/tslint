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
    export interface IAstWalker {
        walk(ast: AST, parent: AST): AST;
        options: AstWalkOptions;
        state: any; // user state object
    }

    export class AstWalkOptions {
        public goChildren = true;
    }

    export interface IAstWalkCallback {
        (ast: AST, parent: AST, walker: IAstWalker): AST;
    }

    export interface IAstWalkChildren {
        (preAst: AST, parent: AST, walker: IAstWalker): void;
    }

    class AstWalker implements IAstWalker {
        constructor(
            private childrenWalkers: IAstWalkChildren[],
            private pre: IAstWalkCallback,
            private post: IAstWalkCallback,
            public options: AstWalkOptions,
            public state: any) {
        }

        public walk(ast: AST, parent: AST): AST {
            var preAst = this.pre(ast, parent, this);
            if (preAst === undefined) {
                preAst = ast;
            }
            if (this.options.goChildren) {
                // Call the "walkChildren" function corresponding to "nodeType".
                this.childrenWalkers[ast.nodeType](ast, parent, this);
            }
            else {
                // no go only applies to children of node issuing it
                this.options.goChildren = true;
            }

            if (this.post) {
                var postAst = this.post(preAst, parent, this);
                if (postAst === undefined) {
                    postAst = preAst;
                }
                return postAst;
            }
            else {
                return preAst;
            }
        }
    }

    export class AstWalkerFactory {
        private childrenWalkers: IAstWalkChildren[] = [];

        constructor() {
            this.initChildrenWalkers();
        }

        public walk(ast: AST, pre: IAstWalkCallback, post?: IAstWalkCallback, options?: AstWalkOptions, state?: any): AST {
            return this.getWalker(pre, post, options, state).walk(ast, null)
        }

        public getWalker(pre: IAstWalkCallback, post?: IAstWalkCallback, options?: AstWalkOptions, state?: any): IAstWalker {
            return this.getSlowWalker(pre, post, options, state);
        }

        private getSlowWalker(pre: IAstWalkCallback, post?: IAstWalkCallback, options?: AstWalkOptions, state?: any): IAstWalker {
            if (!options) {
                options = new AstWalkOptions();
            }

            return new AstWalker(this.childrenWalkers, pre, post, options, state);
        }

        private initChildrenWalkers(): void {
            this.childrenWalkers[NodeType.None] = ChildrenWalkers.walkNone;
            this.childrenWalkers[NodeType.EmptyStatement] = ChildrenWalkers.walkNone;
            this.childrenWalkers[NodeType.OmittedExpression] = ChildrenWalkers.walkNone;
            this.childrenWalkers[NodeType.TrueLiteral] = ChildrenWalkers.walkNone;
            this.childrenWalkers[NodeType.FalseLiteral] = ChildrenWalkers.walkNone;
            this.childrenWalkers[NodeType.ThisExpression] = ChildrenWalkers.walkNone;
            this.childrenWalkers[NodeType.SuperExpression] = ChildrenWalkers.walkNone;
            this.childrenWalkers[NodeType.StringLiteral] = ChildrenWalkers.walkNone;
            this.childrenWalkers[NodeType.RegularExpressionLiteral] = ChildrenWalkers.walkNone;
            this.childrenWalkers[NodeType.NullLiteral] = ChildrenWalkers.walkNone;
            this.childrenWalkers[NodeType.ArrayLiteralExpression] = ChildrenWalkers.walkUnaryExpressionChildren;
            this.childrenWalkers[NodeType.ObjectLiteralExpression] = ChildrenWalkers.walkUnaryExpressionChildren;
            this.childrenWalkers[NodeType.VoidExpression] = ChildrenWalkers.walkUnaryExpressionChildren;
            this.childrenWalkers[NodeType.CommaExpression] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.PlusExpression] = ChildrenWalkers.walkUnaryExpressionChildren;
            this.childrenWalkers[NodeType.NegateExpression] = ChildrenWalkers.walkUnaryExpressionChildren;
            this.childrenWalkers[NodeType.DeleteExpression] = ChildrenWalkers.walkUnaryExpressionChildren;
            this.childrenWalkers[NodeType.InExpression] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.MemberAccessExpression] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.InstanceOfExpression] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.TypeOfExpression] = ChildrenWalkers.walkUnaryExpressionChildren;
            this.childrenWalkers[NodeType.NumericLiteral] = ChildrenWalkers.walkNone;
            this.childrenWalkers[NodeType.Name] = ChildrenWalkers.walkNone;
            this.childrenWalkers[NodeType.TypeParameter] = ChildrenWalkers.walkTypeParameterChildren;
            this.childrenWalkers[NodeType.GenericType] = ChildrenWalkers.walkGenericTypeChildren;
            this.childrenWalkers[NodeType.TypeRef] = ChildrenWalkers.walkTypeReferenceChildren;
            this.childrenWalkers[NodeType.ElementAccessExpression] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.InvocationExpression] = ChildrenWalkers.walkCallExpressionChildren;
            this.childrenWalkers[NodeType.ObjectCreationExpression] = ChildrenWalkers.walkCallExpressionChildren;
            this.childrenWalkers[NodeType.AssignmentExpression] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.AddAssignmentExpression] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.SubtractAssignmentExpression] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.DivideAssignmentExpression] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.MultiplyAssignmentExpression] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.ModuloAssignmentExpression] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.AndAssignmentExpression] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.ExclusiveOrAssignmentExpression] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.OrAssignmentExpression] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.LeftShiftAssignmentExpression] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.SignedRightShiftAssignmentExpression] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.UnsignedRightShiftAssignmentExpression] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.ConditionalExpression] = ChildrenWalkers.walkTrinaryExpressionChildren;
            this.childrenWalkers[NodeType.LogicalOrExpression] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.LogicalAndExpression] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.BitwiseOrExpression] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.BitwiseExclusiveOrExpression] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.BitwiseAndExpression] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.EqualsWithTypeConversionExpression] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.NotEqualsWithTypeConversionExpression] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.EqualsExpression] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.NotEqualsExpression] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.LessThanExpression] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.LessThanOrEqualExpression] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.GreaterThanExpression] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.GreaterThanOrEqualExpression] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.AddExpression] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.SubtractExpression] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.MultiplyExpression] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.DivideExpression] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.ModuloExpression] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.LeftShiftExpression] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.SignedRightShiftExpression] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.UnsignedRightShiftExpression] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.BitwiseNotExpression] = ChildrenWalkers.walkUnaryExpressionChildren;
            this.childrenWalkers[NodeType.LogicalNotExpression] = ChildrenWalkers.walkUnaryExpressionChildren;
            this.childrenWalkers[NodeType.PreIncrementExpression] = ChildrenWalkers.walkUnaryExpressionChildren;
            this.childrenWalkers[NodeType.PreDecrementExpression] = ChildrenWalkers.walkUnaryExpressionChildren;
            this.childrenWalkers[NodeType.PostIncrementExpression] = ChildrenWalkers.walkUnaryExpressionChildren;
            this.childrenWalkers[NodeType.PostDecrementExpression] = ChildrenWalkers.walkUnaryExpressionChildren;
            this.childrenWalkers[NodeType.CastExpression] = ChildrenWalkers.walkUnaryExpressionChildren;
            this.childrenWalkers[NodeType.ParenthesizedExpression] = ChildrenWalkers.walkParenthesizedExpressionChildren;
            this.childrenWalkers[NodeType.FunctionDeclaration] = ChildrenWalkers.walkFuncDeclChildren;
            this.childrenWalkers[NodeType.Member] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.VariableDeclarator] = ChildrenWalkers.walkBoundDeclChildren;
            this.childrenWalkers[NodeType.VariableDeclaration] = ChildrenWalkers.walkVariableDeclarationChildren;
            this.childrenWalkers[NodeType.Parameter] = ChildrenWalkers.walkBoundDeclChildren;
            this.childrenWalkers[NodeType.ReturnStatement] = ChildrenWalkers.walkReturnStatementChildren;
            this.childrenWalkers[NodeType.BreakStatement] = ChildrenWalkers.walkNone;
            this.childrenWalkers[NodeType.ContinueStatement] = ChildrenWalkers.walkNone;
            this.childrenWalkers[NodeType.ThrowStatement] = ChildrenWalkers.walkThrowStatementChildren;
            this.childrenWalkers[NodeType.ForStatement] = ChildrenWalkers.walkForStatementChildren;
            this.childrenWalkers[NodeType.ForInStatement] = ChildrenWalkers.walkForInStatementChildren;
            this.childrenWalkers[NodeType.IfStatement] = ChildrenWalkers.walkIfStatementChildren;
            this.childrenWalkers[NodeType.WhileStatement] = ChildrenWalkers.walkWhileStatementChildren;
            this.childrenWalkers[NodeType.DoStatement] = ChildrenWalkers.walkDoStatementChildren;
            this.childrenWalkers[NodeType.Block] = ChildrenWalkers.walkBlockChildren;
            this.childrenWalkers[NodeType.CaseClause] = ChildrenWalkers.walkCaseClauseChildren;
            this.childrenWalkers[NodeType.SwitchStatement] = ChildrenWalkers.walkSwitchStatementChildren;
            this.childrenWalkers[NodeType.TryStatement] = ChildrenWalkers.walkTryStatementChildren;
            this.childrenWalkers[NodeType.CatchClause] = ChildrenWalkers.walkCatchClauseChildren;
            this.childrenWalkers[NodeType.List] = ChildrenWalkers.walkListChildren;
            this.childrenWalkers[NodeType.Script] = ChildrenWalkers.walkScriptChildren;
            this.childrenWalkers[NodeType.ClassDeclaration] = ChildrenWalkers.walkClassDeclChildren;
            this.childrenWalkers[NodeType.InterfaceDeclaration] = ChildrenWalkers.walkTypeDeclChildren;
            this.childrenWalkers[NodeType.ModuleDeclaration] = ChildrenWalkers.walkModuleDeclChildren;
            this.childrenWalkers[NodeType.ImportDeclaration] = ChildrenWalkers.walkImportDeclChildren;
            this.childrenWalkers[NodeType.ExportAssignment] = ChildrenWalkers.walkExportAssignmentChildren;
            this.childrenWalkers[NodeType.WithStatement] = ChildrenWalkers.walkWithStatementChildren;
            this.childrenWalkers[NodeType.ExpressionStatement] = ChildrenWalkers.walkExpressionStatementChildren;
            this.childrenWalkers[NodeType.LabeledStatement] = ChildrenWalkers.walkLabeledStatementChildren;
            this.childrenWalkers[NodeType.VariableStatement] = ChildrenWalkers.walkVariableStatementChildren;
            this.childrenWalkers[NodeType.Comment] = ChildrenWalkers.walkNone;
            this.childrenWalkers[NodeType.DebuggerStatement] = ChildrenWalkers.walkNone;

            // Verify the code is up to date with the enum
            for (var e in NodeType) {
                if (NodeType.hasOwnProperty(e) && StringUtilities.isString(NodeType[e])) {
                    if (this.childrenWalkers[e] === undefined) {
                        throw new Error("initWalkers function is not up to date with enum content!");
                    }
                }
            }
        }
    }

    var globalAstWalkerFactory: AstWalkerFactory;

    export function getAstWalkerFactory(): AstWalkerFactory {
        if (!globalAstWalkerFactory) {
            globalAstWalkerFactory = new AstWalkerFactory();
        }
        return globalAstWalkerFactory;
    }

    module ChildrenWalkers {
        export function walkNone(preAst: ASTList, parent: AST, walker: IAstWalker): void {
            // Nothing to do
        }

        export function walkListChildren(preAst: ASTList, parent: AST, walker: IAstWalker): void {
            var len = preAst.members.length;

            for (var i = 0; i < len; i++) {
                preAst.members[i] = walker.walk(preAst.members[i], preAst);
            }
        }

        export function walkThrowStatementChildren(preAst: ThrowStatement, parent: AST, walker: IAstWalker): void {
            if (preAst.expression) {
                preAst.expression = walker.walk(preAst.expression, preAst);
            }
        }

        export function walkUnaryExpressionChildren(preAst: UnaryExpression, parent: AST, walker: IAstWalker): void {
            if (preAst.castTerm) {
                preAst.castTerm = <TypeReference>walker.walk(preAst.castTerm, preAst);
            }
            if (preAst.operand) {
                preAst.operand = walker.walk(preAst.operand, preAst);
            }
        }

        export function walkParenthesizedExpressionChildren(preAst: ParenthesizedExpression, parent: AST, walker: IAstWalker): void {
            if (preAst.expression) {
                preAst.expression = walker.walk(preAst.expression, preAst);
            }
        }

        export function walkBinaryExpressionChildren(preAst: BinaryExpression, parent: AST, walker: IAstWalker): void {
            if (preAst.operand1) {
                preAst.operand1 = walker.walk(preAst.operand1, preAst);
            }
            if (preAst.operand2) {
                preAst.operand2 = walker.walk(preAst.operand2, preAst);
            }
        }

        export function walkTypeParameterChildren(preAst: TypeParameter, parent: AST, walker: IAstWalker): void {
            if (preAst.name) {
                preAst.name = <Identifier>walker.walk(preAst.name, preAst);
            }

            if (preAst.constraint) {
                preAst.constraint = <ASTList> walker.walk(preAst.constraint, preAst);
            }
        }

        export function walkGenericTypeChildren(preAst: GenericType, parent: AST, walker: IAstWalker): void {
            if (preAst.name) {
                preAst.name = walker.walk(preAst.name, preAst);
            }

            if (preAst.typeArguments) {
                preAst.typeArguments = <ASTList> walker.walk(preAst.typeArguments, preAst);
            }
        }

        export function walkTypeReferenceChildren(preAst: TypeReference, parent: AST, walker: IAstWalker): void {
            if (preAst.term) {
                preAst.term = walker.walk(preAst.term, preAst);
            }
        }

        export function walkCallExpressionChildren(preAst: CallExpression, parent: AST, walker: IAstWalker): void {
            preAst.target = walker.walk(preAst.target, preAst);

            if (preAst.typeArguments) {
                preAst.typeArguments = <ASTList> walker.walk(preAst.typeArguments, preAst);
            }

            if (preAst.arguments) {
                preAst.arguments = <ASTList> walker.walk(preAst.arguments, preAst);
            }
        }

        export function walkTrinaryExpressionChildren(preAst: ConditionalExpression, parent: AST, walker: IAstWalker): void {
            if (preAst.operand1) {
                preAst.operand1 = walker.walk(preAst.operand1, preAst);
            }
            if (preAst.operand2) {
                preAst.operand2 = walker.walk(preAst.operand2, preAst);
            }
            if (preAst.operand3) {
                preAst.operand3 = walker.walk(preAst.operand3, preAst);
            }
        }

        export function walkFuncDeclChildren(preAst: FunctionDeclaration, parent: AST, walker: IAstWalker): void {
            if (preAst.name) {
                preAst.name = <Identifier>walker.walk(preAst.name, preAst);
            }
            if (preAst.typeArguments) {
                preAst.typeArguments = <ASTList>walker.walk(preAst.typeArguments, preAst);
            }
            if (preAst.arguments) {
                preAst.arguments = <ASTList>walker.walk(preAst.arguments, preAst);
            }
            if (preAst.returnTypeAnnotation) {
                preAst.returnTypeAnnotation = walker.walk(preAst.returnTypeAnnotation, preAst);
            }
            if (preAst.block) {
                preAst.block = <Block>walker.walk(preAst.block, preAst);
            }
        }

        export function walkBoundDeclChildren(preAst: BoundDecl, parent: AST, walker: IAstWalker): void {
            if (preAst.id) {
                preAst.id = <Identifier>walker.walk(preAst.id, preAst);
            }
            if (preAst.init) {
                preAst.init = walker.walk(preAst.init, preAst);
            }
            if (preAst.typeExpr) {
                preAst.typeExpr = walker.walk(preAst.typeExpr, preAst);
            }
        }

        export function walkReturnStatementChildren(preAst: ReturnStatement, parent: AST, walker: IAstWalker): void {
            if (preAst.returnExpression) {
                preAst.returnExpression = walker.walk(preAst.returnExpression, preAst);
            }
        }

        export function walkForStatementChildren(preAst: ForStatement, parent: AST, walker: IAstWalker): void {
            if (preAst.init) {
                preAst.init = walker.walk(preAst.init, preAst);
            }

            if (preAst.cond) {
                preAst.cond = walker.walk(preAst.cond, preAst);
            }

            if (preAst.incr) {
                preAst.incr = walker.walk(preAst.incr, preAst);
            }

            if (preAst.body) {
                preAst.body = walker.walk(preAst.body, preAst);
            }
        }

        export function walkForInStatementChildren(preAst: ForInStatement, parent: AST, walker: IAstWalker): void {
            preAst.lval = walker.walk(preAst.lval, preAst);
            preAst.obj = walker.walk(preAst.obj, preAst);

            if (preAst.body) {
                preAst.body = walker.walk(preAst.body, preAst);
            }
        }

        export function walkIfStatementChildren(preAst: IfStatement, parent: AST, walker: IAstWalker): void {
            preAst.cond = walker.walk(preAst.cond, preAst);
            if (preAst.thenBod) {
                preAst.thenBod = walker.walk(preAst.thenBod, preAst);
            }
            if (preAst.elseBod) {
                preAst.elseBod = walker.walk(preAst.elseBod, preAst);
            }
        }

        export function walkWhileStatementChildren(preAst: WhileStatement, parent: AST, walker: IAstWalker): void {
            preAst.cond = walker.walk(preAst.cond, preAst);
            if (preAst.body) {
                preAst.body = walker.walk(preAst.body, preAst);
            }
        }

        export function walkDoStatementChildren(preAst: DoStatement, parent: AST, walker: IAstWalker): void {
            preAst.cond = walker.walk(preAst.cond, preAst);
            if (preAst.body) {
                preAst.body = walker.walk(preAst.body, preAst);
            }
        }

        export function walkBlockChildren(preAst: Block, parent: AST, walker: IAstWalker): void {
            if (preAst.statements) {
                preAst.statements = <ASTList>walker.walk(preAst.statements, preAst);
            }
        }

        export function walkVariableDeclarationChildren(preAst: VariableDeclaration, parent: AST, walker: IAstWalker): void {
            if (preAst.declarators) {
                preAst.declarators = <ASTList>walker.walk(preAst.declarators, preAst);
            }
        }

        export function walkCaseClauseChildren(preAst: CaseClause, parent: AST, walker: IAstWalker): void {
            if (preAst.expr) {
                preAst.expr = walker.walk(preAst.expr, preAst);
            }

            if (preAst.body) {
                preAst.body = <ASTList>walker.walk(preAst.body, preAst);
            }
        }

        export function walkSwitchStatementChildren(preAst: SwitchStatement, parent: AST, walker: IAstWalker): void {
            if (preAst.val) {
                preAst.val = walker.walk(preAst.val, preAst);
            }

            if (preAst.caseList) {
                preAst.caseList = <ASTList>walker.walk(preAst.caseList, preAst);
            }
        }

        export function walkTryStatementChildren(preAst: TryStatement, parent: AST, walker: IAstWalker): void {
            if (preAst.tryBody) {
                preAst.tryBody = <Block>walker.walk(preAst.tryBody, preAst);
            }
            if (preAst.catchClause) {
                preAst.catchClause = <CatchClause>walker.walk(preAst.catchClause, preAst);
            }
            if (preAst.finallyBody) {
                preAst.finallyBody = <Block>walker.walk(preAst.finallyBody, preAst);
            }
        }

        export function walkCatchClauseChildren(preAst: CatchClause, parent: AST, walker: IAstWalker): void {
            if (preAst.param) {
                preAst.param = <VariableDeclarator>walker.walk(preAst.param, preAst);
            }

            if (preAst.body) {
                preAst.body = <Block>walker.walk(preAst.body, preAst);
            }
        }

        export function walkRecordChildren(preAst: NamedDeclaration, parent: AST, walker: IAstWalker): void {
            preAst.name = <Identifier>walker.walk(preAst.name, preAst);
            if (preAst.members) {
                preAst.members = <ASTList>walker.walk(preAst.members, preAst);
            }
        }

        export function walkNamedTypeChildren(preAst: TypeDeclaration, parent: AST, walker: IAstWalker): void {
            walkRecordChildren(preAst, parent, walker);
        }

        export function walkClassDeclChildren(preAst: ClassDeclaration, parent: AST, walker: IAstWalker): void {
            walkNamedTypeChildren(preAst, parent, walker);

            if (preAst.typeParameters) {
                preAst.typeParameters = <ASTList>walker.walk(preAst.typeParameters, preAst);
            }

            if (preAst.extendsList) {
                preAst.extendsList = <ASTList>walker.walk(preAst.extendsList, preAst);
            }

            if (preAst.implementsList) {
                preAst.implementsList = <ASTList>walker.walk(preAst.implementsList, preAst);
            }
        }

        export function walkScriptChildren(preAst: Script, parent: AST, walker: IAstWalker): void {
            if (preAst.moduleElements) {
                preAst.moduleElements = <ASTList>walker.walk(preAst.moduleElements, preAst);
            }
        }

        export function walkTypeDeclChildren(preAst: InterfaceDeclaration, parent: AST, walker: IAstWalker): void {
            walkNamedTypeChildren(preAst, parent, walker);

            if (preAst.typeParameters) {
                preAst.typeParameters = <ASTList>walker.walk(preAst.typeParameters, preAst);
            }

            // walked arguments as part of members
            if (preAst.extendsList) {
                preAst.extendsList = <ASTList>walker.walk(preAst.extendsList, preAst);
            }

            if (preAst.implementsList) {
                preAst.implementsList = <ASTList>walker.walk(preAst.implementsList, preAst);
            }
        }

        export function walkModuleDeclChildren(preAst: ModuleDeclaration, parent: AST, walker: IAstWalker): void {
            walkRecordChildren(preAst, parent, walker);
        }

        export function walkImportDeclChildren(preAst: ImportDeclaration, parent: AST, walker: IAstWalker): void {
            if (preAst.id) {
                preAst.id = <Identifier>walker.walk(preAst.id, preAst);
            }
            if (preAst.alias) {
                preAst.alias = walker.walk(preAst.alias, preAst);
            }
        }

        export function walkExportAssignmentChildren(preAst: ExportAssignment, parent: AST, walker: IAstWalker): void {
            if (preAst.id) {
                preAst.id = <Identifier>walker.walk(preAst.id, preAst);
            }
        }

        export function walkWithStatementChildren(preAst: WithStatement, parent: AST, walker: IAstWalker): void {
            if (preAst.expr) {
                preAst.expr = walker.walk(preAst.expr, preAst);
            }

            if (preAst.body) {
                preAst.body = walker.walk(preAst.body, preAst);
            }
        }

        export function walkExpressionStatementChildren(preAst: ExpressionStatement, parent: AST, walker: IAstWalker): void {
            preAst.expression = <AST>walker.walk(preAst.expression, preAst);
        }

        export function walkLabeledStatementChildren(preAst: LabeledStatement, parent: AST, walker: IAstWalker): void {
            preAst.identifier = <Identifier>walker.walk(preAst.identifier, preAst);
            preAst.statement = walker.walk(preAst.statement, preAst);
        }

        export function walkVariableStatementChildren(preAst: VariableStatement, parent: AST, walker: IAstWalker): void {
            preAst.declaration = <VariableDeclaration>walker.walk(preAst.declaration, preAst);
        }
    }
}