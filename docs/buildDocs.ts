import * as fs from "fs";
import * as glob from "glob";
import * as path from "path";
import * as yaml from "js-yaml";
import {IRuleMetadata} from "../lib/language/rule/rule";
import {AbstractRule} from "../lib/language/rule/abstractRule";

const DOCS_DIR = "../../tslint-gh-pages";
const DOCS_RULE_DIR = path.join(DOCS_DIR, "rules");

const rulePaths = glob.sync("../lib/rules/*Rule.js");
const rulesJson: IRuleMetadata[] = [];
for (const rulePath of rulePaths) {
    const ruleModule = require(rulePath);
    const Rule = ruleModule.Rule as typeof AbstractRule;
    if (Rule != null && Rule.metadata != null) {
        const metadata = Rule.metadata;
        const fileData = generateRuleFile(metadata);
        const fileDirectory = path.join(DOCS_RULE_DIR, metadata.ruleName);

        // write file for specific rule
        if (!fs.existsSync(fileDirectory)) {
            fs.mkdirSync(fileDirectory);
        }
        fs.writeFileSync(path.join(fileDirectory, "index.html"), fileData);

        rulesJson.push(metadata);
    }
}

// write overall data file, this is used to generate the index page for the rules
const fileData = JSON.stringify(rulesJson, undefined, "  ");
fs.writeFileSync(path.join(DOCS_DIR, "_data", "rules.json"), fileData);

function generateRuleFile(metadata: IRuleMetadata) {
    const yamlData: any = {};
    for (const key of Object.keys(metadata)) {
        yamlData[key] = (<any> metadata)[key];
    }
    yamlData.optionsJSON = JSON.stringify(metadata.options, undefined, "  ");
    yamlData.layout = "rule";
    yamlData.title = `Rule: ${metadata.ruleName}`;
    return `---\n${yaml.safeDump(yamlData, <any>{lineWidth: 140})}---`;
}
