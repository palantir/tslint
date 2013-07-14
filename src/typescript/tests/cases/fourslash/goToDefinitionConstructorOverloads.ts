/// <reference path='fourslash.ts' />

/////*constructorOverloadDefinition*/class ConstructorOverload {
////    /*constructorOverload*/constructor();
////    constructor(foo: string);
////    constructor(foo: any)  { }
////}
////
////var constructorOverload = new /*constructorOverloadReference*/ConstructorOverload();

goTo.marker('constructorOverloadReference');
goTo.definition();
verify.caretAtMarker('constructorOverloadDefinition');

goTo.marker('constructorOverload');
goTo.definition();
verify.caretAtMarker('constructorOverloadDefinition');
