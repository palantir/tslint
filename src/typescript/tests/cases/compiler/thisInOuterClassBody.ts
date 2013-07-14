class Foo2 {
 
    x = this.fgoo; // illegal, and 'this' will be typed to 'any'
 
    bar() {
 
        this.x; // 'this' is type 'Foo'
 
        var f = () => this.x; // 'this' should be type 'Foo' as well

    }
 
}