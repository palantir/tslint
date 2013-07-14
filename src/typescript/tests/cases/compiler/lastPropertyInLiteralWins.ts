interface Thing {
    thunk: (str: string) => void;
}
function test(thing: Thing) {
    thing.thunk("str");
}
test({ // Should error, as last one wins, and is wrong type
    thunk: (str: string) => {
       console.log('string: ' + str)
    },
    thunk: (num: number) => {
       console.log('number: ' + num)
    }
});

test({ // Should be OK.  Last 'thunk' is of correct type
    thunk: (num: number) => {
       console.log('number: ' + num)
    },
    thunk: (str: string) => {
       console.log('string: ' + str)
    }
});
