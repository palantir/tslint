declare function foo(): void;

function testDoubleQuotes() {
    // hello
    "use strict"; // bye

    var i = 3;
}

function testSingleQuotes() {
    'use strict';
}

function testNoUseStrict() {
}

module TestModule {
    // hello
    "use strict"; // bye

    var i = 3;
}

module TestNoUseStrictModule {
    // hello
    var i = 3;
}

function checkDepth() {
    "use strict";

    function innerFunction() {

    }
}

module TestModuleWithFunction {
    "use strict";

    function hello() {
        // there shouldn't be a failure here since it isn't top level
    }
}

declare module foo {
    // shouldn't error because of the declare
    export class bar {
    }
}