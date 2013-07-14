///<reference path='..\..\..\..\src\harness\harness.ts'/>

// Subset of tests in the full Best Common Type testplan just to get some coverage
describe('Ternary expressions have the correct types', function () {
    var typeFactory = new Harness.Compiler.TypeFactory();
    typeFactory.isOfType('false ? 1 : null', 'number');
    typeFactory.isOfType('false ? undefined : 0', 'number');

    typeFactory.isOfType('false ? 1 : 0', 'number');
    typeFactory.isOfType('false ? false : true', 'boolean');
    typeFactory.isOfType('false ? "foo" : "bar"', 'string');
    typeFactory.isOfType('false ? null : undefined', 'any');
    
    assert.equal(typeFactory.get('var x = true ? {x:5} : null;', 'x').type, '{ x: number; }');
    assert.equal(typeFactory.get('var x = [{x:5}, null]', 'x').type, '{ x: number; }[]');
    assert.equal(typeFactory.get('function f() { if (true) { return { x: 5 }; } else { return null; } }', 'f').type, '() => { x: number; }');

});

