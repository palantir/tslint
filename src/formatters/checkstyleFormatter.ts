import {AbstractFormatter} from "../language/formatter/abstractFormatter";
import {RuleFailure} from "../language/rule/rule";

export class Formatter extends AbstractFormatter {
    public format(failures: RuleFailure[]): string {
        let output = '<?xml version="1.0" encoding="utf-8"?><checkstyle version="4.3">';

        if (failures.length) {
            output += `<file name="${this.escapeXml(failures[0].getFileName())}">`;
            for (let failure of failures) {
                output += `<error line="${failure.getStartPosition().getLineAndCharacter().line + 1}" `;
                output += `column="${failure.getStartPosition().getLineAndCharacter().character + 1}" `;
                output += `severity="warning" `;
                output += `message="${this.escapeXml(failure.getFailure())}" `;
                // checkstyle parser wants "source" to have structure like <anything>dot<category>dot<type>
                output += `source="failure.tslint.${this.escapeXml(failure.getRuleName())}" />`;
            }
            output += "</file>";
        }

        output += "</checkstyle>";
        return output;
    }

    private escapeXml(str: string): string {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/'/g, "&#39;")
            .replace(/"/g, "&quot;");
    }
}
