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

import { isAssertionExpression, isObjectFlagSet, isObjectType, isTypeFlagSet } from "tsutils";
import * as ts from "typescript";
import * as Lint from "../index";

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-unnecessary-type-assertion",
        description: "Warns if a type assertion does not change the type of an expression.",
        options: {
            type: "list",
            listType: {
                type: "array",
                items: {type: "string"},
            },
        },
        optionsDescription: "A list of whitelisted assertion types to ignore",
        type: "typescript",
        hasFix: true,
        typescriptOnly: true,
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "This assertion is unnecessary since it does not change the type of the expression.";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithWalker(new Walker(sourceFile, this.ruleName, this.ruleArguments, program));
    }
}

class Walker extends Lint.AbstractWalker<string[]> {
    private readonly checker: ts.TypeChecker;
    constructor(sourceFile: ts.SourceFile, ruleName: string, options: string[], private readonly program: ts.Program) {
        super(sourceFile, ruleName, options);
        this.checker = program.getTypeChecker();
    }

    public walk(sourceFile: ts.SourceFile) {
        const cb = (node: ts.Node): void => {
            switch (node.kind) {
                case ts.SyntaxKind.TypeAssertionExpression:
                case ts.SyntaxKind.NonNullExpression:
                case ts.SyntaxKind.AsExpression:
                    this.verifyCast(node as ts.TypeAssertion | ts.NonNullExpression | ts.AsExpression);
            }

            return ts.forEachChild(node, cb);
        };

        return ts.forEachChild(sourceFile, cb);
    }

    private verifyCast(node: ts.TypeAssertion | ts.NonNullExpression | ts.AsExpression) {
        if (isAssertionExpression(node) && this.options.indexOf(node.type.getText(this.sourceFile)) !== -1) {
            return;
        }
        const castType = this.checker.getTypeAtLocation(node);
        if (castType === undefined) {
            return;
        }

        if (node.kind !== ts.SyntaxKind.NonNullExpression &&
            (isTypeFlagSet(castType, ts.TypeFlags.Literal) ||
                isObjectType(castType) &&
                isObjectFlagSet(castType, ts.ObjectFlags.Tuple)) ||
            // Sometimes tuple types don't have ObjectFlags.Tuple set, like when
            // they're being matched against an inferred type. So, in addition,
            // check if any properties are numbers, which implies that this is
            // likely a tuple type.
            (castType.getProperties().some((symbol) => !isNaN(Number(symbol.name))))) {

            // It's not always safe to remove a cast to a literal type or tuple
            // type, as those types are sometimes widened without the cast.
            return;
        }

        const uncastType = this.checker.getTypeAtLocation(node.expression);
        if (uncastType === castType) {
            // In some cases, this is still not enough; the type in the
            // assertion can actually impact the type in the expression being
            // asserted. To avoid these false positives, we create a new
            // ts.Program with the edited file, to see if the assertion is still
            // unnecessary.
            // This can be a bit slow, so we still want to guard it by the more
            // basic check above.
            const replacement = node.kind === ts.SyntaxKind.TypeAssertionExpression
                ? Lint.Replacement.deleteFromTo(node.getStart(), node.expression.getStart())
                : Lint.Replacement.deleteFromTo(node.expression.getEnd(), node.getEnd());
            const sourceFile = this.sourceFile;
            const modifiedHost = ts.createCompilerHost(this.program.getCompilerOptions());
            const modifiedSourceFile =
                ts.createSourceFile(
                    sourceFile.fileName,
                    replacement.apply(sourceFile.text),
                    sourceFile.languageVersion);
            const oldGetSourceFile = modifiedHost.getSourceFile;
            modifiedHost.getSourceFile = function(fileName: string, ...args: any[]) {
                if (fileName === sourceFile.fileName) {
                    return modifiedSourceFile;
                }
                // tslint:disable-next-line:no-unsafe-any Passing args along to original function.
                return oldGetSourceFile.apply(this, [fileName, ...args]);
            };
            const modifiedChecker =
                    ts.createProgram(
                        this.program.getRootFileNames(),
                        this.program.getCompilerOptions(),
                        modifiedHost).getTypeChecker();

            const typeWithoutCast =
                    modifiedChecker.getTypeAtLocation(
                        getCorrespondingNode(node.expression, modifiedSourceFile, replacement)!);
            if (modifiedChecker.typeToString(typeWithoutCast) ===
                    this.checker.typeToString(castType)) {
                this.addFailureAtNode(node, Rule.FAILURE_STRING, replacement);
            }
        }
    }
}

/**
 * Given a node (needle) and a parent node (haystack) from a modified file,
 * find the node that corresponds, taking into account the replacement that was
 * applied. "Corresponds" here means that it has the same start and end.
 */
function getCorrespondingNode(needle: ts.Node, haystack: ts.Node, replacement: Lint.Replacement): ts.Node | null {
    // Update location of needle to account for replacement that's been applied.
    const updatedPos = needle.pos > replacement.start ? needle.pos - replacement.length - 1 : needle.pos;
    const updatedEnd = needle.end > replacement.start ? needle.end - replacement.length : needle.end;
    if (haystack.pos === updatedPos && haystack.end === updatedEnd) {
        return haystack;
    }
    for (const child of haystack.getChildren()) {
        if (child.pos <= updatedPos && child.end >= updatedEnd) {
            return getCorrespondingNode(needle, child, replacement);
        }
    }
    throw new Error("Can't find corresponding node");
}
