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

import {
    hasModifier,
    isBlockScopedVariableDeclarationList,
    isClassExpression,
    isFunctionExpression,
    isFunctionWithBody,
    isNodeFlagSet,
    isScopeBoundary,
    isThisParameter,
    ScopeBoundary,
} from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-shadowed-variable",
        description: "Disallows shadowing variable declarations.",
        rationale: Lint.Utils.dedent`
            When a variable in a local scope and a variable in the containing scope have the same name, shadowing occurs.
            Shadowing makes it impossible to access the variable in the containing scope and
            obscures to what value an identifier actually refers. Compare the following snippets:

            \`\`\`
            const a = 'no shadow';
            function print() {
                console.log(a);
            }
            print(); // logs 'no shadow'.
            \`\`\`

            \`\`\`
            const a = 'no shadow';
            function print() {
                const a = 'shadow'; // TSLint will complain here.
                console.log(a);
            }
            print(); // logs 'shadow'.
            \`\`\`

            ESLint has [an equivalent rule](https://eslint.org/docs/rules/no-shadow).
            For more background information, refer to
            [this MDN closure doc](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures#Lexical_scoping).
        `,
        optionsDescription: Lint.Utils.dedent`
            You can optionally pass an object to disable checking for certain kinds of declarations.
            Possible keys are \`"class"\`, \`"enum"\`, \`"function"\`, \`"import"\`, \`"interface"\`, \`"namespace"\`, \`"typeAlias"\`
            and \`"typeParameter"\`. Just set the value to \`false\` for the check you want to disable.
            All checks default to \`true\`, i.e. are enabled by default.
            Note that you cannot disable variables and parameters.

            The option \`"temporalDeadZone"\` defaults to \`true\` which shows errors when shadowing block scoped declarations in their
            temporal dead zone. When set to \`false\` parameters, classes, enums and variables declared
            with \`let\` or \`const\` are not considered shadowed if the shadowing occurs within their
            [temporal dead zone](http://jsrocks.org/2015/01/temporal-dead-zone-tdz-demystified).

            The following example shows how the \`"temporalDeadZone"\` option changes the linting result:

            \`\`\`ts
            function fn(value) {
                if (value) {
                    const tmp = value; // no error on this line if "temporalDeadZone" is false
                    return tmp;
                }
                let tmp = undefined;
                if (!value) {
                    const tmp = value; // this line always contains an error
                    return tmp;
                }
            }
            \`\`\`
        `,
        options: {
            type: "object",
            properties: {
                class: { type: "boolean" },
                enum: { type: "boolean" },
                function: { type: "boolean" },
                import: { type: "boolean" },
                interface: { type: "boolean" },
                namespace: { type: "boolean" },
                typeAlias: { type: "boolean" },
                typeParameter: { type: "boolean" },
                temporalDeadZone: { type: "boolean" },
            },
        },
        optionExamples: [
            true,
            [
                true,
                {
                    class: true,
                    enum: true,
                    function: true,
                    interface: false,
                    namespace: true,
                    typeAlias: false,
                    typeParameter: false,
                },
            ],
        ],
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_FACTORY(name: string) {
        return `Shadowed name: '${name}'`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(
            new NoShadowedVariableWalker(
                sourceFile,
                this.ruleName,
                parseOptions(this.ruleArguments[0] as Partial<Options> | undefined),
            ),
        );
    }
}

type Kind =
    | "class"
    | "import"
    | "interface"
    | "function"
    | "enum"
    | "namespace"
    | "typeParameter"
    | "typeAlias"
    | "temporalDeadZone";
type Options = Record<Kind, boolean>;

function parseOptions(option: Partial<Options> | undefined): Options {
    return {
        class: true,
        enum: true,
        function: true,
        import: true,
        interface: true,
        namespace: true,
        temporalDeadZone: true,
        typeAlias: true,
        typeParameter: true,
        ...option,
    };
}

interface VariableInfo {
    identifier: ts.Identifier;
    tdz: boolean;
}

class Scope {
    public functionScope: Scope;
    public variables = new Map<string, VariableInfo[]>();
    public variablesSeen = new Map<string, ts.Identifier[]>();
    public reassigned = new Set<string>();
    constructor(functionScope?: Scope) {
        // if no functionScope is provided we are in the process of creating a new function scope, which for consistency links to itself
        this.functionScope = functionScope !== undefined ? functionScope : this;
    }

