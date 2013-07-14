var Cell = (function () {
    function Cell() {
    }
    return Cell;
})();

var Ship = (function () {
    function Ship() {
    }
    return Ship;
})();

var Board = (function () {
    function Board() {
    }
    Board.prototype.allShipsSunk = function () {
        return this.ships.every(function (val) {
            return val.isSunk;
        });
    };
    return Board;
})();
