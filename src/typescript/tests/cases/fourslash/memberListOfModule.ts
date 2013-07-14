/// <reference path='fourslash.ts' />

////module Foo {
////  export class Bar {
////
////  }
////
////
////  export module Blah {
////
////  }
////}
////
////var x: Foo./**/

goTo.marker();
// bug 671687: wrong number of member list entries
//verify.memberListCount(2);
verify.memberListContains('Bar');
verify.memberListContains('Blah');