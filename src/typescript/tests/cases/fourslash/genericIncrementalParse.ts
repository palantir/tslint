/// <reference path='fourslash.ts' />


//// class C<T, U extends T> {
////     constructor() { }
////     foo(a: T) {
////     }
//// }
//// 
//// interface I1 {
////     a: number;
//// };
//// 
//// interface I2 {
////     a: number;
////     b: string;
//// }
//// 
//// var x = new C< { a: number; }, { a: number; b: string; }>();
//// var y = new C<I1, I2>();
//// /*1*/

verify.numberOfErrorsInCurrentFile(0);

goTo.marker("1");
edit.insert("var z = new C < I2");
verify.numberOfErrorsInCurrentFile(2);

edit.insert(",I1>()");
verify.numberOfErrorsInCurrentFile(2);
