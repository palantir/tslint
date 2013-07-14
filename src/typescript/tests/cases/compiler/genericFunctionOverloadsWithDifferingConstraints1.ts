function foo4<T extends Date>(test: T);
function foo4<T extends Number>(test: string);
function foo4<T extends String>(test: any) { }
foo4<Date>(""); // error

function foo5<T extends Date>(test: T): T;
function foo5<T extends Number>(test: string): T;
function foo5<T extends String>(test: any): any { return null; }
foo5<Date>(""); // error