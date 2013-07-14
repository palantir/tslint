var Accessor = (function () {
    function Accessor() {
    }
    return Accessor;
})();

function attr(nameOrMap, value) {
    if (nameOrMap && typeof nameOrMap === "object") {
        return new Accessor();
    } else {
        return "s";
    }
}

function attr2(nameOrMap, value) {
    if (nameOrMap && typeof nameOrMap === "object") {
        return "t";
    } else {
        return "s";
    }
}

function foo() {
    return "a";
}
;
