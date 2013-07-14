function foo(args) {
    return args.length;
}

////[0.d.ts]
declare function foo(args: {
    (x: any): number;
}[]): number;
