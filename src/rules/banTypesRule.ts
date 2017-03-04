/**
 * @license
 * Copyright 2017 Palantir Technologies, Inc.
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
        ruleName: "ban-types",
        description: Lint.Utils.dedent`
            Bans specific types from being used. Does not ban the
            corresponding runtime objects from being used.`,
        options: {
            type: "list",
            listType: {
                type: "array",
                items: { type: "string" },
                minLength: 1,
                maxLength: 2,
            },
        },
        optionsDescription: Lint.Utils.dedent`
            A list of \`["regex", "optional explanation here"]\`, which bans
            types that match \`regex\``,
        optionExamples: [`[true, ["Object", "Use {} instead."], ["String"]]`],
        type: "typescript",
        typescriptOnly: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_FACTORY(typeName: string, messageAddition?: string) {
        return `Don't use '${typeName}' as a type.` +
            (messageAddition ? " " + messageAddition : "");
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(
            new BanTypeWalker(sourceFile, this.getOptions()));
    }
}

class BanTypeWalker extends Lint.RuleWalker {
    private bans: string[][];
    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
        this.bans = options.ruleArguments!;
    }

    public visitTypeReference(node: ts.TypeReferenceNode) {
        const typeName = node.typeName.getText();
        const ban =
            this.bans.find(([bannedType]) =>
                typeName.match(`^${bannedType}$`) != null) as string[];
        if (ban) {
            this.addFailure(this.createFailure(
                node.getStart(), node.getWidth(),
                Rule.FAILURE_STRING_FACTORY(typeName, ban[1])));
        }
        super.visitTypeReference(node);
    }
}
