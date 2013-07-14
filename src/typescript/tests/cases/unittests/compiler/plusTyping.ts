///<reference path='..\..\..\..\src\harness\harness.ts'/>

describe('Checking + operator with strings', function () {
    var typeFactory = new Harness.Compiler.TypeFactory();
    it('Check any+any=any', function () {
        assert.equal(typeFactory.get('var x; x.name = "hello"; var z = x + x;', 'x').type, 'any');
    });
});