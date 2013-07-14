var \u0061 = 1;
a++;
\u0061++;

var b = 1;
b++;
\u0062++;

var moduleType1;
(function (moduleType1) {
    moduleType1.baz1;
})(moduleType1 || (moduleType1 = {}));
var moduleType\u0032;
(function (moduleType\u0032) {
    moduleType\u0032.baz2;
})(moduleType\u0032 || (moduleType\u0032 = {}));

moduleType1.baz1 = 3;
moduleType\u0031.baz1 = 3;
moduleType2.baz2 = 3;
moduleType\u0032.baz2 = 3;

var classType1 = (function () {
    function classType1() {
    }
    return classType1;
})();
var classType\u0032 = (function () {
    function classType\u0032() {
    }
    return classType\u0032;
})();

var classType1Object1 = new classType1();
classType1Object1.foo1 = 2;
var classType1Object2 = new classType\u0031();
classType1Object2.foo1 = 2;
var classType2Object1 = new classType2();
classType2Object1.foo2 = 2;
var classType2Object2 = new classType\u0032();
classType2Object2.foo2 = 2;

var interfaceType1Object1 = { bar1: 0 };
interfaceType1Object1.bar1 = 2;
var interfaceType1Object2 = { bar1: 0 };
interfaceType1Object2.bar1 = 2;
var interfaceType2Object1 = { bar2: 0 };
interfaceType2Object1.bar2 = 2;
var interfaceType2Object2 = { bar2: 0 };
interfaceType2Object2.bar2 = 2;

var testClass = (function () {
    function testClass() {
    }
    testClass.prototype.func = function (arg1, arg\u0032, arg\u0033, arg4) {
        arg\u0031 = 1;
        arg2 = 'string';
        arg\u0033 = true;
        arg4 = 2;
    };
    return testClass;
})();

var constructorTestClass = (function () {
    function constructorTestClass(arg1, arg\u0032, arg\u0033, arg4) {
        this.arg1 = arg1;
        this.arg\u0032 = arg\u0032;
        this.arg\u0033 = arg\u0033;
        this.arg4 = arg4;
    }
    return constructorTestClass;
})();
var constructorTestObject = new constructorTestClass(1, 'string', true, 2);
constructorTestObject.arg\u0031 = 1;
constructorTestObject.arg2 = 'string';
constructorTestObject.arg\u0033 = true;
constructorTestObject.arg4 = 2;

l\u0061bel1:
while (false) {
    while (false)
        continue label1;
}

label2:
while (false) {
    while (false)
        continue label2;
}

label3:
while (false) {
    while (false)
        continue label3;
}

l\u0061bel4:
while (false) {
    while (false)
        continue label4;
}
