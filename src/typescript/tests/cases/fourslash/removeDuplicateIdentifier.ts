/// <reference path="fourslash.ts" />

////class foo{}
////function foo() { return null; }

goTo.bof();
// Bug 687151 - "duplicate identifier" error doesn't go away after deleting the offending object
// edit.deleteAtCaret("class foo{}".length);
