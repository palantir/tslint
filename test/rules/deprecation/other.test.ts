/** @deprecated reason */
export function other(): void;
/** not deprecated */
export function other(num: number);
export function other(_num?: number) {}

/** @deprecated */
export let other2: Function;

/** This one has @deprecated somewhere in it's jsdoc */
export let notDeprecated: any;
/* @deprecated but it's no JsDoc */
export let notDeprecated2: any;

/** @deprecated deprecated default export */
let def = "";
export default def;

/** @deprecated */
export class DeprecatedClass {
    constructor() {}
}

export class DeprecatedConstructorClass {
    /** @deprecated */
    constructor() {}
}

export class PartiallyDeprecatedClass {
    constructor();
    /** @deprecated */
    constructor(foo: number);
    constructor(_foo?: number) {}
}
