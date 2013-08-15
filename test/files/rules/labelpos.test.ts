var t = function() {
    lab1:
        var x = 123;

    lab2:
    console.log("123");

    lab3:
    for (var i = 0; i < 5; ++i) {
        break lab3;
    }

    lab4:
    do {
        break lab4;
    } while (i < 10);

    lab5:
    while (i < 10) {
        lab6:
        while (j < 20) {
            break lab5;
        }
    }

    lab7:
    switch (i) {
        case 0:
            break lab7;
    }
};
