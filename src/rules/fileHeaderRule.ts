/**
 * @license
 * Copyright 2016 Palantir Technologies, Inc.
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

import * as ts from "typescript";
import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "file-header",
        description: "Enforces a certain header comment for all files, matched by a regular expression.",
        optionsDescription: "Regular expression to match the header.",
        options: {
            type: "string",
        },
        optionExamples: ['[true, "Copyright \\\\d{4}"]'],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "missing file header";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const { text } = sourceFile;
        // ignore shebang if it exists
        const offset = text.startsWith("#!") ? text.indexOf("\n") + 1 : 0;
        if (!textHasComment(text, offset, new RegExp(this.ruleArguments[0]))) {
            return [new Lint.RuleFailure(sourceFile, offset, offset, Rule.FAILURE_STRING, this.ruleName)];
        }
        return [];
    }
}

// match a single line or multi line comment with leading whitespace
// the wildcard dot does not match new lines - we can use [\s\S] instead
const commentRegexp = /^\s*(\/\/(.*)|\/\*([\s\S]*?)\*\/)/;

function textHasComment(text: string, offset: number, headerRegexp: RegExp): boolean {
    // check for a comment
    const match = commentRegexp.exec(text.slice(offset));
    if (match === null) {
        return false;
    }

    // either the third or fourth capture group contains the comment contents
    const comment = match[2] !== undefined ? match[2] : match[3];
    return comment.search(headerRegexp) !== -1;
}
