if (x === 1) {}
if (x === 2) {


}

function testFunction() {

}

for (var x = 0; x < 1; ++x) { }

// empty blocks with comments should be legal
for (var y = 0; y < 1; ++y) {
    // empty here
}

class testClass {
    constructor(private allowed: any, private alsoAllowed: any) {
    }
}

class testClass2 {
    constructor(notAllowed: any) {
    }
}
