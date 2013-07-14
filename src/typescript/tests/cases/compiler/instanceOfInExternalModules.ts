declare module "FS"

{

 export class Foo { }

}
 
import Bar = require("FS");
 
function IsFoo(value: any): boolean

{

 return value instanceof Bar.Foo;

}
