var E;
(function (E) {
    E[E["A"] = 1] = "A";
    E[E["B"] = 0] = "B";

    E[E["C"] = 1] = "C";
})(E || (E = {}));

E.A.A;

var E2;
(function (E2) {
    E2[E2["A"] = 0] = "A";
    E2[E2["B"] = 1] = "B";
})(E2 || (E2 = {}));

var E2;
(function (E2) {
    E2[E2["C"] = 0] = "C";
    E2[E2["D"] = 1] = "D";
})(E2 || (E2 = {}));
