function f(x) {
    var z = f(x);
    return x;
}

var zz = {
    g: function () {
    },
    get f() {
        return "abc";
    }
};
