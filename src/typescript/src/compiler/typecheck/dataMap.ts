// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='..\typescript.ts' />

module TypeScript {
    export class DataMap {
        public map: any = {};

        public link(id: string, data: any) {
            this.map[id] = data;
        }

        public unlink(id: string) {
            this.map[id] = undefined;
        }

        public read(id: string): any {
            return this.map[id];
        }
    }
}