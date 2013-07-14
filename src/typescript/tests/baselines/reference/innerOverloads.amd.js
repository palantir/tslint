function outer() {
    function inner(a) {
        return a;
    }

    return inner(0);
}

var x = outer();
