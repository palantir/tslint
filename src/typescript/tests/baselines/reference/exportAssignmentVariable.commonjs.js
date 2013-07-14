////[exportEqualsVar_A.js]
var x = 0;


module.exports = x;


////[exportEqualsVar_B.js]
var y = require("./exportEqualsVar_A");

var n = y;

