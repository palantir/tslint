// bug 17136: Error when forward-referencing derived class forwarding constructor
// Error forward referencing derived class with forwarding constructor

function f() {
    var d1 = new derived();  // Incorrectly allowed
    var d2 = new derived(4); // Incorrectly flagged as error
}

class base { constructor (public n: number) { } }
class derived extends base { }
