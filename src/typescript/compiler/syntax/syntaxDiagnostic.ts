///<reference path='references.ts' />

module TypeScript {
    export class SyntaxDiagnostic extends Diagnostic {
        public static equals(diagnostic1: SyntaxDiagnostic, diagnostic2: SyntaxDiagnostic): boolean {
            return Diagnostic.equals(diagnostic1, diagnostic2);
        }
    }
}