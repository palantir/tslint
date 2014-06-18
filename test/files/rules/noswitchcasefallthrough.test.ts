switch (foo) {
    case 1:
        bar();
    case 2:
        bar();
        bar();
    case 3:
    case 4:
    default:
        break;
}


switch (foo) {
    case 1:
        bar();
    case 2:
        bar();
}


switch (foo) {
    case 1:
    case 2:
    default:
        bar();
}

switch (foo) {
    case 1:
        switch (bar) {
            case "":
            default:
                break;
        }
    case 2:
}

switch (foo) {
    case 1:
    case 2:

    case 3:

    case 4:
        break;
    default:
        bar();
}


switch (foo) {
    case 1:
        return; // handle return the same as break
    case 2:
    case 3:
        throw "error";
}
