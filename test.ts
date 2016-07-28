interface i1 {
    f1();
    f2(a: symbol);
    f3(a: number, b?: (c: string, d: number) => void);
    f4: {
        f5(b?: (c: string, d: number) => void);
    }
}