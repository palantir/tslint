"use strict";
var Test;
(function (Test) {
    var Bug = (function () {
        function Bug() {
        }
        Bug.prototype.getName = function () {
            return "name";
        };
        Bug.prototype.bug = function () {
            var name = null;
            if ((name = this.getName()).length > 0) {
                console.log(name);
            }
        };
        return Bug;
    })();
    Test.Bug = Bug;
})(Test || (Test = {}));
