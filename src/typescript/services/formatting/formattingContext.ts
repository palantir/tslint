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

/// <references path="formatting.ts"/>

module TypeScript.Formatting {
    export class FormattingContext {
        public currentTokenSpan: TokenSpan = null;
        public nextTokenSpan: TokenSpan = null;
        public contextNode: IndentationNodeContext = null;
        public currentTokenParent: IndentationNodeContext = null;
        public nextTokenParent: IndentationNodeContext = null;

        private contextNodeAllOnSameLine: boolean = null;
        private tokensAreOnSameLine: boolean = null;
        private tokensAreSiblingNodesOnSameLine: boolean = null;

        constructor (private snapshot: ITextSnapshot, public formattingRequestKind: FormattingRequestKind) {
            Debug.assert(this.snapshot != null, "snapshot is null");
        }

        public updateContext(currentTokenSpan: TokenSpan, currentTokenParent: IndentationNodeContext, nextTokenSpan: TokenSpan, nextTokenParent: IndentationNodeContext, commonParent: IndentationNodeContext) {
            Debug.assert(currentTokenSpan != null, "currentTokenSpan is null");
            Debug.assert(currentTokenParent != null, "currentTokenParent is null");
            Debug.assert(nextTokenSpan != null, "nextTokenSpan is null");
            Debug.assert(nextTokenParent != null, "nextTokenParent is null");
            Debug.assert(commonParent != null, "commonParent is null");

            this.currentTokenSpan = currentTokenSpan;
            this.currentTokenParent = currentTokenParent;
            this.nextTokenSpan = nextTokenSpan;
            this.nextTokenParent = nextTokenParent;
            this.contextNode = commonParent;

            this.contextNodeAllOnSameLine = null;
            this.tokensAreOnSameLine = null;
            this.tokensAreSiblingNodesOnSameLine = null;
        }

        public ContextNodeAllOnSameLine(): boolean {
            if (this.contextNodeAllOnSameLine === null) {
                var startLine = this.snapshot.getLineNumberFromPosition(this.contextNode.start());
                var endLine = this.snapshot.getLineNumberFromPosition(this.contextNode.end());
                
                this.contextNodeAllOnSameLine = (startLine == endLine);
            }

            return this.contextNodeAllOnSameLine;
        }

        public TokensAreOnSameLine(): boolean {
            if (this.tokensAreOnSameLine === null) {
                var startLine = this.snapshot.getLineNumberFromPosition(this.currentTokenSpan.start());
                var endLine = this.snapshot.getLineNumberFromPosition(this.nextTokenSpan.start())

                this.tokensAreOnSameLine = (startLine == endLine);
            }

            return this.tokensAreOnSameLine;
        }
    }
}