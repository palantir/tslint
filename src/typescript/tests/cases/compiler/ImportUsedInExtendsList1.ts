declare module 'base' {
    export class Super { }
}

import foo = require('base');
class Sub extends foo.Super { }
