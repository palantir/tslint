// @Filename: exportEqualsModule_A.ts
module M {
	export var x;
}

export = M;

// @Filename: exportEqualsModule_B.ts
import modM = module("exportEqualsModule_A");

var n: number = modM.x;