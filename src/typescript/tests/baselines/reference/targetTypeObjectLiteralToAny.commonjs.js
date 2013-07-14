function suggest() {
    var TypeScriptKeywords;
    var result;

    TypeScriptKeywords.forEach(function (keyword) {
        result.push({ text: keyword, type: "keyword" });
    });
}
