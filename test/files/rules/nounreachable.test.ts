// invalid code

function f1() {
    var x = 3;
    return;
    var y;
    var z;
}

var f2 = () => {
    if (x === 3) {
        throw new Error("error");
        "123";
    } else {
        return y;
    }

    return 123;
};

lab:
for (var i = 0; i < 10; ++i) {
    if (i === 3) {
        break;
        console.log("hi");
    } else {
        continue lab;
        i = 4;
    }
}

// valid code
var f2 = () => {
    if (x === 3) {
        throw new Error("error");
    } else {
        return y;
    }

    return 123;
};

switch (x) {
    case 1:
        i = 2;
        break;
    case 2:
        i = 3;
        break;
    default:
        i = 4;
        break;
}
