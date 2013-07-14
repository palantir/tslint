var Bug = (function () {
    function Bug() {
    }
    Bug.prototype.ok = function () {
        this.values = {};
        this.values['comments'] = { italic: true };
    };
    Bug.prototype.shouldBeOK = function () {
        this.values = {
            comments: { italic: true }
        };
    };
    return Bug;
})();

