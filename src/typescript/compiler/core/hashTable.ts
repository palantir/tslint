///<reference path='references.ts' />

module TypeScript.Collections {
    export var DefaultHashTableCapacity = 256;

    class HashTableEntry {
        constructor(public Key: any,
                    public Value: any,
                    public HashCode: number,
                    public Next: HashTableEntry) {
        }
    }

    export class HashTable {
        // TODO: figure out why the type checker dosn't like "HashTableEntry[]" here.
        private entries: HashTableEntry[] = [];
        private count: number = 0;

        constructor(capacity: number,
                    private hash: (k: any) => number,
                    private equals: (k1: any, k2: any) => boolean) {
            var size = Hash.getPrime(capacity);
            this.hash = hash;
            this.equals = equals;
            this.entries = ArrayUtilities.createArray(size, null);
        }

        // Maps 'key' to 'value' in this table.  Does not throw if 'key' is already in the table.
        public set (key: any, value: any) {
            this.addOrSet(key, value, /*throwOnExistingEntry:*/ false);
        }

        // Maps 'key' to 'value' in this table.  Throws if 'key' is already in the table.
        public add(key: any, value: any) {
            this.addOrSet(key, value, /*throwOnExistingEntry:*/ true);
        }

        public containsKey(key: any): boolean {
            var hashCode = this.computeHashCode(key);
            var entry = this.findEntry(key, hashCode);
            return entry !== null;
        }

        public get (key: any): any {
            var hashCode = this.computeHashCode(key);
            var entry = this.findEntry(key, hashCode);

            return entry === null ? null : entry.Value;
        }

        private computeHashCode(key: any): number {
            var hashCode = this.hash === null
                ? key.hashCode()
                : this.hash(key);

            hashCode = hashCode & 0x7FFFFFFF;
            Debug.assert(hashCode > 0);

            return hashCode;
        }

        private addOrSet(key: any, value: any, throwOnExistingEntry: boolean) {
            // Compute the hash for this key.  Also ensure that it's non negative.
            var hashCode = this.computeHashCode(key);

            var entry = this.findEntry(key, hashCode);
            if (entry !== null) {
                if (throwOnExistingEntry) {
                    throw Errors.argument('key', 'Key was already in table.');
                }

                entry.Key = key;
                entry.Value = value;
                return;
            }

            return this.addEntry(key, value, hashCode);
        }

        private findEntry(key: any, hashCode: number) /*: HashTableEntry*/ {
            for (var e = this.entries[hashCode % this.entries.length]; e !== null; e = e.Next) {
                if (e.HashCode === hashCode) {
                    var equals = this.equals === null
                        ? key === e.Key
                        : this.equals(key, e.Key);

                    if (equals) {
                        return e;
                    }
                }
            }

            return null;
        }

        private addEntry(key: any, value: any, hashCode: number): any {
            var index = hashCode % this.entries.length;

            var e = new HashTableEntry(key, value, hashCode, this.entries[index]);

            this.entries[index] = e;

            // Right now we grow when we get a load factor of 1.  We're basically guaranteed to have had
            // a collision at that point.  Should we potentially change this to a lower load factor?  It
            // will require more space, but provide us with faster lookup.  We could potentially make this
            // configurable as well.
            if (this.count === this.entries.length) {
                this.grow();
            }

            this.count++;
            return e.Key;
        }

        //private dumpStats() {
        //    var standardOut = Environment.standardOut;

        //    standardOut.WriteLine("----------------------")
        //    standardOut.WriteLine("Hash table stats");
        //    standardOut.WriteLine("Count            : " + this.count);
        //    standardOut.WriteLine("Entries Length   : " + this.entries.length);

        //    var occupiedSlots = 0;
        //    for (var i = 0; i < this.entries.length; i++) {
        //        if (this.entries[i] !== null) {
        //            occupiedSlots++;
        //        }
        //    }

        //    standardOut.WriteLine("Occupied slots   : " + occupiedSlots);
        //    standardOut.WriteLine("Avg Length/Slot  : " + (this.count / occupiedSlots));
        //    standardOut.WriteLine("----------------------");
        //}

        private grow(): void {
            // this.dumpStats();

            var newSize = Hash.expandPrime(this.entries.length);

            var oldEntries = this.entries;
            var newEntries: HashTableEntry[] = ArrayUtilities.createArray(newSize, null);

            this.entries = newEntries;

            for (var i = 0; i < oldEntries.length; i++) {
                var e = oldEntries[i];

                while (e !== null) {
                    var newIndex = e.HashCode % newSize;
                    var tmp = e.Next;
                    e.Next = newEntries[newIndex];
                    newEntries[newIndex] = e;
                    e = tmp;
                }
            }

            // this.dumpStats();
        }
    }

    export function createHashTable(capacity: number = DefaultHashTableCapacity,
        hash: (k: any) => number = null,
        equals: (k1: any, k2: any) => boolean = null): HashTable {
        return new HashTable(capacity, hash, equals);
    }

    var currentHashCode = 1;
    export function identityHashCode(value: any): number {
        if (value.__hash === undefined) {
            value.__hash = currentHashCode;
            currentHashCode++;
        }

        return value.__hash;
    }
}