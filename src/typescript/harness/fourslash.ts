//
// Copyright (c) Microsoft Corporation.  All rights reserved.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

/// <reference path='..\compiler\typescript.ts' />
/// <reference path='harness.ts' />

module FourSlash {

    import assert = Harness.Assert;

    // Represents a parsed source file with metadata
    export interface FourSlashFile {
        // The contents of the file (with markers, etc stripped out)
        content: string;

        fileName: string;

        // File-specific options (name/value pairs)
        fileOptions: { [index: string]: string; };
    }

    // Represents a set of parsed source files and options
    export interface FourSlashData {
        // Global options (name/value pairs)
        globalOptions: { [index: string]: string; };

        files: FourSlashFile[];

        // A mapping from marker names to name/position pairs
        markerPositions: { [index: string]: Marker; };

        markers: Marker[];

        ranges: Range[];
    }

    interface MemberListData {
        result: {
            maybeInaccurate: boolean;
            isMemberCompletion: boolean;
            entries: {
                name: string;
                type: string;
                kind: string;
                kindModifiers: string;
            }[];
        };
    }

    export interface Marker {
        fileName: string;
        position: number;
        data?: any;
    }

    interface MarkerMap {
        [index: string]: Marker;
    }

    export interface Range {
        fileName: string;
        start: number;
        end: number;
        marker?: Marker;
    }

    interface ILocationInformation {
        position: number;
        sourcePosition: number;
        sourceLine: number;
        sourceColumn: number;
    }

    interface IRangeLocationInformation  extends ILocationInformation {
        marker?: Marker;
    }

    export interface TextSpan {
        start: number;
        end: number;
    }

    // List of allowed metadata names
    var fileMetadataNames = ['Filename'];
    var globalMetadataNames = ['Module', 'Target', 'BaselineFile']; // Note: Only BaselineFile is actually supported at the moment

    export var currentTestState: TestState = null;

    export class TestState {
        // Language service instance
        public languageServiceShimHost: Harness.TypeScriptLS = null;
        private languageService: Services.ILanguageService = null;

        // A reference to the language service's compiler state's compiler instance
        private compiler: { getSyntaxTree(fileName: string): TypeScript.SyntaxTree; getScript(fileName: string): TypeScript.Script; };

        // The current caret position in the active file
        public currentCaretPosition = 0;
        public lastKnownMarker: string = "";

        // The file that's currently 'opened'
        public activeFile: FourSlashFile = null;

        // Whether or not we should format on keystrokes
        public enableFormatting = true;

        public formatCodeOptions: Services.FormatCodeOptions = null;

        constructor(public testData: FourSlashData) {
            // Initialize the language service with all the scripts
            this.languageServiceShimHost = new Harness.TypeScriptLS();

            for (var i = 0; i < testData.files.length; i++) {
                this.languageServiceShimHost.addScript(testData.files[i].fileName, testData.files[i].content);
            }

            this.languageServiceShimHost.addScript('lib.d.ts', Harness.Compiler.libTextMinimal);

            // Sneak into the language service and get its compiler so we can examine the syntax trees
            this.languageService = this.languageServiceShimHost.getLanguageService().languageService;
            var compilerState = (<any>this.languageService).compilerState;
            this.compiler = (<any>compilerState).compiler;

            this.formatCodeOptions = new Services.FormatCodeOptions();

            // Open the first file by default
            this.openFile(0);
        }

        // Entry points from fourslash.ts
        public goToMarker(name = '') {
            var marker = this.getMarkerByName(name);
            if (this.activeFile.fileName !== marker.fileName) {
                this.openFile(marker.fileName);
            }

            var scriptSnapshot = this.languageServiceShimHost.getScriptSnapshot(marker.fileName);
            if (marker.position === -1 || marker.position > scriptSnapshot.getLength()) {
                throw new Error('Marker "' + name + '" has been invalidated by unrecoverable edits to the file.');
            }
            this.lastKnownMarker = name;
            this.currentCaretPosition = marker.position;
        }

        public goToPosition(pos: number) {
            this.currentCaretPosition = pos;
        }

        public moveCaretRight(count = 1) {
            this.currentCaretPosition += count;
            this.currentCaretPosition = Math.min(this.currentCaretPosition, this.languageServiceShimHost.getScriptSnapshot(this.activeFile.fileName).getLength());
        }

        // Opens a file given its 0-based index or fileName
        public openFile(index: number);
        public openFile(name: string);
        public openFile(indexOrName: any) {
            var fileToOpen: FourSlashFile = this.findFile(indexOrName);
            this.activeFile = fileToOpen;
        }

        public verifyErrorExistsBetweenMarkers(startMarkerName: string, endMarkerName: string, negative: boolean) {
            var startMarker = this.getMarkerByName(startMarkerName);
            var endMarker = this.getMarkerByName(endMarkerName);
            var predicate = function (errorMinChar: number, errorLimChar: number, startPos: number, endPos: number) {
                return ((errorMinChar === startPos) && (errorLimChar === endPos)) ? true : false;
            };

            var exists = this.anyErrorInRange(predicate, startMarker, endMarker);

            if (exists !== negative) {
                this.printErrorLog(negative, this.getAllDiagnostics());
                throw new Error("Failure between markers: " + startMarkerName + ", " + endMarkerName);
            }
        }

        private getDiagnostics(fileName: string): TypeScript.IDiagnostic[] {
            var syntacticErrors = this.languageService.getSyntacticDiagnostics(fileName);
            var semanticErrors = this.languageService.getSemanticDiagnostics(fileName);

            var diagnostics: TypeScript.IDiagnostic[] = [];
            diagnostics.push.apply(diagnostics, syntacticErrors);
            diagnostics.push.apply(diagnostics, semanticErrors);

            return diagnostics;
        }

        private getAllDiagnostics(): TypeScript.IDiagnostic[] {
            var diagnostics: TypeScript.IDiagnostic[] = [];

            var fileNames = JSON2.parse(this.languageServiceShimHost.getScriptFileNames());
            for (var i = 0, n = fileNames.length; i < n; i++) {
                diagnostics.push.apply(this.getDiagnostics(fileNames[i]));
            }

            return diagnostics;
        }

        public verifyErrorExistsAfterMarker(markerName: string, negative: boolean, after: boolean) {
            var marker: Marker = this.getMarkerByName(markerName);
            var predicate: (errorMinChar: number, errorLimChar: number, startPos: number, endPos: number) => boolean;

            if (after) {
                predicate = function (errorMinChar: number, errorLimChar: number, startPos: number, endPos: number) {
                    return ((errorMinChar >= startPos) && (errorLimChar >= startPos)) ? true : false;
                };
            } else {
                predicate = function (errorMinChar: number, errorLimChar: number, startPos: number, endPos: number) {
                    return ((errorMinChar <= startPos) && (errorLimChar <= startPos)) ? true : false;
                };
            }

            var exists = this.anyErrorInRange(predicate, marker);
            var diagnostics = this.getAllDiagnostics();

            if (exists !== negative) {
                this.printErrorLog(negative, diagnostics);
                throw new Error("Failure at marker: " + markerName);
            }
        }

        private anyErrorInRange(predicate: (errorMinChar: number, errorLimChar: number, startPos: number, endPos: number) => boolean, startMarker: Marker, endMarker?: Marker) {

            var errors = this.getDiagnostics(startMarker.fileName);
            var exists = false;

            var startPos = startMarker.position;
            if (endMarker !== undefined) {
                var endPos = endMarker.position;
            }

            errors.forEach(function (error: TypeScript.IDiagnostic) {
                if (predicate(error.start(), error.start() + error.length(), startPos, endPos)) {
                    exists = true;
                }
            });

            return exists;
        }

