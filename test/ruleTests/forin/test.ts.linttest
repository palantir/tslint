function a() {
    for (var i in obj) {
    ~~~~~~~~~~~~~~~~~~~~
        console.log("i");
~~~~~~~~~~~~~~~~~~~~~~~~~
    }
~~~~~ [0]

    for (var j in obj) {
    ~~~~~~~~~~~~~~~~~~~~
        if (j === 3) {
~~~~~~~~~~~~~~~~~~~~~~
            console.log("j");
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        }
~~~~~~~~~
        console.log("j");
~~~~~~~~~~~~~~~~~~~~~~~~~
    }
~~~~~ [0]    

    for (var k in obj) {
        if (obj.hasOwnProperty(k)) {
            console.log("k");
        }
    }
    
    for (var m in obj) {
        if (!obj.hasOwnProperty(m)) {
            continue;
        }
        console.log("m");
    }
    
    for (var n in obj) {
        if (!obj.hasOwnProperty(n)) continue;
        console.log("m");
    }
}

[0]: for (... in ...) statements must be filtered with an if statement
