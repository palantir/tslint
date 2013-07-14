var myCars=new Array(); 
var myCars3 = new Array({});
var myCars4: Array;
var myCars5: Array<any>[];
 
myCars = myCars3;
myCars = myCars4; // error
myCars = myCars5;
 
myCars3 = myCars;
myCars3 = myCars4; // error
myCars3 = myCars5;   
