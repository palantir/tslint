var Greeter = (function () {
    function Greeter() {
    }
    Object.defineProperty(Greeter.prototype, "greet", {
        get: function () {
            throw '';
        },
        enumerable: true,
        configurable: true
    });
    Greeter.prototype.greeting = function () {
        throw '';
    };
    return Greeter;
})();
