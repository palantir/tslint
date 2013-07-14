var Bug = (function () {
    function Bug() {
    }
    Bug.prototype.foo = function (name) {
        this.name = name;
    };
    Bug.func = [
        function (that, name) {
            that.foo(name);
        }
    ];
    return Bug;
})();

var A = (function () {
    function A() {
        this.prop1 = function () {
            this;
        };
        this.prop2 = function () {
            var _this = this;
            function inner() {
                this;
            }
            function () {
                return _this;
            };
        };
        this.prop3 = function () {
            function inner() {
                this;
            }
        };
        this.prop4 = {
            a: function () {
                return this;
            }
        };
        this.prop5 = function () {
            return {
                a: function () {
                    return this;
                }
            };
        };
    }
    return A;
})();
