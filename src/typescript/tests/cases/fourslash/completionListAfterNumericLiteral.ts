/// <reference path='fourslash.ts' />

// lib.d.ts
////interface Number {
////    toString(radix?: number): string;
////    toFixed(fractionDigits?: number): string;
////    toExponential(fractionDigits?: number): string;
////    toPrecision(precision: number): string;
////}

////0./*dotOnNumberExrpressions1*/

goTo.marker("dotOnNumberExrpressions1");
verify.completionListIsEmpty();


////0.0./*dotOnNumberExrpressions2*/

goTo.marker("dotOnNumberExrpressions2");
verify.completionListIsEmpty();


////0.0.0./*dotOnNumberExrpressions3*/

goTo.marker("dotOnNumberExrpressions3");
verify.completionListIsEmpty();


////0./** comment *//*dotOnNumberExrpressions4*/

goTo.marker("dotOnNumberExrpressions4");
verify.completionListIsEmpty();


////(0)./*validDotOnNumberExrpressions1*/

goTo.marker("validDotOnNumberExrpressions1");
verify.completionListContains("toExponential");


////(0.)./*validDotOnNumberExrpressions2*/

goTo.marker("validDotOnNumberExrpressions2");
verify.completionListContains("toExponential");


////(0.0)./*validDotOnNumberExrpressions3*/

goTo.marker("validDotOnNumberExrpressions3");
verify.completionListContains("toExponential");
