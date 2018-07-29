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

import * as semver from "semver";
import * as utils from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

const OPTION_CHECK_PARAMETERS = "check-parameters";
const OPTION_IGNORE_PATTERN = "ignore-pattern";

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-unused-variable",
        description: Lint.Utils.dedent`
            Disallows unused imports, variables, functions and
            private class members. Similar to tsc's --noUnusedParameters and --noUnusedLocals
            options, but does not interrupt code compilation.`,
        descriptionDetails: Lint.Utils.dedent`
            In addition to avoiding compilation errors, this rule may still be useful if you
            wish to have \`tslint\` automatically remove unused imports, variables, functions,
            and private class members, when using TSLint's \`--fix\` option.`,
        hasFix: true,
        optionsDescription: Lint.Utils.dedent`
            Three optional arguments may be optionally provided:

            * \`"check-parameters"\` disallows unused function and constructor parameters.
                * NOTE: this option is experimental and does not work with classes
                that use abstract method declarations, among other things.
            * \`{"ignore-pattern": "pattern"}\` where pattern is a case-sensitive regexp.
            Variable names and imports that match the pattern will be ignored.`,
        options: {
            type: "array",
            items: {
                oneOf: [
                    {
                        type: "string",
                        enum: ["check-parameters"]
                    },
                    {
                        type: "object",
                        properties: {
                            "ignore-pattern": { type: "string" }
                        },
                        additionalProperties: false
                    }
                ]
            },
            minLength: 0,
            maxLength: 3
        },
        optionExamples: [true, [true, { "ignore-pattern": "^_" }]],
        rationale: Lint.Utils.dedent`
            Variables that are declared and not used anywhere in code are likely an error due to incomplete refactoring.
            Such variables take up space in the code, are mild performance pains, and can lead to confusion by readers.
        `,
        type: "functionality",
        typescriptOnly: true,
        requiresTypeInfo: true,
        deprecationMessage: semver.gte(ts.version, "2.9.0-dev.0")
            ? "Since TypeScript 2.9. Please use the built-in compiler checks instead."
            : undefined
    };
    /* tslint:enable:object-literal-sort-keys */

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, parseOptions(this.ruleArguments), program);
    }
}

interface Options {
    checkParameters: boolean;
    ignorePattern: RegExp | undefined;
}
function parseOptions(options: any[]): Options {
    const checkParameters = options.indexOf(OPTION_CHECK_PARAMETERS) !== -1;

    let ignorePattern: RegExp | undefined;
    for (const o of options) {
        if (typeof o === "object") {
            // tslint:disable-next-line no-unsafe-any
            const ignore = o[OPTION_IGNORE_PATTERN] as string | null | undefined;
            if (ignore != undefined) {
                ignorePattern = new RegExp(ignore);
                break;
            }
        }
    }

    return { checkParameters, ignorePattern };
}

function walk(ctx: Lint.WalkContext<Options>, program: ts.Program): void {
    const {
        sourceFile,
        options: { checkParameters, ignorePattern }
    } = ctx;
    const unusedCheckedProgram = getUnusedCheckedProgram(program, checkParameters);
    const diagnostics = ts.getPreEmitDiagnostics(unusedCheckedProgram, sourceFile);
    const checker = unusedCheckedProgram.getTypeChecker(); // Doesn't matter which program is used for this.
    const declaration = program.getCompilerOptions().declaration;

    // If all specifiers in an import are unused, we elide the entire import.
    const importSpecifierFailures = new Map<ts.Identifier, string>();

    for (const diag of diagnostics) {
        if (diag.start === undefined) {
            continue;
        }
        const kind = getUnusedDiagnostic(diag);
        if (kind === undefined) {
            continue;
        }

        const failure = ts.flattenDiagnosticMessageText(diag.messageText, "\n");

        // BUG: this means imports / destructures with all (2+) unused variables don't respect ignore pattern
        if (
            ignorePattern !== undefined &&
            kind !== UnusedKind.DECLARATION &&
            kind !== UnusedKind.ALL_DESTRUCTURES
        ) {
            const varName = /'(.*)'/.exec(failure)![1];
            if (ignorePattern.test(varName)) {
                continue;
            }
        }

        if (kind === UnusedKind.VARIABLE_OR_PARAMETER || kind === UnusedKind.DECLARATION) {
            const importNames = findImports(diag.start, sourceFile, kind);
            if (importNames.length > 0) {
                for (const importName of importNames) {
                    if (declaration && isImportUsed(importName, sourceFile, checker)) {
                        continue;
                    }

                    if (importSpecifierFailures.has(importName)) {
                        throw new Error("Should not get 2 errors for the same import.");
                    }
                    importSpecifierFailures.set(importName, failure);
                }
                continue;
            }
        }

        ctx.addFailureAt(diag.start, diag.length!, failure);
    }

    if (importSpecifierFailures.size !== 0) {
        addImportSpecifierFailures(ctx, importSpecifierFailures, sourceFile);
    }
}

