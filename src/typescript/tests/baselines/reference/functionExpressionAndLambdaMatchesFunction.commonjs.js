var CDoc = (function () {
    function CDoc() {
        function doSomething(a) {
        }
        doSomething(function () {
            return undefined;
        });
        doSomething(function () {
        });
    }
    return CDoc;
})();
