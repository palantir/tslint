// @FileName: duplicateIdentifierShouldNotShorCircuitBaseTypeBindingA.ts
interface IPoint {}

module Shapes {

    export class Point implements IPoint {}

}

// @FileName: duplicateIdentifierShouldNotShorCircuitBaseTypeBindingB.ts
interface IPoint {}

module Shapes {

    export class Point implements IPoint {}

}