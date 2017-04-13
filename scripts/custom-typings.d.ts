// Node v4+ support Object.assign
interface ObjectConstructor {
    assign(target: any, ...sources: any[]): any;
}

declare module "json-stringify-pretty-compact" {
    function stringify(x: any): string;
    export = stringify;
}
