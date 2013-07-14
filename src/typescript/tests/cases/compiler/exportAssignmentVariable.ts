// @Filename: exportEqualsVar_A.ts
var x = 0;

export = x;

// @Filename: exportEqualsVar_B.ts
import y = module("exportEqualsVar_A");

var n: number = y;