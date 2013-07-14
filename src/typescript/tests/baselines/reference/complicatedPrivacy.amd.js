var m1;
(function (m1) {
    (function (m2) {
        function f1(c1) {
        }
        m2.f1 = f1;
        function f2(c2) {
        }
        m2.f2 = f2;

        var C2 = (function () {
            function C2() {
            }
            Object.defineProperty(C2.prototype, "p1", {
                get: function (arg) {
                    return new C1();
                },
                set: function (arg1) {
                },
                enumerable: true,
                configurable: true
            });


            C2.prototype.f55 = function () {
                return "Hello world";
            };
            return C2;
        })();
        m2.C2 = C2;
    })(m1.m2 || (m1.m2 = {}));
    var m2 = m1.m2;

    function f2(arg1) {
    }
    m1.f2 = f2;

    function f3() {
        return null;
    }
    m1.f3 = f3;

    function f4(arg1) {
    }
    m1.f4 = f4;

    function f5(arg2) {
    }
    m1.f5 = f5;
    var m3;
    (function (m3) {
        function f2(f1) {
        }
    })(m3 || (m3 = {}));

    var C1 = (function () {
        function C1() {
        }
        return C1;
    })();

    var C5 = (function () {
        function C5() {
        }
        return C5;
    })();
    m1.C5 = C5;

    m1.v2;
})(m1 || (m1 = {}));

var C2 = (function () {
    function C2() {
    }
    return C2;
})();

var m2;
(function (m2) {
    (function (m3) {
        var c_pr = (function () {
            function c_pr() {
            }
            c_pr.prototype.f1 = function () {
                return "Hello";
            };
            return c_pr;
        })();
        m3.c_pr = c_pr;

        var m4;
        (function (m4) {
            var C = (function () {
                function C() {
                }
                return C;
            })();
            var m5;
            (function (m5) {
                (function (m6) {
                    function f1() {
                        return new C();
                    }
                })(m5.m6 || (m5.m6 = {}));
                var m6 = m5.m6;
            })(m5 || (m5 = {}));
        })(m4 || (m4 = {}));
    })(m2.m3 || (m2.m3 = {}));
    var m3 = m2.m3;
})(m2 || (m2 = {}));
