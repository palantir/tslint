var C1 = (function () {
    function C1() {
        var v = 0;

        s = 1;
        C1.s = 1;

        b();
        C1.b();
    }
    C1.b = function () {
        v = 1;
        this.p = 0;
        C1.s = 1;
    };
    return C1;
})();

var C2 = (function () {
    function C2() {
        this.barback = "";
    }
    Object.defineProperty(C2, "Bar", {
        get: function () {
            return "bar";
        },
        set: function (bar) {
            barback = bar;
        },
        enumerable: true,
        configurable: true
    });

    return C2;
})();
