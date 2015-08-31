namespace sample {
    export class HelloWorld {
        constructor(public name: string) { }
        sayHello() {
            return `Hello, ${this.name}!`;
        }
    };

    let hello = new HelloWorld("TSLint");
    hello.sayHello();
}
