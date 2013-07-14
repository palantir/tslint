/// <reference path="fourslash.ts" />

////"a"./**/

goTo.marker();
debugger;
verify.not.memberListContains('alert');
//verify.memberListContains('charAt');