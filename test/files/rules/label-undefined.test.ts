// invalid code

function f() {
    lab3:
    for (var i = 0; i < 10; ++i) {
        break lab1;
    }
}

var x = function() {
    lab4:
    while (i < 10) {
        continue lab2;
    }
};

var y = () => {
    lab3:
    while (i < 10) {
        continue lab3;
    }

    (function() {
        lab2:
        switch (j) {
            case 1:
                break lab3;
        }
    })();
};

var z = x => {
    lab1:
    do {
        x++;
        continue lab4;
    } while (x < 10);
};

// valid code

lab5:
for (var i = 0; i < 10; ++i) {
    var w = () => {
        lab2:
        while (i < 10) {
            continue lab2;
        }
    };
    break lab5;
}
