/// <reference path="./typescriptServices.d.ts" />

declare module ts {
    function computeLineStarts(text: string): number[];
}
