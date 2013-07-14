// @Filename: exportEqualsEnum_A.ts
enum E {
	A,
	B,
	C,
}

export = E;

// @Filename: exportEqualsEnum_B.ts
import EnumE = module("exportEqualsEnum_A");

var a = EnumE.A;
var b = EnumE.B;
var c = EnumE.C;