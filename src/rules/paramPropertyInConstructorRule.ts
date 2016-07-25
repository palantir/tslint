/**
 * @license
 * Copyright 2014 Palantir Technologies, Inc.
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
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "param-property-in-constructor",
        description: "Disallows constructor parameter properties to be accessed without the 'this.' prefix",
        rationale: Lint.Utils.dedent`
            This helps enforce consistancy.
            When a constructor parameter is accessed without the 'this.' prefix, it is actually not acessing the same thing.
            Example: 
            class Foo {
                constructor(public num: number) {
                    this.num = 10;
                    num = 5;  //this should be disallowed!
                }
            }
            const f = new Foo();
            alert(f.num);  // will display 10`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "functionality",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_FACTORY = (paramName: string) => {
        return `The constructor parameter '${paramName}' should only be accessed with the 'this' keyword: 'this.${paramName}'`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const languageService = Lint.createLanguageService(sourceFile.fileName, sourceFile.getFullText());
        return this.applyWithWalker(new ParamPropInCtorWalker(sourceFile, this.getOptions(), languageService));
    }
}

export class ParamPropInCtorWalker extends Lint.RuleWalker {

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions, private languageService: ts.LanguageService) {
        super(sourceFile, options);
        this.languageService = languageService;
    }

    public visitConstructorDeclaration(node: ts.ConstructorDeclaration) {
        if (node.parameters && node.parameters.length > 0) {
            const fileName = this.getSourceFile().fileName;
            for (let param of node.parameters) {
                if (param.modifiers != null && param.modifiers.length > 0) {
                    this.validateParam(param, fileName);
                }
            }
        }
        super.visitConstructorDeclaration(node);
    }

    private validateParam(param: ts.ParameterDeclaration, fileName: string) {
        const highlights = this.languageService.getDocumentHighlights(fileName, param.name.getStart(), [fileName]);

        if ((highlights !== null && highlights[0].highlightSpans.length > 0)) {
            const paramName = param.name.getText();
            highlights[0].highlightSpans.forEach((span: ts.HighlightSpan, idx: number) => {
                // Ignore the 1st reference which is the actual parameter definition
                if (idx !== 0 && !this.spanHasThisUsage(span, fileName)) {
                    const msg = Rule.FAILURE_STRING_FACTORY(paramName);
                    this.addFailure(this.createFailure(span.textSpan.start, span.textSpan.length, msg));
                }
            });
        }
    }

    private spanHasThisUsage(span: ts.HighlightSpan, fileName: string) {
        const endPos = span.textSpan.start + span.textSpan.length;
        const nameSpanInfo = this.languageService.getNameOrDottedNameSpan(fileName, span.textSpan.start, endPos);

        // If the difference between these two is exactly 5 characters it accounts for the missing `this.`!
        return nameSpanInfo.length - span.textSpan.length === 5;
    }
}
