// bug 687698: Inferred type for Array<T>.slice is any[]
var x:string[] =  [0,1].slice(0); // this should be an error
