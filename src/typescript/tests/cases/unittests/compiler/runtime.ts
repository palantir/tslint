/// <reference path='..\..\..\..\src\compiler\typescript.ts' />
/// <reference path='..\..\..\..\src\harness\harness.ts' />

interface RT_JQueryElement {
    id: string;
}

interface RT_JQuery {
    [n: number]: RT_JQueryElement;
}

module RT_StaticModule {
    export class C {
        x: number;
        g: any;
        constructor(public c1: number, public c2: number, c3: number) {
            this.x = C.y + this.c1 + this.c2 + c3;
            this.g = (v: number) => C.f(this.x + C.y + v + this.c1 + this.c2 + C.pub);
        }

        static priv = 2;
        static pub = 3;
        static y = C.priv;
        static f(n: number) {
            return "wow: " + (n + C.y + C.pub + C.priv);

        }
    }
    var c = C.y;
    export function f() {
        var result = "";
        result += (c);
        result += (new C(0, 1, 2).x);
        result += (C.f(10));
        result += (new C(5, 10, 20).g(C.y));
        return result;
    }
}

module RT_SuperCalls {
    class Base {
        constructor() {
            var x;
        }
        public foo() {
            return "base";
        }

        public bar() {
            return "basebar";
        }
    }

    class Sub1 extends Base {
        public foo() {
            return "sub1" + super.foo() + super.bar();
        }
    }


    class SubSub1 extends Sub1 {
        public foo() {
            return "subsub1" + super.foo();
        }
    }

    var s = new Sub1();
    var ss = new SubSub1();
    export var result = s.foo() + ss.foo();
}

module RT_SuperCalls2 {
    // Case 5
    class Base5 {
        public x() {
            return "BaseX";
        }
        
        public y() {
            return "BaseY";
        }
    }

    class Sub5 extends Base5 {
        public x() {
            return "SubX";
        }
    }

    class SubSub5 extends Sub5 {
        public x() {
            return super.x();
        }
        public y() {
            return super.y();
        }
    }

    // Case 6
    class Base6 {
        public x() {
            return "BaseX";
        }
    }

    class Sub6 extends Base6 {
        public y() {
            return "SubY";
        }
    }

    class SubSub6 extends Sub6 {
        public y() {
            return super.y();
        }
    }


    var results1 = new SubSub5();
    var results2 = new SubSub6();
    export var result = results1.x() + results1.y() + results2.y();
}

module RT_VarArgs {
    module M {
        export class C {
            public f(x: string, ...rest: number[]) {
                var sum = 0;
                for (var i = 0; i < rest.length; i++) {
                    sum += rest[i];
                }
                result += (x + ": " + sum);
                return result;
            }

            public fnope(x: string, ...rest: number[]) {
            
            }

            public fonly(...rest: string[]) {
                var builder = "";
                for (var i = 0; i < rest.length; i++) {
                    builder += rest[i];
                }
                return builder;
            }
        }
    }

    var x = new M.C();
    export var result = "";
    result += x.f("hello", 3, 3, 3, 3, 3); // ok
    result += x.f("hello"); // ok varargs length 0
    result += x.fonly("a"); // ok 
    result += x.fonly("a", "b", "c", "d"); //ok 
}

describe('Runtime behavior tests', function () {
    it('Indexes properly', function () {
        var jq: RT_JQuery = { 0: { id: "a" }, 1: { id: "b" } };
        Harness.Assert.equal(jq[0].id, 'a');
    });
    debugger;
    it('Calls static methods properly', function () {
        // Bug 713955
        //Harness.Assert.equal(RT_StaticModule.f(), '25wow: 17wow: 66');
    });
    
    it('Generates string indices properly', function () {
        var a = {
            "foo": function () { },
            "bar": 5
        };

        Harness.Assert.equal(a.bar.toString(), '5');
    });

    it('Calls super methods correctly (#1)', function () {
        // Bug 713955
        //Harness.Assert.equal(RT_SuperCalls.result, 'sub1basebasebarsubsub1sub1basebasebar');
    });

    it('Calls super methods correctly (#2)', function () {
        // Bug 713955
        //Harness.Assert.equal(RT_SuperCalls2.result, 'SubXBaseYSubY');
    });

    it('Calls methods on primitives correctly', function () {
        Harness.Assert.equal(true.toString(), 'true');
        var aBool = false;
        Harness.Assert.equal(aBool.toString(), 'false');
        Harness.Assert.equal(1..toString(), '1');
    });

    it('Copies vararg arrays correctly', function () {
        Harness.Assert.equal(RT_VarArgs.result, 'hello: 15hello: 15hello: 0aabcd');
    });
});
