/// <reference path='fourslash.ts' />

/////** ExtMod - contains m1*/
////declare module /*1*/"extMod" {
////    /** ModuleComment*/
////    module m/*2*/1 {
////        /** b's comment*/
////        export var b: number;
////        /** m2 comments*/
////        export module m2 {
////            /** class comment;*/
////            export class c {
////            };
////            /** i*/
////            export var i: c;;
////        }
////        /** exported function*/
////        export function fooExport(): number;
////    }
////}
/////** Import declaration*/
////import e/*3*/xtMod = module("e/*4*/xtMod");
/////*5*/extMod./*6*/m1./*7*/fooEx/*8q*/port(/*8*/);
////var new/*9*/Var = new extMod.m1.m2./*10*/c();

goTo.marker('1');
verify.quickInfoIs("extMod", "ExtMod - contains m1", "extMod", "module");

goTo.marker('2');
verify.quickInfoIs("m1", "ModuleComment", "extMod.m1", "module");

goTo.marker('3');
verify.quickInfoIs("extMod", "Import declaration", "extMod", "module");

goTo.marker('4');
verify.quickInfoIs("extMod", "ExtMod - contains m1", "extMod", "module");

// Completion list now show both the external module and the import decalaration at both locations, the
// correct behaviour is to show the value as the import and the type as the container.
//goTo.marker('5');
//verify.completionListContains("extMod", "extMod", "Import declaration", "extMod", "module");

goTo.marker('6');
verify.memberListContains("m1", "extMod.m1");

goTo.marker('7');
verify.memberListContains("b", "number", "b's comment", "extMod.m1.b", "var");
verify.memberListContains("fooExport", "(): number", "exported function", "extMod.m1.fooExport", "function");
verify.memberListContains("m2", "extMod.m1.m2");

goTo.marker('8');
verify.currentSignatureHelpDocCommentIs("exported function");
goTo.marker('8q');
verify.quickInfoIs("(): number", "exported function", "extMod.m1.fooExport", "function");

goTo.marker('9');
verify.quickInfoIs("extMod.m1.m2.c", "", "newVar", "var");

goTo.marker('10');
verify.memberListContains("c", undefined, "class comment;", "extMod.m1.m2.c", "class");
verify.memberListContains("i", "extMod.m1.m2.c", "i", "extMod.m1.m2.i", "var");