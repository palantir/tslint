///<reference path='references.ts' />

module TypeScript {
    export class ArrayUtilities {
        public static isArray(value: any): boolean {
            return Object.prototype.toString.apply(value, []) === '[object Array]';
        }

        public static sequenceEquals(array1: any[], array2: any[], equals: (v1, v2) => boolean) {
            if (array1 === array2) {
                return true;
            }

            if (array1 === null || array2 === null) {
                return false;
            }

            if (array1.length !== array2.length) {
                return false;
            }

            for (var i = 0, n = array1.length; i < n; i++) {
                if (!equals(array1[i], array2[i])) {
                    return false;
                }
            }

            return true;
        }

        public static contains(array: any[], value: any): boolean {
            for (var i = 0; i < array.length; i++) {
                if (array[i] === value) {
                    return true;
                }
            }

            return false;
        }

        public static groupBy(array: any[], func: (v: any) => string): any {
            var result = {};

            for (var i = 0, n = array.length; i < n; i++) {
                var v = array[i];
                var k = func(v);

                var list = result[k] || [];
                list.push(v);
                result[k] = list;
            }

            return result;
        }

        public static min(array: any[], func: (v: any) => number): number {
            // Debug.assert(array.length > 0);
            var min = func(array[0]);

            for (var i = 1; i < array.length; i++) {
                var next = func(array[i]);
                if (next < min) {
                    min = next;
                }
            }

            return min;
        }

        public static max(array: any[], func: (v: any) => number): number {
            // Debug.assert(array.length > 0);
            var max = func(array[0]);

            for (var i = 1; i < array.length; i++) {
                var next = func(array[i]);
                if (next > max) {
                    max = next;
                }
            }

            return max;
        }

        public static last(array: any[]) {
            if (array.length === 0) {
                throw Errors.argumentOutOfRange('array');
            }

            return array[array.length - 1];
        }

        public static firstOrDefault(array: any[], func: (v: any) => boolean): any {
            for (var i = 0, n = array.length; i < n; i++) {
                var value = array[i];
                if (func(value)) {
                    return value;
                }
            }

            return null;
        }

        public static sum(array: any[], func: (v: any) => number): number {
            var result = 0;

            for (var i = 0, n = array.length; i < n; i++) {
                result += func(array[i]);
            }

            return result;
        }

        public static whereNotNull(array: any[]): any[] {
            var result = [];
            for (var i = 0; i < array.length; i++) {
                var value = array[i];
                if (value !== null) {
                    result.push(value);
                }
            }

            return result;
        }

        public static select(values: any[], func: (v: any) => any): any[] {
            var result = [];

            for (var i = 0; i < values.length; i++) {
                result.push(func(values[i]));
            }

            return result;
        }

        public static where(values: any[], func: (v: any) => boolean): any[] {
            var result = [];

            for (var i = 0; i < values.length; i++) {
                if (func(values[i])) {
                    result.push(values[i]);
                }
            }

            return result;
        }

        public static any(array: any[], func: (v: any) => boolean): boolean {
            for (var i = 0, n = array.length; i < n; i++) {
                if (func(array[i])) {
                    return true;
                }
            }

            return false;
        }

        public static all(array: any[], func: (v: any) => boolean): boolean {
            for (var i = 0, n = array.length; i < n; i++) {
                if (!func(array[i])) {
                    return false;
                }
            }

            return true;
        }

        public static binarySearch(array: number[], value: number): number {
            var low = 0;
            var high = array.length - 1;

            while (low <= high) {
                var middle = low + ((high - low) >> 1);
                var midValue = array[middle];

                if (midValue === value) {
                    return middle;
                }
                else if (midValue > value) {
                    high = middle - 1;
                }
                else {
                    low = middle + 1;
                }
            }

            return ~low;
        }

        public static createArray(length: number, defaultvalue: any): any[] {
            var result = [];
            for (var i = 0; i < length; i++) {
                result.push(defaultvalue);
            }

            return result;
        }

        public static grow(array: any[], length: number, defaultValue: any): void {
            var count = length - array.length;
            for (var i = 0; i < count; i++) {
                array.push(defaultValue);
            }
        }

        public static copy(sourceArray: any[], sourceIndex: number, destinationArray: any[], destinationIndex: number, length: number): void {
            for (var i = 0; i < length; i++) {
                destinationArray[destinationIndex + i] = sourceArray[sourceIndex + i];
            }
        }
    }
}