        private printErrorLog(expectErrors: boolean, errors: TypeScript.IDiagnostic[]) {
            if (expectErrors) {
                IO.printLine("Expected error not found.  Error list is:");
            } else {
                IO.printLine("Unexpected error(s) found.  Error list is:");
            }

            errors.forEach(function (error: TypeScript.IDiagnostic) {
                IO.printLine("  minChar: " + error.start() + ", limChar: " + (error.start() + error.length()) + ", message: " + error.message() + "\n");
            });
        }

        public verifyNumberOfErrorsInCurrentFile(expected: number) {
            var errors = this.getDiagnostics(this.activeFile.fileName);
            var actual = errors.length;
            if (actual !== expected) {
                var errorMsg = "Actual number of errors (" + actual + ") does not match expected number (" + expected + ")";
                IO.printLine(errorMsg);
                throw new Error(errorMsg);
            }
        }

        public verifyMemberListContains(symbol: string, type?: string, docComment?: string, fullSymbolName?: string, kind?: string) {
            var members = this.getMemberListAtCaret();

            if (members) {
                this.assertItemInCompletionList(members.entries, symbol, type, docComment, fullSymbolName, kind);
            }
            else {
                throw new Error("Expected a member list, but none was provided")
            }

        }

        public verifyMemberListCount(expectedCount: number, negative: boolean) {
            var members = this.getMemberListAtCaret();

            if (members) {
                var match = members.entries.length === expectedCount;

                if ((!match && !negative) || (match && negative)) {
                    throw new Error("Member list count was " + members.entries.length + ". Expected " + expectedCount);
                }
            }
            else if (expectedCount) {
                throw new Error("Member list count was 0. Expected " + expectedCount);
            }
        }

        public verifyMemberListDoesNotContain(symbol: string) {
            var members = this.getMemberListAtCaret();
            if (members.entries.filter(e => e.name === symbol).length !== 0) {
                throw new Error('Member list did contain ' + symbol);
            }
        }

        public verifyCompletionListItemsCountIsGreaterThan(count: number) {
            var completions = this.getCompletionListAtCaret();
            var itemsCount = completions.entries.length;

            if (itemsCount <= count) {
                throw new Error('Expected completion list items count to be greater than ' + count + ', but is actually ' + itemsCount);
            }
        }

        public verifyMemberListIsEmpty(negative: boolean) {
            var members = this.getMemberListAtCaret();
            if ((!members || members.entries.length === 0) && negative) {
                throw new Error("Member list is empty at Caret");
            } else if ((members && members.entries.length !== 0) && !negative) {

                var errorMsg = "\n" + "Member List contains: [" + members.entries[0].name;
                for (var i = 1; i < members.entries.length; i++) {
                    errorMsg += ", " + members.entries[i].name;
                }
                errorMsg += "]\n";

                IO.printLine(errorMsg);
                throw new Error("Member list is not empty at Caret");

            }
        }

        public verifyCompletionListIsEmpty(negative: boolean) {
            var completions = this.getCompletionListAtCaret();
            if ((!completions || completions.entries.length === 0) && negative) {
                throw new Error("Completion list is empty at Caret");
            } else if ((completions && completions.entries.length !== 0) && !negative) {

                var errorMsg = "\n" + "Completion List contains: [" + completions.entries[0].name;
                for (var i = 1; i < completions.entries.length; i++) {
                    errorMsg += ", " + completions.entries[i].name;
                }
                errorMsg += "]\n";

                IO.printLine(errorMsg);
                throw new Error("Completion list is not empty at Caret");

            }
        }

        public verifyCompletionListContains(symbol: string, type?: string, docComment?: string, fullSymbolName?: string, kind?: string) {
            this.getAllDiagnostics();
            var completions = this.getCompletionListAtCaret();
            this.assertItemInCompletionList(completions.entries, symbol, type, docComment, fullSymbolName, kind);
        }

        public verifyCompletionListDoesNotContain(symbol: string) {
            this.getAllDiagnostics();
            var completions = this.getCompletionListAtCaret();
            if (completions.entries.filter(e => e.name === symbol).length !== 0) {
                throw new Error('Completion list did contain ' + symbol);
            }
        }

        public verifyReferencesCountIs(count: number, localFilesOnly: boolean = true) {
            this.getAllDiagnostics();
            var references = this.getReferencesAtCaret();
            var referencesCount = 0;

            if (localFilesOnly) {
                var localFiles = this.testData.files.map<string>(file => file.fileName);
                // Count only the references in local files. Filter the ones in lib and other files.
                references.forEach((entry) => {
                    if (localFiles.some((filename) => filename === entry.fileName)) {
                        ++referencesCount;
                    }
                });
            }
            else {
                referencesCount = references.length;
            }

            if (referencesCount !== count) {
                var condition = localFilesOnly ? "excluding libs" : "including libs";
                throw new Error("Expected references count (" + condition + ") to be " + count + ", but is actually " + references.length);
            }
        }

        private getMemberListAtCaret() {
            return this.languageService.getCompletionsAtPosition(this.activeFile.fileName, this.currentCaretPosition, true);
        }

        private getCompletionListAtCaret() {
            return this.languageService.getCompletionsAtPosition(this.activeFile.fileName, this.currentCaretPosition, false);
        }

        private getCompletionEntryDetails(entryName: string) {
            return this.languageService.getCompletionEntryDetails(this.activeFile.fileName, this.currentCaretPosition, entryName);
        }

        private getReferencesAtCaret() {
            return this.languageService.getReferencesAtPosition(this.activeFile.fileName, this.currentCaretPosition);
        }

        public verifyQuickInfo(negative: boolean, expectedTypeName?: string, docComment?: string, symbolName?: string, kind?: string) {
            this.getAllDiagnostics();
            var actualQuickInfo = this.languageService.getTypeAtPosition(this.activeFile.fileName, this.currentCaretPosition);
            var actualQuickInfoMemberName = actualQuickInfo ? actualQuickInfo.memberName.toString() : "";
            var actualQuickInfoDocComment = actualQuickInfo ? actualQuickInfo.docComment : "";
            var actualQuickInfoSymbolName = actualQuickInfo ? actualQuickInfo.fullSymbolName : "";
            var actualQuickInfoKind = actualQuickInfo ? actualQuickInfo.kind : "";
            if (negative) {
                if (expectedTypeName !== undefined) {
                    assert.notEqual(actualQuickInfoMemberName, expectedTypeName);
                }
                if (docComment != undefined) {
                    assert.notEqual(actualQuickInfoDocComment, docComment);
                }
                if (symbolName !== undefined) {
                    assert.notEqual(actualQuickInfoSymbolName, symbolName);
                }
                if (kind !== undefined) {
                    assert.notEqual(actualQuickInfoKind, kind);
                }
            } else {
                if (expectedTypeName !== undefined) {
                    assert.equal(actualQuickInfoMemberName, expectedTypeName);
                }
                if (docComment != undefined) {
                    assert.equal(actualQuickInfoDocComment, docComment);
                }
                if (symbolName !== undefined) {
                    assert.equal(actualQuickInfoSymbolName, symbolName);
                }
                if (kind !== undefined) {
                    assert.equal(actualQuickInfoKind, kind);
                }
            }
        }

        public verifyQuickInfoExists(negative: number) {
            var actualQuickInfo = this.languageService.getTypeAtPosition(this.activeFile.fileName, this.currentCaretPosition);
            if (negative) {
                if (actualQuickInfo) {
                    throw new Error('verifyQuickInfoExists failed. Expected quick info NOT to exist');
                }
            }
            else
            {
                if (!actualQuickInfo) {
                    throw new Error('verifyQuickInfoExists failed. Expected quick info to exist');
                }
            }
        }

        public verifyCurrentSignatureHelpIs(expected: string) {
            var help = this.getActiveSignatureHelp();
            assert.equal(help.signatureInfo, expected);
        }

        public verifyCurrentParameterIsVariable(isVariable: boolean) {
            var activeParameter = this.getActiveParameter();
            assert.notNull(activeParameter.parameter);
            assert.equal(isVariable, activeParameter.parameter.isVariable);
        }

