/// <reference path='references.ts' />

describe("Configuration", () => {
    it("recognizes valid rules", () => {
        var validConfiguration = {
            "forin": false,
            "quotemark": "single",
            "eofline": true,
            "indent": 6,
            "debug": true
        };
        
        var rules = Lint.Configuration.getConfiguredRules(validConfiguration);
        assert.equal(rules.length, 5);
    });

    it("skips invalid rules", () => {
        var invalidConfiguration = {
            "invalidConfig1": true,
            "invalidConfig2": false
        };

        var rules = Lint.Configuration.getConfiguredRules(invalidConfiguration);
        assert.deepEqual(rules, []);
    });
});
