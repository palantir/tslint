function foo<T, U extends T>(x: T, y: U) {
    x = y; // cannot convert U to T
    var z = <T>y; // cannot convert U to T
}