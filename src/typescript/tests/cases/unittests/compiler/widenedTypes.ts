/// <reference path="..\..\..\..\src\harness\harness.ts" />
describe('Literal values are widened', function() {
    var typeFactory = new Harness.Compiler.TypeFactory();

    var isOfType = function(expr: string, expectedType: string) {
        var actualType = typeFactory.get('var z = ' + expr, 'z');
        
        it('Literal "' + expr + '" is of type "' + expectedType + '"', function() {
            assert.equal(actualType.type, expectedType);
        });
    }

    isOfType('null', 'any');
    isOfType('undefined', 'any');

    // TODO: compiler just calls all of these nulls and undefineds 'any' now, not very useful tests
    //isOfType('{x: null}', '{ x: any; }');
    //isOfType('[{x: null}]', '{ x: any; }[]');
    //isOfType('[{x: null, y: void 2}]', '{ x: any; y: any; }[]');
    //isOfType('{x: null}', '{ x: any; }');
    //isOfType('[{x: null}]', '{ x: any; }[]');
    //isOfType('[{x: null, y: void 2}]', '{ x: any; y: any; }[]');

    //isOfType('[null, null]', 'any[]');
    //isOfType('[undefined, undefined]', 'any[]');
    //isOfType('[{x: undefined}]', '{ x: any; }[]');
    //isOfType('[{x: undefined, y: void 2}]', '{ x: any; y: any; }[]');
});
