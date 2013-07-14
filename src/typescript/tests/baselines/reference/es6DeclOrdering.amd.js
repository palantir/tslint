var Bar = (function () {
    function Bar(store) {
        this._store = store;
    }
    Bar.prototype.foo = function () {
        return this._store.length;
    };
    return Bar;
})();
