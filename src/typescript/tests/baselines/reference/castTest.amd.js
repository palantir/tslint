var x = 0;
var z = x;
var y = x + z;

var a = 0;
var b = true;
var s = "";

var ar = null;

var f = null;

var p_cast = ({
    x: 0,
    y: 0,
    add: function (dx, dy) {
        return new Point(this.x + dx, this.y + dy);
    },
    mult: function (p) {
        return p;
    }
});
