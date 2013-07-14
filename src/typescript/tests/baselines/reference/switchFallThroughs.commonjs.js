function R1(index) {
    switch (index) {
        case 0:
        case 1:
        case 2:
            var a = 'a';
            return a;
        case 3:
        case 4: {
            return 'b';
        }
        case 5:
        default:
            return 'c';
    }
}