/**
 * Handle import-specifier failures separately.
 * - If all of the import specifiers in an import are unused, add a combined failure for them all.
 * - Unused imports are fixable.
 */
function addImportSpecifierFailures(
    ctx: Lint.WalkContext<Options>,
    failures: Map<ts.Identifier, string>,
    sourceFile: ts.SourceFile
) {
    forEachImport(sourceFile, importNode => {
        if (importNode.kind === ts.SyntaxKind.ImportEqualsDeclaration) {
            tryRemoveAll(importNode.name);
            return;
        }

        if (importNode.importClause === undefined) {
            // Error node
            return;
        }

        const { name: defaultName, namedBindings } = importNode.importClause;
        if (namedBindings !== undefined && namedBindings.kind === ts.SyntaxKind.NamespaceImport) {
            tryRemoveAll(namedBindings.name);
            return;
        }

        const allNamedBindingsAreFailures =
            namedBindings === undefined || namedBindings.elements.every(e => failures.has(e.name));
        if (namedBindings !== undefined && allNamedBindingsAreFailures) {
            for (const e of namedBindings.elements) {
                failures.delete(e.name);
            }
        }

        if (
            (defaultName === undefined || failures.has(defaultName)) &&
            allNamedBindingsAreFailures
        ) {
            if (defaultName !== undefined) {
                failures.delete(defaultName);
            }
            removeAll(importNode, "All imports on this line are unused.");
            return;
        }

        if (defaultName !== undefined) {
            const failure = tryDelete(defaultName);
            if (failure !== undefined) {
                const start = defaultName.getStart();
                const end =
                    namedBindings !== undefined
                        ? namedBindings.getStart()
                        : importNode.moduleSpecifier.getStart();
                const fix = Lint.Replacement.deleteFromTo(start, end);
                ctx.addFailureAtNode(defaultName, failure, fix);
            }
        }

        if (namedBindings !== undefined) {
            if (allNamedBindingsAreFailures) {
                const start =
                    defaultName !== undefined ? defaultName.getEnd() : namedBindings.getStart();
                const fix = Lint.Replacement.deleteFromTo(start, namedBindings.getEnd());
                const failure = "All named bindings are unused.";
                ctx.addFailureAtNode(namedBindings, failure, fix);
            } else {
                const { elements } = namedBindings;
                for (let i = 0; i < elements.length; i++) {
                    const element = elements[i];
                    const failure = tryDelete(element.name);
                    if (failure === undefined) {
                        continue;
                    }

                    const prevElement = elements[i - 1];
                    const nextElement = elements[i + 1];
                    const start =
                        prevElement !== undefined ? prevElement.getEnd() : element.getStart();
                    const end =
                        nextElement !== undefined && prevElement == undefined
                            ? nextElement.getStart()
                            : element.getEnd();
                    const fix = Lint.Replacement.deleteFromTo(start, end);
                    ctx.addFailureAtNode(element.name, failure, fix);
                }
            }
        }

        function tryRemoveAll(name: ts.Identifier): void {
            const failure = tryDelete(name);
            if (failure !== undefined) {
                removeAll(name, failure);
            }
        }

        function removeAll(errorNode: ts.Node, failure: string): void {
            const start = importNode.getStart();
            let end = importNode.getEnd();
            utils.forEachToken(
                importNode,
                token => {
                    ts.forEachTrailingCommentRange(
                        ctx.sourceFile.text,
                        token.end,
                        (_, commentEnd, __) => {
                            end = commentEnd;
                        }
                    );
                },
                ctx.sourceFile
            );
            if (isEntireLine(start, end)) {
                end = getNextLineStart(end);
            }

            const fix = Lint.Replacement.deleteFromTo(start, end);
            ctx.addFailureAtNode(errorNode, failure, fix);
        }

        function isEntireLine(start: number, end: number): boolean {
            return (
                ctx.sourceFile.getLineAndCharacterOfPosition(start).character === 0 &&
                ctx.sourceFile.getLineEndOfPosition(end) === end
            );
        }

        function getNextLineStart(position: number): number {
            const nextLine = ctx.sourceFile.getLineAndCharacterOfPosition(position).line + 1;
            const lineStarts = ctx.sourceFile.getLineStarts();
            if (nextLine < lineStarts.length) {
                return lineStarts[nextLine];
            } else {
                return position;
            }
        }
    });

    if (failures.size !== 0) {
        throw new Error("Should have revisited all import specifier failures.");
    }

    function tryDelete(name: ts.Identifier): string | undefined {
        const failure = failures.get(name);
        if (failure !== undefined) {
            failures.delete(name);
            return failure;
        }
        return undefined;
    }
}

