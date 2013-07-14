var thing = create([{ name: "bob", id: 24 }, { name: "doug", id: 32 }]);
thing.doSomething(function (x, y) {
    return x.name === "bob";
});
