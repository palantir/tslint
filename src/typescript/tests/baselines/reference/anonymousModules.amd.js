module;
 {
    var foo = 1;

    module;
     {
        var bar = 1;
    }

    var bar = 2;

    module;
     {
        var x = bar;
    }
}
