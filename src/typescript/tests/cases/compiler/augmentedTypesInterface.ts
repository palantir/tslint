// interface then interface

interface i {
    foo(): void;
}

interface i {
    bar(): number;
}

// interface then class
// BUG 694374
interface i2 {
    foo(): void;
}

class i2 {  // BUG: should be ok
    bar() {
        return 1;
    }
}

// interface then enum
interface i3 {
    foo(): void;
}
enum i3 { One }; // error

// interface then import
interface i4 {
    foo(): void;
}
// TODO: make a real module
import i4 = require('');  // error