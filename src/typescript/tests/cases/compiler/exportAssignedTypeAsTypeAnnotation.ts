declare module "test" {
    interface x {
        (): Date;
        foo: string;
    }
    export = x;
}
 
import test = require('test');
var t2: test; // should not raise a 'container type' error
