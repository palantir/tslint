export function func1(x: number, y: number, ...args: number[]) { // 'args' failure
    return x + y;
}

export function func2(x: number, y: number, ...args: number[]) { // 'y' failure
    return x + args[0];
}

export function func3(x?: number, y?: number) { // 'y' failure
    return x;
}

export interface ITestInterface {
    func4(x: number, y: number): number;
}

export class ABCD {
    constructor(private x: number, public y: number, private z: number) { // 'x' failure
    }

    func5() {
        return this.z;
    }
}

export interface ITestMapInterface {
    [key: string]: string;
}

export function func6(...args: number[]) {
    return args;
}

export function func7(f: (x: number) => number) {
    return f;
}

export function func8([x, y]: [number, number]) { // 'y' failure
    return x;
}

export class DestructuringTests {
    constructor(public x: number, public [y, z]) { // tsc error on binding pattern
    }

    public func9({a, b}) { // 'b' failure
        return a;
    }

    public func10([a, b]) { // 'b' failure
        return [a];
    }

    // destructuring with default value
    public func11([x = 0]) { // 'x' failure
        return;
    }
}

abstract class AbstractTest {
    abstract foo(x);
}