var simpleVar;

var anotherVar;
var varWithSimpleType;
var varWithArrayType;

var varWithInitialValue = 30;

var withComplicatedValue = { x: 30, y: 70, desc: "position" };

var arrayVar = ['a', 'b'];

function simpleFunction() {
    return {
        x: "Hello",
        y: "word",
        n: 2
    };
}

var m1;
(function (m1) {
    function foo() {
        return "Hello";
    }
    m1.foo = foo;
})(m1 || (m1 = {}));

var m3 = require("m1");

var b = new m3.A();

