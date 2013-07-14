var names = ["list", "table1", "table2", "table3", "summary"];

var elements = names.map(function (name) {
    return document.getElementById(name);
});


var xxx = elements.filter(function (e) {
    return !e.isDisabled;
});

var widths:number[] = elements.map(function (e) { // should not error
    return e.clientWidth;
});

