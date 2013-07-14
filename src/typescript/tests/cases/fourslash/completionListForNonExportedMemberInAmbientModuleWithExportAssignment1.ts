/// <reference path="fourslash.ts"/>

//// declare module "test" {
////     var x: Date;
////     export = x;
//// }
//// 
//// import test = require("test");
//// test./**/
////

goTo.marker();
verify.not.memberListContains("x");