var yellow;
var blue;
var s = "some string";

yellow[5];
yellow["hue"];
yellow[{}];

s[0];
s["s"];
s[{}];

yellow[blue];

var x;
x[0];

var Benchmark = (function () {
    function Benchmark() {
        this.results = {};
    }
    Benchmark.prototype.addTimingFor = function (name, timing) {
        this.results[name] = this.results[name];
    };
    return Benchmark;
})();
