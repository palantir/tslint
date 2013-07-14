class Bug {
    private name: string;

    private static func: Function[] = [
     (that: Bug, name: string) => {
         that.foo(name);
     }
    ];

    private foo(name: string) {
        this.name = name;
    }
}

// Valid use of this in a property bound decl
class A {
    prop1 = function() {
        this;
    };

    prop2 = function() {
        function inner() {
            this;
        }
        () => this;
    };

    prop3 = () => {
        function inner() {
            this;
        }
    };

    prop4 = {
        a: function() { return this; },
    };

    prop5 = () => {
        return {
            a: function() { return this; },
        };
    };
}
