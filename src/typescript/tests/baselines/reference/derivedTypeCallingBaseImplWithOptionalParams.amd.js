var MyClass = (function () {
    function MyClass() {
    }
    MyClass.prototype.myMethod = function (myList) {
    };
    return MyClass;
})();

var x = new MyClass();
x.myMethod();

var y = new MyClass();
y.myMethod();
