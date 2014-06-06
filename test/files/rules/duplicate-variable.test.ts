var duplicated = 1;

class Test {
    private myFunc() {
        var notDuplicated = 123,
            duplicated = 234,
            someFunc = () => {
                var notDuplicated = 345;
            };

        var duplicated = null;
    }
}

function test() {
    var notDuplicated = 123,
        duplicated = 234,
        someFunc = () => {
            var notDuplicated = 345;
        };

    var duplicated = null;
}

duplicated = 2;
var duplicated = 3;

// valid code
module tmp {
    var path = require("path");
    export class MyType {
        path: string;
    }
}

module MyModule {
    export class ClassA {
        id: string;
    }

    export class ClassB {
        id: string;
    }
}

var a = {
    foo(): void {
        var bar = 1;
    },
    baz(): void {
        var bar = 1;
    }
};

class AccessorTest {
    get accesor1(): number {
        var x = 0;
        return x;
    }

    get accesor2(): number {
        var x = 0;
        return x;
    }

}

class NoDupConstructor {
    private test: string;
    constructor() {
        var test = "test";
        this.test = test;
    }
}

