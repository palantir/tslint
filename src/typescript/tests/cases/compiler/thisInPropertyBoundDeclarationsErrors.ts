// Invalid use of this in a property bound decl
class B {
    prop1 = this;

    prop2 = () => this;

    prop3 = () => () => () => () => this;

    prop4 = '  ' + 
        function() {
        } +
        ' ' + 
        () => () => () => this;

    prop5 = {
        a: () => { return this; }
    };

    prop6 = () => {
        return {
            a: () => { return this; }
        };
    };
}