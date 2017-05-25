/**
 * @license
 * Copyright 2013 Palantir Technologies, Inc.
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

import * as Lint from "../lint";
import * as ts from "typescript";

export class Rule extends Lint.Rules.AbstractRule {

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        let walker = new ArrayPaddingWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(walker);
    }
}

const ARRAY_REGEX = /\[ .* \]/;

class ArrayPaddingWalker extends Lint.RuleWalker {

    public visitArrayLiteralExpression(node: ts.ArrayLiteralExpression) {
        const start: number = node.getFullStart();
        const end: number = node.getEnd();
        const startPos = node.getSourceFile().getLineAndCharacterOfPosition(start);
        const endPos = node.getSourceFile().getLineAndCharacterOfPosition(end);

        if (startPos.line === endPos.line) {
            const text = node.getFullText(this.getSourceFile());
            if (!ARRAY_REGEX.test(text) && text !== "[]") {
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), "array padding"));
            }
        }
        super.visitArrayLiteralExpression(node);
    }
}
