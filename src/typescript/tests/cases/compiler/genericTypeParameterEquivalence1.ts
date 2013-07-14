var a = {
   x: function <T>(y: T): T { return null; }
}
var a2 = {
   x: function (y: any): any { return null; }
}
export interface I {
   x<T>(y: T): T;
}
export interface I2 {
   x(y: any): any;
}
 
var i: I;
var i2: I2;

// no error since the type parameters come from different declarations, considered assignment compatible 
a = i;
i = a;
 
a2 = i2;
i2 = a2;
