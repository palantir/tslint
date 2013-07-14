var recurser = function foo() {
};

foo();

recurser();

(function bar() {
    foo();
});

bar();
