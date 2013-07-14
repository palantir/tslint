function Point(x, y) {
    this.x = x;
    this.y = y;
}

function EF1(a, b) {
    return a + b;
}

var x = EF1(1, 2);

Point.origin = new Point(0, 0);

Point.prototype.add = function (dx, dy) {
    return new Point(this.x + dx, this.y + dy);
};

var f = 5;

Point.prototype = {
    x: 0,
    y: 0,
    add: function (dx, dy) {
        return new Point(this.x + dx, this.y + dy);
    }
};

z = function (a) {
    a;
};

function C(a, b) {
    this.a = a;
    this.b = b;
}

C.prototype = {
    a: 0,
    b: 0,
    C1M1: function (c, d) {
        return (this.a + c) + (this.b + d);
    }
};
