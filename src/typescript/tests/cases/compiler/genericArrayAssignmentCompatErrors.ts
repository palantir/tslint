var myCars=new Array(); 
var myCars2 = new [];
var myCars3 = new Array({});
var myCars4: Array;
var myCars5: Array<any>[];
 
myCars = myCars2;
myCars = myCars3;
myCars = myCars4; // error
myCars = myCars5;
 
myCars2 = myCars;
myCars2 = myCars3;
myCars2 = myCars4; // error
myCars2 = myCars5;
 
myCars3 = myCars;
myCars3 = myCars2;
myCars3 = myCars4; // error
myCars3 = myCars5;   