        public verifyCurrentParameterHelpName(name: string) {
            var activeParameter = this.getActiveParameter();
            var activeParameterName = activeParameter.parameter ? activeParameter.parameter.name : activeParameter.typeParameter.name;
            assert.equal(activeParameterName, name);
        }

        public verifyCurrentParameterSpanIs(parameter: string) {
            var activeSignature = this.getActiveSignatureHelp();
            var activeParameter = this.getActiveParameter();
            var activeParameterMinChar = activeParameter.parameter ? activeParameter.parameter.minChar : activeParameter.typeParameter.minChar;
            var activeParameterLimChar = activeParameter.parameter ? activeParameter.parameter.limChar : activeParameter.typeParameter.limChar;
            assert.equal(activeSignature.signatureInfo.substring(activeParameterMinChar, activeParameterLimChar), parameter);
        }

        public verifyCurrentParameterHelpDocComment(docComment: string) {
            var activeParameter = this.getActiveParameter();
            var activeParameterDocComment = activeParameter.parameter ? activeParameter.parameter.docComment : activeParameter.typeParameter.docComment;
            assert.equal(activeParameterDocComment, docComment);
        }

        public verifyCurrentSignatureHelpParameterCount(expectedCount: number) {
            assert.equal(this.getActiveSignatureHelp().parameters.length, expectedCount);
        }

        public verifyCurrentSignatureHelpTypeParameterCount(expectedCount: number) {
            assert.equal(this.getActiveSignatureHelp().typeParameters.length, expectedCount);
        }

        public verifyCurrentSignatureHelpDocComment(docComment: string) {
            var actualDocComment = this.getActiveSignatureHelp().docComment;
            assert.equal(actualDocComment, docComment);
        }

        public verifySignatureHelpCount(expected: number) {
            var help = this.languageService.getSignatureAtPosition(this.activeFile.fileName, this.currentCaretPosition);
            var actual = help && help.formal ? help.formal.length : 0;
            assert.equal(actual, expected);
        }

        public verifySignatureHelpPresent(shouldBePresent = true) {
            var actual = this.languageService.getSignatureAtPosition(this.activeFile.fileName, this.currentCaretPosition);
            if (shouldBePresent) {
                if (!actual) {
                    throw new Error("Expected signature help to be present, but it wasn't");
                }
            } else {
                if (actual) {
                    throw new Error("Expected no signature help, but got '" + JSON2.stringify(actual) + "'");
                }
            }
        }

        private getFormalParameter() {
            var help = this.languageService.getSignatureAtPosition(this.activeFile.fileName, this.currentCaretPosition);
            return help.formal;
        }

        private getActiveSignatureHelp() {
            this.getAllDiagnostics();
            var help = this.languageService.getSignatureAtPosition(this.activeFile.fileName, this.currentCaretPosition);
            var activeFormal = help.activeFormal;

            // If the signature hasn't been narrowed down yet (e.g. no parameters have yet been entered),
            // 'activeFormal' will be -1 (even if there is only 1 signature). Signature help will show the
            // first signature in the signature group, so go with that
            if (activeFormal === -1) {
                activeFormal = 0;
            }

            return help.formal[activeFormal];
        }

        private getActiveParameter(): { parameter: Services.FormalParameterInfo; typeParameter: Services.FormalTypeParameterInfo; } {
            var currentSig = this.getActiveSignatureHelp();
            var help = this.languageService.getSignatureAtPosition(this.activeFile.fileName, this.currentCaretPosition);

            // Same logic as in getActiveSignatureHelp - this value might be -1 until a parameter value actually gets typed
            var currentParam = help.actual.currentParameter;
            if (currentParam === -1) currentParam = 0;

            if (help.actual.currentParameterIsTypeParameter) {
                return {
                    parameter: null,
                    typeParameter: currentSig.typeParameters[currentParam]
                };
            }
            else {
                return {
                    parameter: currentSig.parameters[currentParam],
                    typeParameter: null
                };
            }
        }

        public getBreakpointStatementLocation(pos: number) {
            var spanInfo = this.languageService.getBreakpointStatementAtPosition(this.activeFile.fileName, pos);
            var resultString = "\n**Pos: " + pos + " SpanInfo: " + JSON2.stringify(spanInfo) + "\n** Statement: ";
            if (spanInfo !== null) {
                resultString = resultString + this.activeFile.content.substr(spanInfo.minChar, spanInfo.limChar - spanInfo.minChar);
            }
            return resultString;
        }

        public baselineCurrentFileBreakpointLocations() {
            Harness.Baseline.runBaseline(
                "Breakpoint Locations for " + this.activeFile.fileName,
                this.testData.globalOptions['BaselineFile'],
                () => {
                    var fileLength = this.languageServiceShimHost.getScriptSnapshot(this.activeFile.fileName).getLength();
                    var resultString = "";
                    for (var pos = 0; pos < fileLength; pos++) {
                        resultString = resultString + this.getBreakpointStatementLocation(pos);
                    }
                    return resultString;
                },
                true /* run immediately */);
        }

        public printBreakpointLocation(pos: number) {
            IO.printLine(this.getBreakpointStatementLocation(pos));
        }

        public printBreakpointAtCurrentLocation() {
            this.printBreakpointLocation(this.currentCaretPosition);
        }

        public printCurrentParameterHelp() {
            var help = this.languageService.getSignatureAtPosition(this.activeFile.fileName, this.currentCaretPosition);
            IO.printLine(JSON2.stringify(help));
        }

        public printCurrentQuickInfo() {
            var quickInfo = this.languageService.getTypeAtPosition(this.activeFile.fileName, this.currentCaretPosition);
            IO.printLine(JSON2.stringify(quickInfo));
        }

        public printErrorList() {
            var syntacticErrors = this.languageService.getSyntacticDiagnostics(this.activeFile.fileName);
            var semanticErrors = this.languageService.getSemanticDiagnostics(this.activeFile.fileName);
            var errorList = syntacticErrors.concat(semanticErrors);
            IO.printLine('Error list (' + errorList.length + ' errors)');

            if (errorList.length) {
                errorList.forEach(err => {
                    IO.printLine("start: " + err.start() + ", length: " + err.length() +
                        ", message: " + err.message());
                });
            }
        }

        public printCurrentFileState(makeWhitespaceVisible = false, makeCaretVisible = true) {
            for (var i = 0; i < this.testData.files.length; i++) {
                var file = this.testData.files[i];
                var active = (this.activeFile === file);

                IO.printLine('=== Script (' + file.fileName + ') ' + (active ? '(active, cursor at |)' : '') + ' ===');
                var snapshot = this.languageServiceShimHost.getScriptSnapshot(file.fileName);
                var content = snapshot.getText(0, snapshot.getLength());
                if (active) {
                    content = content.substr(0, this.currentCaretPosition) + (makeCaretVisible ? '|' : "") + content.substr(this.currentCaretPosition);
                }
                if (makeWhitespaceVisible) {
                    content = TestState.makeWhitespaceVisible(content);
                }
                IO.printLine(content);
            }
        }

        public printCurrentSignatureHelp() {
            var sigHelp = this.getActiveSignatureHelp();
            IO.printLine(JSON2.stringify(sigHelp));
        }

        public printMemberListMembers() {
            var members = this.getMemberListAtCaret();
            IO.printLine(JSON2.stringify(members));
        }

        public printCompletionListMembers() {
            var completions = this.getCompletionListAtCaret();
            IO.printLine(JSON2.stringify(completions));
        }

        public deleteChar(count = 1) {
            var offset = this.currentCaretPosition;
            var ch = "";

            for (var i = 0; i < count; i++) {
                // Make the edit
                this.languageServiceShimHost.editScript(this.activeFile.fileName, offset, offset + 1, ch);
                this.updateMarkersForEdit(this.activeFile.fileName, offset, offset + 1, ch);

                // Handle post-keystroke formatting
                if (this.enableFormatting) {
                    var edits = this.languageService.getFormattingEditsAfterKeystroke(this.activeFile.fileName, offset, ch, this.formatCodeOptions);
                    offset += this.applyEdits(this.activeFile.fileName, edits);
                }
            }

            // Move the caret to wherever we ended up
            this.currentCaretPosition = offset;

            this.fixCaretPosition();
            this.checkPostEditInvariants();
        }

