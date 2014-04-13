var NoTypeObjectLiteralWithPropertyGetter = {
    Prop: "some property",

    get Prop() {
        return Prop;
    }
};

interface NoTypeInterface {
    Prop;
}

var NoTypesFn = function (
    a,
    b) {
    var c = a + b,
        d = a - b;

    try {
        return c / d;
    } catch (ex) {
        console.log(ex);
    }
};

class NoTypesClass {
    [index]

    Prop = "some property";

    public get name() {
        return "some name";
    }
}
