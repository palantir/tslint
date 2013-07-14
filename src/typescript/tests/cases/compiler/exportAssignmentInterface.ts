// @Filename: exportEqualsInterface_A.ts
interface A {
	p1: number;
}

export = A;

// @Filename: exportEqualsInterface_B.ts
import I1 = module("exportEqualsInterface_A");

var i: I1;

var n: number = i.p1;