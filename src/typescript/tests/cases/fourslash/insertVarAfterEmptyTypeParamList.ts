/// <reference path="fourslash.ts" />

//// class Dictionary<> { }
//// var x;
//// /**/

goTo.marker();

// Bug 664967: Adding a second var after a class with a missing type parameter makes the parse error go away
// edit.insert("var y;\n");
