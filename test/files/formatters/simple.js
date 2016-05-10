function SimpleFormatter () {

}
SimpleFormatter.prototype = Object.create({
    name: "simple",
    getName: function () {
        return this.name;
    },
    format: function (failures) {
        var output = "";
        for (var i = 0; i < failures.length; ++i) {
            var failure = failures[i];
            var fileName = failure.getFileName();

            var lineAndCharacter = failure.getStartPosition().getLineAndCharacter();
            var line = lineAndCharacter.line;
            var character = lineAndCharacter.character;

            output += "[" + (line + 1) + ", " + (character + 1) + "]" + fileName + "\n";
        }
        return output;
    },
});

module.exports = {
    Formatter: SimpleFormatter,
};
