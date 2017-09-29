declare function get<T>(): T;

// typeof undefined
{
    typeof get<boolean>() === "undefined";

    typeof get<void>() === "undefined";

    typeof get<boolean | undefined>() === "undefined";

    declare const c: any;
    typeof get<any>() === "undefined";

    // 'undefined' is not assignable to '{}'
    typeof get<{}>() === "undefined";
}

// typeof boolean
{
    declare const a: boolean;
    typeof get<boolean>() === "boolean";

    typeof get<Boolean>() === "boolean";

    typeof get<boolean | undefined>() === "boolean";

    typeof get<{}>() === "boolean";
}

// typeof number
{
    enum E {}

    typeof get<E>() === "number";

    typeof get<Number>() === "number";
}

// typeof string
{
    typeof get<"abc" | "def">() === "string";

    typeof get<String>() === "string";

    typeof get<"abc" | undefined>() === "string";
}

// typeof symbol
{
    typeof get<symbol>() === "symbol";

    typeof get<string>() === "symbol";

    typeof get<symbol | string>() === "symbol";
}

// typeof function
{
    typeof get<() => void>() === "function";

    typeof get<Function>() === "function";


    typeof get<number>() === "function";

    typeof get<number | (() => void)>() === "function";

    class X {}
    typeof X === "function";
    typeof X === "object";

    // Works with union
    class Foo { }
    typeof get<typeof Foo | object> === "function";
}

// typeof object
{
    typeof get<boolean | number | string | symbol | (() => void) | Function>() === "object";

    typeof get<{}> === "object";
}

// === null / undefined
{
    get<number | undefined>() === null;

    get<number | null>() === null;

    get<number | null>() === undefined;

    get<number | undefined>() === undefined;

    // 'null' and 'undefined' are not assignable to '{}'

    get<{}>() === null;

    get<{}>() === undefined;

    get<string | undefined>() == null;

    get<string | null>() == undefined;

    get<string | null>() == null;

    get<string | undefined>() == undefined;

    get<string | undefined>() != null;

    get<{}>() == null;

    get<string | null | undefined>() == null;
    get<string | null | undefined>() != undefined;

    get<null|undefined>() == null;
    get<null|undefined>() != undefined;
}

// negation
{
    get<number | undefined>() !== null;

    get<number | null>() !== null;

    get<number | null>() !== undefined;

    get<number | undefined>() !== undefined;

    typeof get<string>() !== "string";
}

// reverse left/right
{
    "string" === typeof get<number>();

    undefined === get<void>();
}

// type parameters
{
    function f<T>(t: T) {
        typeof t === "boolean";
    }

    // TODO: Would be nice to catch this.
    function g<T extends string>(t: T) {
        typeof t === "boolean";
    }
}

// Detects bad typeof
{
    typeof get<boolean>() === true;

    typeof get<any>() === "orbject";
}
