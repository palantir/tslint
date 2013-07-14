///<reference path='references.ts' />

module TypeScript {
    export interface IDiagnostic {
        fileName(): string;
        start(): number;
        length(): number;
        diagnosticCode(): DiagnosticCode;
        text(): string;
        message(): string;
    }

    export class Diagnostic implements IDiagnostic {
        private _fileName: string;
        private _start: number;
        private _originalStart: number;
        private _length: number;
        private _diagnosticCode: DiagnosticCode;
        private _arguments: any[];

        constructor(fileName: string, start: number, length: number, diagnosticCode: DiagnosticCode, arguments: any[] = null) {
            this._diagnosticCode = diagnosticCode;
            this._arguments = (arguments && arguments.length > 0) ? arguments : null;
            this._fileName = fileName;
            this._originalStart = this._start = start;
            this._length = length;
        }

        public toJSON(key) {
            var result: any = {};
            result.start = this.start();
            result.length = this.length();

            result.diagnosticCode = DiagnosticCode[this.diagnosticCode()];

            var arguments = (<any>this).arguments();
            if (arguments && arguments.length > 0) {
                result.arguments = arguments;
            }

            return result;
        }

        public fileName(): string {
            return this._fileName;
        }

        public start(): number {
            return this._start;
        }

        public length(): number {
            return this._length;
        }

        public diagnosticCode(): DiagnosticCode {
            return this._diagnosticCode;
        }

        public arguments(): any[] {
            return this._arguments;
        }

        /// <summary>
        /// Get the text of the message in the given language.
        /// </summary>
        public text(): string {
            return TypeScript.getDiagnosticText(this._diagnosticCode, this._arguments);
        }

        /// <summary>
        /// Get the text of the message including the error code in the given language.
        /// </summary>
        public message(): string {
            return TypeScript.getDiagnosticMessage(this._diagnosticCode, this._arguments);
        }

        public adjustOffset(pos: number) {
            this._start = this._originalStart + pos;
        }

        /// <summary>
        /// If a derived class has additional information about other referenced symbols, it can
        /// expose the locations of those symbols in a general way, so they can be reported along
        /// with the error.
        /// </summary>
        public additionalLocations(): Location[] {
            return [];
        }

        public static equals(diagnostic1: Diagnostic, diagnostic2: Diagnostic): boolean {
            return diagnostic1._fileName === diagnostic2._fileName &&
                diagnostic1._start === diagnostic2._start &&
                diagnostic1._length === diagnostic2._length &&
                diagnostic1._diagnosticCode === diagnostic2._diagnosticCode &&
                ArrayUtilities.sequenceEquals(diagnostic1._arguments, diagnostic2._arguments, (v1, v2) => v1 === v2);
        }
    }

    function getLargestIndex(diagnostic: string): number {
        var largest = -1;
        var stringComponents = diagnostic.split("_");

        for (var i = 0; i < stringComponents.length; i++) {
            var val = parseInt(stringComponents[i]);
            if (!isNaN(val) && val > largest) {
                largest = val;
            }
        }

        return largest;
    }

    export function getDiagnosticInfoFromCode(diagnosticCode: DiagnosticCode): DiagnosticInfo {
        var diagnosticName: string = DiagnosticCode[diagnosticCode];
        return <DiagnosticInfo>diagnosticMessages[diagnosticName];
    }

    export function getDiagnosticText(diagnosticCode: DiagnosticCode, args: any[]): string {
        var diagnosticName: string = DiagnosticCode[diagnosticCode];

        var diagnostic = <DiagnosticInfo>diagnosticMessages[diagnosticName];

        var actualCount = args ? args.length : 0;
        if (!diagnostic) {
            throw new Error("Invalid diagnostic");
        }
        else {
            // We have a string like "foo_0_bar_1".  We want to find the largest integer there.
            // (i.e.'1').  We then need one more arg than that to be correct.
            var expectedCount = 1 + getLargestIndex(diagnosticName);

            if (expectedCount !== actualCount) {
                throw new Error("Expected " + expectedCount + " arguments to diagnostic, got " + actualCount + " instead");
            }
        }

        var diagnosticMessageText = diagnostic.message.replace(/{({(\d+)})?TB}/g, function (match, p1, num) {
            var tabChar = "\t";
            var result = tabChar;
            if (num && args[num]) {
                for (var i = 1; i < <number>args[num]; i++) {
                    result += tabChar;
                }
            }

            return result;
        } );


        diagnosticMessageText = diagnosticMessageText.replace(/{(\d+)}/g, function (match, num) {
            return typeof args[num] !== 'undefined'
                ? args[num]
                : match;
        } );

        diagnosticMessageText = diagnosticMessageText.replace(/{(NL)}/g, function (match) {
            return "\r\n";
        } );

        return diagnosticMessageText;
    }

    export function getDiagnosticMessage(diagnosticCode: DiagnosticCode, args: any[]): string {
        var diagnostic = getDiagnosticInfoFromCode(diagnosticCode);
        var diagnosticMessageText = getDiagnosticText(diagnosticCode, args);

        var message: string;
        if (diagnostic.category === DiagnosticCategory.Error) {
            message = getDiagnosticText(DiagnosticCode.error_TS_0__1, [diagnostic.code, diagnosticMessageText]);
        } else if (diagnostic.category === DiagnosticCategory.Warning) {
            message = getDiagnosticText(DiagnosticCode.warning_TS_0__1, [diagnostic.code, diagnosticMessageText]);
        } else {
            message = diagnosticMessageText;
        }

        return message;
    }
}