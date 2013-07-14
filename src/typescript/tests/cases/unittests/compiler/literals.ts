/// <reference path="..\..\..\..\src\harness\harness.ts" />
describe('Literal expressions have the correct types', function() {
    var typeFactory = new Harness.Compiler.TypeFactory();

    var isOfType = function(expr: string, expectedType: string) {
        var actualType = typeFactory.get('var x = ' + expr, 'x');
        
        it('Literal "' + expr + '" is of type "' + expectedType + '"', function() {
            assert.equal(actualType.type, expectedType);
        });
    }

    // Numbers
    describe('Numeric literals are of the "number" type', function() {
        var isNumber = function(x) { isOfType(x, 'number'); };
        
        isNumber('42');
        isNumber('0xFA34');
        isNumber('0.1715');
        isNumber('3.14E5');
        isNumber('8.14e-5');
        isNumber('02343');
    });

    // boolean
    describe('boolean literals are of the "boolean" type', function() {
        var isBool= function(x) { isOfType(x, 'boolean'); };
        
        isBool('true');
        isBool('false');
    });

    describe('String literals are of the "string" type', function() {
        var isString = function(x) { isOfType(x, 'string'); };

        isString('""');
        isString('"hi"');
        isString("''");
        isString("'q\tq'");
    });
    
    describe('RegExp literals are of the "RegExp" type', function() {
        var isRegExp = function(x) { isOfType(x, 'RegExp'); };
        
        isRegExp('/q/');
        isRegExp('/\d+/g');
        isRegExp('/[3-5]+/i');
    });
});
