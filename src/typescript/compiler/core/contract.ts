///<reference path='references.ts' />

module TypeScript {
    export class Contract {
        public static requires(expression: boolean): void {
            if (!expression) {
                throw new Error("Contract violated. False expression.");
            }
        }

        public static throwIfFalse(expression: boolean): void {
            if (!expression) {
                throw new Error("Contract violated. False expression.");
            }
        }

        public static throwIfNull(value: any): void {
            if (value === null) {
                throw new Error("Contract violated. Null value.");
            }
        }
    }
}