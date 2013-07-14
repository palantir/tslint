var Outer;
(function (Outer) {
    var non_export_var;
    module;
     {
        var non_export_var = 0;
        Outer.export_var = 1;

        function NonExportFunc() {
            return 0;
        }

        function ExportFunc() {
            return 0;
        }
        Outer.ExportFunc = ExportFunc;
    }

    Outer.outer_var_export = 0;
    function outerFuncExport() {
        return 0;
    }
    Outer.outerFuncExport = outerFuncExport;
})(Outer || (Outer = {}));

Outer.ExportFunc();
