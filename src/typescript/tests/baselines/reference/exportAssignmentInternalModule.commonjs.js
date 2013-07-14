////[exportEqualsModule_A.js]
var M;
(function (M) {
    M.x;
})(M || (M = {}));


module.exports = M;


////[exportEqualsModule_B.js]
var modM = require("./exportEqualsModule_A");

var n = modM.x;

