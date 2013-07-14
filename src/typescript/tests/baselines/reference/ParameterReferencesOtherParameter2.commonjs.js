var Model = (function () {
    function Model() {
    }
    return Model;
})();

var UI = (function () {
    function UI(model, foo) {
        if (typeof foo === "undefined") { foo = model.name; }
    }
    return UI;
})();
