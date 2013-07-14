var names = ["list", "table1", "table2", "table3", "summary"];

var elements = names.map(function (name) {
    return document.getElementById(name);
});

var xxx = elements.filter(function (e) {
    return !e.isDisabled;
});

var widths = elements.map(function (e) {
    return e.clientWidth;
});
