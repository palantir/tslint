function fun1() {
    return 0;
}

function fun2(a: number) {
    return 0;
}

function fun3(a: number, b: number) {
    return 0;
}

// valid code:

var i: number;
var j = 3;
i = 1 + 2;
j = fun1();
fun1();
fun2(2);
fun3(2, fun1());
i++;
i += 2;
--i;
i <<= 2;
i = fun1() + fun1();
j = (j === 0 ? 5 : 6);
(j === 0 ? fun1() : fun2(j));
(a => 5)(4);
"use strict";

// invalid code:

5;
i;
3 + 5;
fun1() + fun1();
fun2(i) + fun3(4,7);
fun1() + 4;
4 + fun2(j);
(j === 0 ? fun1() : 5);
(j === 0 ? i : fun2(j));
a => fun2(a);
() => {return fun1();};
"use strct";

// sigh, valid code again:

var obj = {};
delete obj.key;
