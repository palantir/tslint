///<reference path='..\..\..\..\src\compiler\typescript.ts' />
///<reference path='..\..\..\..\src\harness\harness.ts' />

describe('Optional params dont generate any code inside interface', function () {
    it('Check if inferfaces generate any code', function () {
        var code = "interface i1 {a?: any;b: any;c(): any;d?(): any;}";
        Harness.Compiler.compileString(code, 'interface code-gen', function (result) {
            assert.equal(result.errors.length, 0);
            assert.equal(result.code, "");
        });
    });
    it('Check if inferfaces generate any code - 2', function () {
        var code = "interface i1 {a?: any;b: any;c(): any;d?(): any;}";
        Harness.Compiler.compileString(code, 'interface code-gen', function (result) {
            assert.equal(result.errors.length, 0);
            assert.equal(result.code, "");
        });
    });
});


describe('Type identity', function() {
    describe('Compiling unittests\\compiler\\testCode\\interfaceDeclaration6.ts', function() {
        it('Check primitive type identity .', function() {
            /* TO DO after fix */
        });
    });
});
