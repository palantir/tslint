// bug 17632: Compiler crash on invalid static field
//class A { foo() { return B.NULL; } }
//class B { static NOT_NULL = new B(); }