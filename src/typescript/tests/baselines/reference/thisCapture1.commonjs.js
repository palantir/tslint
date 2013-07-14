var X = (function () {
    function X() {
        this.y = 0;
    }
    X.prototype.getSettings = function (keys) {
        var _this = this;
        var ret;
        return ret.always(function () {
            _this.y = 0;
        }).promise();
    };
    return X;
})();
