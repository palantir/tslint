var IceCreamMonster = (function () {
    function IceCreamMonster(iceCreamFlavor, wantsSprinkles, soundsWhenEating, name) {
        this.iceCreamFlavor = iceCreamFlavor;
        this.iceCreamRemaining = 100;
        this.wantsSprinkles = wantsSprinkles;
        this.soundsWhenEating = soundsWhenEating;
        this.name = name;
    }
    IceCreamMonster.prototype.eatIceCream = function (amount) {
        this.iceCreamRemaining -= amount;
        if (this.iceCreamRemaining <= 0) {
            this.iceCreamRemaining = 0;
            return false;
        } else {
            return 12345;
        }
    };
    return IceCreamMonster;
})();
var cookieMonster;
cookieMonster = new IceCreamMonster("Chocolate Chip", false, "COOOOOKIE", "Cookie Monster");
