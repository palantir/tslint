// bug 521684: generated code for ref.ts and ref.d.ts should be the same

///<reference path="ref.d.ts" />

// in the generated code a 'this' is added before this call
M1.f1();