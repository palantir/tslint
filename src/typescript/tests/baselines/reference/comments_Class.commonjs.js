/** This is class c2 without constuctor*/
var c2 = (function () {
    function c2() {
    }
    return c2;
})();
var i2 = new c2();
var i2_c = c2;
var c3 = (function () {
    /** Constructor comment*/
    function c3() {
    }
    return c3;
})();
var i3 = new c3();
var i3_c = c3;

/** Class comment*/
var c4 = (function () {
    /** Constructor comment*/
    function c4() {
    }
    return c4;
})();
var i4 = new c4();
var i4_c = c4;

/** Class with statics*/
var c5 = (function () {
    function c5() {
    }
    return c5;
})();
var i5 = new c5();
var i5_c = c5;

/// class with statics and constructor
var c6 = (function () {
    /// constructor comment
    function c6() {
    }
    return c6;
})();
var i6 = new c6();
var i6_c = c6;

// class with statics and constructor
var c7 = (function () {
    // constructor comment
    function c7() {
    }
    return c7;
})();
var i7 = new c7();
var i7_c = c7;

/** class with statics and constructor
*/
var c8 = (function () {
    /** constructor comment
    */
    function c8() {
    }
    return c8;
})();
var i8 = new c8();
var i8_c = c8;

////[0.d.ts]
/** This is class c2 without constuctor*/
declare class c2 {
}
declare var i2: c2;
declare var i2_c: new() => c2;
declare class c3 {
    /** Constructor comment*/
    constructor();
}
declare var i3: c3;
declare var i3_c: new() => c3;
/** Class comment*/
declare class c4 {
    /** Constructor comment*/
    constructor();
}
declare var i4: c4;
declare var i4_c: new() => c4;
/** Class with statics*/
declare class c5 {
    static s1: number;
}
declare var i5: c5;
declare var i5_c: {
    s1: number;
    new(): c5;
};
declare class c6 {
    static s1: number;
    constructor();
}
declare var i6: c6;
declare var i6_c: {
    s1: number;
    new(): c6;
};
declare class c7 {
    static s1: number;
    constructor();
}
declare var i7: c7;
declare var i7_c: {
    s1: number;
    new(): c7;
};
/** class with statics and constructor
*/
declare class c8 {
    /** s1 comment */
    static s1: number;
    /** constructor comment
    */
    constructor();
}
declare var i8: c8;
declare var i8_c: {
    s1: number;
    new(): c8;
};
