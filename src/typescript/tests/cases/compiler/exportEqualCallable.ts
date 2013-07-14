declare module 'connect' {
    var server: {
        (): any;
    };
    export = server;
}
 
import connect = require('connect');
connect();
