interface MyInterface {
    myMethod(...myList: any[]);
}
class MyClass implements MyInterface {
    myMethod(myList: any[]) {
    }
}

var x: MyInterface = new MyClass();
x.myMethod(); // should be valid, but MyClass has no implementation to handle it.

var y: MyClass = new MyClass();
y.myMethod(); // error