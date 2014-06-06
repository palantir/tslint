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
