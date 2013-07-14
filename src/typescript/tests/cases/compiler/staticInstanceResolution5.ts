declare module "winjs" {
    export class Promise {
        static timeout(delay: number): Promise;
    }
}
import WinJS = module('winjs');

// these 3 should be errors
var x = (w1: WinJS) => { };
var y = function (w2: WinJS) { }
function z(w3: WinJS) { }
