/// <reference path='rules/rules.ts'/>

module Lint.Configuration {

  var fs = require("fs");
  var path = require("path");

  var CONFIG_FILENAME = ".tslintrc";

  export function findConfiguration(configFile): string {
    if (!configFile) {
      var currentPath = global.process.cwd();
      var parentPath = currentPath;

      while(true) {
        var filePath = path.join(currentPath, CONFIG_FILENAME);

        if(fs.existsSync(filePath)) {
          configFile = filePath;
          break;
        }

        // check if there's nowhere else to go
        parentPath = path.resolve(currentPath, "..");
        if(parentPath === currentPath) {
          return undefined;
        }

        currentPath = parentPath;
      }
    }

    return JSON.parse(fs.readFileSync(configFile, "utf8"));
  }

  export function getConfiguredRules(configuration): Rule[] {
    var rules = [];

    for(var ruleName in configuration) {
      var rule = Lint.Rules.getRuleForName(ruleName);
      if(rule === undefined) {
        console.warn("ignoring unrecognized rule '" + ruleName + "'")
        continue;
      }

      var ruleValue = configuration[ruleName];
      rule.setValue(ruleValue);
      rules.push(rule);
    }

    return rules;
  }

}
