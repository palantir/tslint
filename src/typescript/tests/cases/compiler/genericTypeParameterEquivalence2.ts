// compose :: (b->c) -> (a->b) -> (a->c)
function compose<A, B, C>(f: (b: B) => C, g: (a:A) => B): (a:A) => C {
    return function (a:A) : C {
        return f(g.apply(null, a));
    };
}

// forEach :: [a] -> (a -> ()) -> ()
function forEach<A>(list: A[], f: (a: A, n?: number) => void ): void {
    for (var i = 0; i < list.length; ++i) {
        f(list[i], i);
    }
}

// filter :: (a->bool) -> [a] -> [a]
function filter<A>(f: (a: A) => bool, ar: A[]): A[] {
    var ret = [];
    forEach(ar, (el) => {
        if (f(el)) {
            ret.push(el);
        }
    } );

    return ret;
}

// length :: [a] -> Num
function length<A>(ar: A[]): number {
    return ar.length;
}

// curry1 :: ((a,b)->c) -> (a->(b->c))
function curry1<A, B, C>(f: (a: A, b: B) => C): (ax: A) => (bx: B) => C {
    return function (ay: A) {
        return function (by: B) {
            return f(ay, by);
        };
    };
}

var cfilter = curry1(filter);

// compose :: (b->c) -> (a->b) -> (a->c)
// length :: [a] -> Num
// cfilter :: (a -> Bool) -> [a] -> [a]
// pred :: a -> Bool 
// countWhere :: (a -> Bool) -> [a] -> Num

function countWhere_1<A>(pred: (a: A) => bool): (a: A[]) => number {
    return compose(length, cfilter(pred));
}

function countWhere_2<A>(pred: (a: A) => bool): (a: A[]) => number {
    var where = cfilter(pred);
    return compose(length, where);
}