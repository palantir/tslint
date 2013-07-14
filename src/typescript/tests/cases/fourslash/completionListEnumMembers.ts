/// <reference path='fourslash.ts' />

//lib.d.ts
////interface Number {
////    toString(radix?: number): string;
////    toFixed(fractionDigits?: number): string;
////    toExponential(fractionDigits?: number): string;
////    toPrecision(precision: number): string;
////}

////enum Foo {
////    bar,
////    baz
////}
////
////var v = Foo./*valueReference*/ba;
////var t :Foo./*typeReference*/ba;
////Foo.bar./*enumValueReference*/;

goTo.marker('valueReference');
verify.memberListContains("bar");
verify.memberListContains("baz");
verify.memberListCount(2);


goTo.marker('typeReference');
verify.memberListContains("bar");
verify.memberListContains("baz");
verify.memberListCount(2);


goTo.marker('enumValueReference');
verify.memberListContains("toString");
verify.memberListContains("toFixed");
verify.memberListCount(4);


