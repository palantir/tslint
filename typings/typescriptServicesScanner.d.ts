/// <reference path="./typescriptServices.d.ts" />

declare module ts {
    /** Creates a scanner over a (possibly unspecified) range of a piece of text. */
    function createScanner(languageVersion: ScriptTarget, skipTrivia: boolean, languageVariant: ts.LanguageVariant, text?: string, onError?: ErrorCallback, start?: number, length?: number): Scanner;
}
