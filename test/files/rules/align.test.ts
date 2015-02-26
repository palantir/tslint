function invalidParametersAlignment1(a: number,
b: number) {
    var i = 0;
}

function invalidParametersAlignment2(a: number, b: number,
c: number) {
    var i = 0;
}

function invalidParametersAlignment3(a: number,
                             b: number,
                           c: number) {
    var i = 0;
}

class C1 {
    function invalidParametersAlignment(a: number,
                           b: number)
    {
    }
}

class InvalidAlignmentInConstructor {
    function constructor(a: number,
                                 str: string)
    {
    }
}

var invalidParametersAlignment4 = function(xxx: foo,
                              yyy: bar) { return true; }

function validParametersAlignment1(a: number, b: number) {
    var i = 0;
}

function validParametersAlignment2(a: number, b: number,
                                   c: number) {
    var i = 0;
}

function validParametersAlignment3(a: number,
                                   b: number,
                                   c: number) {
    var i = 0;
}

function validParametersAlignment4(
      a: number,
      b: number,
      c: number) {
    var i = 0;
}

var validParametersAlignment6 = function(xxx: foo,
                                         yyy: bar) { return true; }


///////

void invalidArgumentsAlignment1()
{
    f(10,
    'abcd', 0);
}

void invalidArgumentsAlignment2()
{
    f(10,
      'abcd',
        0);
}

void validArgumentsAlignment1()
{
    f(101, 'xyz', 'abc');
}

void validArgumentsAlignment2()
{
    f(1,
      2,
      3,
      4);
}

void validArgumentsAlignment3()
{
    f(
        1,
        2,
        3,
        4);
}

void validArgumentsAlignment3()
{
    f(1, 2,
      3, 4);
}

////////

void invalidStatementsAlignment1()
{
    var i = 0;
    var j = 0;
     var k = 1;
}

void invalidStatementsAlignment1()
{
    var i = 0;
    {
        var j = 0;
       var k = 1;
    }
}

void validStatementsAlignment1()
{
    var i = 0;
    var j = 0;
    var k = 1;
}

void validStatementsAlignment2()
{
    var i = 0;
    {
        var j = 0;
        var k = 1;
    }
}
