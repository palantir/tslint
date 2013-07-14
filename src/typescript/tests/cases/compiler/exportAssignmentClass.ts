// @Filename: exportEqualsClass_A.ts
class C { public p = 0; }

export = C;

// @Filename: exportEqualsClass_B.ts
import D = module("exportEqualsClass_A");

var d = new D();
var x = d.p;