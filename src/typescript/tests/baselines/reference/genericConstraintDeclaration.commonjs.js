var List = (function () {
    function List() {
    }
    List.empty = function () {
        return null;
    };
    return List;
})();

////[0.d.ts]
declare class List<T extends {}> {
    static empty<T extends {}>(): List<T>;
    interface __anonymous {
    }
}
