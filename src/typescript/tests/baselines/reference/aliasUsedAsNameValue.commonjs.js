var mod = require("module");
var b = require("Test2");

exports.a = function () {
    b.b(mod);
};

