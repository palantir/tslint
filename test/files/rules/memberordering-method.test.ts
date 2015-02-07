// ensure that Bar and Baz do not get conflated
interface Bar {
    x(): void;
}

interface Baz {
    y: number;
}

interface BarBaz {
    x(): void;
    y: number;
}

class Foo {
    x(): void {}
    y: number;
}
