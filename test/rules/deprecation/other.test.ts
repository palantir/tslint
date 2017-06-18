/** @deprecated reason */
export function other() {}

/** @deprecated */
export let other2: Function;

/** This one has @deprecated somewhere in it's jsdoc */
export let notDeprecated: any;
/* @deprecated but it's no JsDoc */
export let notDeprecated2: any;

/** @deprecated deprecated default export */
let def = "";
export default def;