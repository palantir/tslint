class bar {
    'hello world': number;
    'test-property': string;
    '1': string;
    constructor() {
        bar['hello world'] = 3;
        bar['test-property'] = 3; // no error while the indexer doesn't prefer property name lookups over Object's indexer
    }
}

var b: bar;
// errors on these:
var r6 = b."hello world";
var r7 = b.1;
var r8 = b."1";