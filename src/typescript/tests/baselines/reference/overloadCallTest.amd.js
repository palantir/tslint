var foo = (function () {
    function foo() {
        function bar(foo) {
            return "foo";
        }
        ;

        var test = bar("test");
        var goo = bar();

        goo = bar("test");
    }
    return foo;
})();
