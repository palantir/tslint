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
    export interface IASTSpan {
        minChar: number;
        limChar: number;
        trailingTriviaWidth: number;
    }

    export class ASTSpan implements IASTSpan {
        public minChar: number = -1;  // -1 = "undefined" or "compiler generated"
        public limChar: number = -1;  // -1 = "undefined" or "compiler generated"
        public trailingTriviaWidth = 0;
    }

    export var astID = 0;

    export function structuralEqualsNotIncludingPosition(ast1: AST, ast2: AST): boolean {
        return structuralEquals(ast1, ast2, false);
    }

    export function structuralEqualsIncludingPosition(ast1: AST, ast2: AST): boolean {
        return structuralEquals(ast1, ast2, true);
    }

    function structuralEquals(ast1: AST, ast2: AST, includingPosition: boolean): boolean {
        if (ast1 === ast2) {
            return true;
        }

        return ast1 !== null && ast2 !== null &&
               ast1.nodeType === ast2.nodeType &&
               ast1.structuralEquals(ast2, includingPosition);
    }

    function astArrayStructuralEquals(array1: AST[], array2: AST[], includingPosition): boolean {
        return ArrayUtilities.sequenceEquals(array1, array2,
            includingPosition ? structuralEqualsIncludingPosition : structuralEqualsNotIncludingPosition);
    }

    export class AST implements IASTSpan {
        public minChar: number = -1;  // -1 = "undefined" or "compiler generated"
        public limChar: number = -1;  // -1 = "undefined" or "compiler generated"
        public trailingTriviaWidth = 0;

        private _flags = ASTFlags.None;

        public typeCheckPhase = -1;

        private astID = astID++;

        // REVIEW: for diagnostic purposes
        public passCreated: number = CompilerDiagnostics.analysisPass;

        public preComments: Comment[] = null;
        public postComments: Comment[] = null;
        private docComments: Comment[] = null;

        constructor(public nodeType: NodeType) {
        }

        public shouldEmit(): boolean {
            return true;
        }

        public isExpression() { return false; }
        public isStatementOrExpression() { return false; }

        public getFlags(): ASTFlags {
            return this._flags;
        }

        // Must only be called from SyntaxTreeVisitor
        public setFlags(flags: ASTFlags): void {
            this._flags = flags;
        }

        public getLength() { return this.limChar - this.minChar; }

        public getID() { return this.astID; }

        public isDeclaration() { return false; }

        public isStatement() {
            return false;
        }

        public emit(emitter: Emitter) {
            emitter.emitComments(this, true);
            emitter.recordSourceMappingStart(this);
            this.emitWorker(emitter);
            emitter.recordSourceMappingEnd(this);
            emitter.emitComments(this, false);
        }

        public emitWorker(emitter: Emitter) {
            throw new Error("please implement in derived class");
        }

        public getDocComments(): Comment[] {
            if (!this.isDeclaration() || !this.preComments || this.preComments.length === 0) {
                return [];
            }

            if (!this.docComments) {
                var preCommentsLength = this.preComments.length;
                var docComments: Comment[] = [];
                for (var i = preCommentsLength - 1; i >= 0; i--) {
                    if (this.preComments[i].isDocComment()) {
                        var prevDocComment = docComments.length > 0 ? docComments[docComments.length - 1] : null;
                        if (prevDocComment === null || // If the help comments were not yet set then this is the comment
                             (this.preComments[i].limLine === prevDocComment.minLine ||
                              this.preComments[i].limLine + 1 === prevDocComment.minLine)) { // On same line or next line
                            docComments.push(this.preComments[i]);
                            continue;
                        }
                    }
                    break;
                }

                this.docComments = docComments.reverse();
            }

            return this.docComments;
        }

        public structuralEquals(ast: AST, includingPosition: boolean): boolean {
            if (includingPosition) {
                if (this.minChar !== ast.minChar || this.limChar !== ast.limChar) {
                    return false;
                }
            }

            return this._flags === ast._flags &&
                   astArrayStructuralEquals(this.preComments, ast.preComments, includingPosition) &&
                   astArrayStructuralEquals(this.postComments, ast.postComments, includingPosition)
        }
    }

    export class ASTList extends AST {
        public members: AST[] = [];

        constructor() {
            super(NodeType.List);
        }

        public append(ast: AST) {
            this.members[this.members.length] = ast;
            return this;
        }

        public emit(emitter: Emitter) {
            emitter.recordSourceMappingStart(this);
            emitter.emitModuleElements(this);
            emitter.recordSourceMappingEnd(this);
        }

        public structuralEquals(ast: ASTList, includingPosition: boolean): boolean {
            return super.structuralEquals(ast, includingPosition) &&
                   astArrayStructuralEquals(this.members, ast.members, includingPosition);
        }
    }

    export class Expression extends AST {
        constructor(nodeType: NodeType) {
            super(nodeType);
        }
    }

    export class Identifier extends Expression {
        public text: string;

        // 'actualText' is the text that the user has entered for the identifier. the text might 
        // include any Unicode escape sequences (e.g.: \u0041 for 'A'). 'text', however, contains 
        // the resolved value of any escape sequences in the actual text; so in the previous 
        // example, actualText = '\u0041', text = 'A'.
        //
        // For purposes of finding a symbol, use text, as this will allow you to match all 
        // variations of the variable text. For full-fidelity translation of the user input, such
        // as emitting, use the actualText field.
        // 
        // Note: 
        //    To change text, and to avoid running into a situation where 'actualText' does not 
        //    match 'text', always use setText.
        constructor(public actualText: string) {
            super(NodeType.Name);
            this.setText(actualText);
        }

        public setText(actualText: string) {
            this.actualText = actualText;
            this.text = actualText;
        }

        public isMissing() { return false; }

        public emit(emitter: Emitter) {
            emitter.emitName(this, true);
        }

        public structuralEquals(ast: Identifier, includingPosition: boolean): boolean {
            return super.structuralEquals(ast, includingPosition) &&
                   this.text === ast.text &&
                   this.actualText === ast.actualText &&
                   this.isMissing() === ast.isMissing();
        }
    }

    export class MissingIdentifier extends Identifier {
        constructor() {
            super("__missing");
        }

        public isMissing() {
            return true;
        }

        public emit(emitter: Emitter) {
            // Emit nothing for a missing ID
        }
    }

    export class LiteralExpression extends Expression {
        constructor(nodeType: NodeType) {
            super(nodeType);
        }

        public emitWorker(emitter: Emitter) {
            switch (this.nodeType) {
                case NodeType.NullLiteral:
                    emitter.writeToOutput("null");
                    break;
                case NodeType.FalseLiteral:
                    emitter.writeToOutput("false");
                    break;
                case NodeType.TrueLiteral:
                    emitter.writeToOutput("true");
                    break;
                default:
                    throw new Error("please implement in derived class");
            }
        }

        public structuralEquals(ast: ParenthesizedExpression, includingPosition: boolean): boolean {
            return super.structuralEquals(ast, includingPosition);
        }
    }

    export class ThisExpression extends Expression {
        constructor() {
            super(NodeType.ThisExpression);
        }

        public emitWorker(emitter: Emitter) {
            if (emitter.thisFunctionDeclaration && (hasFlag(emitter.thisFunctionDeclaration.getFunctionFlags(), FunctionFlags.IsFatArrowFunction))) {
                emitter.writeToOutput("_this");
            }
            else {
                emitter.writeToOutput("this");
            }
        }

        public structuralEquals(ast: ParenthesizedExpression, includingPosition: boolean): boolean {
            return super.structuralEquals(ast, includingPosition);
        }
    }

    export class SuperExpression extends Expression {
        constructor() {
            super(NodeType.SuperExpression);
        }

        public emitWorker(emitter: Emitter) {
            emitter.emitSuperReference();
        }

        public structuralEquals(ast: ParenthesizedExpression, includingPosition: boolean): boolean {
            return super.structuralEquals(ast, includingPosition);
        }
    }

    export class ParenthesizedExpression extends Expression {
        constructor(public expression: AST) {
            super(NodeType.ParenthesizedExpression);
        }

        public emitWorker(emitter: Emitter) {
            emitter.writeToOutput("(");
            this.expression.emit(emitter);
            emitter.writeToOutput(")");
        }

        public structuralEquals(ast: ParenthesizedExpression, includingPosition: boolean): boolean {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.expression, ast.expression, includingPosition);
        }
    }

    export class UnaryExpression extends Expression {
        public castTerm: TypeReference = null;

        constructor(nodeType: NodeType, public operand: AST) {
            super(nodeType);
        }

        public emitWorker(emitter: Emitter) {
            switch (this.nodeType) {
                case NodeType.PostIncrementExpression:
                    this.operand.emit(emitter);
                    emitter.writeToOutput("++");
                    break;
                case NodeType.LogicalNotExpression:
                    emitter.writeToOutput("!");
                    this.operand.emit(emitter);
                    break;
                case NodeType.PostDecrementExpression:
                    this.operand.emit(emitter);
                    emitter.writeToOutput("--");
                    break;
                case NodeType.ObjectLiteralExpression:
                    emitter.emitObjectLiteral(this);
                    break;
                case NodeType.ArrayLiteralExpression:
                    emitter.emitArrayLiteral(this);
                    break;
                case NodeType.BitwiseNotExpression:
                    emitter.writeToOutput("~");
                    this.operand.emit(emitter);
                    break;
                case NodeType.NegateExpression:
                    emitter.writeToOutput("-");
                    if (this.operand.nodeType === NodeType.NegateExpression || this.operand.nodeType === NodeType.PreDecrementExpression) {
                        emitter.writeToOutput(" ");
                    }
                    this.operand.emit(emitter);
                    break;
                case NodeType.PlusExpression:
                    emitter.writeToOutput("+");
                    if (this.operand.nodeType === NodeType.PlusExpression || this.operand.nodeType === NodeType.PreIncrementExpression) {
                        emitter.writeToOutput(" ");
                    }
                    this.operand.emit(emitter);
                    break;
                case NodeType.PreIncrementExpression:
                    emitter.writeToOutput("++");
                    this.operand.emit(emitter);
                    break;
                case NodeType.PreDecrementExpression:
                    emitter.writeToOutput("--");
                    this.operand.emit(emitter);
                    break;
                case NodeType.TypeOfExpression:
                    emitter.writeToOutput("typeof ");
                    this.operand.emit(emitter);
                    break;
                case NodeType.DeleteExpression:
                    emitter.writeToOutput("delete ");
                    this.operand.emit(emitter);
                    break;
                case NodeType.VoidExpression:
                    emitter.writeToOutput("void ");
                    this.operand.emit(emitter);
                    break;
                case NodeType.CastExpression:
                    this.operand.emit(emitter);
                    break;
                default:
                    throw new Error("please implement in derived class");
            }
        }

        public structuralEquals(ast: UnaryExpression, includingPosition: boolean): boolean {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.castTerm, ast.castTerm, includingPosition) &&
                   structuralEquals(this.operand, ast.operand, includingPosition);
        }
    }

    export class CallExpression extends Expression {
        constructor(nodeType: NodeType,
                    public target: AST,
                    public typeArguments: ASTList,
                    public arguments: ASTList) {
            super(nodeType);
        }

        public emitWorker(emitter: Emitter) {
            if (this.nodeType === NodeType.ObjectCreationExpression) {
                emitter.emitNew(this.target, this.arguments);
            }
            else {
                emitter.emitCall(this, this.target, this.arguments);
            }
        }

        public structuralEquals(ast: CallExpression, includingPosition: boolean): boolean {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.target, ast.target, includingPosition) &&
                   structuralEquals(this.typeArguments, ast.typeArguments, includingPosition) &&
                   structuralEquals(this.arguments, ast.arguments, includingPosition);
        }
    }

    export class BinaryExpression extends Expression {
        constructor(nodeType: NodeType,
                    public operand1: AST,
                    public operand2: AST) {
            super(nodeType);
        }

        public static getTextForBinaryToken(nodeType: NodeType): string {
            switch (nodeType) {
                case NodeType.CommaExpression: return ",";
                case NodeType.AssignmentExpression: return "=";
                case NodeType.AddAssignmentExpression: return "+=";
                case NodeType.SubtractAssignmentExpression: return "-=";
                case NodeType.MultiplyAssignmentExpression: return "*=";
                case NodeType.DivideAssignmentExpression: return "/=";
                case NodeType.ModuloAssignmentExpression: return "%=";
                case NodeType.AndAssignmentExpression: return "&=";
                case NodeType.ExclusiveOrAssignmentExpression: return "^=";
                case NodeType.OrAssignmentExpression: return "|=";
                case NodeType.LeftShiftAssignmentExpression: return "<<=";
                case NodeType.SignedRightShiftAssignmentExpression: return ">>=";
                case NodeType.UnsignedRightShiftAssignmentExpression: return ">>>=";
                case NodeType.LogicalOrExpression: return "||";
                case NodeType.LogicalAndExpression: return "&&";
                case NodeType.BitwiseOrExpression: return "|";
                case NodeType.BitwiseExclusiveOrExpression: return "^";
                case NodeType.BitwiseAndExpression: return "&";
                case NodeType.EqualsWithTypeConversionExpression: return "==";
                case NodeType.NotEqualsWithTypeConversionExpression: return "!=";
                case NodeType.EqualsExpression: return "===";
                case NodeType.NotEqualsExpression: return "!==";
                case NodeType.LessThanExpression: return "<";
                case NodeType.GreaterThanExpression: return ">";
                case NodeType.LessThanOrEqualExpression: return "<="
                case NodeType.GreaterThanOrEqualExpression: return ">="
                case NodeType.InstanceOfExpression: return "instanceof";
                case NodeType.InExpression: return "in";
                case NodeType.LeftShiftExpression: return "<<";
                case NodeType.SignedRightShiftExpression: return ">>"
                case NodeType.UnsignedRightShiftExpression: return ">>>"
                case NodeType.MultiplyExpression: return "*"
                case NodeType.DivideExpression: return "/"
                case NodeType.ModuloExpression: return "%"
                case NodeType.AddExpression: return "+"
                case NodeType.SubtractExpression: return "-";
            }

            throw Errors.invalidOperation();
        }

        public emitWorker(emitter: Emitter) {
            switch (this.nodeType) {
                case NodeType.MemberAccessExpression:
                    if (!emitter.tryEmitConstant(this)) {
                        this.operand1.emit(emitter);
                        emitter.writeToOutput(".");
                        emitter.emitName(<Identifier>this.operand2, false);
                    }
                    break;
                case NodeType.ElementAccessExpression:
                    emitter.emitIndex(this.operand1, this.operand2);
                    break;

                case NodeType.Member:
                    if (this.operand2.nodeType === NodeType.FunctionDeclaration && (<FunctionDeclaration>this.operand2).isAccessor()) {
                        var funcDecl = <FunctionDeclaration>this.operand2;
                        if (hasFlag(funcDecl.getFunctionFlags(), FunctionFlags.GetAccessor)) {
                            emitter.writeToOutput("get ");
                        }
                        else {
                            emitter.writeToOutput("set ");
                        }
                        this.operand1.emit(emitter);
                    }
                    else {
                        this.operand1.emit(emitter);
                        emitter.writeToOutputTrimmable(": ");
                    }
                    this.operand2.emit(emitter);
                    break;
                case NodeType.CommaExpression:
                    this.operand1.emit(emitter);
                    emitter.writeToOutput(", ");
                    this.operand2.emit(emitter);
                    break;
                default:
                    {
                        this.operand1.emit(emitter);
                        var binOp = BinaryExpression.getTextForBinaryToken(this.nodeType);
                        if (binOp === "instanceof") {
                            emitter.writeToOutput(" instanceof ");
                        }
                        else if (binOp === "in") {
                            emitter.writeToOutput(" in ");
                        }
                        else {
                            emitter.writeToOutputTrimmable(" " + binOp + " ");
                        }
                        this.operand2.emit(emitter);
                    }
            }
        }

        public structuralEquals(ast: BinaryExpression, includingPosition: boolean): boolean {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.operand1, ast.operand1, includingPosition) &&
                   structuralEquals(this.operand2, ast.operand2, includingPosition);
        }
    }

    export class ConditionalExpression extends Expression {
        constructor(public operand1: AST,
                    public operand2: AST,
                    public operand3: AST) {
            super(NodeType.ConditionalExpression);
        }

        public emitWorker(emitter: Emitter) {
            this.operand1.emit(emitter);
            emitter.writeToOutput(" ? ");
            this.operand2.emit(emitter);
            emitter.writeToOutput(" : ");
            this.operand3.emit(emitter);
        }

        public structuralEquals(ast: ConditionalExpression, includingPosition: boolean): boolean {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.operand1, ast.operand1, includingPosition) &&
                   structuralEquals(this.operand2, ast.operand2, includingPosition) &&
                   structuralEquals(this.operand3, ast.operand3, includingPosition);
        }
    }

    export class NumberLiteral extends Expression {
        constructor(public value: number, public text: string) {
            super(NodeType.NumericLiteral);
        }

        public emitWorker(emitter: Emitter) {
            emitter.writeToOutput(this.text);
        }

        public structuralEquals(ast: NumberLiteral, includingPosition: boolean): boolean {
            return super.structuralEquals(ast, includingPosition) &&
                   this.value === ast.value &&
                   this.text === ast.text;
        }
    }

    export class RegexLiteral extends Expression {
        constructor(public text: string) {
            super(NodeType.RegularExpressionLiteral);
        }

        public emitWorker(emitter: Emitter) {
            emitter.writeToOutput(this.text);
        }

        public structuralEquals(ast: RegexLiteral, includingPosition: boolean): boolean {
            return super.structuralEquals(ast, includingPosition) &&
                   this.text === ast.text;
        }
    }

    export class StringLiteral extends Expression {
        constructor(public actualText: string, public text: string) {
            super(NodeType.StringLiteral);
        }

        public emitWorker(emitter: Emitter) {
            emitter.writeToOutput(this.actualText);
        }

        public structuralEquals(ast: StringLiteral, includingPosition: boolean): boolean {
            return super.structuralEquals(ast, includingPosition) &&
                   this.actualText === ast.actualText;
        }
    }

    export class ImportDeclaration extends AST {
        public isDynamicImport = false;
        public isStatementOrExpression() { return true; }

        constructor(public id: Identifier, public alias: AST) {
            super(NodeType.ImportDeclaration);
        }

        public isDeclaration() { return true; }

        public emit(emitter: Emitter) {
            // REVIEW: Only modules may be aliased for now, though there's no real
            // restriction on what the type symbol may be
            if (emitter.importStatementShouldBeEmitted(this)) {
                var prevModAliasId = emitter.modAliasId;
                var prevFirstModAlias = emitter.firstModAlias;

                emitter.recordSourceMappingStart(this);
                emitter.emitComments(this, true);
                emitter.writeToOutput("var " + this.id.actualText + " = ");
                emitter.modAliasId = this.id.actualText;
                emitter.firstModAlias = this.firstAliasedModToString();
                var aliasAST = this.alias.nodeType === NodeType.TypeRef ? (<TypeReference>this.alias).term : this.alias;

                emitter.emitJavascript(aliasAST, false);
                emitter.writeToOutput(";");

                emitter.emitComments(this, false);
                emitter.recordSourceMappingEnd(this);

                emitter.modAliasId = prevModAliasId;
                emitter.firstModAlias = prevFirstModAlias;
            }
        }

        public getAliasName(aliasAST: AST = this.alias): string {
            if (aliasAST.nodeType === NodeType.Name) {
                return (<Identifier>aliasAST).actualText;
            } else {
                var dotExpr = <BinaryExpression>aliasAST;
                return this.getAliasName(dotExpr.operand1) + "." + this.getAliasName(dotExpr.operand2);
            }
        }

        public firstAliasedModToString() {
            if (this.alias.nodeType === NodeType.Name) {
                return (<Identifier>this.alias).actualText;
            }
            else {
                var dotExpr = <TypeReference>this.alias;
                var firstMod = <Identifier>(<BinaryExpression>dotExpr.term).operand1;
                return firstMod.actualText;
            }
        }

        public structuralEquals(ast: ImportDeclaration, includingPosition: boolean): boolean {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.id, ast.id, includingPosition) &&
                   structuralEquals(this.alias, ast.alias, includingPosition);
        }
    }

    export class ExportAssignment extends AST {
        constructor(public id: Identifier) {
            super(NodeType.ExportAssignment);
        }

        public structuralEquals(ast: ExportAssignment, includingPosition: boolean): boolean {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.id, ast.id, includingPosition);
        }

        public emit(emitter: Emitter) {
            emitter.setExportAssignmentIdentifier(this.id.actualText);
        }
    }

    export class BoundDecl extends AST {
        public init: AST = null;
        public isImplicitlyInitialized = false;
        public typeExpr: AST = null;
        private _varFlags = VariableFlags.None;
        public isDeclaration() { return true; }
        public isStatementOrExpression() { return true; }

        constructor(public id: Identifier, nodeType: NodeType) {
            super(nodeType);
        }

        public getVarFlags(): VariableFlags {
            return this._varFlags;
        }

        // Must only be called from SyntaxTreeVisitor
        public setVarFlags(flags: VariableFlags): void {
            this._varFlags = flags;
        }

        public isProperty() { return hasFlag(this.getVarFlags(), VariableFlags.Property); }

        public structuralEquals(ast: BoundDecl, includingPosition: boolean): boolean {
            return super.structuralEquals(ast, includingPosition) &&
                   this._varFlags === ast._varFlags &&
                   structuralEquals(this.init, ast.init, includingPosition) &&
                   structuralEquals(this.typeExpr, ast.typeExpr, includingPosition) &&
                   structuralEquals(this.id, ast.id, includingPosition);
        }
    }

    export class VariableDeclarator extends BoundDecl {
        constructor(id: Identifier) {
            super(id, NodeType.VariableDeclarator);
        }

        public isExported() { return hasFlag(this.getVarFlags(), VariableFlags.Exported); }

        public isStatic() { return hasFlag(this.getVarFlags(), VariableFlags.Static); }

        public emit(emitter: Emitter) {
            emitter.emitVariableDeclarator(this);
        }
    }

    export class Parameter extends BoundDecl {
        constructor(id: Identifier) {
            super(id, NodeType.Parameter);
        }

        public isOptional = false;

        public isOptionalArg() { return this.isOptional || this.init; }

        public emitWorker(emitter: Emitter) {
            emitter.writeToOutput(this.id.actualText);
        }

        public structuralEquals(ast: Parameter, includingPosition: boolean): boolean {
            return super.structuralEquals(ast, includingPosition) &&
                   this.isOptional === ast.isOptional;
        }
    }

    export class FunctionDeclaration extends AST {
        public hint: string = null;
        private _functionFlags = FunctionFlags.None;
        public returnTypeAnnotation: AST = null;
        public variableArgList = false;
        public classDecl: NamedDeclaration = null;

        public returnStatementsWithExpressions: ReturnStatement[];
        public isDeclaration() { return true; }

        constructor(public name: Identifier,
                    public block: Block,
                    public isConstructor: boolean,
                    public typeArguments: ASTList,
                    public arguments: ASTList,
                    nodeType: number) {

            super(nodeType);
        }

        public getFunctionFlags(): FunctionFlags {
            return this._functionFlags;
        }

        // Must only be called from SyntaxTreeVisitor
        public setFunctionFlags(flags: FunctionFlags): void {
            this._functionFlags = flags;
        }

        public structuralEquals(ast: FunctionDeclaration, includingPosition: boolean): boolean {
            return super.structuralEquals(ast, includingPosition) &&
                   this._functionFlags === ast._functionFlags &&
                   this.hint === ast.hint &&
                   this.variableArgList === ast.variableArgList &&
                   structuralEquals(this.name, ast.name, includingPosition) &&
                   structuralEquals(this.block, ast.block, includingPosition) &&
                   this.isConstructor === ast.isConstructor &&
                   structuralEquals(this.typeArguments, ast.typeArguments, includingPosition) &&
                   structuralEquals(this.arguments, ast.arguments, includingPosition);
        }

        public shouldEmit(): boolean {
            return !hasFlag(this.getFunctionFlags(), FunctionFlags.Signature) &&
                   !hasFlag(this.getFunctionFlags(), FunctionFlags.Ambient);
        }

        public emit(emitter: Emitter) {
            emitter.emitFunction(this);
        }

        public getNameText() {
            if (this.name) {
                return this.name.actualText;
            }
            else {
                return this.hint;
            }
        }

        public isMethod() {
            return (this.getFunctionFlags() & FunctionFlags.Method) !== FunctionFlags.None;
        }

        public isCallMember() { return hasFlag(this.getFunctionFlags(), FunctionFlags.CallMember); }
        public isConstructMember() { return hasFlag(this.getFunctionFlags(), FunctionFlags.ConstructMember); }
        public isIndexerMember() { return hasFlag(this.getFunctionFlags(), FunctionFlags.IndexerMember); }
        public isSpecialFn() { return this.isCallMember() || this.isIndexerMember() || this.isConstructMember(); }
        public isAccessor() { return hasFlag(this.getFunctionFlags(), FunctionFlags.GetAccessor) || hasFlag(this.getFunctionFlags(), FunctionFlags.SetAccessor); }
        public isGetAccessor() { return hasFlag(this.getFunctionFlags(), FunctionFlags.GetAccessor); }
        public isSetAccessor() { return hasFlag(this.getFunctionFlags(), FunctionFlags.SetAccessor); }
        public isStatic() { return hasFlag(this.getFunctionFlags(), FunctionFlags.Static); }

        public isSignature() { return (this.getFunctionFlags() & FunctionFlags.Signature) !== FunctionFlags.None; }
    }

    export class Script extends AST {
        public moduleElements: ASTList = null;
        public referencedFiles: IFileReference[] = [];
        public requiresExtendsBlock = false;
        public isDeclareFile = false;
        public topLevelMod: ModuleDeclaration = null;
        // Remember if the script contains Unicode chars, that is needed when generating code for this script object to decide the output file correct encoding.
        public containsUnicodeChar = false;
        public containsUnicodeCharInComment = false;

        constructor() {
            super(NodeType.Script);
        }

        public emit(emitter: Emitter) {
            if (!this.isDeclareFile) {
                emitter.emitScriptElements(this, this.requiresExtendsBlock);
            }
        }

        public structuralEquals(ast: Script, includingPosition: boolean): boolean {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.moduleElements, ast.moduleElements, includingPosition);
        }
    }

    export class NamedDeclaration extends AST {
        public isDeclaration() { return true; }

        constructor(nodeType: NodeType,
                    public name: Identifier,
                    public members: ASTList) {
            super(nodeType);
        }

        public structuralEquals(ast: NamedDeclaration, includingPosition: boolean): boolean {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.name, ast.name, includingPosition) &&
                   structuralEquals(this.members, ast.members, includingPosition);
        }
    }

    export class ModuleDeclaration extends NamedDeclaration {
        private _moduleFlags = ModuleFlags.None;
        public prettyName: string;
        public amdDependencies: string[] = [];
        // Remember if the module contains Unicode chars, that is needed for dynamic module as we will generate a file for each.
        public containsUnicodeChar = false;
        public containsUnicodeCharInComment = false;

        constructor(name: Identifier, members: ASTList, public endingToken: ASTSpan) {
            super(NodeType.ModuleDeclaration, name, members);

            this.prettyName = this.name.actualText;
        }

        public getModuleFlags(): ModuleFlags {
            return this._moduleFlags;
        }

        // Must only be called from SyntaxTreeVisitor
        public setModuleFlags(flags: ModuleFlags): void {
            this._moduleFlags = flags;
        }

        public structuralEquals(ast: ModuleDeclaration, includePosition: boolean): boolean {
            if (super.structuralEquals(ast, includePosition)) {
                return this._moduleFlags === ast._moduleFlags;
            }

            return false;
        }

        public isEnum() { return hasFlag(this.getModuleFlags(), ModuleFlags.IsEnum); }
        public isWholeFile() { return hasFlag(this.getModuleFlags(), ModuleFlags.IsWholeFile); }

        public shouldEmit(): boolean {
            if (hasFlag(this.getModuleFlags(), ModuleFlags.Ambient)) {
                return false;
            }

            // Always emit a non ambient enum (even empty ones).
            if (hasFlag(this.getModuleFlags(), ModuleFlags.IsEnum)) {
                return true;
            }

            for (var i = 0, n = this.members.members.length; i < n; i++) {
                var member = this.members.members[i];

                // We should emit *this* module if it contains any non-interface types. 
                // Caveat: if we have contain a module, then we should be emitted *if we want to
                // emit that inner module as well.
                if (member.nodeType === NodeType.ModuleDeclaration) {
                    if ((<ModuleDeclaration>member).shouldEmit()) {
                        return true;
                    }
                }
                else if (member.nodeType !== NodeType.InterfaceDeclaration) {
                    return true;
                }
            }

            return false;
        }

        public emit(emitter: Emitter) {
            if (this.shouldEmit()) {
                emitter.emitComments(this, true);
                emitter.emitModule(this);
                emitter.emitComments(this, false);
            }
        }
    }

    export class TypeDeclaration extends NamedDeclaration {
        private _varFlags = VariableFlags.None;

        constructor(nodeType: NodeType,
                    name: Identifier,
                    public typeParameters: ASTList,
                    public extendsList: ASTList,
                    public implementsList: ASTList,
                    members: ASTList) {
            super(nodeType, name, members);
        }

        public getVarFlags(): VariableFlags {
            return this._varFlags;
        }

        // Must only be called from SyntaxTreeVisitor
        public setVarFlags(flags: VariableFlags): void {
            this._varFlags = flags;
        }

        public structuralEquals(ast: TypeDeclaration, includingPosition: boolean): boolean {
            return super.structuralEquals(ast, includingPosition) &&
                   this._varFlags === ast._varFlags &&
                   structuralEquals(this.typeParameters, ast.typeParameters, includingPosition) &&
                   structuralEquals(this.extendsList, ast.extendsList, includingPosition) &&
                   structuralEquals(this.implementsList, ast.implementsList, includingPosition);
        }
    }

    export class ClassDeclaration extends TypeDeclaration {
        public constructorDecl: FunctionDeclaration = null;
        public endingToken: ASTSpan = null;

        constructor(name: Identifier,
                    typeParameters: ASTList,
                    members: ASTList,
                    extendsList: ASTList,
                    implementsList: ASTList) {
            super(NodeType.ClassDeclaration, name, typeParameters, extendsList, implementsList, members);
        }

        public shouldEmit(): boolean {
            return !hasFlag(this.getVarFlags(), VariableFlags.Ambient);
        }

        public emit(emitter: Emitter): void {
            emitter.emitClass(this);
        }
    }

    export class InterfaceDeclaration extends TypeDeclaration {
        constructor(name: Identifier,
            typeParameters: ASTList,
            members: ASTList,
            extendsList: ASTList,
            implementsList: ASTList) {
            super(NodeType.InterfaceDeclaration, name, typeParameters, extendsList, implementsList, members);
        }

        public shouldEmit(): boolean {
            return false;
        }
    }

    export class Statement extends AST {
        constructor(nodeType: NodeType) {
            super(nodeType);
        }

        public isStatement() {
            return true;
        }

        public isStatementOrExpression() { return true; }
    }

    export class ThrowStatement extends Statement {
        constructor(public expression: Expression) {
            super(NodeType.ThrowStatement);
        }

        public emitWorker(emitter: Emitter) {
            emitter.writeToOutput("throw ");
            this.expression.emit(emitter);
            emitter.writeToOutput(";");
        }

        public structuralEquals(ast: ThrowStatement, includingPosition: boolean): boolean {
            return super.structuralEquals(ast, includingPosition) &&
            structuralEquals(this.expression, ast.expression, includingPosition);
        }
    }

    export class ExpressionStatement extends Statement {
        constructor(public expression: AST) {
            super(NodeType.ExpressionStatement);
        }

        public emitWorker(emitter: Emitter) {
            this.expression.emit(emitter);
            emitter.writeToOutput(";");
        }

        public structuralEquals(ast: ExpressionStatement, includingPosition: boolean): boolean {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.expression, ast.expression, includingPosition);
        }
    }

    export class LabeledStatement extends Statement {
        constructor(public identifier: Identifier, public statement: AST) {
            super(NodeType.LabeledStatement);
        }

        public emitWorker(emitter: Emitter) {
            emitter.recordSourceMappingStart(this.identifier);
            emitter.writeToOutput(this.identifier.actualText);
            emitter.recordSourceMappingEnd(this.identifier);
            emitter.writeLineToOutput(":");
            emitter.emitJavascript(this.statement, true);
        }

        public structuralEquals(ast: LabeledStatement, includingPosition: boolean): boolean {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.identifier, ast.identifier, includingPosition) &&
                   structuralEquals(this.statement, ast.statement, includingPosition);
        }
    }

    export class VariableDeclaration extends AST {
        constructor(public declarators: ASTList) {
            super(NodeType.VariableDeclaration);
        }

        public emit(emitter: Emitter) {
            emitter.emitVariableDeclaration(this);
        }

        public structuralEquals(ast: VariableDeclaration, includingPosition: boolean): boolean {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.declarators, ast.declarators, includingPosition);
        }
    }

    export class VariableStatement extends Statement {
        constructor(public declaration: VariableDeclaration) {
            super(NodeType.VariableStatement);
        }

        public shouldEmit(): boolean {
            if (hasFlag(this.getFlags(), ASTFlags.EnumMapElement)) {
                return false;
            }

            var varDecl = <VariableDeclarator>this.declaration.declarators.members[0];
            return !hasFlag(varDecl.getVarFlags(), VariableFlags.Ambient) || varDecl.init !== null;
        }

        public emitWorker(emitter: Emitter) {
            if (hasFlag(this.getFlags(), ASTFlags.EnumElement)) {
                emitter.emitEnumElement(<VariableDeclarator>this.declaration.declarators.members[0]);
            }
            else {
                this.declaration.emit(emitter);
                emitter.writeToOutput(";");
            }
        }

        public structuralEquals(ast: VariableStatement, includingPosition: boolean): boolean {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.declaration, ast.declaration, includingPosition);
        }
    }

    export class Block extends Statement {
        public closeBraceSpan: IASTSpan = null;
        constructor(public statements: ASTList) {
            super(NodeType.Block);
        }

        public emitWorker(emitter: Emitter) {
            emitter.writeLineToOutput(" {");
            emitter.indenter.increaseIndent();
            if (this.statements) {
                emitter.emitModuleElements(this.statements);
            }
            emitter.indenter.decreaseIndent();
            emitter.emitIndent();
            emitter.writeToOutput("}");
        }

        public structuralEquals(ast: Block, includingPosition: boolean): boolean {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.statements, ast.statements, includingPosition);
        }
    }

    export class Jump extends Statement {
        public target: string = null;
        public hasExplicitTarget() { return (this.target); }
        public resolvedTarget: Statement = null;

        constructor(nodeType: NodeType) {
            super(nodeType);
        }

        public emitWorker(emitter: Emitter) {
            if (this.nodeType === NodeType.BreakStatement) {
                emitter.writeToOutput("break");
            }
            else {
                emitter.writeToOutput("continue");
            }
            if (this.hasExplicitTarget()) {
                emitter.writeToOutput(" " + this.target);
            }
            emitter.writeToOutput(";");
        }

        public structuralEquals(ast: Jump, includingPosition: boolean): boolean {
            return super.structuralEquals(ast, includingPosition) &&
                   this.target === ast.target;
        }
    }

    export class WhileStatement extends Statement {
        constructor(public cond: AST, public body: AST) {
            super(NodeType.WhileStatement);
        }

        public emitWorker(emitter: Emitter) {
            emitter.writeToOutput("while (");
            this.cond.emit(emitter);
            emitter.writeToOutput(")");
            emitter.emitBlockOrStatement(this.body);
        }

        public structuralEquals(ast: WhileStatement, includingPosition: boolean): boolean {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.cond, ast.cond, includingPosition) &&
                   structuralEquals(this.body, ast.body, includingPosition);
        }
    }

    export class DoStatement extends Statement {
        public whileSpan: ASTSpan = null;

        constructor(public body: AST, public cond: AST) {
            super(NodeType.DoStatement);
        }

        public emitWorker(emitter: Emitter) {
            emitter.writeToOutput("do");
            emitter.emitBlockOrStatement(this.body);
            emitter.recordSourceMappingStart(this.whileSpan);
            emitter.writeToOutput(" while");
            emitter.recordSourceMappingEnd(this.whileSpan);
            emitter.writeToOutput('(');
            this.cond.emit(emitter);
            emitter.writeToOutput(")");
            emitter.writeToOutput(";");
        }

        public structuralEquals(ast: DoStatement, includingPosition: boolean): boolean {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.body, ast.body, includingPosition) &&
                   structuralEquals(this.cond, ast.cond, includingPosition);
        }
    }

    export class IfStatement extends Statement {
        public statement: ASTSpan = new ASTSpan();

        constructor(public cond: AST,
                    public thenBod: AST,
                    public elseBod: AST) {
            super(NodeType.IfStatement);
        }

        public emitWorker(emitter: Emitter) {
            emitter.recordSourceMappingStart(this.statement);
            emitter.writeToOutput("if (");
            this.cond.emit(emitter);
            emitter.writeToOutput(")");
            emitter.recordSourceMappingEnd(this.statement);

            emitter.emitBlockOrStatement(this.thenBod);

            if (this.elseBod) {
                if (this.elseBod.nodeType === NodeType.IfStatement) {
                    emitter.writeToOutput(" else ");
                    this.elseBod.emit(emitter);
                }
                else {
                    emitter.writeToOutput(" else");
                    emitter.emitBlockOrStatement(this.elseBod);
                }
            }
        }

        public structuralEquals(ast: IfStatement, includingPosition: boolean): boolean {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.cond, ast.cond, includingPosition) &&
                   structuralEquals(this.thenBod, ast.thenBod, includingPosition) &&
                   structuralEquals(this.elseBod, ast.elseBod, includingPosition);
        }
    }

    export class ReturnStatement extends Statement {
        constructor(public returnExpression: AST) {
            super(NodeType.ReturnStatement);
        }

        public emitWorker(emitter: Emitter) {
            if (this.returnExpression) {
                emitter.writeToOutput("return ");
                this.returnExpression.emit(emitter);
                emitter.writeToOutput(";");
            }
            else {
                emitter.writeToOutput("return;");
            }
        }

        public structuralEquals(ast: ReturnStatement, includingPosition: boolean): boolean {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.returnExpression, ast.returnExpression, includingPosition);
        }
    }

    export class ForInStatement extends Statement {
        constructor(public lval: AST, public obj: AST, public body: AST) {
            super(NodeType.ForInStatement);
        }

        public statement: ASTSpan = new ASTSpan();

        public emitWorker(emitter: Emitter) {
            emitter.recordSourceMappingStart(this.statement);
            emitter.writeToOutput("for (");
            this.lval.emit(emitter);
            emitter.writeToOutput(" in ");
            this.obj.emit(emitter);
            emitter.writeToOutput(")");
            emitter.recordSourceMappingEnd(this.statement);
            emitter.emitBlockOrStatement(this.body);
        }

        public structuralEquals(ast: ForInStatement, includingPosition: boolean): boolean {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.lval, ast.lval, includingPosition) &&
                   structuralEquals(this.obj, ast.obj, includingPosition) &&
                   structuralEquals(this.body, ast.body, includingPosition);
        }
    }

    export class ForStatement extends Statement {
        constructor(public init: AST,
                    public cond: AST,
                    public incr: AST,
                    public body: AST) {
            super(NodeType.ForStatement);
        }

        public emitWorker(emitter: Emitter) {
            emitter.writeToOutput("for (");
            if (this.init) {
                if (this.init.nodeType !== NodeType.List) {
                    this.init.emit(emitter);
                }
                else {
                    emitter.setInVarBlock((<ASTList>this.init).members.length);
                    emitter.emitCommaSeparatedList(<ASTList>this.init);
                }
            }

            emitter.writeToOutput("; ");
            emitter.emitJavascript(this.cond, false);
            emitter.writeToOutput("; ");
            emitter.emitJavascript(this.incr, false);
            emitter.writeToOutput(")");
            emitter.emitBlockOrStatement(this.body);
        }

        public structuralEquals(ast: ForStatement, includingPosition: boolean): boolean {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.init, ast.init, includingPosition) &&
                   structuralEquals(this.cond, ast.cond, includingPosition) &&
                   structuralEquals(this.incr, ast.incr, includingPosition) &&
                   structuralEquals(this.body, ast.body, includingPosition);
        }
    }

    export class WithStatement extends Statement {
        constructor(public expr: AST, public body: AST) {
            super(NodeType.WithStatement);
        }

        public emitWorker(emitter: Emitter) {
            emitter.writeToOutput("with (");
            if (this.expr) {
                this.expr.emit(emitter);
            }

            emitter.writeToOutput(")");
            emitter.emitBlockOrStatement(this.body);
        }

        public structuralEquals(ast: WithStatement, includingPosition: boolean): boolean {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.expr, ast.expr, includingPosition) &&
                   structuralEquals(this.body, ast.body, includingPosition);
        }
    }

    export class SwitchStatement extends Statement {
        public caseList: ASTList;
        public defaultCase: CaseClause = null;
        public statement: ASTSpan = new ASTSpan();

        constructor(public val: AST) {
            super(NodeType.SwitchStatement);
        }

        public emitWorker(emitter: Emitter) {
            emitter.recordSourceMappingStart(this.statement);
            emitter.writeToOutput("switch (");
            this.val.emit(emitter);
            emitter.writeToOutput(")");
            emitter.recordSourceMappingEnd(this.statement);
            emitter.writeLineToOutput(" {");
            emitter.indenter.increaseIndent();

            var lastEmittedNode = null;
            for (var i = 0, n = this.caseList.members.length; i < n; i++) {
                var caseExpr = this.caseList.members[i];

                emitter.emitSpaceBetweenConstructs(lastEmittedNode, caseExpr);
                emitter.emitJavascript(caseExpr, true);

                lastEmittedNode = caseExpr;
            }
            emitter.indenter.decreaseIndent();
            emitter.emitIndent();
            emitter.writeToOutput("}");
        }

        public structuralEquals(ast: SwitchStatement, includingPosition: boolean): boolean {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.caseList, ast.caseList, includingPosition) &&
                   structuralEquals(this.val, ast.val, includingPosition);
        }
    }

    export class CaseClause extends AST {
        public expr: AST = null;
        public body: ASTList;
        public colonSpan: ASTSpan = new ASTSpan();

        constructor() {
            super(NodeType.CaseClause);
        }

        public emitWorker(emitter: Emitter) {
            if (this.expr) {
                emitter.writeToOutput("case ");
                this.expr.emit(emitter);
            }
            else {
                emitter.writeToOutput("default");
            }
            emitter.recordSourceMappingStart(this.colonSpan);
            emitter.writeToOutput(":");
            emitter.recordSourceMappingEnd(this.colonSpan);

            if (this.body.members.length === 1 && this.body.members[0].nodeType === NodeType.Block) {
                // The case statement was written with curly braces, so emit it with the appropriate formatting
                this.body.members[0].emit(emitter);
                emitter.writeLineToOutput("");
            }
            else {
                // No curly braces. Format in the expected way
                emitter.writeLineToOutput("");
                emitter.indenter.increaseIndent();
                this.body.emit(emitter);
                emitter.indenter.decreaseIndent();
            }
        }

        public structuralEquals(ast: CaseClause, includingPosition: boolean): boolean {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.expr, ast.expr, includingPosition) &&
                   structuralEquals(this.body, ast.body, includingPosition);
        }
    }

    export class TypeParameter extends AST {
        constructor(public name: Identifier, public constraint: AST) {
            super(NodeType.TypeParameter);
        }

        public structuralEquals(ast: TypeParameter, includingPosition: boolean): boolean {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.name, ast.name, includingPosition) &&
                   structuralEquals(this.constraint, ast.constraint, includingPosition);
        }
    }

    export class GenericType extends AST {
        constructor(public name: AST, public typeArguments: ASTList) {
            super(NodeType.GenericType);
        }

        public emit(emitter: Emitter): void {
            this.name.emit(emitter);
        }

        public structuralEquals(ast: GenericType, includingPosition: boolean): boolean {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.name, ast.name, includingPosition) &&
                   structuralEquals(this.typeArguments, ast.typeArguments, includingPosition);
        }
    }

    export class TypeReference extends AST {
        constructor(public term: AST, public arrayCount: number) {
            super(NodeType.TypeRef);
        }

        public emit(emitter: Emitter) {
            throw new Error("should not emit a type ref");
        }

        public structuralEquals(ast: TypeReference, includingPosition: boolean): boolean {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.term, ast.term, includingPosition) &&
                   this.arrayCount === ast.arrayCount;
        }
    }

    export class TryStatement extends Statement {
        constructor(public tryBody: Block, public catchClause: CatchClause, public finallyBody: Block) {
            super(NodeType.TryStatement);
        }

        public emitWorker(emitter: Emitter) {
            emitter.writeToOutput("try ");
            this.tryBody.emit(emitter);
            emitter.emitJavascript(this.catchClause, false);

            if (this.finallyBody) {
                emitter.writeToOutput(" finally");
                this.finallyBody.emit(emitter);
            }
        }

        public structuralEquals(ast: TryStatement, includingPosition: boolean): boolean {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.tryBody, ast.tryBody, includingPosition) &&
                   structuralEquals(this.catchClause, ast.catchClause, includingPosition) &&
                   structuralEquals(this.finallyBody, ast.finallyBody, includingPosition);
        }
    }

    export class CatchClause extends AST {
        constructor(public param: VariableDeclarator, public body: Block) {
            super(NodeType.CatchClause);
        }

        public statement: ASTSpan = new ASTSpan();

        public emitWorker(emitter: Emitter) {
            emitter.writeToOutput(" ");
            emitter.recordSourceMappingStart(this.statement);
            emitter.writeToOutput("catch (");
            this.param.id.emit(emitter);
            emitter.writeToOutput(")");
            emitter.recordSourceMappingEnd(this.statement);
            this.body.emit(emitter);
        }

        public structuralEquals(ast: CatchClause, includingPosition: boolean): boolean {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.param, ast.param, includingPosition) &&
                   structuralEquals(this.body, ast.body, includingPosition);
        }
    }

    export class DebuggerStatement extends Statement {
        constructor() {
            super(NodeType.DebuggerStatement);
        }

        public emitWorker(emitter: Emitter) {
            emitter.writeToOutput("debugger;");
        }
    }

    export class OmittedExpression extends Expression {
        constructor() {
            super(NodeType.OmittedExpression);
        }

        public emitWorker(emitter: Emitter) {
        }

        public structuralEquals(ast: CatchClause, includingPosition: boolean): boolean {
            return super.structuralEquals(ast, includingPosition);
        }
    }

    export class EmptyStatement extends Statement {
        constructor() {
            super(NodeType.EmptyStatement);
        }

        public emitWorker(emitter: Emitter) {
            emitter.writeToOutput(";");
        }

        public structuralEquals(ast: CatchClause, includingPosition: boolean): boolean {
            return super.structuralEquals(ast, includingPosition);
        }
    }

    export class Comment extends AST {
        public text: string[] = null;
        public minLine: number;
        public limLine: number;
        private docCommentText: string = null;

        constructor(public content: string,
                    public isBlockComment: boolean,
                    public endsLine) {
            super(NodeType.Comment);
        }

        public structuralEquals(ast: Comment, includingPosition: boolean): boolean {
            return super.structuralEquals(ast, includingPosition) &&
                   this.minLine === ast.minLine &&
                   this.content === ast.content &&
                   this.isBlockComment === ast.isBlockComment &&
                   this.endsLine === ast.endsLine;
        }

        public getText(): string[] {
            if (this.text === null) {
                if (this.isBlockComment) {
                    this.text = this.content.split("\n");
                    for (var i = 0; i < this.text.length; i++) {
                        this.text[i] = this.text[i].replace(/^\s+|\s+$/g, '');
                    }
                }
                else {
                    this.text = [(this.content.replace(/^\s+|\s+$/g, ''))];
                }
            }

            return this.text;
        }

        public isDocComment() {
            if (this.isBlockComment) {
                return this.content.charAt(2) === "*" && this.content.charAt(3) !== "/";
            }

            return false;
        }

        public getDocCommentTextValue() {
            if (this.docCommentText === null) {
                this.docCommentText = Comment.cleanJSDocComment(this.content);
            }

            return this.docCommentText;
        }

        static consumeLeadingSpace(line: string, startIndex: number, maxSpacesToRemove?: number) {
            var endIndex = line.length;
            if (maxSpacesToRemove !== undefined) {
                endIndex = min(startIndex + maxSpacesToRemove, endIndex);
            }

            for (; startIndex < endIndex; startIndex++) {
                var charCode = line.charCodeAt(startIndex);
                if (charCode !== CharacterCodes.space && charCode !== CharacterCodes.tab) {
                    return startIndex;
                }
            }

            if (endIndex !== line.length) {
                return endIndex;
            }

            return -1;
        }

        static isSpaceChar(line: string, index: number) {
            var length = line.length;
            if (index < length) {
                var charCode = line.charCodeAt(index);
                // If the character is space
                return charCode === CharacterCodes.space || charCode === CharacterCodes.tab;
            }

            // If the index is end of the line it is space
            return index === length;
        }

        static cleanDocCommentLine(line: string, jsDocStyleComment: boolean, jsDocLineSpaceToRemove?: number) {
            var nonSpaceIndex = Comment.consumeLeadingSpace(line, 0);
            if (nonSpaceIndex !== -1) {
                var jsDocSpacesRemoved = nonSpaceIndex;
                if (jsDocStyleComment && line.charAt(nonSpaceIndex) === '*') { // remove leading * in case of jsDocComment
                    var startIndex = nonSpaceIndex + 1;
                    nonSpaceIndex = Comment.consumeLeadingSpace(line, startIndex, jsDocLineSpaceToRemove);

                    if (nonSpaceIndex !== -1) {
                        jsDocSpacesRemoved = nonSpaceIndex - startIndex;
                    } else {
                        return null;
                    }
                }

                return {
                    minChar: nonSpaceIndex,
                    limChar: line.charAt(line.length - 1) === "\r" ? line.length - 1 : line.length,
                    jsDocSpacesRemoved: jsDocSpacesRemoved
                };
            }

            return null;
        }

        static cleanJSDocComment(content: string, spacesToRemove?: number) {

            var docCommentLines: string[] = [];
            content = content.replace("/**", ""); // remove /**
            if (content.length >= 2 && content.charAt(content.length - 1) === "/" && content.charAt(content.length - 2) === "*") {
                content = content.substring(0, content.length - 2); // remove last */
            }
            var lines = content.split("\n");
            var inParamTag = false;
            for (var l = 0; l < lines.length; l++) {
                var line = lines[l];
                var cleanLinePos = Comment.cleanDocCommentLine(line, true, spacesToRemove);
                if (!cleanLinePos) {
                    // Whole line empty, read next line
                    continue;
                }

                var docCommentText = "";
                var prevPos = cleanLinePos.minChar;
                for (var i = line.indexOf("@", cleanLinePos.minChar); 0 <= i && i < cleanLinePos.limChar; i = line.indexOf("@", i + 1)) {
                    // We have encoutered @. 
                    // If we were omitting param comment, we dont have to do anything
                    // other wise the content of the text till @ tag goes as doc comment
                    var wasInParamtag = inParamTag;

                    // Parse contents next to @
                    if (line.indexOf("param", i + 1) === i + 1 && Comment.isSpaceChar(line, i + 6)) {
                        // It is param tag. 

                        // If we were not in param tag earlier, push the contents from prev pos of the tag this tag start as docComment
                        if (!wasInParamtag) {
                            docCommentText += line.substring(prevPos, i);
                        }

                        // New start of contents 
                        prevPos = i;
                        inParamTag = true;
                    } else if (wasInParamtag) {
                        // Non param tag start
                        prevPos = i;
                        inParamTag = false;
                    }
                }

                if (!inParamTag) {
                    docCommentText += line.substring(prevPos, cleanLinePos.limChar);
                }

                // Add line to comment text if it is not only white space line
                var newCleanPos = Comment.cleanDocCommentLine(docCommentText, false);
                if (newCleanPos) {
                    if (spacesToRemove === undefined) {
                        spacesToRemove = cleanLinePos.jsDocSpacesRemoved;
                    }
                    docCommentLines.push(docCommentText);
                }
            }

            return docCommentLines.join("\n");
        }

        static getDocCommentText(comments: Comment[]) {
            var docCommentText: string[] = [];
            for (var c = 0 ; c < comments.length; c++) {
                var commentText = comments[c].getDocCommentTextValue();
                if (commentText !== "") {
                    docCommentText.push(commentText);
                }
            }
            return docCommentText.join("\n");
        }

        static getParameterDocCommentText(param: string, fncDocComments: Comment[]) {
            if (fncDocComments.length === 0 || !fncDocComments[0].isBlockComment) {
                // there were no fnc doc comments and the comment is not block comment then it cannot have 
                // @param comment that can be parsed
                return "";
            }

            for (var i = 0; i < fncDocComments.length; i++) {
                var commentContents = fncDocComments[i].content;
                for (var j = commentContents.indexOf("@param", 0); 0 <= j; j = commentContents.indexOf("@param", j)) {
                    j += 6;
                    if (!Comment.isSpaceChar(commentContents, j)) {
                        // This is not param tag but a tag line @paramxxxxx
                        continue;
                    }

                    // This is param tag. Check if it is what we are looking for
                    j = Comment.consumeLeadingSpace(commentContents, j);
                    if (j === -1) {
                        break;
                    }

                    // Ignore the type expression
                    if (commentContents.charCodeAt(j) === CharacterCodes.openBrace) {
                        j++;
                        // Consume the type
                        var charCode = 0;
                        for (var curlies = 1; j < commentContents.length; j++) {
                            charCode = commentContents.charCodeAt(j);
                            // { character means we need to find another } to match the found one
                            if (charCode === CharacterCodes.openBrace) {
                                curlies++;
                                continue;
                            }

                            // } char
                            if (charCode === CharacterCodes.closeBrace) {
                                curlies--;
                                if (curlies === 0) {
                                    // We do not have any more } to match the type expression is ignored completely
                                    break;
                                } else {
                                    // there are more { to be matched with }
                                    continue;
                                }
                            }

                            // Found start of another tag
                            if (charCode === CharacterCodes.at) {
                                break;
                            }
                        }

                        // End of the comment
                        if (j === commentContents.length) {
                            break;
                        }

                        // End of the tag, go onto looking for next tag
                        if (charCode === CharacterCodes.at) {
                            continue;
                        }

                        j = Comment.consumeLeadingSpace(commentContents, j + 1);
                        if (j === -1) {
                            break;
                        }
                    }

                    // Parameter name
                    if (param !== commentContents.substr(j, param.length) || !Comment.isSpaceChar(commentContents, j + param.length)) {
                        // this is not the parameter we are looking for
                        continue;
                    }

                    // Found the parameter we were looking for
                    j = Comment.consumeLeadingSpace(commentContents, j + param.length);
                    if (j === -1) {
                        return "";
                    }

                    var endOfParam = commentContents.indexOf("@", j);
                    var paramHelpString = commentContents.substring(j, endOfParam < 0 ? commentContents.length : endOfParam);

                    // Find alignement spaces to remove
                    var paramSpacesToRemove: number = undefined;
                    var paramLineIndex = commentContents.substring(0, j).lastIndexOf("\n") + 1;
                    if (paramLineIndex !== 0) {
                        if (paramLineIndex < j && commentContents.charAt(paramLineIndex + 1) === "\r") {
                            paramLineIndex++;
                        }
                    }
                    var startSpaceRemovalIndex = Comment.consumeLeadingSpace(commentContents, paramLineIndex);
                    if (startSpaceRemovalIndex !== j && commentContents.charAt(startSpaceRemovalIndex) === "*") {
                        paramSpacesToRemove = j - startSpaceRemovalIndex - 1;
                    }

                    // Clean jsDocComment and return
                    return Comment.cleanJSDocComment(paramHelpString, paramSpacesToRemove);
                }
            }

            return "";
        }
    }
}