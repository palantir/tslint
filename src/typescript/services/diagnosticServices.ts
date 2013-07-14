///<reference path='languageService.ts'/>

module Services {

    export interface ILanguageServicesDiagnostics {
        log(content: string): void;
    }

    export interface ICompilerDiagnostics {
        //logNewCompilerUnit(scriptId: string, unitIndex: number): void;
        //logUpdatedCompilerUnit(scriptId: string, unitIndex: number, editRange: TypeScript.TextChangeRange): void;
        isLoggingEdits(): boolean;
    }

    export class CompilerDiagnostics implements ICompilerDiagnostics {

        private openEditTag: string = "<Edit>";
        private closeEditTag: string = "<Edit/>";

        constructor(private host: Services.ILanguageServiceHost) { }

        //public logNewCompilerUnit(scriptId: string, unitIndex: number) {
        //    var sourceText = this.host.getScriptSourceText(unitIndex, 0, this.host.getScriptSourceLength(unitIndex));
        //    if (scriptId.indexOf(".d.ts") === -1) {
        //        this.host.getDiagnosticsObject().log("//=New=\\\\" + '\r\n' +
        //                                               "scriptId: " + scriptId + '\r\n' +
        //                                               this.openEditTag + sourceText + this.closeEditTag + '\r\n' +
        //                                               "\\\\=====//" + '\r\n');
        //    }
        //}

        //public logUpdatedCompilerUnit(scriptId: string, unitIndex: number, editRange: TypeScript.TextChangeRange) {
            
        //    var sourceText = this.host.getScriptSourceText(unitIndex, editRange.span ..minChar, editRange.limChar + editRange.delta);
        //    this.host.getDiagnosticsObject().log("//=Update=\\\\" + '\r\n' +
        //                                           "scriptId: " + scriptId + '\r\n' +
        //                                           editRange + '\r\n' +
        //                                           this.openEditTag + sourceText + this.closeEditTag + '\r\n' +
        //                                           "\\\\=====//" + '\r\n');
        //}

        public isLoggingEdits(): boolean {
            return (this.host.getDiagnosticsObject() !== null);
        }

    }

    export class DiagnosticService implements Services.ILanguageService {

        private internal: Services.ILanguageService;
        private host: Services.ILanguageServiceHost;
        private diagnostics: Services.ILanguageServicesDiagnostics;

        constructor(internal: Services.ILanguageService, host: ILanguageServiceHost) {
            this.internal = internal;
            this.diagnostics = host.getDiagnosticsObject();
        }

        private writeFile(content: string): void {
            this.diagnostics.log(content);
        }

        public refresh(): void {

            this.writeFile("refresh: "+"\n");
            this.internal.refresh();

        }

        public getSyntacticDiagnostics(fileName: string): TypeScript.IDiagnostic[] {

            var args = "fileName: " + this.stringify(fileName);
            var result = this.internal.getSyntacticDiagnostics(fileName);

            this.writeFile("getSyntacticDiagnostics: " + args + " result: " + this.stringify(result) + "\n");

            return result;

        }

        public getSemanticDiagnostics(fileName: string): TypeScript.IDiagnostic[] {

            var args = "fileName: " + this.stringify(fileName);
            var result = this.internal.getSemanticDiagnostics(fileName);

            this.writeFile("getSemanticDiagnostics: " + args + " result: " + this.stringify(result) + "\n");

            return result;

        }

        public getCompletionsAtPosition(fileName: string, pos: number, isMemberCompletion: boolean): Services.CompletionInfo {

            var args = "fileName: " + this.stringify(fileName) + " pos: " + this.stringify(pos) + " isMemberCompletion: " + this.stringify(isMemberCompletion);
            var result = this.internal.getCompletionsAtPosition(fileName, pos, isMemberCompletion);

            this.writeFile("getCompletionsAtPosition: " + args + " result: " + this.stringify(result) + "\n");

            return result;

        }

        getCompletionEntryDetails(fileName: string, position: number, entryName: string): Services.CompletionEntryDetails {

            var args = "fileName: " + this.stringify(fileName) + " pos: " + this.stringify(position) + " entryName: " + this.stringify(entryName);
            var result = this.internal.getCompletionEntryDetails(fileName, position, entryName);

            this.writeFile("getCompletionEntryDetails: " + args + " result: " + this.stringify(result) + "\n");

            return result;

        }

