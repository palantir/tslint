declare module 'M' {
   interface Sammy {
      new (): any; // a constructor signature
          (): number; // a 0 arg call signature
     }
   export = Sammy;
}

import Sammy = require('M');
var x = new Sammy(); // error to use as constructor as there is not constructor symbol
var y = Sammy(); // error to use interface name as call target
var z: Sammy; // no error - z is of type interface Sammy from module 'M'
var a = new z(); // constructor - no error
var b = z(); // call signature - no error