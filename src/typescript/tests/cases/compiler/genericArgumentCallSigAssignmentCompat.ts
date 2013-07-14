module Underscore {
    export interface Iterator<T, U> {
        (value: T, index: any, list: any): U;
    }
 
    export interface Static {
        all<T>(list: T[], iterator?: Iterator<T, boolean>, context?: any): boolean;
        identity<T>(value: T): T;
    }
}
 
declare var _: Underscore.Static;
 
// Correct -> Error: Call signatures of types '<T>(value: T) => T' and 'Underscore.Iterator<{}, boolean>' are incompatible.
_.all([true, 1, null, 'yes'], _.identity);
 
// Incorrect -> Error: Call signatures of types '<T>(value: T) => T' and 'Underscore.Iterator<boolean, boolean>' are incompatible.
_.all([true], _.identity);
