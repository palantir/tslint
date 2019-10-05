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

import { isTypeReferenceNode } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

interface Option {
    pattern: RegExp;
    message?: string;
}

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
        optionExamples: [[true, ["Object", "Use {} instead."], ["String"]]],
        type: "typescript",
        typescriptOnly: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_FACTORY(typeName: string, messageAddition?: string) {
        return `Don't use '${typeName}' as a type.${
            messageAddition !== undefined ? ` ${messageAddition}` : ""
        }`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, this.ruleArguments.map(parseOption));
    }
}

function parseOption([pattern, message]: [string, string | undefined]): Option {
    return { message, pattern: new RegExp(`^${pattern}$`) };
}

function walk(ctx: Lint.WalkContext<Option[]>) {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (isTypeReferenceNode(node)) {
            const typeName = node.getText(ctx.sourceFile);
            for (const ban of ctx.options) {
                if (ban.pattern.test(typeName)) {
                    ctx.addFailureAtNode(node, Rule.FAILURE_STRING_FACTORY(typeName, ban.message));
                    break;
                }
            }
        }
        return ts.forEachChild(node, cb);
    });
}
