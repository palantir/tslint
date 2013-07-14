var m3;
(function (m3) {
    m3.server;
})(m3 || (m3 = {}));

var m = m3;

module.exports = m;


////[0.d.ts]
declare module m3 {
    module m2 {
        interface connectModule {
            (res, req, next): void;
        }
        interface connectExport {
            use: (mod: connectModule) => connectExport;
            listen: (port: number) => void;
        }
    }
    var server: {
        test1: m2.connectModule;
        test2(): m2.connectModule;
        (): m2.connectExport;
    };
}
import m = m3;
export = m;
