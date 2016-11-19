// valid case
var a = (a) => {};
var b = (a: number) => {};
var c = (a, b) => {};
var f = (...rest) => {};
var f = a: number => {}; // TSLint don't warn. But syntax is wrong.
class Foo {
    a: (a) =>{}
}
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

// invalid case
var e = (a => {})(1);
         ~            [Parentheses are required around the parameters of an arrow function definition]
var f = ab => {};
        ~~             [Parentheses are required around the parameters of an arrow function definition]