/**
 * Ignore this import if it's used as an implicit type somewhere.
 * Workround for https://github.com/Microsoft/TypeScript/issues/9944
 */
function isImportUsed(
    importSpecifier: ts.Identifier,
    sourceFile: ts.SourceFile,
    checker: ts.TypeChecker
): boolean {
    const importedSymbol = checker.getSymbolAtLocation(importSpecifier);
    if (importedSymbol === undefined) {
        return false;
    }

    const symbol = checker.getAliasedSymbol(importedSymbol);
    if (!utils.isSymbolFlagSet(symbol, ts.SymbolFlags.Type)) {
        return false;
    }

    return (
        ts.forEachChild(sourceFile, function cb(child): boolean | undefined {
            if (isImportLike(child)) {
                return false;
            }

            const type = getImplicitType(child, checker);
            // TODO: checker.typeEquals https://github.com/Microsoft/TypeScript/issues/13502
            if (
                type !== undefined &&
                checker.typeToString(type) === checker.symbolToString(symbol)
            ) {
                return true;
            }

            return ts.forEachChild(child, cb);
        }) === true
    );
}

function getImplicitType(node: ts.Node, checker: ts.TypeChecker): ts.Type | undefined {
    if (
        ((utils.isPropertyDeclaration(node) || utils.isVariableDeclaration(node)) &&
            node.type === undefined &&
            node.name.kind === ts.SyntaxKind.Identifier) ||
        (utils.isBindingElement(node) && node.name.kind === ts.SyntaxKind.Identifier)
    ) {
        return checker.getTypeAtLocation(node);
    } else if (utils.isSignatureDeclaration(node) && node.type === undefined) {
        const sig = checker.getSignatureFromDeclaration(node);
        return sig === undefined ? undefined : sig.getReturnType();
    } else {
        return undefined;
    }
}

type ImportLike = ts.ImportDeclaration | ts.ImportEqualsDeclaration;
function isImportLike(node: ts.Node): node is ImportLike {
    return (
        node.kind === ts.SyntaxKind.ImportDeclaration ||
        node.kind === ts.SyntaxKind.ImportEqualsDeclaration
    );
}

function forEachImport<T>(
    sourceFile: ts.SourceFile,
    f: (i: ImportLike) => T | undefined
): T | undefined {
    return ts.forEachChild(sourceFile, child => {
        if (isImportLike(child)) {
            const res = f(child);
            if (res !== undefined) {
                return res;
            }
        }
        return undefined;
    });
}

function findImports(
    pos: number,
    sourceFile: ts.SourceFile,
    kind: UnusedKind
): ReadonlyArray<ts.Identifier> {
    const imports = forEachImport(sourceFile, i => {
        if (!isInRange(i, pos)) {
            return undefined;
        }

        if (i.kind === ts.SyntaxKind.ImportEqualsDeclaration) {
            return [i.name];
        } else {
            if (i.importClause === undefined) {
                // Error node
                return undefined;
            }

            const { name: defaultName, namedBindings } = i.importClause;
            if (
                namedBindings !== undefined &&
                namedBindings.kind === ts.SyntaxKind.NamespaceImport
            ) {
                return [namedBindings.name];
            }

            // Starting from TS2.8, when all imports in an import node are not used,
            // TS emits only 1 diagnostic object for the whole line as opposed
            // to the previous behavior of outputting a diagnostic with kind == 6192
            // (UnusedKind.VARIABLE_OR_PARAMETER) for every unused import.
            // From TS2.8, in the case of none of the imports in a line being used,
            // the single diagnostic TS outputs are different between the 1 import
            // and 2+ imports cases:
            // - 1 import in node:
            //   - diagnostic has kind == 6133 (UnusedKind.VARIABLE_OR_PARAMETER)
            //   - the text range is the whole node (`import { ... } from "..."`)
            //     whereas pre-TS2.8, the text range was for the import node. so
            //     `name.getStart()` won't equal `pos` like in pre-TS2.8
            // - 2+ imports in node:
            //   - diagnostic has kind == 6192 (UnusedKind.DECLARATION)
            //   - we know that all of these are unused
            if (kind === UnusedKind.DECLARATION) {
                const imp: ts.Identifier[] = [];
                if (defaultName !== undefined) {
                    imp.push(defaultName);
                }
                if (namedBindings !== undefined) {
                    imp.push(...namedBindings.elements.map(el => el.name));
                }
                return imp.length > 0 ? imp : undefined;
            } else if (
                defaultName !== undefined &&
                (isInRange(defaultName, pos) || namedBindings === undefined) // defaultName is the only option
            ) {
                return [defaultName];
            } else if (namedBindings !== undefined) {
                if (namedBindings.elements.length === 1) {
                    return [namedBindings.elements[0].name];
                }

                for (const element of namedBindings.elements) {
                    if (isInRange(element, pos)) {
                        return [element.name];
                    }
                }
            }
        }
        return undefined;
    });
    return imports !== undefined ? imports : [];
}

