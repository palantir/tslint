declare module 'connect' {
    module server {
        export interface connectModule {
            (res, req, next): void;
        }
        export interface connectExport {
            use: (mod: connectModule) => connectExport;
        }
    }
    var server: {
        (): server.connectExport;
        foo: Date;
    };
    export = server;
}

import connect = require('connect');
connect().use(connect.static('foo')); // Error	1	The property 'static' does not exist on value of type ''.
