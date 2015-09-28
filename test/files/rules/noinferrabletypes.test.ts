// errors, inferrable type is declared
let x: number = 7;
let y: boolean = false;
let z: string = "foo";

// errors, types are inferrable
function foo (a: number = 5, b: boolean = true, c: string = "bah") { }

// not errors, inferrable type is not declared
let _x = 7;
let _y = false;
let _z = "foo";

// not error, type is not inferrable
let weird: any = 123;

// not errors, inferrable type is not declared
function bar(a = 5, b = true, c = "bah") { }

// not errors, types are not inferrable
function baz(a: any = 5, b: any = true, c: any = "bah") { }
