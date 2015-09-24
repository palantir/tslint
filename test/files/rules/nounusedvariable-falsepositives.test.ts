// case 1
const fs = require("fs");

module Foo {
    const path = require("path");

    console.log(fs);
    console.log(path);
}

// case 2
class HelloWorld {
    constructor(public name: string) { }
    sayHello() {
        return `Hello, ${this.name}!`;
    }
};

let hello = new HelloWorld("TSLint");
hello.sayHello();

// case 3
import Bar = whatever.that.Foo;

module some.module.blah {
    export class bar {
        private bar: Bar;
        constructor() {
            console.log(this.bar);
        }
    }
}

// case 4
import DateTimeOpts = Intl.DateTimeFormatOptions;

interface MyDateTimeOpts extends DateTimeOpts {
    timezoneOffset: number;
}

let opts: MyDateTimeOpts;
console.log(opts.timezoneOffset - 1);
