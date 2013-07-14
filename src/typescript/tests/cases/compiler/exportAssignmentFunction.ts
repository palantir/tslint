// @Filename: exportEqualsFunction_A.ts
function foo() { return 0; }

export = foo;

// @Filename: exportEqualsFunction_B.ts
import fooFunc = module("exportEqualsFunction_A");

var n: number = fooFunc();