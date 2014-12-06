// valid

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
    case 2:
    default:
        bar();
}

// Error cases

switch (foo) {
    case 1:
        bar();
    case 2:
        bar();
}

// error on first switch both switches

switch (foo) {
    case 1:
        switch (bar) {
            case "":
                break;
        }
    case 2:
}
