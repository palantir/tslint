function f() {
    try  {
    } catch (e) {
        var stack2 = e.stack;
        return stack2;
    }
}