        public replace(start: number, length: number, text: string) {
            this.languageServiceShimHost.editScript(this.activeFile.fileName, start, start + length, text);
            this.updateMarkersForEdit(this.activeFile.fileName, start, start + length, text);

            this.checkPostEditInvariants();
        }

        public deleteCharBehindMarker(count = 1) {
            var offset = this.currentCaretPosition;
            var ch = "";

            for (var i = 0; i < count; i++) {
                offset--;
                // Make the edit
                this.languageServiceShimHost.editScript(this.activeFile.fileName, offset, offset + 1, ch);
                this.updateMarkersForEdit(this.activeFile.fileName, offset, offset + 1, ch);

                // Handle post-keystroke formatting
                if (this.enableFormatting) {
                    var edits = this.languageService.getFormattingEditsAfterKeystroke(this.activeFile.fileName, offset, ch, this.formatCodeOptions);
                    offset += this.applyEdits(this.activeFile.fileName, edits);
                }
            }

            // Move the caret to wherever we ended up
            this.currentCaretPosition = offset;

            this.fixCaretPosition();

            this.checkPostEditInvariants();
        }

        // Enters lines of text at the current caret position
        public type(text: string) {
            var offset = this.currentCaretPosition;
            for (var i = 0; i < text.length; i++) {
                // Make the edit
                var ch = text.charAt(i);
                this.languageServiceShimHost.editScript(this.activeFile.fileName, offset, offset, ch);
                this.updateMarkersForEdit(this.activeFile.fileName, offset, offset, ch);
                offset++;

                // Handle post-keystroke formatting
                if (this.enableFormatting) {
                    var edits = this.languageService.getFormattingEditsAfterKeystroke(this.activeFile.fileName, offset, ch, this.formatCodeOptions);
                    offset += this.applyEdits(this.activeFile.fileName, edits);
                }
            }

            // Move the caret to wherever we ended up
            this.currentCaretPosition = offset;

            this.fixCaretPosition();

            this.checkPostEditInvariants();
        }

        // Enters text as if the user had pasted it
        public paste(text: string) {
            var start = this.currentCaretPosition;
            var offset = this.currentCaretPosition;
            this.languageServiceShimHost.editScript(this.activeFile.fileName, offset, offset, text);
            this.updateMarkersForEdit(this.activeFile.fileName, offset, offset, text);
            offset += text.length;

            // Handle formatting
            if (this.enableFormatting) {
                // this.languageService.
                var edits = this.languageService.getFormattingEditsOnPaste(this.activeFile.fileName, start, offset, this.formatCodeOptions);
                offset += this.applyEdits(this.activeFile.fileName, edits);
            }

            // Move the caret to wherever we ended up
            this.currentCaretPosition = offset;
            this.fixCaretPosition();

            this.checkPostEditInvariants();
        }

        private checkPostEditInvariants() {
            // Get syntactic errors (to force a refresh)
            var incrSyntaxErrs = JSON2.stringify(this.languageService.getSyntacticDiagnostics(this.activeFile.fileName));

            // Check syntactic structure
            var compilationSettings = new TypeScript.CompilationSettings();
            var parseOptions = TypeScript.getParseOptions(compilationSettings);
            var snapshot = this.languageServiceShimHost.getScriptSnapshot(this.activeFile.fileName);
            var content = snapshot.getText(0, snapshot.getLength());
            var refSyntaxTree = TypeScript.Parser.parse(this.activeFile.fileName, TypeScript.SimpleText.fromString(content), TypeScript.isDTSFile(this.activeFile.fileName), TypeScript.LanguageVersion.EcmaScript5, parseOptions);
            var fullSyntaxErrs = JSON2.stringify(refSyntaxTree.diagnostics());
            var refAST = TypeScript.SyntaxTreeToAstVisitor.visit(refSyntaxTree, this.activeFile.fileName, compilationSettings);
            var compiler = new TypeScript.TypeScriptCompiler();

            compiler.addSourceUnit('lib.d.ts', TypeScript.ScriptSnapshot.fromString(Harness.Compiler.libTextMinimal), ByteOrderMark.None, 0, true);
            compiler.addSourceUnit(this.activeFile.fileName, TypeScript.ScriptSnapshot.fromString(content), ByteOrderMark.None,0, true);

            compiler.pullTypeCheck();
            var refSemanticErrs = JSON2.stringify(compiler.getSemanticDiagnostics(this.activeFile.fileName));
            var incrSemanticErrs = JSON2.stringify(this.languageService.getSemanticDiagnostics(this.activeFile.fileName));

            if (!refSyntaxTree.structuralEquals(this.compiler.getSyntaxTree(this.activeFile.fileName))) {
                throw new Error('Incrementally-parsed and full-parsed syntax trees were not equal');
            }

            if (!TypeScript.structuralEqualsIncludingPosition(refAST, this.compiler.getScript(this.activeFile.fileName))) {
                throw new Error('Incrementally-parsed and full-parsed ASTs were not equal');
            }

            if (incrSyntaxErrs !== fullSyntaxErrs) {
                throw new Error('Mismatched incremental/full syntactic errors.\n=== Incremental errors ===\n' + incrSyntaxErrs + '\n=== Full Errors ===\n' + fullSyntaxErrs);
            }

            if (incrSemanticErrs !== refSemanticErrs) {
                throw new Error('Mismatched incremental/full semantic errors.\n=== Incremental errors ===\n' + incrSemanticErrs + '\n=== Full Errors ===\n' + refSemanticErrs);
            }
        }

        private fixCaretPosition() {
            // The caret can potentially end up between the \r and \n, which is confusing. If
            // that happens, move it back one character
            if (this.currentCaretPosition > 0) {
                var ch = this.languageServiceShimHost.getScriptSnapshot(this.activeFile.fileName).getText(this.currentCaretPosition - 1, this.currentCaretPosition);
                if (ch === '\r') {
                    this.currentCaretPosition--;
                }
            };
        }

        private applyEdits(fileName: string, edits: Services.TextEdit[]): number {
            // We get back a set of edits, but langSvc.editScript only accepts one at a time. Use this to keep track
            // of the incremental offest from each edit to the next. Assumption is that these edit ranges don't overlap
            // or come in out-of-order.
            var runningOffset = 0;
            for (var j = 0; j < edits.length; j++) {
                this.languageServiceShimHost.editScript(fileName, edits[j].minChar + runningOffset, edits[j].limChar + runningOffset, edits[j].text);
                this.updateMarkersForEdit(fileName, edits[j].minChar + runningOffset, edits[j].limChar + runningOffset, edits[j].text);
                var change = (edits[j].minChar - edits[j].limChar) + edits[j].text.length;
                runningOffset += change;
            }
            return runningOffset;
        }

        public formatDocument() {
            var edits = this.languageService.getFormattingEditsForDocument(this.activeFile.fileName, 0, this.languageServiceShimHost.getScriptSnapshot(this.activeFile.fileName).getLength(), this.formatCodeOptions);
            this.currentCaretPosition += this.applyEdits(this.activeFile.fileName, edits);
            this.fixCaretPosition();
        }

        public formatSelection(start: number, end: number) {
            var edits = this.languageService.getFormattingEditsForRange(this.activeFile.fileName, start, end, this.formatCodeOptions);
            this.currentCaretPosition += this.applyEdits(this.activeFile.fileName, edits);
            this.fixCaretPosition();
        }

