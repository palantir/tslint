/** this is multi declare module*/
var multiM;
(function (multiM) {
    /** class b*/
    var b = (function () {
        function b() {
        }
        return b;
    })();
    multiM.b = b;

    // class d
    var d = (function () {
        function d() {
        }
        return d;
    })();
    multiM.d = d;
})(multiM || (multiM = {}));

/// this is multi module 2
var multiM;
(function (multiM) {
    /** class c comment*/
    var c = (function () {
        function c() {
        }
        return c;
    })();
    multiM.c = c;

    /// class e
    var e = (function () {
        function e() {
        }
        return e;
    })();
    multiM.e = e;
})(multiM || (multiM = {}));
new multiM.b();
new multiM.c();

////[0.d.ts]
/** this is multi declare module*/
declare module multiM {
    /** class b*/
    class b {
    }
    class d {
    }
}
declare module multiM {
    /** class c comment*/
    class c {
    }
    class e {
    }
}
