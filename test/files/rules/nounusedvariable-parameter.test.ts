export function func1(x: number, y: number, ...args: number[]) {
    return x + y;
}

export function func2(x: number, y: number, ...args: number[]) {
    return x + args[0];
}

export function func3(x?: number, y?: number) {
    return x;
}

export interface ITestInterface {
    func4(x: number, y: number): number;
}

export class ABCD {
    constructor(private x: number, public y: number, private z: number) {
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