function isInRange(range: ts.TextRange, pos: number): boolean {
    return range.pos <= pos && range.end >= pos;
}

const enum UnusedKind {
    VARIABLE_OR_PARAMETER,
    PROPERTY,
    DECLARATION, // Introduced in TS 2.8
    ALL_DESTRUCTURES // introduced in TS 2.9
}
function getUnusedDiagnostic(diag: ts.Diagnostic): UnusedKind | undefined {
    // https://github.com/Microsoft/TypeScript/blob/master/src/compiler/diagnosticMessages.json
    switch (diag.code) {
        case 6133: // Pre TS 2.9 "'{0}' is declared but never used.
        // TS 2.9+ "'{0}' is declared but its value is never read."
        case 6196: // TS 2.9+ "'{0}' is declared but never used."
            return UnusedKind.VARIABLE_OR_PARAMETER;
        case 6138:
            return UnusedKind.PROPERTY; // "Property '{0}' is declared but never used."
        case 6192:
            return UnusedKind.DECLARATION; // "All imports in import declaration are unused."
        case 6198:
            return UnusedKind.ALL_DESTRUCTURES; // "All destructured elements are unused."
        default:
            return undefined;
    }
}

const programToUnusedCheckedProgram = new WeakMap<ts.Program, ts.Program>();

function getUnusedCheckedProgram(program: ts.Program, checkParameters: boolean): ts.Program {
    // Assuming checkParameters will always have the same value, so only lookup by program.
    let checkedProgram = programToUnusedCheckedProgram.get(program);
    if (checkedProgram !== undefined) {
        return checkedProgram;
    }

    checkedProgram = makeUnusedCheckedProgram(program, checkParameters);
    programToUnusedCheckedProgram.set(program, checkedProgram);
    return checkedProgram;
}

function makeUnusedCheckedProgram(program: ts.Program, checkParameters: boolean): ts.Program {
    const originalOptions = program.getCompilerOptions();
    const options = {
        ...originalOptions,
        noEmit: true,
        noUnusedLocals: true,
        noUnusedParameters: originalOptions.noUnusedParameters || checkParameters
    };
    const sourceFilesByName = new Map<string, ts.SourceFile>(
        program
            .getSourceFiles()
            .map<[string, ts.SourceFile]>(s => [getCanonicalFileName(s.fileName), s])
    );

    // tslint:disable object-literal-sort-keys
    return ts.createProgram(Array.from(sourceFilesByName.keys()), options, {
        fileExists: f => sourceFilesByName.has(getCanonicalFileName(f)),
        readFile: f => sourceFilesByName.get(getCanonicalFileName(f))!.text,
        getSourceFile: f => sourceFilesByName.get(getCanonicalFileName(f))!,
        getDefaultLibFileName: () => ts.getDefaultLibFileName(options),
        writeFile: () => undefined,
        getCurrentDirectory: () => "",
        getDirectories: () => [],
        getCanonicalFileName,
        useCaseSensitiveFileNames: () => ts.sys.useCaseSensitiveFileNames,
        getNewLine: () => "\n"
    });
    // tslint:enable object-literal-sort-keys

    // We need to be careful with file system case sensitivity
    function getCanonicalFileName(fileName: string): string {
        return ts.sys.useCaseSensitiveFileNames ? fileName : fileName.toLowerCase();
    }
}
