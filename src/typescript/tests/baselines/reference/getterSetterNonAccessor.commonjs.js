function getFunc() {
    return 0;
}
function setFunc(v) {
}

Object.defineProperty({}, "0", ({
    get: getFunc,
    set: setFunc,
    configurable: true
}));
