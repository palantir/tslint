var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var MsPortal;
(function (MsPortal) {
    (function (Controls) {
        (function (Base) {
            (function (ItemList) {
                var ItemValue = (function () {
                    function ItemValue(value) {
                    }
                    return ItemValue;
                })();
                ItemList.ItemValue = ItemValue;

                var ViewModel = (function (_super) {
                    __extends(ViewModel, _super);
                    function ViewModel() {
                        _super.apply(this, arguments);
                    }
                    return ViewModel;
                })(ItemValue);
                ItemList.ViewModel = ViewModel;
            })(Base.ItemList || (Base.ItemList = {}));
            var ItemList = Base.ItemList;
        })(Controls.Base || (Controls.Base = {}));
        var Base = Controls.Base;
    })(MsPortal.Controls || (MsPortal.Controls = {}));
    var Controls = MsPortal.Controls;
})(MsPortal || (MsPortal = {}));
