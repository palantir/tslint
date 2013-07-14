var A;
(function (A) {
    A[A["foo"] = 0] = "foo";
    A[A["bar"] = 1] = "bar";
})(A || (A = {}));
A = undefined;
A = A.bar;
A.foo = 1;
A.foo = A.bar;
