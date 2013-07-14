/// <reference path='fourslash.ts'/>

////class A<T> {
////    static B<S>(v: A<S>): A<S>;
////    static B<S>(v: S): A<S>;
////    static B<S>(v: any): A<S> {
////        return null;
////    }
////}

////var a = new A<number>();
////A.B(/**/

goTo.marker();
verify.currentSignatureHelpIs('B<S>(v: A<S>): A<S>')
// BUG 701161
//edit.insert('a');
//verify.currentSignatureHelpIs('B<S>(v: A<S>): A<S>');
