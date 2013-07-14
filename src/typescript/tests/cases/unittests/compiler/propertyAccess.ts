///<reference path='..\..\..\..\src\compiler\typescript.ts' />
///<reference path='..\..\..\..\src\harness\harness.ts' />

describe('Property Access', function() {
    var typeFactory = new Harness.Compiler.TypeFactory();

    it("Type of expression is any", function() {
        var code = "var foo: any; foo.bar = 4;";
        Harness.Compiler.compileString(code, 'propertyAccess', function(result) {
            assert.equal(result.errors.length, 0);
        });
    });

    it("Type of expression is string", function() {
        var code = "var foo: string; foo.toUpperCase();";
        Harness.Compiler.compileString(code, 'propertyAccess', function(result) {
            assert.equal(result.errors.length, 0);
        });
    });
});