var testVariable = "debugger";

function testFunction(): number {
    if (testVariable === "debugger") {
        debugger;
    }
}
