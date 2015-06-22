var x = 3
a += b

c = () => {
}

d = function() { }

console.log("i am adam, am i?")

function xyz() {
    return
}

switch(xyz) {
    case 1:
        break
    case 2:
        continue
}

throw new Error("some error")

do {
    var a = 4
} while(x == 3)

debugger

import v = require("i")
module M {
    export var x
}

function useStrictMissingSemicolon() {
    "use strict"
    return null;
}

class MyClass {
    public name : string
    private index : number
    private email : string; // no error
}

interface ITest {
    foo?: string
    bar: number
    baz: boolean; // no error
}

import {Router} from 'aurelia-router'; // no error

import {Controller} from 'my-lib' // error