    public addVariable(identifier: ts.Identifier, blockScoped = true, tdz = false) {
        // block scoped variables go to the block scope, function scoped variables to the containing function scope
        const scope = blockScoped ? this : this.functionScope;
        const list = scope.variables.get(identifier.text);
        const variableInfo: VariableInfo = {
            identifier,
            tdz,
        };
        if (list === undefined) {
            scope.variables.set(identifier.text, [variableInfo]);
        } else {
            list.push(variableInfo);
        }
    }
}

class NoShadowedVariableWalker extends Lint.AbstractWalker<Options> {
    private scope: Scope = new Scope();
    public walk(sourceFile: ts.SourceFile) {
        if (sourceFile.isDeclarationFile) {
            return;
        }
        this.scope = new Scope();

        const cb = (node: ts.Node): void => {
            const parentScope = this.scope;
            if (
                ((this.options.function && isFunctionExpression(node)) ||
                    (this.options.class && isClassExpression(node))) &&
                node.name !== undefined
            ) {
                /* special handling for named function and class expressions:
                   technically the name of the function is only visible inside of it,
                   but variables with the same name declared inside don't cause compiler errors.
                   Therefore we add an additional function scope only for the function name to avoid merging with other declarations */
                const functionScope = new Scope();
                functionScope.addVariable(node.name, false);
                this.scope = new Scope();
                if (isClassExpression(node)) {
                    this.visitClassLikeDeclaration(node, functionScope, cb);
                } else {
                    ts.forEachChild(node, cb);
                }
                this.onScopeEnd(functionScope);
                this.scope = functionScope;
                this.onScopeEnd(parentScope);
                this.scope = parentScope;
                return;
            }

            /* Visit decorators before entering a function scope.
               In the AST decorators are children of the declaration they decorate, but we don't want to warn for the following code:
               @decorator((param) => param)
               function foo(param) {}
            */
            if (node.decorators !== undefined) {
                for (const decorator of node.decorators) {
                    ts.forEachChild(decorator, cb);
                }
            }

            const boundary = isScopeBoundary(node);
            if (boundary === ScopeBoundary.Block) {
                this.scope = new Scope(parentScope.functionScope);
            } else if (boundary === ScopeBoundary.Function) {
                this.scope = new Scope();
            }
            switch (node.kind) {
                case ts.SyntaxKind.Decorator:
                    return; // handled above
                case ts.SyntaxKind.VariableDeclarationList:
                    this.handleVariableDeclarationList(node as ts.VariableDeclarationList);
                    break;
                case ts.SyntaxKind.TypeParameter:
                    if (this.options.typeParameter) {
                        this.scope.addVariable((node as ts.TypeParameterDeclaration).name);
                    }
                    break;
                case ts.SyntaxKind.FunctionDeclaration:
                    if (
                        this.options.function &&
                        (node as ts.FunctionDeclaration).name !== undefined
                    ) {
                        parentScope.addVariable((node as ts.FunctionDeclaration).name!, false);
                    }
                    break;
                case ts.SyntaxKind.ClassDeclaration:
                    if (this.options.class && (node as ts.ClassDeclaration).name !== undefined) {
                        parentScope.addVariable((node as ts.ClassDeclaration).name!, true, true);
                    }
                // falls through
                case ts.SyntaxKind.ClassExpression:
                    this.visitClassLikeDeclaration(
                        node as ts.ClassLikeDeclaration,
                        parentScope,
                        cb,
                    );
                    this.onScopeEnd(parentScope);
                    this.scope = parentScope;
                    return;
                case ts.SyntaxKind.TypeAliasDeclaration:
                    if (this.options.typeAlias) {
                        parentScope.addVariable((node as ts.TypeAliasDeclaration).name);
                    }
                    break;
                case ts.SyntaxKind.EnumDeclaration:
                    if (this.options.enum) {
                        parentScope.addVariable((node as ts.EnumDeclaration).name, true, true);
                    }
                    break;
                case ts.SyntaxKind.InterfaceDeclaration:
                    if (this.options.interface) {
                        parentScope.addVariable((node as ts.InterfaceDeclaration).name);
                    }
                    break;
                case ts.SyntaxKind.Parameter:
                    if (
                        node.parent.kind !== ts.SyntaxKind.IndexSignature &&
                        !isThisParameter(node as ts.ParameterDeclaration) &&
                        isFunctionWithBody(node.parent)
                    ) {
                        this.handleBindingName((node as ts.ParameterDeclaration).name, false, true);
                    }
                    break;
                case ts.SyntaxKind.ModuleDeclaration:
                    if (
                        this.options.namespace &&
                        node.parent.kind !== ts.SyntaxKind.ModuleDeclaration &&
                        (node as ts.ModuleDeclaration).name.kind === ts.SyntaxKind.Identifier &&
                        !isNodeFlagSet(node, ts.NodeFlags.GlobalAugmentation)
                    ) {
                        parentScope.addVariable((node as ts.NamespaceDeclaration).name, false);
                    }
                    if (hasModifier(node.modifiers, ts.SyntaxKind.DeclareKeyword)) {
                        this.onScopeEnd(parentScope);
                        this.scope = parentScope;
                        return; // don't check any ambient declaration blocks
                    }
                    break;
                case ts.SyntaxKind.ImportClause:
                    if (this.options.import && (node as ts.ImportClause).name !== undefined) {
                        this.scope.addVariable((node as ts.ImportClause).name!, false);
                    }
                    break;
                case ts.SyntaxKind.NamespaceImport:
                case ts.SyntaxKind.ImportSpecifier:
                case ts.SyntaxKind.ImportEqualsDeclaration:
                    if (this.options.import) {
                        this.scope.addVariable(
                            (node as
                                | ts.NamespaceImport
                                | ts.ImportSpecifier
                                | ts.ImportEqualsDeclaration).name,
                            false,
                        );
                    }
            }
            if (boundary !== ScopeBoundary.None) {
                ts.forEachChild(node, cb);
                this.onScopeEnd(parentScope);
                this.scope = parentScope;
            } else {
                return ts.forEachChild(node, cb);
            }
        };

        ts.forEachChild(sourceFile, cb);
        this.onScopeEnd();
    }

