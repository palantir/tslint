// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='typescriptServices.ts' />

module Services {
    export class EmitOutputTextWriter implements ITextWriter {
        public text: string;
        public useUTF8encoding: boolean;
        constructor(public name: string, public writeByteOrderMark: boolean) {
            this.useUTF8encoding = writeByteOrderMark;
            this.text = "";
        }

        public Write(s) {
            this.text += s;
        }

        public WriteLine(s) {
            this.text += s + '\n';
        }

        public Close() {
        }
    }
}