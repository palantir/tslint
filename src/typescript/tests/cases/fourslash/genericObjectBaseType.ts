/// <reference path='fourslash.ts' />

// @Filename: lib.d.ts
//// interface Object {
////     /** Returns a string representation of an object. */
////     toString(): string;
//// }
//// 
//// var Object: {
////     new (value?: any): Object;
////     (): any;
////     (value: any): any;
//// 
////     /** A reference to the prototype for a class of objects. */
////     prototype: Object;
//// }

// @Filename: file1.ts
//// class C<T> {
////     constructor(){}
////     foo(a: T) {
////         return a.toString();
////     }
//// }
//// var x = new C<string>();
//// var y: string = x.foo("hi");
//// /*1*/

goTo.marker('1');
//debug.printCurrentFileState();
//debug.printErrorList();
verify.numberOfErrorsInCurrentFile(0);
