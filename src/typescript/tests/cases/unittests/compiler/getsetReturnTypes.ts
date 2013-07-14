///<reference path='..\..\..\..\src\harness\harness.ts'/>

 describe('Checking return type of getter', function () {
    var typeFactory = new Harness.Compiler.TypeFactory();
    it('Check getter return type to be number', function () {
        assert.equal(typeFactory.get('function makePoint(x: number) { return { get x() { return x; } } }; var x = makePoint(2).x;', 'x').type, 'number');
    });
});