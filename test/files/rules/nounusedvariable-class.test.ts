class ABCD {
    private z2: number; // failure
    constructor() {
    }

    mfunc1() {
        //
    }

    public mfunc2() {
        this.mfunc3();
    }

    private mfunc3() {
        //
    }

    private mfunc4() { // failure
        //
    }
    static stillPublic: number;
}
