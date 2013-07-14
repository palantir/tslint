var GetterOnly = (function () {
    function GetterOnly() {
    }
    Object.defineProperty(GetterOnly.prototype, "Value", {
        get: function () {
            var _this = this;
            var fn = function () {
                return _this;
            };
            return '';
        },
        set: function (val) {
        },
        enumerable: true,
        configurable: true
    });
    return GetterOnly;
})();

var SetterOnly = (function () {
    function SetterOnly() {
    }
    Object.defineProperty(SetterOnly.prototype, "Value", {
        get: function () {
            return '';
        },
        set: function (val) {
            var _this = this;
            var fn = function () {
                return _this;
            };
        },
        enumerable: true,
        configurable: true
    });
    return SetterOnly;
})();

var GetterAndSetter = (function () {
    function GetterAndSetter() {
    }
    Object.defineProperty(GetterAndSetter.prototype, "Value", {
        get: function () {
            var _this = this;
            var fn = function () {
                return _this;
            };
            return '';
        },
        set: function (val) {
            var _this = this;
            var fn = function () {
                return _this;
            };
        },
        enumerable: true,
        configurable: true
    });
    return GetterAndSetter;
})();
