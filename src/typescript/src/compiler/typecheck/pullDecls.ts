// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='..\typescript.ts' />

module TypeScript {
    export var pullDeclID = 0;
    export var lastBoundPullDeclId = 0;
    var sentinelEmptyPullDeclArray: any[] = [];

    export class PullDecl {
        public kind: PullElementKind;

        public name: string;

        private declDisplayName: string;

        private symbol: PullSymbol = null;

        private declGroups: { [s: string]: PullDeclGroup; } = new BlockIntrinsics();

        // use this to store the signature symbol for a function declaration
        private signatureSymbol: PullSignatureSymbol = null;
        private specializingSignatureSymbol: PullSignatureSymbol = null;

        private childDecls: PullDecl[] = null;
        private typeParameters: PullDecl[] = null;

        // Mappings from names to decls.  Public only for diffing purposes.
        public childDeclTypeCache: any = new BlockIntrinsics();
        public childDeclValueCache: any = new BlockIntrinsics();
        public childDeclNamespaceCache: any = new BlockIntrinsics();
        public childDeclTypeParameterCache: any = new BlockIntrinsics();

        public declID = pullDeclID++;
        public declIDString: string = null;

        public flags: PullElementFlags = PullElementFlags.None;

        private span: TextSpan;

        private scriptName: string;

        private diagnostics: Diagnostic[] = null;

        private parentDecl: PullDecl = null;
        private _parentPath: PullDecl[] = null;
        private _isBound: boolean = false;

        // In the case of classes, initialized modules and enums, we need to track the implicit
        // value set to the constructor or instance type.  We can use this field to make sure that on
        // edits and updates we don't leak the val decl or symbol
        private synthesizedValDecl: PullDecl = null;

        public hashCode = -1;

        // This is used to store the AST directly on the decl, rather than in a data map,
        // if the useDirectTypeStorage flag is set
        public ast: AST = null;

        constructor(declName: string, displayName: string, kind: PullElementKind, declFlags: PullElementFlags, span: TextSpan, scriptName: string) {
            this.name = declName;
            this.kind = kind;
            this.flags = declFlags;
            this.span = span;
            this.scriptName = scriptName;

            if (displayName !== this.name) {
                this.declDisplayName = displayName;
            }

            this.hashCode = this.declID ^ this.kind;
            this.declIDString = this.declID.toString();
        }

        /** Use getName for type checking purposes, and getDisplayName to report an error or display info to the user.
         * They will differ when the identifier is an escaped unicode character or the identifier "__proto__".
         */

        public getDisplayName() {
            return this.declDisplayName === undefined ? this.name : this.declDisplayName;
        }

        public setSymbol(symbol: PullSymbol) { this.symbol = symbol; }

        public ensureSymbolIsBound(bindSignatureSymbol=false) {

            if (!((bindSignatureSymbol && this.signatureSymbol) || this.symbol) && !this._isBound && this.kind != PullElementKind.Script) {
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

            if (this.kind == PullElementKind.Script) {
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

        public setFlags(flags: PullElementFlags) { this.flags = flags; }
        public setFlag(flags: PullElementFlags) { this.flags |= flags; }

        public getSpan(): TextSpan { return this.span; }
        public setSpan(span: TextSpan) { this.span = span; }

        public getScriptName(): string { return this.scriptName; }

        public setValueDecl(valDecl: PullDecl) { this.synthesizedValDecl = valDecl; }
        public getValueDecl() { return this.synthesizedValDecl; }

        public isEqual(other: PullDecl) {
            return  (this.name === other.name) &&
                    (this.kind === other.kind) &&
                    (this.flags === other.flags) &&
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

        public addDiagnostic(diagnostic: Diagnostic) {
            if (diagnostic) {
                if (!this.diagnostics) {
                    this.diagnostics = [];
                }

                //error.adjustOffset(this.span.start());

                this.diagnostics[this.diagnostics.length] = diagnostic;
            }
        }

        public getDiagnostics(): Diagnostic[] {
            return this.diagnostics ? this.diagnostics : sentinelEmptyPullDeclArray;
        }

        public resetErrors() {
            this.diagnostics = null;
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

            if (childDecl.kind === PullElementKind.TypeParameter) {
                if (!this.typeParameters) {
                    this.typeParameters = [];
                }
                this.typeParameters[this.typeParameters.length] = childDecl;
            }
            else {
                if (!this.childDecls) {
                    this.childDecls = [];
                }
                this.childDecls[this.childDecls.length] = childDecl;
            }

            // add to the appropriate cache
            var declName = childDecl.name;
            var cache = this.getChildDeclCache(childDecl.kind);
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

            var cacheVal: PullDecl[] = null;

            if (searchKind & PullElementKind.SomeType) {
                cacheVal = <PullDecl[]>this.childDeclTypeCache[declName];
            }
            else if (searchKind & PullElementKind.SomeContainer) {
                cacheVal = <PullDecl[]>this.childDeclNamespaceCache[declName];
            }
            else {
                cacheVal = <PullDecl[]>this.childDeclValueCache[declName];
            }

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

                return sentinelEmptyPullDeclArray;
            }
         }

        public getChildDecls() : PullDecl[] { return this.childDecls ? this.childDecls : sentinelEmptyPullDeclArray; }
        public getTypeParameters() { return this.typeParameters ? this.typeParameters : sentinelEmptyPullDeclArray; }

        public addVariableDeclToGroup(decl: PullDecl) {
            var declGroup = this.declGroups[decl.name];
            if (declGroup) {
                declGroup.addDecl(decl);
            }
            else {
                declGroup = new PullDeclGroup(decl.name);
                declGroup.addDecl(decl);
                this.declGroups[decl.name] = declGroup;
            }
        }

        public getVariableDeclGroups(): PullDecl[][] {
            var declGroups: PullDecl[][] = null;

            for (var declName in this.declGroups) {
                if (this.declGroups[declName]) {
                    if (!declGroups) {
                        declGroups = [];
                    }

                    declGroups[declGroups.length] = this.declGroups[declName].getDecls();
                }
            }

            return declGroups ? declGroups : sentinelEmptyPullDeclArray;
        }

        public getParentPath() {
            return this._parentPath;
        }

        public setParentPath(path: PullDecl[]) {
            this._parentPath = path;
        }

        public setIsBound(isBinding: boolean) {
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
            if (decl.name === this.name) {
                this._decls[this._decls.length] = decl;
            }
        }

        public getDecls() {
            return this._decls;
        }
    }
}