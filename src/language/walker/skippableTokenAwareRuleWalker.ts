/*
 * Copyright 2015 Palantir Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

module Lint {
    export class SkippableTokenAwareRuleWalker extends RuleWalker {
        protected tokensToSkipStartEndMap: {[start: number]: number};

        constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
            super(sourceFile, options);
            this.tokensToSkipStartEndMap = {};
        }

        protected visitRegularExpressionLiteral(node: ts.Node) {
            this.addTokenToSkipFromNode(node);
            super.visitRegularExpressionLiteral(node);
        }

        protected visitIdentifier(node: ts.Identifier) {
            this.addTokenToSkipFromNode(node);
            super.visitIdentifier(node);
        }

        protected visitTemplateExpression(node: ts.TemplateExpression) {
            this.addTokenToSkipFromNode(node);
            super.visitTemplateExpression(node);
        }

        protected addTokenToSkipFromNode(node: ts.Node) {
            if (node.getStart() < node.getEnd()) {
                // only add to the map nodes whose end comes after their start, to prevent infinite loops
                this.tokensToSkipStartEndMap[node.getStart()] = node.getEnd();
            }
        }
    }
}