        private updateMarkersForEdit(fileName: string, minChar: number, limChar: number, text: string) {
            for (var i = 0; i < this.testData.markers.length; i++) {
                var marker = this.testData.markers[i];
                if (marker.fileName === fileName) {
                    if (marker.position > minChar) {
                        if (marker.position < limChar) {
                            // Marker is inside the edit - mark it as invalidated (?)
                            marker.position = -1;
                        } else {
                            // Move marker back/forward by the appropriate amount
                            marker.position += (minChar - limChar) + text.length;
                        }
                    }
                }
            }
        }

        public goToBOF() {
            this.currentCaretPosition = 0;
        }

        public goToEOF() {
            this.currentCaretPosition = this.languageServiceShimHost.getScriptSnapshot(this.activeFile.fileName).getLength();
        }

        public goToDefinition(definitionIndex: number) {
            this.languageService.refresh();
            this.getAllDiagnostics(); // trigger a full type check to ensure all symbols are resolved

            var definitions = this.languageService.getDefinitionAtPosition(this.activeFile.fileName, this.currentCaretPosition);
            if (!definitions || !definitions.length) {
                throw new Error('goToDefinition failed - expected to at least one defintion location but got 0');
            }

            if (definitionIndex >= definitions.length) {
                throw new Error('goToDefinition failed - definitionIndex value (' + definitionIndex + ') exceeds definition list size (' + definitions.length + ')');
            }

            var definition = definitions[definitionIndex];
            this.openFile(definition.fileName);
            this.currentCaretPosition = definition.minChar;
        }

        public getMarkers(): Marker[] {
            //  Return a copy of the list
            return this.testData.markers.slice(0);
        }

        public getRanges(): Range[] {
            //  Return a copy of the list
            return this.testData.ranges.slice(0);
        }

        public verifyCaretAtMarker(markerName = '') {
            var pos = this.getMarkerByName(markerName);
            if (pos.fileName !== this.activeFile.fileName) {
                throw new Error('verifyCaretAtMarker failed - expected to be in file "' + pos.fileName + '", but was in file "' + this.activeFile.fileName + '"');
            }
            if (pos.position !== this.currentCaretPosition) {
                throw new Error('verifyCaretAtMarker failed - expected to be at marker "/*' + markerName + '*/, but was at position ' + this.currentCaretPosition + '(' + this.getLineColStringAtCaret() + ')');
            }
        }

        private getIndentation(fileName: string, position: number): number {
            return this.languageService.getIndentationAtPosition(fileName, position, this.formatCodeOptions);
        }

        public verifyIndentationAtCurrentPosition(numberOfSpaces: number) {
            var actual = this.getIndentation(this.activeFile.fileName, this.currentCaretPosition);
            if (actual != numberOfSpaces) {
                throw new Error('verifyIndentationAtCurrentPosition failed - expected: ' + numberOfSpaces + ', actual: ' + actual);
            }
        }

        public verifyIndentationAtPosition(fileName: string, position: number, numberOfSpaces: number) {
            var actual = this.getIndentation(fileName, position);
            if (actual !== numberOfSpaces) {
                throw new Error('verifyIndentationAtPosition failed - expected: ' + numberOfSpaces + ', actual: ' + actual);
            }
        }

        public verifyCurrentLineContent(text: string) {
            var actual = this.getCurrentLineContent();
            if (actual !== text) {
                throw new Error('verifyCurrentLineContent\n' +
                    '\tExpected: "' + text + '"\n' +
                    '\t  Actual: "' + actual + '"');
            }
        }

        public verifyCurrentFileContent(text: string) {
            var actual = this.getCurrentFileContent();
            var replaceNewlines = str => str.replace(/\r\n/g, "\n");
            if (replaceNewlines(actual) !== replaceNewlines(text)) {
                throw new Error('verifyCurrentLineContent\n' +
                    '\tExpected: "' + text + '"\n' +
                    '\t  Actual: "' + actual + '"');
            }
        }

        public verifyTextAtCaretIs(text: string) {
            var actual = this.languageServiceShimHost.getScriptSnapshot(this.activeFile.fileName).getText(this.currentCaretPosition, this.currentCaretPosition + text.length);
            if (actual !== text) {
                throw new Error('verifyTextAtCaretIs\n' +
                    '\tExpected: "' + text + '"\n' +
                    '\t  Actual: "' + actual + '"');
            }
        }

        public verifyCurrentNameOrDottedNameSpanText(text: string) {
            var span = this.languageService.getNameOrDottedNameSpan(this.activeFile.fileName, this.currentCaretPosition, this.currentCaretPosition);
            if (span === null) {
                throw new Error('verifyCurrentNameOrDottedNameSpanText\n' +
                    '\tExpected: "' + text + '"\n' +
                    '\t  Actual: null');
            }

            var actual = this.languageServiceShimHost.getScriptSnapshot(this.activeFile.fileName).getText(span.minChar, span.limChar);
            if (actual !== text) {
                throw new Error('verifyCurrentNameOrDottedNameSpanText\n' +
                    '\tExpected: "' + text + '"\n' +
                    '\t  Actual: "' + actual + '"');
            }
        }

        private getNameOrDottedNameSpan(pos: number) {
            var spanInfo = this.languageService.getNameOrDottedNameSpan(this.activeFile.fileName, pos, pos);
            var resultString = "\n**Pos: " + pos + " SpanInfo: " + JSON2.stringify(spanInfo) + "\n** Statement: ";
            if (spanInfo !== null) {
                resultString = resultString + this.languageServiceShimHost.getScriptSnapshot(this.activeFile.fileName).getText(spanInfo.minChar, spanInfo.limChar);
            }
            return resultString;
        }

        public baselineCurrentFileNameOrDottedNameSpans() {
            Harness.Baseline.runBaseline(
                "Name OrDottedNameSpans for " + this.activeFile.fileName,
                this.testData.globalOptions['BaselineFile'],
                () => {
                    var fileLength = this.languageServiceShimHost.getScriptSnapshot(this.activeFile.fileName).getLength();
                    var resultString = "";
                    for (var pos = 0; pos < fileLength; pos++) {
                        resultString = resultString + this.getNameOrDottedNameSpan(pos);
                    }
                    return resultString;
                },
                true /* run immediately */);
        }

        public printNameOrDottedNameSpans(pos: number) {
            IO.printLine(this.getNameOrDottedNameSpan(pos));
        }

        public verifyOutliningSpans(spans: TextSpan[]) {
            var actual = this.languageService.getOutliningRegions(this.activeFile.fileName);

            if (actual.length !== spans.length) {
                throw new Error('verifyOutliningSpans failed - expected total spans to be ' + spans.length + ', but was ' + actual.length);
            }

            for (var i = 0; i < spans.length; i++) {
                var expectedSpan = spans[i];
                var actualSpan = actual[i];
                if (expectedSpan.start !== actualSpan.start() || expectedSpan.end !== actualSpan.end()) {
                    throw new Error('verifyOutliningSpans failed - span ' + (i + 1) + ' expected: (' + expectedSpan.start + ',' + expectedSpan.end + '),  actual: (' + actualSpan.start() + ',' + actualSpan.end() + ')');
                }
            }
        }

        public verifyMatchingBracePosition(bracePosition: number, expectedMatchPosition: number) {
            var actual = this.languageService.getBraceMatchingAtPosition(this.activeFile.fileName, bracePosition);

            if (actual.length !== 2) {
                throw new Error('verifyMatchingBracePosition failed - expected result to contain 2 spans, but it had ' + actual.length);
            }

            var actualMatchPosition = -1;
            if (bracePosition >= actual[0].start() && bracePosition <= actual[0].end()) {
                actualMatchPosition = actual[1].start();
            } else if (bracePosition >= actual[1].start() && bracePosition <= actual[1].end()) {
                actualMatchPosition = actual[0].start();
            } else {
                throw new Error('verifyMatchingBracePosition failed - could not find the brace position: ' + bracePosition + ' in the returned list: (' + actual[0].start() + ',' + actual[0].end() + ') and (' + actual[1].start() + ',' + actual[1].end() + ')');
            }

            if (actualMatchPosition !== expectedMatchPosition) {
                throw new Error('verifyMatchingBracePosition failed - expected: ' + actualMatchPosition + ',  actual: ' + expectedMatchPosition);
            }
        }

