var o = {
    counter: 0,
    start: function () {
        var _this = this;
        window.onmousemove = function () {
            console.log("iteration: " + _this.counter++);

            var f = function () {
                return _this.counter;
            };
        };
    }
};

var X = (function () {
    function X() {
        this.value = "value";
    }
    X.prototype.foo = function () {
        var _this = this;
        var outer = function () {
            console.log(_this.value);

            var inner = function () {
                console.log(_this.value);
            };

            inner();
        };
        outer();
    };
    return X;
})();
