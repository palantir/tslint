/// <reference path="fourslash.ts" />

// What's the deal with bug 662364 here? If the line between 
// the class and the interface is removed, the 
// quick info verification at the last line of
// the test fails

//// interface Intersection {
////     dist: number;
//// }
//// /*interfaceGoesHere*/
//// class /*className*/Sphere {
////     constructor(private center) {
////     }
//// }

goTo.marker('className');
verify.quickInfoSymbolNameIs('Sphere');

goTo.marker('interfaceGoesHere');
edit.insert("\r\ninterface Surface {\r\n    reflect: () => number;\r\n}\r\n");

goTo.marker('className');
verify.quickInfoSymbolNameIs('Sphere');
