// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='..\typescript.ts' />

module TypeScript {

    // pull errors are declared at a specific offset from a given decl
    // adjustedOffset is set when the error is added to a decl
    export class SemanticDiagnostic extends Diagnostic {
        public static equals(diagnostic1: SemanticDiagnostic, diagnostic2: SemanticDiagnostic): boolean {
            return Diagnostic.equals(diagnostic1, diagnostic2);
        }
    }

    export function getDiagnosticsFromEnclosingDecl(enclosingDecl: PullDecl, errors: IDiagnostic[]) {
        var declErrors = enclosingDecl.getDiagnostics();

        if (declErrors) {
            for (var i = 0; i < declErrors.length; i++) {
                errors[errors.length] = declErrors[i];
            }
        }

        var childDecls = enclosingDecl.getChildDecls();

        for (var i = 0; i < childDecls.length; i++) {
            getDiagnosticsFromEnclosingDecl(childDecls[i], errors);
        }
    }
}