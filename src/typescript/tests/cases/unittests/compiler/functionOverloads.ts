///<reference path='..\..\..\..\src\compiler\typescript.ts' />
///<reference path='..\..\..\..\src\harness\harness.ts' />

describe('Compiling unittests\\compiler\\functionOverloads.ts', function() {
    var typeFactory = new Harness.Compiler.TypeFactory();

    assert.bug('13922: [Overload] Overload implementations should be right after signatures');
    //it("Overload implementations should be right after signatures", function() {
    //    var code  = 'function foo();';
    //        code += '1+1;';
    //        code += 'function foo():string { return "a" };'
    //    Harness.Compiler.compileString(code, 'functionOverload', function(result) {
    //        assert.compilerWarning(result, 1, 0, 'ERROR');
    //        assert.equal(result.errors.length, 1);
    //    });
    //});
    
    it("Calling an overload implementation should be invalid", function() {
        var code  = 'function foo():string;'
            code += 'function foo(bar:string):number;'
            code += 'function foo(bar?:string):any{ return "" };'
            code += 'var x = foo(5);'
        Harness.Compiler.compileString(code, 'functionOverload', function(result) {
            assert.compilerWarning(result, 1, 106, 'error TS2081: Supplied parameters do not match any signature of call target.');
            assert.equal(result.errors.length, 2);
        });
    });

    it("Calling an overload implementation should be invalid - 2", function() {
        var code  = 'function foo(bar:string):string;'
            code += 'function foo(bar:number):number;'
            code += 'function foo(bar:any):any{ return bar };'
            code += 'var x = foo(true);'
        Harness.Compiler.compileString(code, 'functionOverload', function(result) {
            assert.compilerWarning(result, 1, 113, 'error TS2081: Supplied parameters do not match any signature of call target.');
            assert.equal(result.errors.length, 2);
        });
    });

    it("Having only signature should be invalid", function() {
        var code  = 'function foo():string;';
        Harness.Compiler.compileString(code, 'functionOverload', function(result) {
            assert.compilerWarning(result, 1, 1, 'error TS1041: Function implementation expected.');
            assert.equal(result.errors.length, 1);
        });
    });

    it("Overload signatures should be assign compatible with their implementation", function() {
        var code  = 'function foo():number;';
            code += 'function foo():string { return "a" };'
        Harness.Compiler.compileString(code, 'functionOverload', function(result) {
            assert.compilerWarning(result, 1, 1, 'error TS2148: Overload signature is not compatible with function definition.');
            assert.equal(result.errors.length, 1);
        });
    });

    it("Private / Public overloads shouldn't be allowed inside classes", function() {
        var code  = 'class baz { ';
            code += '  public foo();';
            code += '  private foo(bar?:any){ }';
            code += '}';
        Harness.Compiler.compileString(code, 'functionOverload', function(result) {
            assert.compilerWarning(result, 1, 15, 'error TS2150: Overload signatures must all be public or private.');
            assert.arrayLengthIs(result.errors, 1);
        });
    });

    it("Overloading static functions in classes should work", function () {
        var code  = 'class foo { ';
            code += '   static fnOverload();';
            code += '   static fnOverload(foo:string);';
            code += '   static fnOverload(foo?: any){ }';
            code += '}';
        Harness.Compiler.compileString(code, 'functionOverload', function(result) {
            assert.arrayLengthIs(result.errors, 0);
        });
    });

    it("Overloading functions with parameters inside classes should work", function() {
        var code  = 'class foo { ';
            code += '   private bar();';
            code += '   private bar(foo: string);';
            code += '   private bar(foo?: any){ return "foo" }';
            code += '   public n() {';
            code += '     var foo = this.bar();';
            code += '     foo = this.bar("test");';
            code += '   }';
            code += '}';
        Harness.Compiler.compileString(code, 'functionOverload', function(result) {
            assert.arrayLengthIs(result.errors, 0);
        });
    });

    it("Check for overload with less params", function() {
        var code  = "function foo();";
            code += "function foo(foo:string);";
            code += "function foo(foo?:any){ return '' };";
        Harness.Compiler.compileString(code, 'singleParam', function(result) {          
            assert.arrayLengthIs(result.errors, 0);
        });
    });

    it("Check for overload with same params", function() {
        var code  = "function foo(foo:string); ";
            code += "function foo(foo?:string){ return '' }; ";
            code += "var x = foo('foo'); ";
        Harness.Compiler.compileString(code, 'singleParam', function(result) {          
            assert.arrayLengthIs(result.errors, 0);
        });
    });

    it("Check for overload with more params", function() {
        var code  = "function foo(foo:string, bar:number);";
            code += "function foo(foo:string);";
            code += "function foo(foo:any){ }";
        Harness.Compiler.compileString(code, 'overload', function(result) {       
            assert.arrayLengthIs(result.errors, 0);
        });
    });            
        
    it("Check for overload with not compatible return type", function() {
        var code  = "function foo():number;";
            code += 'function foo():string { return "" };';
        Harness.Compiler.compileString(code, 'overload', function(result) {    
            assert.compilerWarning(result, 1, 1, 'error TS2148: Overload signature is not compatible with function definition.');      
            assert.arrayLengthIs(result.errors, 1);
        });
    });      

    it("Check for overload with compatible return type", function() {
        var code  = "function foo():string;";
            code += 'function foo():number;';
            code += 'function foo():any { if (true) return ""; else return 0;}';
        Harness.Compiler.compileString(code, 'overload', function(result) {     
            assert.equal(result.errors.length, 0);
        });
    });      

    it("Check for overload with compatible return type with parameters", function() {
        var code  = "function foo(bar:number):string;";
            code += 'function foo(bar:number):number;';
            code += 'function foo(bar?:number):any { return "" };';
        Harness.Compiler.compileString(code, 'overload', function(result) {     
            assert.equal(result.errors.length, 0);
        });
    });   
                        
    it("Check for overload with compatible object literal", function() {
        var code  = "function foo():{a:number;};";
            code += 'function foo():{a:string;};';
            code += 'function foo():{a:any;} { return {a:1} };';
        Harness.Compiler.compileString(code, 'overload', function(result) {     
            assert.equal(result.errors.length, 0);
        });
    });     

    it("Check for overload with compatible object literal - 2", function() {
        var code  = "function foo(foo:{a:string; b:number;}):string;";
            code += "function foo(foo:{a:string; b:number;}):number;";
            code += 'function foo(foo:{a:string; b?:number;}):any { return "" };';
        Harness.Compiler.compileString(code, 'overload', function(result) {     
            assert.equal(result.errors.length, 0);
        });
    }); 

    it("Check for overload with compatible object literal - 3", function() {
        var code  = "function foo(foo:{a:string;}):string;";
            code += "function foo(foo:{a:string;}):number;";
            code += 'function foo(foo:{a:string; b?:number;}):any { return "" };';
        Harness.Compiler.compileString(code, 'overload', function(result) {     
            assert.equal(result.errors.length, 0);
        });
    }); 
    
    it("Check for overload with incompatible object literal return type", function() {
        var code  = "function foo():{a:number;};";
            code += 'function foo():{a:string;} { return {a:""} }';
        Harness.Compiler.compileString(code, 'overload', function(result) {     
            assert.equal(result.errors.length, 1);
        });
    }); 

    it("Check for overload with incompatible object literal argument - 2", function() {
        var code  = "function foo(bar:{a:number;});";
            code += 'function foo(bar:{a:string;}) { return {a:""} }';
        Harness.Compiler.compileString(code, 'overload', function(result) {     
            assert.equal(result.errors.length, 1);
        });
    }); 

    it("Check for overload with incompatible object literal argument - 3", function() {
        var code  = "function foo(bar:{b:string;});";
            code += "function foo(bar:{a:string;});";
            code += 'function foo(bar:{a:any;}) { return {a:""} }';
        Harness.Compiler.compileString(code, 'overload', function(result) {     
            assert.equal(result.errors.length, 1);
        });
    }); 

    it("Check for overload with incompatible object literal argument - 4", function() {
        var code  = "function foo(bar:{a:number;}): number;";
            code += "function foo(bar:{a:string;}): string;";
            code += 'function foo(bar:{a:any;}): string {return ""}';
        Harness.Compiler.compileString(code, 'overload', function(result) {     
            assert.equal(result.errors.length, 1);
        });
    }); 

    it("Check for overload with compatible array literal argument", function() {
        var code  = "function foo(bar:{a:number;}[]);";
            code += "function foo(bar:{a:number; b:string;}[]);";
            code += 'function foo(bar:{a:any; b?:string;}[]) { return 0 }';
        Harness.Compiler.compileString(code, 'overload', function(result) {     
            assert.equal(result.errors.length, 0);
        });
    }); 

    it("Check for overload with compatible array literal return type", function() {
        var code  = "function foo(bar:number):{a:number;}[];";
            code += "function foo(bar:string):{a:number; b:string;}[];";
            code += 'function foo(bar:any):{a:any;b?:any;}[] { return [{a:""}] }';
        Harness.Compiler.compileString(code, 'overload', function(result) {     
            assert.equal(result.errors.length, 0);
        });
    }); 

    it("Check for overload with compatible function argument", function() {
        var code  = "function foo(bar:(b:string)=>void);";
            code += "function foo(bar:(a:number)=>void);";
            code += 'function foo(bar:(a?)=>void) { return 0 }';
        Harness.Compiler.compileString(code, 'overload', function(result) {     
            assert.equal(result.errors.length, 0);
        });
    }); 

    
    it("Check for overload with compatible function return type", function() {
        var code  = "function foo(bar:number):(b:string)=>void;";
            code += "function foo(bar:string):(a:number)=>void;";
            code += 'function foo(bar:any):(a)=>void { return function(){} }';
        Harness.Compiler.compileString(code, 'overload', function(result) {     
            assert.equal(result.errors.length, 0);
        });
    }); 

    /*
        Overload Calls
    */

    it("Check the return type of overload with primitive types", function() {
        var code  = "function foo():string;";
            code += "function foo(bar:string):number;";
            code += "function foo(bar?:any):any{ return '' };";
            code += "var x = foo();";
        var returnType = typeFactory.get(code, "x");
        assert.equal(returnType.type, "string");
    });

    it("Check the return type of overload with primitive types - 2", function() {
        var code  = "function foo():string;";
            code += "function foo(bar:string):number;";
            code += "function foo(bar?:any):any{ return '' };";
            code += "var x = foo('baz');";
        var returnType = typeFactory.get(code, "x");
        assert.equal(returnType.type, "number");
    });

    it("Check the return type of overload with primitive types - 3", function() {
        var code  = "function foo():string;";
            code += "function foo(bar:string):number;";
            code += "function foo(bar?:any):any{ return '' };";
            code += "var x = foo(5);";
        Harness.Compiler.compileString(code, 'overload', function(result) {     
            assert.equal(result.errors.length, 2);
        });
    });

    it("Check the return type of overload with primitive types - 4", function() {
        var code  = "function foo():string;";
            code += "function foo(bar:string):number;";
            code += "function foo(bar?:any):any{ return '' };";
            code += "var t:any; var x = foo(t);";
        var returnType = typeFactory.get(code, "x");
        assert.equal(returnType.type, "number");
    });

    it("Check the return type of overload with primitive types - 5", function() {
        var code  = "function foo(bar:string):string;";
            code += "function foo(bar:number):number;";
            code += "function foo(bar:any):any{ return bar };";
            code += "var x = foo();";
        Harness.Compiler.compileString(code, 'overload', function(result) {     
            assert.compilerWarning(result, 1, 113, 'error TS2081: Supplied parameters do not match any signature of call target.'); 
            assert.equal(result.errors.length, 2);
        });
    });

    it("Check the return type of overload with primitive types - 6", function() {
        var code  = "function foo(bar:string):string;";
            code += "function foo(bar:number):number;";
            code += "function foo(bar:any):any{ return bar };";
            code += "var x = foo('bar');";
        var returnType = typeFactory.get(code, "x");
        assert.equal(returnType.type, "string");
    });

    it("Check the return type of overload with primitive types - 7", function() {
        var code  = "function foo(bar:string):string;";
            code += "function foo(bar:number):number;";
            code += "function foo(bar:any):any{ return bar };";
            code += "var x = foo(5);";
        var returnType = typeFactory.get(code, "x");
        assert.equal(returnType.type, "number");
    });

    it("Check the return type of overload with primitive types - 8", function() {
        var code  = "function foo(bar:string):string;";
            code += "function foo(bar:number):number;";
            code += "function foo(bar:any):any{ return bar };";
            code += "var x = foo(true);";
        Harness.Compiler.compileString(code, 'overload', function(result) {     
            assert.compilerWarning(result, 1, 113, 'error TS2081: Supplied parameters do not match any signature of call target.'); 
            assert.equal(result.errors.length, 2);
        });
    });

    it("Check the return type of overload with primitive types - 9", function() {
        var code  = "function foo(bar:string):string;";
            code += "function foo(bar:number):number;";
            code += "function foo(bar:any):any{ return bar };";
            code += "var baz:number; var x = foo(baz);";
        var returnType = typeFactory.get(code, "x");
        assert.equal(returnType.type, "number");
    });

    it("Check the return type of overload with primitive types - 10", function() {
        var code  = "function foo(bar:string):string;";
            code += "function foo(bar:any):number;";
            code += "function foo(bar:any):any{ return bar };";
            code += "var x = foo(5);";
        var returnType = typeFactory.get(code, "x");
        assert.equal(returnType.type, "number");
    });

    it("Check the return type of overload with object literals", function() {
        var code  = "function foo(bar:{a:number;}):string;";
            code += "function foo(bar:{a:boolean;}):number;";
            code += "function foo(bar:{a:any;}):any{ return bar };";
            code += "var x = foo();";
        Harness.Compiler.compileString(code, 'overload', function(result) {     
            assert.compilerWarning(result, 1, 129, 'error TS2081: Supplied parameters do not match any signature of call target.'); 
            assert.equal(result.errors.length, 2);
        });
    });

    it("Check the return type of overload with object literals - 2", function() {
        var code  = "function foo(bar:{a:number;}):number;";
            code += "function foo(bar:{a:string;}):string;";
            code += "function foo(bar:{a:any;}):any{ return bar };";
            code += "var x = foo({a:1});";
        var returnType = typeFactory.get(code, "x");
        assert.equal(returnType.type, "number");
    });
    
    it("Check the return type of overload with object literals - 3", function() {
        var code  = "function foo(bar:{a:number;}):number;";
            code += "function foo(bar:{a:string;}):string;";
            code += "function foo(bar:{a:any;}):any{ return bar };";
            code += "var x = foo({a:'foo'});";
        var returnType = typeFactory.get(code, "x");
        assert.equal(returnType.type, "string");
    });

    // TODO: Harness is complaining when these are run along with everything else
    //it("Check the return type of overload with object literals - 4", function() {
    //    var code  = "function foo(bar:{a:number;}):number;";
    //        code += "function foo(bar:{a:string;}):string;";
    //        code += "function foo(bar:{a:any;}):any{ return bar };";
    //        code += "var x = foo({a:true});";
    //    Harness.Compiler.compileString(code, 'overload', function(result) {     
    //        assert.equal(result.errors.length, 2);
    //    });
    //});
    
    //it("Check the return type of overload with object literals - 5", function() {
    //    var code  = "function foo(bar:{a:number;}):string;";
    //        code += "function foo(bar:{a:boolean;}):number;";
    //        code += "function foo(bar:{a:any;}):any{ return bar };";
    //        code += "var x = foo({});";
    //    Harness.Compiler.compileString(code, 'overload', function (result) {
    //        assert.equal(result.errors.length, 2);
    //    });
    //});    

    //it("Check the return type of overload with object literals- 6", function() {
    //    var code  = "function foo(bar:{a:number;}):string;";
    //        code += "function foo(bar:{a:any;}):number;";
    //        code += "function foo(bar:{a:any;}):any{ return bar };";
    //        code += "var x = foo({a:'s'});";
    //    var returnType = typeFactory.get(code, "x");
    //    assert.equal(returnType.type, "number");
    //});

    it("Check the return type of overload with array literals", function() {
        var code  = "function foo(bar:{a:number;}[]):string;";
            code += "function foo(bar:{a:boolean;}[]):number;";
            code += "function foo(bar:{a:any;}[]):any{ return bar };";
            code += "var x = foo();";
        Harness.Compiler.compileString(code, 'overload', function(result) {  
            assert.compilerWarning(result, 1, 135, 'error TS2081: Supplied parameters do not match any signature of call target.'); 
            assert.equal(result.errors.length, 2);
        });
    });

    it("Check the return type of overload with array literals - 2", function() {
        var code  = "function foo(bar:{a:number;}[]):string;";
            code += "function foo(bar:{a:boolean;}[]):number;";
            code += "function foo(bar:{a:any;}[]):any{ return bar };";
            code += "var x = foo([{a:1}]);";
        var returnType = typeFactory.get(code, "x");
        assert.equal(returnType.type, "string");
    });

    it("Check the return type of overload with array literals - 3", function() {
        var code  = "function foo(bar:{a:number;}[]):string;";
            code += "function foo(bar:{a:boolean;}[]):number;";
            code += "function foo(bar:{a:any;}[]):any{ return bar };";
            code += "var x = foo([{a:true}]);";
        var returnType = typeFactory.get(code, "x");
        assert.equal(returnType.type, "number");
    });

    assert.bug("17994: Shouldn't issue error about incompatible types in array literal due to contextual typing");
    
    it("Check the return type of overload with array literals - 4", function() {
        var code  = "function foo(bar:{a:number;}[]):string;";
            code += "function foo(bar:{a:boolean;}[]):number;";
            code += "function foo(bar:{a:any;}[]):any{ return bar };";
            code += "var x = foo([{a:'bar'}]);";
        Harness.Compiler.compileString(code, 'overload', function(result) {     
            //assert.compilerWarning(result, 1, 131, 'Supplied parameters do not match any signature of call target'); 
            assert.equal(result.errors.length, 2);
        });
    });
    

    
    //BUG -> Should give ambiguous error
    it("Check the return type of overload with array literals - 5", function() {
        var code  = "function foo(bar:{a:number;}[]):string;";
            code += "function foo(bar:{a:boolean;}[]):number;";
            code += "function foo(bar:{a:any;}[]):any{ return bar };";
            code += "var x = foo([{}]);";
        Harness.Compiler.compileString(code, 'overload', function(result) {     
            //assert.compilerWarning(result, 1, 131, 'Supplied parameters do not match any signature of call target'); 
            assert.equal(result.errors.length, 2);
        });
    });
    

    it("Check the return type of overload with array literals - 6", function() {
        var code  = "function foo(bar:{a:number;}[]):string;";
            code += "function foo(bar:{a:any;}[]):number;";
            code += "function foo(bar:{a:any;}[]):any{ return bar };";
            code += "var x = foo([{a:'s'}]);";
        var returnType = typeFactory.get(code, "x");
        assert.equal(returnType.type, "number");
    });

    assert.bug('[Errors] No error trying to call/define ambiguous functions overload');
    //it("Check the return type of overload with functions", function() {
    //    var code  = "function foo(bar:(b:string)=>void):string;";
    //        code += "function foo(bar:(a:number)=>void):number;";
    //        code += 'function foo(bar:(a:any)=>void):any { return 0 }';
    //        code += 'var x = foo(()=>{});';
    //    Harness.Compiler.compileString(code, 'overload', function(result) {     
    //        assert.equal(result.errors.length, 1);
    //    });
    //}); 
});