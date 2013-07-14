/// <reference path='fourslash.ts'/>

////function fnc1() {
////    var bar = 1;
////    function foob(){ }
////}
////
////fnc1./**/

goTo.marker();
// bug 665591: Fourslash test doesn't get the completion list as we get manually
//verify.memberListContains('arguments', 'any');