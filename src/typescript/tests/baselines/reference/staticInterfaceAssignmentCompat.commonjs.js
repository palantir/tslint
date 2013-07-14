var Shape = (function () {
    function Shape() {
    }
    Shape.create = function () {
        return new Shape();
    };
    return Shape;
})();

var x = Shape;
