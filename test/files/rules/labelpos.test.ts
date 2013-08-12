var t = function() {
    lab1:
        var x = 123;

    lab2:
    console.log("123");

    lab3:
    for (var i = 0; i < 5; ++i) {
        break lab3;
    }
}

var f = () => {
    console.log();
};
