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

function f4() {
    var x = 3;
    if (x === 4) return;
    else x = 4;
    var y = 7;
}

function f5() {
    var x = 3;
    if (x === 4) x = 5;
    else return;
    var y = 7;
}

function f6() {
    hoisted();
    return 0;

    function hoisted() {
        return 0;
    }
}

// more invalid code

function f7() {
    hoisted();
    return 0;

    function hoisted() {
        return 0;
    }

    var y = 7;
}
