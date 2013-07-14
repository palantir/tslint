// @declaration: true
var simpleVar;

var anotherVar: any;
var varWithSimpleType: number;
var varWithArrayType: number[];

var varWithInitialValue = 30;

var withComplicatedValue = { x: 30, y: 70, desc: "position" };

declare var declaredVar;
declare var declareVar2

declare var declaredVar;
declare var deckareVarWithType: number;

var arrayVar: string[] = ['a', 'b'];


function simpleFunction() {
    return {
        x: "Hello",
        y: "word",
        n: 2
    };
}

module m1 {
    export function foo() {
        return "Hello";
    }
}


declare module "m1" {
    class A {
    }
}

import m3 = require("m1");

var b = new m3.A();