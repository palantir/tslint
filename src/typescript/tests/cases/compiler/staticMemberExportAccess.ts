class Sammy {
   foo() { return "hi"; }
  static bar() {
    return -1;
   }
}
module Sammy {
    export var x = 1;
}
interface JQueryStatic {
    sammy: Sammy;
}
var $: JQueryStatic;
var instanceOfClassSammy = new $.sammy();
var r1 = instanceOfClassSammy.foo(); // r1 is string
var r2 = $.sammy.foo(); // why is foo here?
var r3 = $.sammy.bar(); // why isn't bar here?
var r4 = $.sammy.x; // why is x an error?

Sammy.bar();