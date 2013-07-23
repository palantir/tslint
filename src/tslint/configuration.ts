/// <reference path='rules/rules.ts'/>

module Lint.Configuration {

  var fs = require("fs");
  var path = require("path");

  var CONFIG_FILENAME = ".tslintrc";

  export function findConfiguration(): string {
    var currentPath = global.process.cwd();
    var parentPath = currentPath;

    while(true) {
      var filePath = path.join(currentPath, CONFIG_FILENAME);

      if(fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, "utf8"));
      }

      // check if there's nowhere else to go
      parentPath = path.resolve(currentPath, "..");
      if(parentPath === currentPath) {
        break;
      }

      currentPath = parentPath;
    }

    return undefined;
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
