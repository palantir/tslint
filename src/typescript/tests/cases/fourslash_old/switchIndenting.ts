/// <reference path='fourslash.ts' />

////switch (null) {
////    case 0:
////        /**/
////}

goTo.marker();
edit.insert('case 1:\n');

// Formatting of switch statements indents correctly as you type
verify.smartIndentLevelIs(2);
