var testVariable = 123;

function testFunction(): number {
    if(arguments.callee.caller === testFunction) {
        console.log("called");
    }

    argument.callee = testFunction;

    return testVariable;
}
