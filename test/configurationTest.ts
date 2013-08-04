/// <reference path='references.ts' />

describe("Configuration", () => {
    it("recognizes valid rules", () => {
        var validConfiguration = {
            "forin": false,
            "quotemark": "single",
            "eofline": true,
            "indent": 6,
            "debug": true
        }
        
        var rules = Lint.Configuration.getConfiguredRules(validConfiguration);
        assert.equal(rules.length, 5);
    });
});
