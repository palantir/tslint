// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='..\typescript.ts' />

module TypeScript {
    export var pullDeclID = 0;
    export var lastBoundPullDeclId = 0;

    export class PullDecl {
        private declType: PullElementKind;

        private declName: string;

        private declDisplayName: string;

        private symbol: PullSymbol = null;

        private declGroups: { [s: string]: PullDeclGroup; } = new BlockIntrinsics();

        // use this to store the signature symbol for a function declaration
        private signatureSymbol: PullSignatureSymbol = null;
        private specializingSignatureSymbol: PullSignatureSymbol = null;

        private childDecls: PullDecl[] = [];
        private typeParameters: PullDecl[] = [];

        // Mappings from names to decls.  Public only for diffing purposes.
        public childDeclTypeCache: any = new BlockIntrinsics();
        public childDeclValueCache: any = new BlockIntrinsics();
        public childDeclNamespaceCache: any = new BlockIntrinsics();
        public childDeclTypeParameterCache: any = new BlockIntrinsics();

        private declID = pullDeclID++;

        private declFlags: PullElementFlags = PullElementFlags.None;

        private span: TextSpan;

        private scriptName: string;

        private diagnostics: IDiagnostic[] = null;

        private parentDecl: PullDecl = null;
        private _parentPath: PullDecl[] = null;
        private _isBound: boolean = false;

        // In the case of classes, initialized modules and enums, we need to track the implicit
        // value set to the constructor or instance type.  We can use this field to make sure that on
        // edits and updates we don't leak the val decl or symbol
        private synthesizedValDecl: PullDecl = null;

        constructor(declName: string, displayName: string, declType: PullElementKind, declFlags: PullElementFlags, span: TextSpan, scriptName: string) {
            this.declName = declName;
            this.declType = declType;
            this.declFlags = declFlags;
            this.span = span;
            this.scriptName = scriptName;

            if (displayName !== this.declName) {
                this.declDisplayName = displayName;
            }
        }

        public getDeclID() { return this.declID; }

        /** Use getName for type checking purposes, and getDisplayName to report an error or display info to the user.
         * They will differ when the identifier is an escaped unicode character or the identifier "__proto__".
         */
        public getName() { return this.declName; }
        public getKind() { return this.declType }

        public getDisplayName() {
            return this.declDisplayName === undefined ? this.declName : this.declDisplayName;
        }

        public setSymbol(symbol: PullSymbol) { this.symbol = symbol; }

        public ensureSymbolIsBound(bindSignatureSymbol=false) {

            if (!((bindSignatureSymbol && this.signatureSymbol) || this.symbol) && !this._isBound && this.declType != PullElementKind.Script) {
                //var binder = new PullSymbolBinder(globalSemanticInfoChain);
                var prevUnit = globalBinder.semanticInfo;
                globalBinder.setUnit(this.scriptName);
                globalBinder.bindDeclToPullSymbol(this);
                if (prevUnit) {
                    globalBinder.setUnit(prevUnit.getPath());
                }
            }
        }

        public getSymbol(): PullSymbol {

            if (this.declType == PullElementKind.Script) {
                return null;
            }

            this.ensureSymbolIsBound();

            return this.symbol;
        }

        public hasSymbol() {
            return this.symbol != null;
        }

        public setSignatureSymbol(signature: PullSignatureSymbol): void { this.signatureSymbol = signature; }
        public getSignatureSymbol(): PullSignatureSymbol { 
            this.ensureSymbolIsBound(true);
            
            return this.signatureSymbol;
        }

        public hasSignature() {
            return this.signatureSymbol != null;
        }

        public setSpecializingSignatureSymbol(signature: PullSignatureSymbol): void { this.specializingSignatureSymbol = signature; }
        public getSpecializingSignatureSymbol() {
            if (this.specializingSignatureSymbol) {
                return this.specializingSignatureSymbol;
            }

            return this.signatureSymbol;
        }

        public getFlags(): PullElementFlags { return this.declFlags; }
        public setFlags(flags: PullElementFlags) { this.declFlags = flags; }

        public getSpan(): TextSpan { return this.span; }
        public setSpan(span: TextSpan) { this.span = span; }

        public getScriptName(): string { return this.scriptName; }

        public setValueDecl(valDecl: PullDecl) { this.synthesizedValDecl = valDecl; }
        public getValueDecl() { return this.synthesizedValDecl; }

        public isEqual(other: PullDecl) {
            return  (this.declName === other.declName) &&
                    (this.declType === other.declType) &&
                    (this.declFlags === other.declFlags) &&
                    (this.scriptName === other.scriptName) &&
                    (this.span.start() === other.span.start()) &&
                    (this.span.end() === other.span.end());
        }

        public getParentDecl(): PullDecl {
            return this.parentDecl;
        }

        public setParentDecl(parentDecl: PullDecl) {
            this.parentDecl = parentDecl;
        }

        public addDiagnostic(diagnostic: IDiagnostic) {
            if (diagnostic) {
                if (!this.diagnostics) {
                    this.diagnostics = [];
                }

                //error.adjustOffset(this.span.start());

                this.diagnostics[this.diagnostics.length] = diagnostic;
            }
        }

