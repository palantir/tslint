// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='..\typescript.ts' />

module TypeScript {

    export class PullSymbolBindingContext {

        private parentChain: PullTypeSymbol[] = [];
        private declPath: string[] = [];
        public semanticInfo: SemanticInfo;
        public reBindingAfterChange = false;
        public startingDeclForRebind = pullDeclID; // note that this gets set on creation

        constructor(public semanticInfoChain: SemanticInfoChain, public scriptName: string) {
            this.semanticInfo = this.semanticInfoChain.getUnit(this.scriptName);
        }

        public getParent(n = 0): PullTypeSymbol { return this.parentChain ? this.parentChain[this.parentChain.length - 1 - n] : null; }
        public getDeclPath() { return this.declPath; }

        public pushParent(parentDecl: PullTypeSymbol) {
            if (parentDecl) {
                this.parentChain[this.parentChain.length] = parentDecl;
                this.declPath[this.declPath.length] = parentDecl.getName();
            }
        }

        public popParent() {
            if (this.parentChain.length) {
                this.parentChain.length--;
                this.declPath.length--;
            }
        }
    }

    export var time_in_findSymbol = 0;
}