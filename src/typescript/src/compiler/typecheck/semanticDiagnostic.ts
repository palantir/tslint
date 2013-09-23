// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='..\typescript.ts' />

module TypeScript {
    export function getDiagnosticsFromEnclosingDecl(enclosingDecl: PullDecl, errors: Diagnostic[]) {
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