        public getTypeAtPosition(fileName: string, pos: number): Services.TypeInfo {

            var args = "fileName: " + this.stringify(fileName) + " pos: " + this.stringify(pos);
            var result = this.internal.getTypeAtPosition(fileName, pos);

            this.writeFile("getTypeAtPosition: " + args + " result: " + this.stringify(result) + "\n");

            return result;

        }

        public getNameOrDottedNameSpan(fileName: string, startPos: number, endPos: number): Services.SpanInfo {

            var args = "fileName: " + this.stringify(fileName) + " startPos: " + this.stringify(startPos) + " endPos: " + this.stringify(endPos);
            var result = this.internal.getNameOrDottedNameSpan(fileName, startPos, endPos);

            this.writeFile("getNameOrDottedNameSpan: " + args + " result: " + this.stringify(result) + "\n");

            return result;

        }

        public getBreakpointStatementAtPosition(fileName: string, pos: number): Services.SpanInfo {

            var args = "fileName: " + this.stringify(fileName) + " pos: " + this.stringify(pos);
            var result = this.internal.getBreakpointStatementAtPosition(fileName, pos);

            this.writeFile("getBreakpointStatementAtPosition: " + args + " result: " + this.stringify(result) + "\n");

            return result;

        }

        public getSignatureAtPosition(fileName: string, pos: number): Services.SignatureInfo {

            var args = "fileName: " + this.stringify(fileName) + " pos: " + this.stringify(pos);
            var result = this.internal.getSignatureAtPosition(fileName, pos);

            this.writeFile("getSignatureAtPosition: " + args + " result: " + this.stringify(result) + "\n");

            return result;

        }

        public getDefinitionAtPosition(fileName: string, pos: number): Services.DefinitionInfo[] {

            var args = "fileName: " + this.stringify(fileName) + " pos: " + this.stringify(pos);
            var result = this.internal.getDefinitionAtPosition(fileName, pos);

            this.writeFile("getDefinitionAtPosition: " + args + " result: " + this.stringify(result) + "\n");

            return result;

        }

        public getReferencesAtPosition(fileName: string, pos: number): Services.ReferenceEntry[] {

            var args = "fileName: " + this.stringify(fileName) + " pos: " + this.stringify(pos);
            var result = this.internal.getReferencesAtPosition(fileName, pos);

            this.writeFile("getReferencesAtPosition: " + args + " result: " + this.stringify(result) + "\n");

            return result;

        }

        public getOccurrencesAtPosition(fileName: string, pos: number): Services.ReferenceEntry[] {

            var args = "fileName: " + this.stringify(fileName) + " pos: " + this.stringify(pos);
            var result = this.internal.getOccurrencesAtPosition(fileName, pos);

            this.writeFile("getOccurrencesAtPosition: " + args + " result: " + this.stringify(result) + "\n");

            return result;

        }

        public getImplementorsAtPosition(fileName: string, pos: number): Services.ReferenceEntry[] {

            var args = "fileName: " + this.stringify(fileName) + " pos: " + this.stringify(pos);
            var result = this.internal.getImplementorsAtPosition(fileName, pos);

            this.writeFile("getImplementorsAtPosition: " + args + " result: " + this.stringify(result) + "\n");

            return result;

        }

        public getNavigateToItems(searchValue: string): Services.NavigateToItem[] {

            var args = "searchValue: " + this.stringify(searchValue);
            var result = this.internal.getNavigateToItems(searchValue);

            this.writeFile("getNavigateToItems: " + args + " result: " + this.stringify(result) + "\n");

            return result;

        }

        public getScriptLexicalStructure(fileName: string): Services.NavigateToItem[] {

            var args = "fileName: " + this.stringify(fileName);
            var result = this.internal.getScriptLexicalStructure(fileName);

            this.writeFile("getScriptLexicalStructure: " + args + " result: " + this.stringify(result) + "\n");

            return result;

        }

        public getOutliningRegions(fileName: string): TypeScript.TextSpan[] {

            var args = "fileName: " + this.stringify(fileName);
            var result = this.internal.getOutliningRegions(fileName);

            this.writeFile("getOutliningRegions: " + args + " result: " + this.stringify(result) + "\n");

            return result;

        }

