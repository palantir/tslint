declare module "winjs" {

export class Promise {

static timeout(delay: number): Promise;




}

}


import WinJS = module('winjs');




WinJS.Promise.timeout(10);
