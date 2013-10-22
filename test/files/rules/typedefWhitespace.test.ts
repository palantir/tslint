var noPreceedingSpaceObjectLiteralWithPropertyGetter = {
    Prop: "some property",
    
    get Prop(): string {
        return Prop;
    }
};

var withPreceedingSpaceObjectLiteralWithPropertyGetter = {
    Prop: "some property",

    get Prop() : string {
        return Prop;
    }
};

interface NoPreceedingSpaceInterface {
    Prop: string;
}

interface WithPreceedingSpaceInterface {
    Prop : string;
}

var noPreceedingSpacesFn = function (a: number, b: number): number {
    var c: number = a + b;
    var d: number = a - b;

    try {
        return c / d;
    } catch (ex: Exception) {
        console.log(ex);
    }
};

var withPreceedingSpacesFn = function (a : number, b : number) : number {
    var c : number = a + b;
    var d : number = a - b;

    try {
        return c / d;
    } catch (ex : Exception) {
        console.log(ex);
    }
};

class NoPreceedingSpacesClass {
    [index: number]: string

    Prop: string = "some property";

    public get name(): string {
        return "some name";
    }
}

class WithPreceedingSpacesClass {
    [index : number] : string

    Prop : string = "some property";

    public get name() : string {
        return "some name";
    }
}
