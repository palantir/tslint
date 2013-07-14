/// Bug 512325
var tt1 = (a, (b, c)) => a+b+c;
var tt2 = ((a), b, c) => a+b+c;

var tt3 = ((a)) => a;