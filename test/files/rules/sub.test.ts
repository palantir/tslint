var obj = {
    a: 1,
    b: 2,
    c: 3,
    d: 4
};

function test() {
    var a = obj.a;
      var b = obj[ 'bcd' ];
        var c = obj["c"];
    var d = obj[b];
}