        public getFormattingEditsForRange(fileName: string, minChar: number, limChar: number, options: Services.FormatCodeOptions): Services.TextEdit[] {

            var args = "fileName: " + this.stringify(fileName) + " minChar: " + this.stringify(minChar) + " limChar: " + this.stringify(limChar) + " options: " + this.stringify(options);
            var result = this.internal.getFormattingEditsForRange(fileName, minChar, limChar, options);

            this.writeFile("getFormattingEditsForRange: " + args + " result: " + this.stringify(result) + "\n");

            return result;

        }

        
        public getFormattingEditsForDocument(fileName: string, minChar: number, limChar: number, options: Services.FormatCodeOptions): Services.TextEdit[] {

            var args = "fileName: " + this.stringify(fileName) + " minChar: " + this.stringify(minChar) + " limChar: " + this.stringify(limChar) + " options: " + this.stringify(options);
            var result = this.internal.getFormattingEditsForDocument(fileName, minChar, limChar, options);

            this.writeFile("getFormattingEditsForDocument: " + args + " result: " + this.stringify(result) + "\n");

            return result;

        }

        
        public getFormattingEditsOnPaste(fileName: string, minChar: number, limChar: number, options: Services.FormatCodeOptions): Services.TextEdit[] {

            var args = "fileName: " + this.stringify(fileName) + " minChar: " + this.stringify(minChar) + " limChar: " + this.stringify(limChar) + " options: " + this.stringify(options);
            var result = this.internal.getFormattingEditsOnPaste(fileName, minChar, limChar, options);

            this.writeFile("getFormattingEditsOnPaste: " + args + " result: " + this.stringify(result) + "\n");

            return result;

        }

        
        public getFormattingEditsAfterKeystroke(fileName: string, position: number, key: string, options: Services.FormatCodeOptions): Services.TextEdit[] {

            var args = "fileName: " + this.stringify(fileName) + " position: " + this.stringify(position) + " key: " + this.stringify(key) + " options: " + this.stringify(options);
            var result = this.internal.getFormattingEditsAfterKeystroke(fileName, position, key, options);

            this.writeFile("getFormattingEditsAfterKeystroke: " + args + " result: " + this.stringify(result) + "\n");

            return result;

        }

        
        public getBraceMatchingAtPosition(fileName: string, position: number): TypeScript.TextSpan[] {

            var args = "fileName: " + this.stringify(fileName) + " position: " + this.stringify(position);
            var result = this.internal.getBraceMatchingAtPosition(fileName, position);

            this.writeFile("getBraceMatchingAtPosition: " + args + " result: " + this.stringify(result) + "\n");

            return result;

        }

        
        public getIndentationAtPosition(fileName: string, position: number, options: Services.EditorOptions): number {

            var args = "fileName: " + this.stringify(fileName) + " position: " + this.stringify(position) + " options: " + this.stringify(options);
            var result = this.internal.getIndentationAtPosition(fileName, position, options);

            this.writeFile("getIndentationAtPosition: " + args + " result: " + this.stringify(result) + "\n");

            return result;

        }

        public getEmitOutput(fileName: string): Services.EmitOutput {

            var args = "fileName: " + this.stringify(fileName);
            var result = this.internal.getEmitOutput(fileName);

            this.writeFile("getEmitOutput: " + args + " result: " + this.stringify(result) + "\n");

            return result;
        }

        public getSyntaxTree(fileName: string): TypeScript.SyntaxTree {

            var args = "fileName: " + this.stringify(fileName);
            var result = this.internal.getSyntaxTree(fileName);

            this.writeFile("getSyntaxTree: " + args + " result: " + this.stringify(result) + "\n");

            return result;
        }

        private stringify(object: any): string {

            var returnString: string = "";

            if (typeof object === 'string') {
                returnString = "\"" + object.toString().replace("\n", "\\n") + "\"";
            } else if (typeof object === 'number') {
                returnString = object.toString();
            } else if (typeof object === 'boolean') {
                returnString = object;
            } else if (typeof object !== 'function') {
                var properties = [];

                for (var key in object) {
                    if (object.hasOwnProperty(key) && typeof object[key] !== 'function') {
                        properties.push(key);
                    }
                }

                for (var i = 0; i < properties.length; i++) {
                    key = properties[i];
                    properties[i] = (typeof object[key] !== 'undefined' ? key + ": " + this.stringify(object[key]) : this.stringify(key));
                }

                returnString = "{ " + properties.toString() + " }";
            }

            return returnString;

        }

    }

}
