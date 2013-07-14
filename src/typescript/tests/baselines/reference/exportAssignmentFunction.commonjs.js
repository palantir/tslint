////[exportEqualsFunction_A.js]
function foo() {
    return 0;
}


module.exports = foo;


////[exportEqualsFunction_B.js]
var fooFunc = require("./exportEqualsFunction_A");

var n = fooFunc();

