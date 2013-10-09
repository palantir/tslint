function SimpleFormatter() {

}
SimpleFormatter.prototype = Object.create({
    name: 'simple',
    getName: function () {
        return this.name;
    },
    format: function (failures) {
        var output = "";
        for (var i = 0; i < failures.length; ++i) {
            var failure = failures[i];
            var fileName = failure.getFileName();

            var lineAndCharacter = failure.getStartPosition().getLineAndCharacter();
            var line = lineAndCharacter.line() + 1;
            var character = lineAndCharacter.character() + 1;

            output += "[" + line + ", " + character + "]" + fileName + "\n";
        }
        return output;
    }
});

module.exports = {
    Formatter: SimpleFormatter
};
