class Foo {
    private x: number;
    private bar(): any {
        var bla: { a: string, b: () => void } = { a: '1', b() {} };
    }
    y: number;
}
