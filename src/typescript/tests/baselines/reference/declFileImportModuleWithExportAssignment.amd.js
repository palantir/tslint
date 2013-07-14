////[declFileImportModuleWithExportAssignment_0.js]
define(["require", "exports"], function(require, exports) {
    var m2;
    
    return m2;
});

////[declFileImportModuleWithExportAssignment_1.js]
define(["require", "exports", "declFileImportModuleWithExportAssignment_0"], function(require, exports, __a1__) {
    var a1 = __a1__;
    exports.a = a1;
    exports.a.test1(null, null, null);
});

////[declFileImportModuleWithExportAssignment_1.d.ts]
import a1 = require("declFileImportModuleWithExportAssignment_0");
export declare var a: {
    test1: a1.connectModule;
    test2(): a1.connectModule;
    (): a1.connectExport;
};
