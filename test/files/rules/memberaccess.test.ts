declare class AmbientNoAccess {
    a(): number;
}

declare class AmbientAccess {
    public a(): number;
}

class Members {
    i: number;

    public nPublic: number;
    protected nProtected: number;
    private nPrivate: number;

    noAccess(x: number): number;
    noAccess(o: any): any {}

    public access(x: number): number;
    public access(o: any): any {}
}

const obj = {
    func() {}
};

function main() {
    class A {
        i: number;
        public n: number;
    }
}