    private visitClassLikeDeclaration(
        declaration: ts.ClassLikeDeclaration,
        parentScope: Scope,
        cb: (node: ts.Node) => void,
    ) {
        const currentScope = this.scope;
        ts.forEachChild(declaration, node => {
            if (!hasModifier(node.modifiers, ts.SyntaxKind.StaticKeyword)) {
                return cb(node);
            }
            /* Don't treat static members as children of the class' scope. That avoid shadowed type parameter warnings on static members.
               class C<T> {
                   static method<T>() {}
               }
            */
            this.scope = parentScope;
            cb(node);
            this.scope = currentScope;
        });
    }

    private handleVariableDeclarationList(node: ts.VariableDeclarationList) {
        const blockScoped = isBlockScopedVariableDeclarationList(node);
        for (const variable of node.declarations) {
            this.handleBindingName(variable.name, blockScoped);
        }
    }

    private handleBindingName(node: ts.BindingName, blockScoped: boolean, tdz = blockScoped) {
        if (node.kind === ts.SyntaxKind.Identifier) {
            this.scope.addVariable(node, blockScoped, tdz);
        } else {
            for (const element of node.elements) {
                if (element.kind !== ts.SyntaxKind.OmittedExpression) {
                    this.handleBindingName(element.name, blockScoped, tdz);
                }
            }
        }
    }

    private onScopeEnd(parent?: Scope) {
        const { variables, variablesSeen } = this.scope;
        variablesSeen.forEach((identifiers, name) => {
            const declarationsInScope = variables.get(name);
            for (const identifier of identifiers) {
                if (
                    declarationsInScope !== undefined &&
                    (this.options.temporalDeadZone ||
                        // check if any of the declaration either has no temporal dead zone or is declared before the identifier
                        declarationsInScope.some(
                            declaration =>
                                !declaration.tdz || declaration.identifier.pos < identifier.pos,
                        ))
                ) {
                    this.addFailureAtNode(identifier, Rule.FAILURE_STRING_FACTORY(name));
                } else if (parent !== undefined) {
                    addOneToList(parent.variablesSeen, name, identifier);
                }
            }
        });
        if (parent !== undefined) {
            variables.forEach((identifiers, name) => {
                addToList(parent.variablesSeen, name, identifiers);
            });
        }
    }
}

function addToList(map: Map<string, ts.Identifier[]>, name: string, variables: VariableInfo[]) {
    let list = map.get(name);
    if (list === undefined) {
        list = [];
        map.set(name, list);
    }
    for (const variable of variables) {
        list.push(variable.identifier);
    }
}

function addOneToList(map: Map<string, ts.Identifier[]>, name: string, identifier: ts.Identifier) {
    const list = map.get(name);
    if (list === undefined) {
        map.set(name, [identifier]);
    } else {
        list.push(identifier);
    }
}
