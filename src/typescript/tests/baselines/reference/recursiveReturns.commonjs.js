function R1() {
    R1();
    return;
}

function R2() {
    R2();
}

function R3(n) {
    if (n == 0) {
    } else {
        R3(n--);
    }
}
