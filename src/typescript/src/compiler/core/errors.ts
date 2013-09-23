///<reference path='references.ts' />

module TypeScript {
    export class Errors {
        public static argument(argument: string, message?: string): Error {
            return new Error(message ?
                             getDiagnosticMessage(DiagnosticCode.Invalid_argument_0_1, [argument, message]) :
                             getDiagnosticMessage(DiagnosticCode.Invalid_argument_0, [argument]));
        }

        public static argumentOutOfRange(argument: string): Error {
            return new Error(getDiagnosticMessage(DiagnosticCode.Argument_out_of_range_0, [argument]));
        }

        public static argumentNull(argument: string): Error {
            return new Error(getDiagnosticMessage(DiagnosticCode.Argument_null_0, [argument]));
        }

        public static abstract(): Error {
            return new Error(getDiagnosticMessage(DiagnosticCode.Operation_not_implemented_properly_by_subclass, null));
        }

        public static notYetImplemented(): Error {
            return new Error(getDiagnosticMessage(DiagnosticCode.Not_yet_implemented, null));
        }

        public static invalidOperation(message?: string): Error {
            return new Error(message ?
                             getDiagnosticMessage(DiagnosticCode.Invalid_operation_0, [message]) :
                             getDiagnosticMessage(DiagnosticCode.Invalid_operation, null));
        }
    }
}