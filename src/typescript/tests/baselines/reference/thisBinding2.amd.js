var C = (function () {
    function C() {
        var _this = this;
        this.x = (function () {
            var x = 1;
            return _this.x;
        })();
        this.x = (function () {
            var x = 1;
            return this.x;
        })();
    }
    return C;
})();

var messenger = {
    message: "Hello World",
    start: function () {
        var _this = this;
        return setTimeout(function () {
            alert(_this.message);
        }, 3000);
    }
};