        public verifyNoMatchingBracePosition(bracePosition: number) {
            var actual = this.languageService.getBraceMatchingAtPosition(this.activeFile.fileName, bracePosition);

            if (actual.length !== 0) {
                throw new Error('verifyNoMatchingBracePosition failed - expected: 0 spans, actual: ' + actual.length);
            }
        }

        public verifyTypesAgainstFullCheckAtPositions(positions: number[]) {
            // Create a from-scratch LS to check against
            var referenceLanguageServiceShimHost = new Harness.TypeScriptLS();
            var referenceLanguageServiceShim = referenceLanguageServiceShimHost.getLanguageService();
            var referenceLanguageService = referenceLanguageServiceShim.languageService;

            for (var i = 0; i < this.testData.files.length; i++) {
                var file = this.testData.files[i];

                var snapshot = this.languageServiceShimHost.getScriptSnapshot(file.fileName);
                var content = snapshot.getText(0, snapshot.getLength());
                referenceLanguageServiceShimHost.addScript(this.testData.files[i].fileName, content);
            }
            referenceLanguageServiceShim.refresh(true);

            for (i = 0; i < positions.length; i++) {
                var nameOf = (type: Services.TypeInfo) => type ? type.fullSymbolName : '(none)';

                var pullName: string, refName: string;
                var anyFailed = false;

                var errMsg = '';

                try {
                    var pullType = this.languageService.getTypeAtPosition(this.activeFile.fileName, positions[i]);
                    pullName = nameOf(pullType);
                } catch (err1) {
                    errMsg = 'Failed to get pull type check. Exception: ' + err1 + '\r\n';
                    if (err1.stack) errMsg = errMsg + err1.stack;
                    pullName = '(failed)';
                    anyFailed = true;
                }

                try {
                    var referenceType = referenceLanguageService.getTypeAtPosition(this.activeFile.fileName, positions[i]);
                    refName = nameOf(referenceType);
                } catch (err2) {
                    errMsg = 'Failed to get full type check. Exception: ' + err2 + '\r\n';
                    if (err2.stack) errMsg = errMsg + err2.stack;
                    refName = '(failed)';
                    anyFailed = true;
                }

                var failure = anyFailed || (refName !== pullName);
                if (failure) {
                    snapshot = this.languageServiceShimHost.getScriptSnapshot(this.activeFile.fileName);
                    content = snapshot.getText(0, snapshot.getLength());
                    var textAtPosition = content.substr(positions[i], 10);
                    var positionDescription = 'Position ' + positions[i] + ' ("' + textAtPosition + '"...)';

                    if (anyFailed) {
                        throw new Error('Exception thrown in language service for ' + positionDescription + '\r\n' + errMsg);
                    } else if (refName !== pullName) {
                        throw new Error('Pull/Full disagreement failed at ' + positionDescription + ' - expected full typecheck type "' + refName + '" to equal pull type "' + pullName + '".');
                    }
                }
            }
        }

        public verifyNavigationItemsCount(expected: number) {
            var items = this.languageService.getScriptLexicalStructure(this.activeFile.fileName);
            var actual = (items && items.length) || 0;
            if (expected != actual) {
                throw new Error('verifyNavigationItemsCount failed - found: ' + actual + ' navigation items, expected: ' + expected + '.');
            }
        }

        public verifyNavigationItemsListContains(name: string, kind: string, fileName: string, parentName: string) {
            var items = this.languageService.getScriptLexicalStructure(this.activeFile.fileName);

            if (!items || items.length === 0) {
                throw new Error('verifyNavigationItemsListContains failed - found 0 navigation items, expected at least one.');
            }

            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item && item.name === name && item.kind === kind && item.fileName === fileName) {
                    return;
                }
            }

