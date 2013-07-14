class C {
 x: number;
    constructor() {
        this.x = () => {
   var x = 1;
   return this.x;
  }();
  this.x = function() {
   var x = 1;
   return this.x;
  }();
    }  
}

var messenger = {
    message: "Hello World",
    start: function () {
        return setTimeout(() => { alert(this.message); }, 3000);
    }
};
