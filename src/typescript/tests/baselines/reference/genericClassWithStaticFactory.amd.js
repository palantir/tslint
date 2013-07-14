var Editor;
(function (Editor) {
    var List = (function () {
        function List(isHead, data) {
            this.isHead = isHead;
            this.data = data;
            this.listFactory = new ListFactory();
        }
        List.prototype.add = function (data) {
            var entry = this.listFactory.MakeEntry(data);

            this.prev.next = entry;
            entry.next = this;
            entry.prev = this.prev;
            this.prev = entry;
            return entry;
        };

        List.prototype.count = function () {
            var entry;
            var i;

            entry = this.next;
            for (i = 0; !(entry.isHead); i++) {
                entry = entry.next;
            }

            return (i);
        };

        List.prototype.isEmpty = function () {
            return (this.next == this);
        };

        List.prototype.first = function () {
            if (this.isEmpty()) {
                return this.next.data;
            } else {
                return null;
            }
        };

        List.prototype.pushEntry = function (entry) {
            entry.isHead = false;
            entry.next = this.next;
            entry.prev = this;
            this.next = entry;
            entry.next.prev = entry;
        };

        List.prototype.push = function (data) {
            var entry = this.listFactory.MakeEntry(data);
            entry.data = data;
            entry.isHead = false;
            entry.next = this.next;
            entry.prev = this;
            this.next = entry;
            entry.next.prev = entry;
        };

        List.prototype.popEntry = function (head) {
            if (this.next.isHead) {
                return null;
            } else {
                return this.listFactory.RemoveEntry(this.next);
            }
        };

        List.prototype.insertEntry = function (entry) {
            entry.isHead = false;
            this.prev.next = entry;
            entry.next = this;
            entry.prev = this.prev;
            this.prev = entry;
            return entry;
        };

        List.prototype.insertAfter = function (data) {
            var entry = this.listFactory.MakeEntry(data);
            entry.next = this.next;
            entry.prev = this;
            this.next = entry;
            entry.next.prev = entry;
            return entry;
        };

        List.prototype.insertEntryBefore = function (entry) {
            this.prev.next = entry;

            entry.next = this;
            entry.prev = this.prev;
            this.prev = entry;
            return entry;
        };

        List.prototype.insertBefore = function (data) {
            var entry = this.listFactory.MakeEntry(data);
            return this.insertEntryBefore(entry);
        };
        return List;
    })();
    Editor.List = List;

    var ListFactory = (function () {
        function ListFactory() {
        }
        ListFactory.prototype.MakeHead = function () {
            var entry = new List(true, null);
            entry.prev = entry;
            entry.next = entry;
            return entry;
        };

        ListFactory.prototype.MakeEntry = function (data) {
            var entry = new List(false, data);
            entry.prev = entry;
            entry.next = entry;
            return entry;
        };

        ListFactory.prototype.RemoveEntry = function (entry) {
            if (entry == null) {
                return null;
            } else if (entry.isHead) {
                return null;
            } else {
                entry.next.prev = entry.prev;
                entry.prev.next = entry.next;

                return entry;
            }
        };
        return ListFactory;
    })();
    Editor.ListFactory = ListFactory;
})(Editor || (Editor = {}));
