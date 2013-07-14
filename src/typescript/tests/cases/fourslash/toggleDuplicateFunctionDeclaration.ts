/// <reference path="fourslash.ts" />

//// class D { }
//// D();

var funcDecl = 'declare function D();';

goTo.bof();
// Bug 673244: Adding duplicate function declaration of class name doesn't result in incremental error
// edit.insert(funcDecl);

goTo.bof();
// edit.deleteAtCaret(funcDecl.length);
