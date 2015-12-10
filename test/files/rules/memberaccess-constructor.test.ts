class ContructorsNoAccess {
    constructor(i: number);
    constructor(o: any) {}
}

class ContructorsAccess {
    public constructor(i: number);
    public constructor(o: any) {}
}
