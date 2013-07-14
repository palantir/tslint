var TestClass = (function () {
    function TestClass() {
    }
    TestClass.prototype.bar = function (x) {
    };

    TestClass.prototype.foo = function (x) {
        this.bar(x);
    };
    return TestClass;
})();

var TestClass2 = (function () {
    function TestClass2() {
    }
    TestClass2.prototype.bar = function (x) {
        return 0;
    };

    TestClass2.prototype.foo = function (x) {
        return this.bar(x);
    };
    return TestClass2;
})();
