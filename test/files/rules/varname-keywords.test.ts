let undefined = 8;
let boolean: boolean;
function bad(any: any) { }
let [number] = [3];
let {String} = {String: 1};

// good:
let foo = 2;
let bar: any;
function good(baz: any) { }
let [faz] = [5];
const {pom} = {pom: 5};

interface Wob {
    number: string;
}

