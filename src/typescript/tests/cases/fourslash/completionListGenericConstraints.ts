/// <reference path="fourslash.ts" />

////// lib.d.ts
////interface Object {
////    toString(): string;
////    toLocaleString(): string;
////    valueOf(): Object;
////    hasOwnProperty(v: string): boolean;
////    isPrototypeOf(v: Object): boolean;
////    propertyIsEnumerable(v: string): boolean;
////    [s: string]: any;
////}
////
////interface Function {
////    apply(thisArg: any, argArray?: any): any;
////    call(thisArg: any, ...argArray: any[]): any;
////    bind(thisArg: any, ...argArray: any[]): any;
////    prototype: any;
////    length: number;
////    // Non-standard extensions
////    arguments: any;
////    caller: Function;
////}


////// Simple constraint
////class Foo<T extends Object> {
////    private v: T;
////    public value(): void {
////        this.v./*objectMembers*/
////    }
////}

goTo.marker("objectMembers");
verify.memberListContains("hasOwnProperty");
verify.memberListContains("isPrototypeOf");
verify.memberListContains("toString");

////// Inheritance in constraints
////interface IBar1 {
////    bar11: number;
////    bar12: string;
////}
////
////interface IBar2  extends IBar1 {
////    bar21: boolean;
////    bar22: IBar2;
////}
////
////class BarWrapper<T extends IBar2> {
////    private value: T;
////    public getValue(){
////        this.value./*interfaceMembers*/;
////    }
////}

goTo.marker("interfaceMembers");
verify.memberListContains("bar11");
verify.memberListContains("bar12");
verify.memberListContains("bar21");
verify.memberListContains("bar22");


////// Interface with call signature
////interface ICallable {
////    (n: number): string;
////    name: string;
////}
////
////class CallableWrapper<T extends ICallable> {
////    public call(value: T) {
////        value./*callableMembers*/        
////    }
////}

goTo.marker("callableMembers");
verify.memberListContains("name");
verify.memberListContains("apply");
verify.memberListContains("call");
verify.memberListContains("bind");


////// Only public members of a constraint should be shown
////class Base {
////    public publicProperty: number;
////    private privateProperty: number;
////    public publicMethod(): void { }
////    private privateMethod(): void { }
////    public static publicStaticMethod(): void { }
////    private static privateStaticMethod(): void { }
////}
////
////class BaseWrapper<T extends Base> {
////    public test(value: T) {
////        value./*publicOnlyMemebers*/
////    }
////}

goTo.marker("publicOnlyMemebers");
verify.memberListContains("publicProperty");
verify.memberListContains("publicMethod");
verify.not.memberListContains("privateProperty");
verify.not.memberListContains("privateMethod");
verify.not.memberListContains("publicStaticMethod");
verify.not.memberListContains("privateStaticMethod");