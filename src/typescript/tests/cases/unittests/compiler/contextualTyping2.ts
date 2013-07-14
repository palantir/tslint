///<reference path='..\..\..\..\src\compiler\typescript.ts' />
///<reference path='..\..\..\..\src\harness\harness.ts' />

describe('Contextual typing tests', function() {
    var typeFactory = new Harness.Compiler.TypeFactory();

    describe('In variable and property declarations', function() {
        describe("Object Literal", function() {
            /*
            Variable
            */
            it("Variable - Object with same properties", function() {
                var code = "var foo: {id:number;} = {id:4};";
                Harness.Compiler.compileString(code, 'Object Literal', function(result) {
                    assert.equal(result.errors.length, 0);
                });
            });
            it("Variable - Object with type having less properties 1", function() {
                var code = 'var foo: {id:number;} = {id:4, name:"foo"};';
                Harness.Compiler.compileString(code, 'Object Literal', function(result) {
                    assert.equal(result.errors.length, 0);
                });
            });
            
            it("Variable - Object with expression having less properties 2", function() {
                var code = "var foo: {id:number;} = { };";
                Harness.Compiler.compileString(code, 'Object Literal', function(result) {
                    assert.equal(result.errors.length, 1);
                });
            });
            /*
            Property
            */
            it("Property - Object with same properties", function() {
                var code = "class foo { public bar:{id:number;} = {id:5}; }";
                Harness.Compiler.compileString(code, 'Object Literal', function(result) {
                    assert.equal(result.errors.length, 0);
                });
            });
            it("Property - Object with type having less properties", function() {
                var code = 'class foo { public bar:{id:number;} = {id:5, name:"foo"}; }';
                Harness.Compiler.compileString(code, 'Object Literal', function(result) {
                    assert.equal(result.errors.length, 0);
                });
            });
            it("Property - Object with expression having less properties", function() {
                var code = "class foo { public bar:{id:number;} = { }; }";
                Harness.Compiler.compileString(code, 'Object Literal', function(result) {
                    assert.equal(result.errors.length, 1);
                });
            });   
        });
        describe("Array Literal", function() {
            /*
            Variable
            */
            it("Variable - Positive 1", function() {
                var code = "var foo:{id:number;}[] = [{id:1}, {id:2}];";
                Harness.Compiler.compileString(code, 'Object Literal', function(result) {
                    assert.equal(result.errors.length, 0);
                });
            });
            it("Variable - Positive 2", function() {
                var code = "var foo:{id:number;}[] = [<{id:number;}>({})];";
                Harness.Compiler.compileString(code, 'Object Literal', function(result) {
                    assert.equal(result.errors.length, 0);
                });
            });
            it("Variable - Negative", function() {
                var code = 'var foo:{id:number;}[] = [{id:1}, {id:2, name:"foo"}];';
                Harness.Compiler.compileString(code, 'Object Literal', function(result) {
                    assert.equal(result.errors.length, 0);
                });
            });
            /*
            Property
            */
            it("Property - Positive 1", function() {
                var code = "class foo { public bar:{id:number;}[] = [{id:1}, {id:2}]; }";
                Harness.Compiler.compileString(code, 'Object Literal', function(result) {
                    assert.equal(result.errors.length, 0);
                });
            });
            it("Property - Negative 2", function() {
                var code = "class foo { public bar:{id:number;}[] = [<foo>({})]; }";
                Harness.Compiler.compileString(code, 'Object Literal', function(result) {
                    assert.equal(result.errors.length, 1);
                });
            });  
            it("Property - Negative", function() {
                var code = 'class foo { public bar:{id:number;}[] = [{id:1}, {id:2, name:"foo"}]; }';
                Harness.Compiler.compileString(code, 'Object Literal', function(result) {
                    assert.equal(result.errors.length, 0);
                });
            });
        });
        describe("Function Expression", function() {
            it("Positive 1", function() {
                var code = "var foo:(a:number)=>number = function(a){return a};";
                Harness.Compiler.compileString(code, 'Object Literal', function(result) {
                    assert.equal(result.errors.length, 0);
                });
            });
            it("Positive 2", function() {
                var code = "class foo { public bar:(a:number)=>number = function(a){return a}; }";
                Harness.Compiler.compileString(code, 'Object Literal', function(result) {
                    assert.equal(result.errors.length, 0);
                });
            });
        });
        describe("Regular Expression", function() {
            it("Positive", function() {
                var code = "class foo { public bar: { (): number; (i: number): number; } = function() { return 1 }; }";
                Harness.Compiler.compileString(code, 'Object Literal', function(result) {
                    assert.equal(result.errors.length, 0);
                });
            });
            //it("Negative", function() {
            //    var code = "class foo { public bar: { (i: number): number; } = function(a:string) { return 1 }; }";
            //    Harness.Compiler.compileString(code, 'Object Literal', function(result) {
            //        assert.equal(result.errors.length, 1);
            //    });
            //});
        });
    });
    
    describe('Assignment statements', function() {
        describe("Object Literal", function() {
            it("Object with same properties", function() {
                var code = "var foo: {id:number;} = {id:4}; foo = {id:5};";
                Harness.Compiler.compileString(code, 'Object Literal', function(result) {
                    assert.equal(result.errors.length, 0);
                });
            });
            it("Object with type having less properties", function() {
                var code = 'var foo: {id:number;} = {id:4}; foo = {id: 5, name:"foo"};';
                Harness.Compiler.compileString(code, 'Object Literal', function(result) {
                    assert.equal(result.errors.length, 0);
                });
            });
            it("Object with expression having less properties", function() {
                var code = "var foo: {id:number;} = <{id:number;}>({ }); foo = {id: 5};";
                Harness.Compiler.compileString(code, 'Object Literal', function(result) {
                    assert.equal(result.errors.length, 0);
                });
            });
        });
        describe("Array Literal", function() {
            it("Positive", function() {
                var code = "var foo:{id:number;}[] = [{id:1}]; foo = [{id:1}, {id:2}];";
                Harness.Compiler.compileString(code, 'Array Literal', function(result) {
                    assert.equal(result.errors.length, 0);
                });
            });
            it("Negative 1", function() {
                var code = 'var foo:{id:number;}[] = [{id:1}]; foo = [{id:1}, {id:2, name:"foo"}];';
                Harness.Compiler.compileString(code, 'Array Literal', function(result) {
                    assert.equal(result.errors.length, 0);
                });
            } );
            it("Negative 2", function() {
                var code = 'var foo:{id:number;}[] = [{id:1}]; foo = [{id:1}, 1];';
                Harness.Compiler.compileString(code, 'Array Literal', function(result) {
                    assert.equal(result.errors.length, 1);
                });
            });
        });
        describe("Function Expression", function() {
            it("Positive", function() {
                var code = "var foo:(a:number)=>number = function(a){return a}; foo = function(b){return b};";
                Harness.Compiler.compileString(code, 'Object Literal', function(result) {
                    assert.equal(result.errors.length, 0);
                });
            });
        });     
        describe("Regular Expression", function() {
            it("Positive", function() {
                var code = "var foo:(a:{():number; (i:number):number; })=>number; foo = function(a){return 5};";
                Harness.Compiler.compileString(code, 'Object Literal', function(result) {
                    assert.equal(result.errors.length, 0);
                });
            });
            it("Negative", function() {
                var code = "var foo:(a:{():number; (i:number):number; })=>number; foo = function(a:string){return 5};";
                Harness.Compiler.compileString(code, 'Object Literal', function(result) {
                    assert.equal(result.errors.length, 1);
                });
            });
        });        
    });
    describe('Function Calls', function() {
        describe('Object literal', function() {
            it("Object with fewer properties", function() {
                var code = "function foo(param:{id:number;}){}; foo(<{id:number;}>({}));";
                Harness.Compiler.compileString(code, 'Array Literal', function(result) {
                    assert.equal(result.errors.length, 0);
                });
            });
            it("Object with more properties", function() {
                var code = "function foo(param:{id:number;}){}; foo(<{id:number;}>({}));";
                Harness.Compiler.compileString(code, 'Array Literal', function(result) {
                    assert.equal(result.errors.length, 0);
                });
            });
            it("Object with same amount of properties", function() {
                var code = "function foo(param:{id:number;}){}; foo(<{id:number;}>({}));";
                Harness.Compiler.compileString(code, 'Array Literal', function(result) {
                    assert.equal(result.errors.length, 0);
                });
            });
        });
        describe('Array literal', function() {
            it("Array literal with numbers - 1", function() {
                var code = "function foo(param:number[]){}; foo([1]);";
                Harness.Compiler.compileString(code, 'Array Literal', function(result) {
                    assert.equal(result.errors.length, 0);
                });
            });
            it("Array literal with numbers - 2", function() {
                var code = "function foo(param:number[]){}; foo([1, 3]);";
                Harness.Compiler.compileString(code, 'Array Literal', function(result) {
                    assert.equal(result.errors.length, 0);
                });
            });
            it("Array literal with numbers - 3", function() {
                var code = 'function foo(param:number[]){}; foo([1, "a"]);';
                Harness.Compiler.compileString(code, 'Array Literal', function(result) {
                    assert.equal(result.errors.length, 2);
                });
            });
        });
        describe('Function Expression', function() {
            it("Array literal with numbers", function() {
                var code = "function foo(param:number[]){}; foo([1]);";
                Harness.Compiler.compileString(code, 'Array Literal', function(result) {
                    assert.equal(result.errors.length, 0);
                });
            });
        });
        describe('Regular Expression', function() {
            it("Positive", function() {
                var code = 'function foo(param: {():number; (i:number):number; }[]) { }; foo([function(){return 1;}, function(){return 4}]);';
                Harness.Compiler.compileString(code, 'Array Literal', function(result) {
                    assert.equal(result.errors.length, 0);
                });
            });
            it("Negative", function() {
                var code = 'function foo(param: {():number; (i:number):number; }[]) { }; foo([function(){return 1;}, function(){return "foo"}]);';
                Harness.Compiler.compileString(code, 'Array Literal', function(result) {
                    assert.equal(result.errors.length, 2);
                });
            });
        });
    });
    describe('Type-Annotated Expressions', function() {
        describe('Object literal', function() {
            it("Positive", function() {
                var code = 'var foo = <{ id: number;}> ({id:4});';
                Harness.Compiler.compileString(code, 'Array Literal', function(result) {
                    assert.equal(result.errors.length, 0);
                });
            });
            it("Negative", function() {
                var code = 'var foo = <{ id: number;}> {id:4, name: "as"};';
                Harness.Compiler.compileString(code, 'Array Literal', function(result) {
                    assert.equal(result.errors.length, 0);
                });          
            });
        });
        describe('Array literal', function() {
            it("Positive", function() {
                var code = 'var foo = <{ id: number; }[]>[{ id: 4 }, <{ id: number; }>({  })];';
                Harness.Compiler.compileString(code, 'Array Literal', function(result) {
                    assert.equal(result.errors.length, 0);
                });
            });
            it("Negative", function() {
                var code = 'var foo = <{ id: number; }[]>[{ foo: "s" }, {  }];';
                Harness.Compiler.compileString(code, 'Array Literal', function(result) {
                    assert.equal(result.errors.length, 1); // Cannot convert '{ foo: string; }' to '{ id: number; }'
                });
            });
        });
        describe('Function expression', function() {
            it("Positive", function() {
                var code = 'var foo = <{ (): number; }> function(a) { return a };';
                Harness.Compiler.compileString(code, 'Array Literal', function(result) {
                    assert.equal(result.errors.length, 0);
                });
            });
            it("Negative", function() {
                var code = 'var foo = <{ (): number; }> function() { return "err"; };';
                Harness.Compiler.compileString(code, 'Array Literal', function(result) {
                    assert.equal(result.errors.length, 1);
                });
            });
        });
        describe('Regular expression', function() {
            it("Positive", function() {
                var code = 'var foo = <{():number; (i:number):number; }> function(){return 1;};';
                Harness.Compiler.compileString(code, 'Array Literal', function(result) {
                    assert.equal(result.errors.length, 0);
                });
            });
            it("Negative", function() {
                var code = 'var foo = <{():number; (i:number):number; }> (function(){return "err";});';
                Harness.Compiler.compileString(code, 'Array Literal', function(result) {
                    assert.equal(result.errors.length, 1);
                });
            });
        });
    });        
});

