// valid case
var b = (a: number) => {};
var c = (a, b) => {};
var f = (...rest) => {};
var f = a: number => {}; // TSLint don't warn. But syntax is wrong.
var bar = <T>(method: () => T) => {
    method();
};
var barbar = <T>(method: (a: any) => T) => {
    method("");
};
var barbarbar = <T>(method: (a) => T) => {
    method("");
};
var piyo = <T, U>(method: () => T) => {
    method();
};
const validAsync = async (param: any) => {};
const validAsync = async (param) => {};

var e = (a => {})(1);
var f = ab => {};

// invalid case
var a = (a) => {};
         ~         [Parentheses are prohibited around the parameter in this single parameter arrow function]
