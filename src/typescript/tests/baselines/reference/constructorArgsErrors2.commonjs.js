var foo = (function () {
    function foo(static, number) {
        if (typeof static === "undefined") { static = a; }
        this.static = static;
    }
    return foo;
})();
