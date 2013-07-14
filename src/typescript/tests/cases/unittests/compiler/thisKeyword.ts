///<reference path='..\..\..\..\src\compiler\typescript.ts' />
///<reference path='..\..\..\..\src\harness\harness.ts' />

describe('Compiling tests\\compiler\\testCode\\thisKeyword.ts', function() {
    var typeFactory = new Harness.Compiler.TypeFactory();
    it('this inside static methods of a class is any', function () {
        assert.equal(typeFactory.get('class foo { static bar() { return this; } } var x = foo.bar();', 'x').type, 'any');
    });
    it('this inside functions of a module is any', function () {
        assert.equal(typeFactory.get('module bar { export function bar() { return this; } } var z = bar.bar();', 'z').type, 'any');
    });
});


