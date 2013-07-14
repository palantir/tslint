function test(thing) {
    thing.thunk("str");
}
test({
    thunk: function (str) {
        console.log('string: ' + str);
    },
    thunk: function (num) {
        console.log('number: ' + num);
    }
});

test({
    thunk: function (num) {
        console.log('number: ' + num);
    },
    thunk: function (str) {
        console.log('string: ' + str);
    }
});
