/// <reference path='fourslash.ts'/>

////interface Collection<T, U> {
////    length: number;
////    add(x: T, y: U): void;
////    remove(x: T, y: U): boolean;
////}
////
////interface Combinators {
////    map<T, U>(c: Collection<T,U>, f: (x: T, y: U) => any): Collection<any, any>;
////    map<T, U, V>(c: Collection<T,U>, f: (x: T, y: U) => V): Collection<T, V>;
////}
////
////class A {
////    foo<T>(): T { return null; }
////}
////
////class B<T> {
////    foo(x: T): T { return null; }
////}
////
////var c1: Collection;
////var c2: Collection<number, string>;
////var c3: Collection<Collection<number, number>, string>;
////var c4: Collection<number, A>;
////var c5: Collection<number, B>;
////
////var _: Combinators;
////// param help on open paren for arg 2 should show 'number' not T or 'any'
////// x should be contextually typed to number
////var rf1 = (x: number, y: string) => { return x.toFixed() };
////var rf2 = (x: Collection<number,number>, y: string) => { return x.length };
////var rf3 = (x: number, y: A) => { return y.foo() };
////// BUG 684722
////var rf4 = <T>(x: number, y: B<T>) => { return y.foo<number>(1); };
////
////var r1a/*9*/  = _.ma/*1c*/p(c2, (x/*1a*/,y/*1b*/) => { return x.toFixed() });  // check quick info of map here
////var r1b/*10*/ = _.map(c2, rf1); 
////
////var r2a/*11*/ = _.map(c3, (x/*2a*/,y/*2b*/) => { return x.length }); 
////var r2b/*12*/ = _.map(c3, rf2); 
////
////var r3a/*13*/ = _.map(c4, (x/*3a*/,y/*3b*/) => { return y.foo() }); 
////var r3b/*14*/ = _.map(c4, rf3); 
////
////var r4a/*15*/ = _.map(c5, (x/*4a*/,y/*4b*/) => { return y.foo() }); 
////var r4b/*16*/ = _.map(c5, rf4); 
////
////var r5a/*17*/ = _.map<number, string, Date>(c2, (x/*5a*/,y/*5b*/) => { return x.toFixed() }); 
////var r5b/*18*/ = _.map<number, string, Date>(c2, rf1);
////
////var r6a/*19*/ = _.map<Collection<number, number>, string, Date>(c3, (x/*6a*/,y/*6b*/) => { return x.length });
////var r6b/*20*/ = _.map<Collection<number, number>, string, Date>(c3, rf2);
////
////var r7a/*21*/ = _.map<number, A, string>(c4, (x/*7a*/,y/*7b*/) => { return y.foo() });
////var r7b/*22*/ = _.map<number, A, string>(c4, rf3);
////
////var r8a/*23*/ = _.map<number, B, string>(c5, (x/*8a*/,y/*8b*/) => { return y.foo() }); 
////var r8b/*24*/ = _.map<number, B, string>(c5, rf4); 

goTo.marker('2a');
verify.quickInfoIs('Collection<number, number>');
goTo.marker('2b');
verify.quickInfoIs('string');

goTo.marker('3a');
verify.quickInfoIs('number');
goTo.marker('3b');
verify.quickInfoIs('A');

goTo.marker('4a');
verify.quickInfoIs('number');
goTo.marker('4b');
verify.quickInfoIs('B<any>');

goTo.marker('5a');
verify.quickInfoIs('number');
goTo.marker('5b');
verify.quickInfoIs('string');

goTo.marker('6a');
verify.quickInfoIs('Collection<number, number>');
goTo.marker('6b');
verify.quickInfoIs('string');

goTo.marker('7a');
verify.quickInfoIs('number');
goTo.marker('7b');
verify.quickInfoIs('A');

goTo.marker('8a');
verify.quickInfoIs('number');
goTo.marker('8b');
verify.quickInfoIs('B<T>');

// BUG 684828
goTo.marker('9');
verify.quickInfoIs('Collection<any, any>');
goTo.marker('10');
// BUG 684805
verify.quickInfoIs('Collection<number, string>');
goTo.marker('11');
verify.quickInfoIs('Collection<Collection<number, number>, number>');
goTo.marker('12');
verify.quickInfoIs('Collection<Collection<number, number>, number>');
goTo.marker('13');
verify.quickInfoIs('Collection<any, any>');
goTo.marker('14');
verify.quickInfoIs('Collection<any, any>');
goTo.marker('15');
verify.quickInfoIs('Collection<any, any>');
goTo.marker('16');
verify.quickInfoIs('Collection<any, any>');

// BUG 684803
goTo.marker('17');
// verify.quickInfoIs('Collection<number, string, Date>');

// BUG 684803
goTo.marker('18');
// verify.quickInfoIs('Collection<number, string, Date>');

goTo.marker('19');
// verify.quickInfoIs('Collection<Collection<number, number>, string, Date>');

goTo.marker('20');
// verify.quickInfoIs('Collection<Collection<number, number>, string, Date');

goTo.marker('21');
// Bug: 689228
// verify.quickInfoIs('Collection<number, string>');

goTo.marker('22');
verify.quickInfoIs('Collection<number, string>');

goTo.marker('23');
// Bug: 689228
//verify.quickInfoIs('Collection<number, string>');

goTo.marker('24');

// Bug: 689228
// verify.quickInfoIs('Collection<number, string>');