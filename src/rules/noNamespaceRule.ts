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
        ruleName: "no-namespace",
        description: "Disallows use of internal \`module\`s and \`namespace\`s.",
        descriptionDetails: "This rule still allows the use of `declare module ... {}`",
        rationale: Lint.Utils.dedent`
            ES6-style external modules are the standard way to modularize code.
            Using \`module {}\` and \`namespace {}\` are outdated ways to organize TypeScript code.`,
        optionsDescription: Lint.Utils.dedent`
            One argument may be optionally provided:

            * \`allow-declarations\` allows \`declare namespace ... {}\` to describe external APIs.`,
        options: {
            type: "array",
            items: {
                type: "string",
                enum: ["allow-declarations"],
            },
            minLength: 0,
            maxLength: 1,
        },
        optionExamples: ["true", '[true, "allow-declarations"]'],
        type: "typescript",
        typescriptOnly: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "'namespace' and 'module' are disallowed";

    public apply(sourceFile: ts.SourceFile): Lint.RuleViolation[] {
        return this.applyWithWalker(new NoNamespaceWalker(sourceFile, this.getOptions()));
    }
}

class NoNamespaceWalker extends Lint.RuleWalker {
    public visitSourceFile(node: ts.SourceFile) {
        // Ignore all .d.ts files by returning and not walking their ASTs.
        // .d.ts declarations do not have the Ambient flag set, but are still declarations.
        if (this.hasOption("allow-declarations") && node.fileName.match(/\.d\.ts$/)) {
            return;
        }
        this.walkChildren(node);
    }

    public visitModuleDeclaration(decl: ts.ModuleDeclaration) {
        super.visitModuleDeclaration(decl);

        // declare module 'foo' {} is an external module, not a namespace.
        if (decl.name.kind === ts.SyntaxKind.StringLiteral) {
            return;
        }
        if (this.hasOption("allow-declarations")
                && Lint.someAncestor(decl, (n) => Lint.isNodeFlagSet(n, ts.NodeFlags.Ambient))) {
            return;
        }
        if (Lint.isNestedModuleDeclaration(decl)) {
            return;
        }

        this.addFailure(this.createFailure(decl.getStart(), decl.getWidth(), Rule.FAILURE_STRING));
    }
}
