function foo(b: (item: number) => bool) { }
foo(a => a); // can not convert (number)=>bool to (number)=>number