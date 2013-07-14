var Greeter = (function () {
    function Greeter() {
        var _this = this;
        foo(function () {
            bar(function () {
                console.log(_this);
            });
        });
    }
    return Greeter;
})();
