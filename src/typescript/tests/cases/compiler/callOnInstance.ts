declare function D(): string;

declare class D { constructor (value: number); }

var s1: string = D(); // OK

var s2: string = (new D(1))(); // Should be an error
