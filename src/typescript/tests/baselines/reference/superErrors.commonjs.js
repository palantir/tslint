var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
function foo() {
    var _this = this;
    var x = _super.prototype;
    var y = function () {
        return _super.prototype;
    };
    var z = function () {
        return function () {
            return function () {
                return _super.prototype;
            };
        };
    };
}

var User = (function () {
    function User() {
        this.name = "Bob";
    }
    User.prototype.sayHello = function () {
        console.log("Hello, " + this.name);
    };
    return User;
})();

var RegisteredUser = (function (_super) {
    __extends(RegisteredUser, _super);
    function RegisteredUser() {
        _super.call(this);
        this.name = "Frank";

        function inner() {
            _super.prototype.sayHello.call(_this);
        }

        function inner2() {
            var _this = this;
            var x = function () {
                return _super.prototype.sayHello.call(_this);
            };
        }

        (function () {
            var _this = this;
            return function () {
                return _super.prototype;
            };
        })();
    }
    RegisteredUser.prototype.sayHello = function () {
        _super.prototype.sayHello.call(this);

        function inner() {
            var _this = this;
            var x = function () {
                return _super.prototype.sayHello.call(_this);
            };
        }

        (function () {
            var _this = this;
            return function () {
                return _super.prototype;
            };
        })();
    };
    RegisteredUser.staticFunction = function () {
        var _this = this;
        var s = _super.prototype;
        var x = function () {
            return _super.prototype;
        };
        var y = function () {
            return function () {
                return function () {
                    return _super.prototype;
                };
            };
        };
    };
    return RegisteredUser;
})(User);
