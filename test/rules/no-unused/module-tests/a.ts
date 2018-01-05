[typescript]: >= 2.4.0
// Note: `user.ts` uses some of these exported symbols, but some are not used.

declare function use(...args: any[]): void;

// Detects implicit export of types -- So 'C' must be exported here.
export class C {}
export function f() { return new C(); }

// If used in a parameter or return type, consider it public.
export interface I {}
export interface J {}
export function g(i: I): J { return i; }

// As well as deeply nested in another type.
export interface K {}
export interface _ {
    _: {
        _: K;
    }
}

// But *not* inside the *body* of a function.
export interface L { readonly x: number }
                 ~ [noexport]
export function h(): number {
    const l: L = { x: 0 };
    return l.x;
}

// Value in `typeof` is also implicitly exported
export const s = "s";
export type T = typeof s;

// Used, but no need to export
export const x = 0;
             ~ [noexport]
use(x);

[noexport]: Analysis found no uses in other modules; this should not be exported.