            var missingItem = { name: name, kind: kind, fileName: fileName, parentName: parentName };
            throw new Error('verifyNavigationItemsListContains failed - could not find the item: ' + JSON.stringify(missingItem) + ' in the returned list: (' + JSON.stringify(items) + ')');
        }

        public verifyOccurancesAtPositionListContains(fileName: string, start: number, end: number, isWriteAccess?: boolean) {
            var occurances = this.languageService.getOccurrencesAtPosition(this.activeFile.fileName, this.currentCaretPosition);

            if (!occurances || occurances.length === 0) {
                throw new Error('verifyOccurancesAtPositionListContains failed - found 0 references, expected at least one.');
            }

            for (var i = 0; i < occurances.length; i++) {
                var occurance = occurances[i];
                if (occurance && occurance.fileName === fileName && occurance.minChar === start && occurance.limChar === end) {
                    if (typeof isWriteAccess !== "undefined" && occurance.isWriteAccess !== isWriteAccess) {
                        throw new Error('verifyOccurancesAtPositionListContains failed - item isWriteAccess value doe not match, actual: ' + occurance.isWriteAccess + ', expected: ' + isWriteAccess + '.');
                    }
                    return;
                }
            }

            var missingItem = { fileName: fileName, start: start, end: end, isWriteAccess: isWriteAccess };
            throw new Error('verifyOccurancesAtPositionListContains failed - could not find the item: ' + JSON.stringify(missingItem) + ' in the returned list: (' + JSON.stringify(occurances) + ')');
        }

        private getBOF(): number {
            return 0;
        }

        private getEOF(): number {
            return this.languageServiceShimHost.getScriptSnapshot(this.activeFile.fileName).getLength();
        }

        // Get the text of the entire line the caret is currently at
        private getCurrentLineContent() {
            // The current caret position (in line/col terms)
            var line = this.getCurrentCaretFilePosition().line;
            // The line/col of the start of this line
            var pos = this.languageServiceShimHost.lineColToPosition(this.activeFile.fileName, line, 1);
            // The index of the current file

            // The text from the start of the line to the end of the file
            var snapshot = this.languageServiceShimHost.getScriptSnapshot(this.activeFile.fileName);
            var text = snapshot.getText(pos, snapshot.getLength());

            // Truncate to the first newline
            var newlinePos = text.indexOf('\n');
            if (newlinePos === -1) {
                return text;
            } else {
                if (text.charAt(newlinePos - 1) === '\r') {
                    newlinePos--;
                }
                return text.substr(0, newlinePos);
            }
        }

        private getCurrentFileContent() {
            var snapshot = this.languageServiceShimHost.getScriptSnapshot(this.activeFile.fileName);
            return snapshot.getText(0, snapshot.getLength());
        }

        private getCurrentCaretFilePosition() {
            var result = this.languageServiceShimHost.positionToZeroBasedLineCol(this.activeFile.fileName, this.currentCaretPosition);
            if (result.line >= 0) {
                result.line++;
            }

            if (result.character >= 0) {
                result.character++;
            }

            return result;
        }

        private assertItemInCompletionList(items: Services.CompletionEntry[], name: string, type?: string, docComment?: string, fullSymbolName?: string, kind?: string) {
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.name == name) {
                    if (docComment != undefined || type !== undefined || fullSymbolName !== undefined) {
                        var details = this.getCompletionEntryDetails(item.name);

                        if (docComment != undefined) {
                            assert.equal(details.docComment, docComment);
                        }
                        if (type !== undefined) {
                            assert.equal(details.type, type);
                        }
                        if (fullSymbolName !== undefined) {
                            assert.equal(details.fullSymbolName, fullSymbolName);
                        }
                    }

                    if (kind !== undefined) {
                        assert.equal(item.kind, kind);
                    }

                    return;
                }
            }

            var itemsString = items.map((item) => JSON2.stringify({ name: item.name, kind: item.kind })).join(",\n");

            throw new Error("Marker: " + currentTestState.lastKnownMarker + "\n" + 'Expected "' + JSON2.stringify({ name: name, type: type, docComment: docComment, fullSymbolName: fullSymbolName, kind: kind }) + '" to be in list [' + itemsString + ']');
        }

        private findFile(indexOrName: any) {
            var result: FourSlashFile = null;
            if (typeof indexOrName === 'number') {
                var index = <number>indexOrName;
                if (index >= this.testData.files.length) {
                    throw new Error('File index (' + index + ') in openFile was out of range. There are only ' + this.testData.files.length + ' files in this test.');
                } else {
                    result = this.testData.files[index];
                }
            } else if (typeof indexOrName === 'string') {
                var name = <string>indexOrName;
                var availableNames = [];
                var foundIt = false;
                for (var i = 0; i < this.testData.files.length; i++) {
                    var fn = this.testData.files[i].fileName;
                    if (fn) {
                        if (fn === name) {
                            result = this.testData.files[i];
                            foundIt = true;
                            break;
                        }
                        availableNames.push(fn);
                    }
                }

                if (!foundIt) {
                    throw new Error('No test file named "' + name + '" exists. Available file names are:' + availableNames.join(', '));
                }
            } else {
                throw new Error('Unknown argument type');
            }

            return result;
        }

        private getCurrentLineNumberZeroBased() {
            return this.getCurrentLineNumberOneBased() - 1;
        }

        private getCurrentLineNumberOneBased() {
            return this.languageServiceShimHost.positionToZeroBasedLineCol(this.activeFile.fileName, this.currentCaretPosition).line + 1;
        }

        private getLineColStringAtCaret() {
            var pos = this.languageServiceShimHost.positionToZeroBasedLineCol(this.activeFile.fileName, this.currentCaretPosition);
            return 'line ' + (pos.line + 1) + ', col ' + pos.character;
        }

        private getMarkerByName(markerName: string) {
            var markerPos = this.testData.markerPositions[markerName];
            if (markerPos === undefined) {
                var markerNames = [];
                for (var m in this.testData.markerPositions) markerNames.push(m);
                throw new Error('Unknown marker "' + markerName + '" Available markers: ' + markerNames.map(m => '"' + m + '"').join(', '));
            } else {
                return markerPos;
            }
        }

        private static makeWhitespaceVisible(text: string) {
            return text.replace(/ /g, '\u00B7').replace(/\r/g, '\u00B6').replace(/\n/g, '\u2193\n').replace(/\t/g, '\u2192\   ');
        }
    }

    // TOOD: should these just use the Harness's stdout/stderr?
    var fsOutput = new Harness.Compiler.WriterAggregator();
    var fsErrors = new Harness.Compiler.WriterAggregator();
    export function runFourSlashTest(fileName: string) {
        var content = IO.readFile(fileName);
        runFourSlashTestContent(content.contents(), fileName)
    }

    export function runFourSlashTestContent(content: string, fileName: string) {
        // Parse out the files and their metadata
        var testData = parseTestData(content);

        assert.bugs(content);

        currentTestState = new TestState(testData);
        var oldThrowAssertError = assert.throwAssertError;
        assert.throwAssertError = (error: Error) => {
            error.message = "Marker: " + currentTestState.lastKnownMarker + "\n" + error.message;
            throw error;
        }

        var mockFilename = 'file_0.ts';

        var result = '';
        var tsFn = './tests/cases/fourslash/fourslash.ts';

        // TODO: previously we set these two settings on the compiler:
        //    settings.outputOption = "fourslash.js";
        //    settings.resolve = true;
        // but they appear to not affect test execution, are they still necessary? (I don't think resolve ever really worked)

        fsOutput.reset();
        fsErrors.reset();

        Harness.Compiler.addUnit(Harness.Compiler.CompilerInstance.RunTime, IO.readFile(tsFn).contents(), tsFn);
        Harness.Compiler.addUnit(Harness.Compiler.CompilerInstance.RunTime, content, mockFilename);
        Harness.Compiler.compile(Harness.Compiler.CompilerInstance.RunTime, content, mockFilename);

        var emitterIOHost: TypeScript.EmitterIOHost = {
            writeFile: (path: string, contents: string, writeByteOrderMark: boolean) => fsOutput.Write(contents),
            directoryExists: (s: string) => false,
            fileExists: (s: string) => true,
            resolvePath: (s: string) => s
        }

        Harness.Compiler.emitAll(Harness.Compiler.CompilerInstance.RunTime, emitterIOHost);
        fsOutput.Close();
        fsErrors.Close();

        if (fsErrors.lines.length > 0) {
            throw new Error('Error compiling ' + fileName + ': ' + fsErrors.lines.join('\r\n'));
        }

        result = fsOutput.lines.join('\r\n');

        // Compile and execute the test
        try {
            eval(result);
        } catch (err) {
            // Debugging: FourSlash.currentTestState.printCurrentFileState();
            throw err;
        } finally {
            assert.throwAssertError = oldThrowAssertError;
        }
    }

    function chompLeadingSpace(content: string) {
        var lines = content.split("\n");
        for (var i = 0; i < lines.length; i++) {
            if ((lines[i].length !== 0) && (lines[i].charAt(0) !== ' ')) {
                return content;
            }
        }

        return lines.map(s => s.substr(1)).join('\n');
    }

    function parseTestData(contents: string): FourSlashData {
        // Regex for parsing options in the format "@Alpha: Value of any sort"
        var optionRegex = /^\s*@(\w+): (.*)\s*/;

        // List of all the subfiles we've parsed out
        var files: FourSlashFile[] = [];
        // Global options
        var opts = {};
        // Marker positions
        var makeDefaultFilename = () => 'file_' + files.length + '.ts';

        // Split up the input file by line
        // Note: IE JS engine incorrectly handles consecutive delimiters here when using RegExp split, so
        // we have to string-based splitting instead and try to figure out the delimiting chars
        var lines = contents.split('\n');

        var markerMap: MarkerMap = {};
        var markers: Marker[] = [];
        var ranges: Range[] = [];

        // Stuff related to the subfile we're parsing
        var currentFileContent: string = null;
        var currentFileName = makeDefaultFilename();
        var currentFileOptions = {};

        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            var lineLength = line.length;

            if (lineLength > 0 && line.charAt(lineLength - 1) === '\r') {
                line = line.substr(0, lineLength - 1);
            }

            if (line.substr(0, 4) === '////') {
                // Subfile content line

                // Append to the current subfile content, inserting a newline needed
                if (currentFileContent === null) {
                    currentFileContent = '';
                } else {
                    // End-of-line
                    currentFileContent = currentFileContent + '\n';
                }

                currentFileContent = currentFileContent + line.substr(4);
            } else if (line.substr(0, 2) === '//') {
                // Comment line, check for global/file @options and record them
                var match = optionRegex.exec(line.substr(2));
                if (match) {
                    var globalNameIndex = globalMetadataNames.indexOf(match[1]);
                    var fileNameIndex = fileMetadataNames.indexOf(match[1]);
                    if (globalNameIndex === -1) {
                        if (fileNameIndex === -1) {
                            throw new Error('Unrecognized metadata name "' + match[1] + '". Available global metadata names are: ' + globalMetadataNames.join(', ') + '; file metadata names are: ' + fileMetadataNames.join(', '));
                        } else {
                            currentFileOptions[match[1]] = match[2];
                        }
                    } else {
                        opts[match[1]] = match[2];
                    }
                }
            } else {
                // Empty line or code line, terminate current subfile if there is one
                if (currentFileContent) {
                    var file = parseFileContent(currentFileContent, currentFileName, markerMap, markers, ranges);
                    file.fileOptions = currentFileOptions;

                    // Store result file
                    files.push(file);

                    // Reset local data
                    currentFileContent = null;
                    currentFileOptions = {};
                    currentFileName = makeDefaultFilename();
                }
            }
        }

        return {
            markerPositions: markerMap,
            markers: markers,
            globalOptions: opts,
            files: files,
            ranges: ranges
        }
    }

    enum State {
        none,
        inSlashStarMarker,
        inObjectMarker
    }

    function reportError(fileName: string, line: number, col: number, message: string) {
        var errorMessage = fileName + "(" + line + "," + col + "): " + message;
        throw new Error(errorMessage);
    }

    //function isValidSlashStarMarkerText(text: string): boolean {
    //    return !!(text !== null && text.match(markerTextRegexp));
    //}

    function recordObjectMarker(fileName: string, location: ILocationInformation, text: string, markerMap: MarkerMap, markers: Marker[]): Marker {
        var markerValue = undefined;
        try {
            // Attempt to parse the marker value as JSON
            markerValue = JSON2.parse("{ " + text + " }");
        } catch (e) {
            reportError(fileName, location.sourceLine, location.sourceColumn, "Unable to parse marker text " + e.message);
        }

        if (markerValue === undefined) {
            reportError(fileName, location.sourceLine, location.sourceColumn, "Object markers can not be empty");
            return null;
        }

        var marker: Marker = {
            fileName: fileName,
            position: location.position,
            data: markerValue
        };

        // Object markers can be anonymous
        if (markerValue.name) {
            markerMap[markerValue.name] = marker;
        }

        markers.push(marker);

        return marker;
    }

    function recordMarker(fileName: string, location: ILocationInformation, name: string, markerMap: MarkerMap, markers: Marker[]): Marker {
        var marker: Marker = {
            fileName: fileName,
            position: location.position
        };

        // Verify /**/ markers for uniqueness
        if (markerMap[name] !== undefined) {
            var message = "Marker '" + name + "' is duplicated in the source file contents.";
            reportError(marker.fileName, location.sourceLine, location.sourceColumn, message);
            return null;
        } else {
            markerMap[name] = marker;
            markers.push(marker);
            return marker;
        }
    }

    function parseFileContent(content: string, fileName: string, markerMap: MarkerMap, markers: Marker[], ranges: Range[]): FourSlashFile {
        content = chompLeadingSpace(content);

        // Any /*comment*/ with a character not in this string is not a marker.
        var validMarkerChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz$1234567890_';

        /** The file content (minus metacharacters) so far */
        var output: string = "";

        /** The current marker (or maybe multi-line comment?) we're parsing, possibly */
        var openMarker: ILocationInformation = null;

        /** A stack of the open range markers that are still unclosed */
        var openRanges: IRangeLocationInformation[] = [];

        /** A list of ranges we've collected so far */
        var localRanges: Range[] = [];

        /** The latest position of the start of an unflushed plaintext area */
        var lastNormalCharPosition: number = 0;

        /** The total number of metacharacters removed from the file (so far) */
        var difference: number = 0;

        /** The fourslash file state object we are generating */
        var state: State = State.none;

        /** Current position data */
        var line: number = 1;
        var column: number = 1;

        var flush = (lastSafeCharIndex: number) => {
            if (lastSafeCharIndex === undefined) {
                output = output + content.substr(lastNormalCharPosition);
            } else {
                output = output + content.substr(lastNormalCharPosition, lastSafeCharIndex - lastNormalCharPosition);
            }
        };

        if (content.length > 0) {
            var previousChar = content.charAt(0);
            for (var i = 1; i < content.length; i++) {
                var currentChar = content.charAt(i);
                switch (state) {
                    case State.none:
                        if (previousChar === "[" && currentChar === "|") {
                            // found a range start
                            openRanges.push({
                                position: (i - 1) - difference,
                                sourcePosition: i - 1,
                                sourceLine: line,
                                sourceColumn: column,
                            });
                            // copy all text up to marker position
                            flush(i - 1);
                            lastNormalCharPosition = i + 1;
                            difference += 2;
                        } else if (previousChar === "|" && currentChar === "]") {
                            // found a range end
                            var rangeStart = openRanges.pop();
                            if (!rangeStart) {
                                reportError(fileName, line, column, "Found range end with no matching start.");
                            }

                            var range: Range = {
                                fileName: fileName,
                                start: rangeStart.position,
                                end: (i - 1) - difference,
                                marker: rangeStart.marker
                            };
                            localRanges.push(range);

                            // copy all text up to range marker position
                            flush(i - 1);
                            lastNormalCharPosition = i + 1;
                            difference += 2;
                        } else if (previousChar === "/" && currentChar === "*") {
                            // found a possible marker start
                            state = State.inSlashStarMarker;
                            openMarker = {
                                position: (i - 1) - difference,
                                sourcePosition: i - 1,
                                sourceLine: line,
                                sourceColumn: column,
                            };
                        } else if (previousChar === "{" && currentChar === "|") {
                            // found an object marker start
                            state = State.inObjectMarker;
                            openMarker = {
                                position: (i - 1) - difference,
                                sourcePosition: i - 1,
                                sourceLine: line,
                                sourceColumn: column,
                            };
                            flush(i - 1);
                        }
                        break;

                    case State.inObjectMarker:
                        // Object markers are only ever terminated by |} and have no content restrictions
                        if (previousChar === "|" && currentChar === "}") {
                            // Record the marker
                            var objectMarkerNameText = content.substring(openMarker.sourcePosition + 2, i - 1).trim();
                            var marker = recordObjectMarker(fileName, openMarker, objectMarkerNameText, markerMap, markers);

                            if (openRanges.length > 0) {
                                openRanges[openRanges.length - 1].marker = marker;
                            }

                            // Set the current start to point to the end of the current marker to ignore its text
                            lastNormalCharPosition = i + 1;
                            difference += i + 1 - openMarker.sourcePosition;

                            // Reset the state
                            openMarker = null;
                            state = State.none;
                        }
                        break;

                    case State.inSlashStarMarker:
                        if (previousChar === "*" && currentChar === "/") {
                            // Record the marker
                            // start + 2 to ignore the */, -1 on the end to ignore the * (/ is next)
                            var markerNameText = content.substring(openMarker.sourcePosition + 2, i - 1).trim();
                            var marker = recordMarker(fileName, openMarker, markerNameText, markerMap, markers);

                            if (openRanges.length > 0) {
                                openRanges[openRanges.length - 1].marker = marker;
                            }

                            // Set the current start to point to the end of the current marker to ignore its text
                            flush(openMarker.sourcePosition);
                            lastNormalCharPosition = i + 1;
                            difference += i + 1 - openMarker.sourcePosition;

                            // Reset the state
                            openMarker = null;
                            state = State.none;
                        } else if (validMarkerChars.indexOf(currentChar) < 0) {
                            if (currentChar === '*' && i < content.length - 1 && content.charAt(i + 1) === '/') {
                                // The marker is about to be closed, ignore the 'invalid' char
                            } else {
                                // We've hit a non-valid marker character, so we were actually in a /* comment */.
                                // Bail out the text we've gathered so far back into the output
                                flush(i);
                                lastNormalCharPosition = i;
                                openMarker = null;

                                state = State.none;
                            }
                        }
                        break;
                }

                if (currentChar === '\n' && previousChar === '\r') {
                    // Ignore trailing \n after a \r
                    continue;
                } else if (currentChar === '\n' || currentChar === '\r') {
                    line++;
                    column = 1;
                    continue;
                }

                column++;
                previousChar = currentChar;
            }
        }

        // Add the remaining text
        flush(undefined);

        if (openRanges.length > 0) {
            var openRange = openRanges[0];
            reportError(fileName, openRange.sourceLine, openRange.sourceColumn, "Unterminated range.");
        }

        if (openMarker !== null) {
            reportError(fileName, openMarker.sourceLine, openMarker.sourceColumn, "Unterminated marker.");
        }

        // put ranges in the correct order
        localRanges = localRanges.sort((a, b) => a.start < b.start ? -1 : 1);
        localRanges.forEach((r) => { ranges.push(r); });

        return {
            content: output,
            fileOptions: {},
            version: 0,
            fileName: fileName
        };
    }
}
