/// <reference path="fourslash.ts"/>

/////*file1*/
////(function() {
////    // this should not be included
////    var x = 0;
////
////    // this should not be included either
////    function foo() {
////
////    }
////})();

goTo.marker("file1");
verify.navigationItemsCount(0);


/////*file2*/
////var x = function() {
////    // this should not be included
////    var x = 0;
////    
////    // this should not be included either
////    function foo() {
////};

goTo.marker("file2");
verify.navigationItemsCount(1);


// Named functions should still show up
/////*file3*/
////function foo() {
////}
////function bar() {
////}

goTo.marker("file3");
verify.navigationItemsCount(2);