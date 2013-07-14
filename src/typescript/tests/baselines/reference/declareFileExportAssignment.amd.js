define(["require", "exports"], function(require, exports) {
    var m2;

    
    return m2;
});

////[0.d.ts]
declare module m2 {
    interface connectModule {
        (res, req, next): void;
    }
    interface connectExport {
        use: (mod: connectModule) => connectExport;
        listen: (port: number) => void;
    }
}
declare var m2: {
    test1: m2.connectModule;
    test2(): m2.connectModule;
    (): m2.connectExport;
};
export = m2;
