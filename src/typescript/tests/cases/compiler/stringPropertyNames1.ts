interface foo {
    "foo bar": string;
}

var f: foo;
var r = f['foo bar'];

class bar {
    'hello world': number;
    'test-property': string;
    '1': string;
    constructor() {
        bar['hello world'] = 3;
    }
}

var b: bar;
var r2 = b["hello world"];
var r3 = b["test-property"];
var r4 = b['1'];
var r5 = b[1];
