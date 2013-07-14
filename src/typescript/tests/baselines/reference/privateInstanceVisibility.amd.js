var Test;
(function (Test) {
    var Example = (function () {
        function Example() {
        }
        Example.prototype.doSomething = function () {
            var that = this;

            function innerFunction() {
                var num = that.someNumber;
            }
        };
        return Example;
    })();
    Test.Example = Example;
})(Test || (Test = {}));

var C = (function () {
    function C() {
    }
    C.prototype.getX = function () {
        return this.x;
    };

    C.prototype.clone = function (other) {
        this.x = other.x;
    };
    return C;
})();
