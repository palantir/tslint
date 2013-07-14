define(["require", "exports", 'connect'], function(require, exports, __connect__) {
    var connect = __connect__;
    connect().use(connect.static('foo'));
});
