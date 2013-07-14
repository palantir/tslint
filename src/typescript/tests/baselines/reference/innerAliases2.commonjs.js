var _provider;
(function (_provider) {
    var UsefulClass = (function () {
        function UsefulClass() {
        }
        UsefulClass.prototype.foo = function () {
        };
        return UsefulClass;
    })();
    _provider.UsefulClass = UsefulClass;
})(_provider || (_provider = {}));

var consumer;
(function (consumer) {
    var provider = _provider;

    var g = null;

    function use() {
        var p2 = new provider.UsefulClass();
        return p2;
    }
})(consumer || (consumer = {}));
