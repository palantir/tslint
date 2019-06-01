/**
 * @license
 * Copyright 2018 Palantir Technologies, Inc.
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

import {isNodeFlagSet, isTypeFlagSet} from 'tsutils';
import * as ts from "typescript";
import * as Lint from "../index";


const OPTION_IGNORE_ARROW_FUNCTION_SHORTHAND = "ignore-arrow-function-shorthand";

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-void-expression",
        description: "Requires expressions of type `void` to appear in statement position.",
        hasFix: true,
        optionsDescription: Lint.Utils.dedent`
            If \`${OPTION_IGNORE_ARROW_FUNCTION_SHORTHAND}\` is provided, \`() => returnsVoid()\` will be allowed.
            Otherwise, it must be written as \`() => { returnsVoid(); }\`.`,
        options: {
            type: "array",
            items: {
                type: "string",
                enum: [OPTION_IGNORE_ARROW_FUNCTION_SHORTHAND],
            },
            minLength: 0,
            maxLength: 1,
        },
        rationale: Lint.Utils.dedent`
            It's misleading returning the results of an expression whose type is \`void\`.
            Attempting to do so is likely a symptom of expecting a different return type from a function.
            For example, the following code will log \`undefined\` but looks like it logs a value:

            \`\`\`
            const performWork = (): void => {
                workFirst();
                workSecond();
            };

            console.log(performWork());
            \`\`\`
        `,
        requiresTypeInfo: true,
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING =
        "Expression has type `void`. Put it on its own line as a statement.";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        const ignoreArrowFunctionShorthand =
            this.ruleArguments.indexOf(OPTION_IGNORE_ARROW_FUNCTION_SHORTHAND) !== -1;
        return this.applyWithFunction(
            sourceFile,
            walk,
            { ignoreArrowFunctionShorthand },
            program.getTypeChecker(),
        );
    }
}

interface Options {
    ignoreArrowFunctionShorthand: boolean;
}

function walk(ctx: Lint.WalkContext<Options>, checker: ts.TypeChecker): void {
    const {
        sourceFile,
        options: { ignoreArrowFunctionShorthand },
    } = ctx;
    return ts.forEachChild(sourceFile, function cb(node: ts.Node): void {
        if (
            isPossiblyVoidExpression(node) &&
            !isParentAllowedVoid(node) &&
            isVoidExpression(node, checker)
        ) {
            ctx.addFailureAtNode(node, Rule.FAILURE_STRING, fix(node));
        }
        return ts.forEachChild(node, cb);
    });

    function isParentAllowedVoid(node: ts.Node): boolean {
        switch (node.parent.kind) {
            case ts.SyntaxKind.ExpressionStatement:
                return true;
            case ts.SyntaxKind.ArrowFunction:
                return ignoreArrowFunctionShorthand;

            // Something like "x && console.log(x)".
            case ts.SyntaxKind.BinaryExpression:
                return isParentAllowedVoid(node.parent);

            // Something like "!!cond ? console.log(true) : console.log(false)"
            case ts.SyntaxKind.ConditionalExpression:
                return true;
            default:
                return false;
        }
    }
}

function isPossiblyVoidExpression(node: ts.Node): boolean {
    switch (node.kind) {
        case ts.SyntaxKind.AwaitExpression:
        case ts.SyntaxKind.CallExpression:
        case ts.SyntaxKind.TaggedTemplateExpression:
            return true;
        default:
            return ts.isArrowFunction(node.parent) &&
                isNodeFlagSet(node.parent, ts.NodeFlags.HasImplicitReturn);
    }
}

function fix(node: ts.Node): Lint.Fix | undefined {
    let text: string;
    switch (node.parent.kind) {
        case ts.SyntaxKind.ReturnStatement:
            text = `${node.getText()}; return;`;
            node = node.parent;
            break;
        case ts.SyntaxKind.ArrowFunction:
            text = `{ ${node.getText()}; }`;
            break;
        default:
            return undefined;
    }
    return new Lint.Replacement(node.getStart(), node.getWidth(), text);
}

function isVoidExpression(node: ts.Node, checker: ts.TypeChecker) {
    if (isTypeFlagSet(checker.getTypeAtLocation(node), ts.TypeFlags.Void)) return true;

    // Detect an arrow function that is up-casted to return void by looking at
    // the parameter declarations of the function or constructor.
    // Arrow functions that already have a body wrapped in a block are ignored.
    if (ts.isArrowFunction(node.parent) &&
        node.parent.body === node &&
        !ts.isBlock(node) &&
        ts.isCallOrNewExpression(node.parent.parent)
    ) {
        if (!node.parent.parent.arguments) return false;
        const idx = node.parent.parent.arguments.findIndex(n => n === node.parent);
        if (idx === -1) return false;
        const signature = checker.getResolvedSignature(node.parent.parent)
        if (!signature) return false;
        const params = signature.getParameters();
        if (!params.length) return false;
        const param = params[idx] || params[params.length - 1];
        if (!ts.isParameter(param.valueDeclaration) || !param.valueDeclaration.type) return false;
        let returnType: ts.TypeNode|undefined;
        // Param is variadic
        if (param.valueDeclaration.dotDotDotToken &&
            ts.isTypeReferenceNode(param.valueDeclaration.type) &&
            param.valueDeclaration.type.typeName.getText() === "Array" &&
            param.valueDeclaration.type.typeArguments &&
            param.valueDeclaration.type.typeArguments[0] &&
            ts.isFunctionTypeNode(param.valueDeclaration.type.typeArguments[0])
        ) {
            returnType = (param.valueDeclaration.type.typeArguments[0] as ts.FunctionTypeNode).type
        } else if (ts.isFunctionTypeNode(param.valueDeclaration.type)) {
            returnType = param.valueDeclaration.type.type
        }
        if(!returnType) return false;
        return isTypeFlagSet(checker.getTypeFromTypeNode(returnType), ts.TypeFlags.Void);
    }
    return false;
}
