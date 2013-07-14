///<reference path='..\..\..\..\src\compiler\typescript.ts' />
///<reference path='..\..\..\..\src\harness\harness.ts' />

describe('Compiling tests\\compiler\\testCode\\recursiveInferenceBug.ts', function() {
    var typeFactory = new Harness.Compiler.TypeFactory();

    it("Functions with recursive references should always have a return type of 'any'", function() {
        var code  = "function fib(x:number) { return x <= 1 ? x : fib(x - 1) + fib(x - 2); }";
            code += "var result = fib(5);";
        var returnType = typeFactory.get(code, "result");
        assert.equal(returnType.type, "any");
    });
});