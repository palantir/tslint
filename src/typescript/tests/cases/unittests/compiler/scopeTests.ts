///<reference path='..\..\..\..\src\compiler\typescript.ts' />
///<reference path='..\..\..\..\src\harness\harness.ts' />

describe('Compiling tests\\compiler\\scopeTests.ts', function() {
    it("Scope check extended class with errors", function () {
        var code = 'class C { private v; public p; static s; }';
        code += 'class D extends C {';
        code += '  public v: number;';
        code += '  public p: number;'
        code += '  constructor() {';
        code += '   super();'
        code += '   this.v = 1;';
        code += '   this.p = 1;';
        code += '   C.s = 1;';
        code += '  }';
        code += '}';
        Harness.Compiler.compileString(code, 'declarations', function (result) {
            assert.arrayLengthIs(result.errors, 1);
            assert.compilerWarning(result, 1, 49, "error TS2141: Class 'D' cannot extend class 'C':\r\n\tProperty 'v' defined as public in type 'D' is defined as private in type 'C'.");
        } );
    } );
});