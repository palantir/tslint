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

