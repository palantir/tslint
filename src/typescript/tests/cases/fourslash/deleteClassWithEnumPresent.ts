///<reference path="fourslash.ts"/>

////enum Foo { a, b, c }
/////**/class Bar { }

goTo.marker();
edit.deleteAtCaret('class Bar { }'.length);
verify.navigationItemsListContains('Foo', 'enum', 'file_0.ts', '');