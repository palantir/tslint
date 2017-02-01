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

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "await-promise",
        description: "Warns for an awaited value that is not a Promise.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "functionality",
        typescriptOnly: true,
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "'await' of non-Promise.";

    public applyWithProgram(srcFile: ts.SourceFile, langSvc: ts.LanguageService): Lint.RuleFailure[] {
        return this.applyWithWalker(new Walker(srcFile, this.getOptions(), langSvc.getProgram()));
    }
}

class Walker extends Lint.ProgramAwareRuleWalker {
    public visitNode(node: ts.Node) {
        if (node.kind === ts.SyntaxKind.AwaitExpression &&
            !couldBePromise(this.getTypeChecker().getTypeAtLocation((node as ts.AwaitExpression).expression))) {
            this.addFailureAtNode(node, Rule.FAILURE_STRING);
        }

        super.visitNode(node);
    }
}

function couldBePromise(type: ts.Type): boolean {
    if (Lint.isTypeFlagSet(type, ts.TypeFlags.Any) || isPromiseType(type)) {
        return true;
    }

    if (isUnionType(type)) {
        return type.types.some(isPromiseType);
    }

    const bases = type.getBaseTypes();
    return bases !== undefined && bases.some(couldBePromise);
}

function isPromiseType(type: ts.Type): boolean {
    const { target } = type as ts.TypeReference;
    const symbol = target && target.symbol;
    return !!symbol && symbol.name === "Promise";
}

function isUnionType(type: ts.Type): type is ts.UnionType {
    return Lint.isTypeFlagSet(type, ts.TypeFlags.Union);
}
