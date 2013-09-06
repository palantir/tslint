function a() {
    for (var i in obj) {
        console.log("i");
    }

    for (var j in obj) {
        if (j === 3) {
            console.log("j");
        }
        console.log("j");
    }

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
