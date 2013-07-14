define(["require", "exports", "fs"], function(require, exports, __fs__) {
    var fs = __fs__;

    function main() {
        fs.mkdirSync('test');
    }
});
