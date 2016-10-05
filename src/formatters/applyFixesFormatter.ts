import {AbstractFormatter} from "../language/formatter/abstractFormatter";
import {Fix, RuleFailure} from "../language/rule/rule";
import * as fs from "fs";

export class Formatter extends AbstractFormatter {
    public format(failures: RuleFailure[]): string {
        const files: {[file: string]: boolean} = {};
        failures.map(f => files[f.getFileName()] = true);
        const log: string[] = [];
        for (const file of Object.keys(files)) {
            log.push(`Applying fixes to ${file}`);
            let content = fs.readFileSync(file, {encoding: "utf-8"});
            const fixes = failures.filter(f => f.getFileName() === file).map(f => f.getFix()).filter(f => !!f);
            content = Fix.applyAll(content, fixes);
            fs.writeFileSync(file, content, {encoding: "utf-8"});
        }
        log.push("All done. Remember to test the changes, as not all fixes preserve semantics.");
        return log.join("\n") + "\n";
    }
}
