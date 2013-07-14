var Events;
(function (Events) {
    var EventEmitter = (function () {
        function EventEmitter() {
        }
        EventEmitter.prototype.addListener = function (type, listener) {
        };
        return EventEmitter;
    })();
    Events.EventEmitter = EventEmitter;
})(Events || (Events = {}));

var Consumer;
(function (Consumer) {
    var EventEmitterConsummer = (function () {
        function EventEmitterConsummer(emitter) {
            this.emitter = emitter;
        }
        EventEmitterConsummer.prototype.register = function () {
            var _this = this;
            this.emitter.addListener('change', function (e) {
                _this.changed();
            });
        };

        EventEmitterConsummer.prototype.changed = function () {
        };
        return EventEmitterConsummer;
    })();
})(Consumer || (Consumer = {}));
