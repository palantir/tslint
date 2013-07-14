var obj = {};
Object.defineProperty(obj, "accProperty", ({
    get: function () {
        eval("public = 1;");
        return 11;
    },
    set: function (v) {
    }
}));
