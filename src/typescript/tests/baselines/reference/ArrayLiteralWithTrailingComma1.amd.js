var arrTest = (function () {
    function arrTest() {
    }
    arrTest.prototype.test = function (arg1) {
    };

    arrTest.prototype.callTest = function () {
        this.test([1, 2, "hi", 5]);
        this.test([1, 2, "hi", 5]);
    };
    return arrTest;
})();
