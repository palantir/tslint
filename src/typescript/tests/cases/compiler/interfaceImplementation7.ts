interface i1{ name(): { s: string; }; }
interface i2{ name(): { n: number; }; }

// BUG 12764: Error should be issued when attempting to declare unimplementable interface
interface i3 extends i1, i2 { }
interface i4 extends i1, i2 { name(): { s: string; n: number; }; }

class C1 implements i4 {
    public name(): string { return ""; }
}
