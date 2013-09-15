class Test {
    private myFunc() {
        var notDuplicated = 123,
            duplicated = 234,
            someFunc = () => {
                var notDuplicated = 345;
            };

        var duplicated = null;
    }
}

function test() {
    var notDuplicated = 123,
        duplicated = 234,
        someFunc = () => {
            var notDuplicated = 345;
        };

    var duplicated = null;
}
