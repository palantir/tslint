///<reference path='references.ts' />

module TypeScript {
    export class Debug {
        public static assert(expression: boolean, message?: string): void {
            if (!expression) {
                throw new Error("Debug Failure. False expression: " + (message ? message : ""));
            }
        }
    }
}