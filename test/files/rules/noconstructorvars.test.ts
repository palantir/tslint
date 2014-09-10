class Class1 {
    // one error
    constructor(private foo: string) {
    }
}

class Class2 {
    // two errors, last one is correct
    constructor(private foo: string, public bar: string, qux: any) {
    }
}

class Class3 {
    // no errors
    constructor() {
    }
}
