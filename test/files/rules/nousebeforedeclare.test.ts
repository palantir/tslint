$.x = 3; // failure on '$'
import $ = require("$");
var vara = varb, varb; // failure on 'varb'

class Test {
    constructor() {
        this.a = 3;
    }

    private a: number;
}

var i = j; // failure on 'j'

class ClassA {
    prop: number;
    constructor(object: ClassB) {
        this.prop = object.prop;
    }
}

class ClassB {
    prop: number;
}

var j: number;

if (something) {
    var defined = 1;
} else {
    var defined;
}

function testUndeclaredImports() {
    console.log(foo1); // failure on 'foo1'
    console.log(foo2); // failure on 'foo2'
    console.log(foo3); // failure on 'foo3'
    map([], (x) => x); // failure on 'map'
}

import { default as foo1 } from "lib";
import foo2 from "lib";
import _, { map, foldl } from "underscore";
import * as foo3 from "lib";
