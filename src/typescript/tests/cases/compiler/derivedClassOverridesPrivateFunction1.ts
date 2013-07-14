class BaseClass {
    constructor() {
        this._init();
    }
    private _init() {
        alert("base init called");
    }
}
class DerivedClass extends BaseClass {
    constructor() {
        super();
    }
    private _init() {
        alert("derived init called");
    }
}
new DerivedClass();