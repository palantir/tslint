////[duplicateIdentifierShouldNotShorCircuitBaseTypeBindingA.js]
var Shapes;
(function (Shapes) {
    var Point = (function () {
        function Point() {
        }
        return Point;
    })();
    Shapes.Point = Point;
})(Shapes || (Shapes = {}));

////[duplicateIdentifierShouldNotShorCircuitBaseTypeBindingB.js]
var Shapes;
(function (Shapes) {
    var Point = (function () {
        function Point() {
        }
        return Point;
    })();
    Shapes.Point = Point;
})(Shapes || (Shapes = {}));
