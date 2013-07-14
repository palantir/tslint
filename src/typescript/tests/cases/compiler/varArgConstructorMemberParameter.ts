class Foo1 {
    // Works
    constructor (...args: string[]) { }
}

class Foo2 {
    // Works
    constructor (public args: string[]) { }
}

class Foo3 {
    // Bug 17115: Can't combine member prefix (public/private) with ... (rest arg)
    constructor (public ...args: string[]) { }
}