        public getDiagnostics(): IDiagnostic[] {
            return this.diagnostics;
        }

        public setErrors(diagnostics: SemanticDiagnostic[]) {
            if (diagnostics) {
                this.diagnostics = [];

                // adjust the spans as we parent the errors to the new decl
                for (var i = 0; i < diagnostics.length; i++) {
                    diagnostics[i].adjustOffset(this.span.start());
                    this.diagnostics[this.diagnostics.length] = diagnostics[i];
                }
            }
        }

        public resetErrors() {
            this.diagnostics = [];
        }

        private getChildDeclCache(declKind: PullElementKind): any {
            return declKind === PullElementKind.TypeParameter
                ? this.childDeclTypeParameterCache
                : hasFlag(declKind, PullElementKind.SomeContainer)
                ? this.childDeclNamespaceCache
                    : hasFlag(declKind, PullElementKind.SomeType)
                        ? this.childDeclTypeCache
                        : this.childDeclValueCache;
        }

        // returns 'true' if the child decl was successfully added
        // ('false' is returned if addIfDuplicate is false and there is a collision)
        public addChildDecl(childDecl: PullDecl): void {
            // check if decl exists
            // merge if necessary

            if (childDecl.getKind() === PullElementKind.TypeParameter) {
                this.typeParameters[this.typeParameters.length] = childDecl;
            }
            else {
                this.childDecls[this.childDecls.length] = childDecl;
            }

            // add to the appropriate cache
            var declName = childDecl.getName();
            var cache = this.getChildDeclCache(childDecl.getKind());
            var childrenOfName = <PullDecl[]>cache[declName];
            if (!childrenOfName) {
                childrenOfName = [];
            }

            childrenOfName.push(childDecl);
            cache[declName] = childrenOfName;
        }

        //public lookupChildDecls(declName: string, declKind: PullElementKind): PullDecl[] {
        //    // find the decl with the optional type
        //    // if necessary, cache the decl
        //    // may be wise to return a chain of decls, or take a parent decl as a parameter
        //    var cache = this.getChildDeclCache(declKind);
        //    var childrenOfName = <PullDecl[]>cache[declName];

        //    return childrenOfName ? childrenOfName : [];
        //}

        // Search for a child decl with the given name.  'isType' is used to specify whether or 
        // not child types or child values are returned.
        public searchChildDecls(declName: string, searchKind: PullElementKind): PullDecl[]{
            // find the decl with the optional type
            // if necessary, cache the decl
            // may be wise to return a chain of decls, or take a parent decl as a parameter
            var cache = (searchKind & PullElementKind.SomeType) ? this.childDeclTypeCache :
                (searchKind & PullElementKind.SomeContainer) ? this.childDeclNamespaceCache :
                this.childDeclValueCache;
            
            var cacheVal = <PullDecl[]>cache[declName];

            if (cacheVal) {
                return cacheVal;
            }
            else {
                // If we didn't find it, and they were searching for types, then also check the 
                // type parameter cache.
                if (searchKind & PullElementKind.SomeType) {
                    cacheVal = this.childDeclTypeParameterCache[declName];

                    if (cacheVal) {
                        return cacheVal;
                    }
                }

                return [];
            }
         }

        public getChildDecls() { return this.childDecls; }
        public getTypeParameters() { return this.typeParameters; }

        public addVariableDeclToGroup(decl: PullDecl) {
            var declGroup = this.declGroups[decl.getName()];
            if (declGroup) {
                declGroup.addDecl(decl);
            }
            else {
                declGroup = new PullDeclGroup(decl.getName());
                declGroup.addDecl(decl);
                this.declGroups[decl.getName()] = declGroup;
            }
        }

        public getVariableDeclGroups(): PullDecl[][] {
            var declGroups: PullDecl[][] = [];

            for (var declName in this.declGroups) {
                if (this.declGroups[declName]) {
                    declGroups[declGroups.length] = this.declGroups[declName].getDecls();
                }
            }

            return declGroups;
        }

        public getParentPath() {
            return this._parentPath;
        }

        public setParentPath(path: PullDecl[]) {
            this._parentPath = path;
        }

        public setIsBound(isBinding) {
            this._isBound = isBinding;
        }

        public isBound() {
            return this._isBound;
        }
    }

    export class PullFunctionExpressionDecl extends PullDecl {
        private functionExpressionName: string;

        constructor(expressionName: string, declFlags: PullElementFlags, span: TextSpan, scriptName: string) {
            super("", "", PullElementKind.FunctionExpression, declFlags, span, scriptName);
            this.functionExpressionName = expressionName;
        }

        public getFunctionExpressionName(): string {
            return this.functionExpressionName;
        }
    }

    export class PullDeclGroup {

        private _decls: PullDecl[] = [];

        constructor(public name: string) {
        }

        public addDecl(decl: PullDecl) {
            if (decl.getName() === this.name) {
                this._decls[this._decls.length] = decl;
            }
        }

        public getDecls() {
            return this._decls;
        }
    }
}