declare module "module" {
	var id: number;
}

declare module "Test2" {
	function b(a:any): any;
}

import mod = module("module");
import b = module("Test2");
 
export var a = function () {
    //var x = mod.id; // TODO needed hack that mod is loaded
    b.b(mod);
}
