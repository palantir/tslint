"use strict";
var Test;
(function (Test) {
    var Gar = (function () {
        function Gar() {
            this.moo = 0;
        }
        return Gar;
    })();
    Test.Gar = Gar;

    function bug() {
        var state = null;
        return {
            tokens: Gar[],
            endState: state
        };
    }
    Test.bug = bug;
})(Test || (Test = {}));
