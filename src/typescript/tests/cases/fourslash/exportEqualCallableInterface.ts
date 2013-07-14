/// <reference path='fourslash.ts'/>

////declare module "test" {
////    interface x {
////        (): Date;
////        foo: string;
////    }
////    export = x;
////}

////import test = require('test');
////var t2: test;
////t2./**/

goTo.marker();
verify.completionListContains('apply');
verify.completionListContains('arguments');
verify.completionListContains('foo');
