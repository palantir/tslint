/**
 * @license
 * Copyright 2013 Palantir Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as ts from "typescript";
import * as Lint from "../lint";

const OPTION_ALWAYS = "always-prefix";
const OPTION_NEVER = "never-prefix";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "interface-name",
        description: "Requires interface names to begin with a capital 'I'",
        rationale: "Makes it easy to differentitate interfaces from regular classes at a glance.",
        optionsDescription: Lint.Utils.dedent`
            One of the following two options must be provided:

            * \`"${OPTION_ALWAYS}"\` requires interface names to start with an "I"
            * \`"${OPTION_NEVER}"\` requires interface names to not have an "I" prefix`,
        options: {
            type: "enum",
            enumValues: [OPTION_ALWAYS, OPTION_NEVER],
        },
        optionExamples: [`[true, "${OPTION_ALWAYS}"]`, `[true, "${OPTION_NEVER}"]`],
        type: "style",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "interface name must start with a capitalized I";
    public static FAILURE_STRING_NO_PREFIX = `interface name must not have an "I" prefix`;

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NameWalker(sourceFile, this.getOptions()));
    }
}

class NameWalker extends Lint.RuleWalker {
    public visitInterfaceDeclaration(node: ts.InterfaceDeclaration) {
        const interfaceName = node.name.text;

        const always = this.hasOption(OPTION_ALWAYS) || (this.getOptions() && this.getOptions().length === 0);

        if (always) {
            if (!this.startsWithI(interfaceName)) {
                this.addFailureAt(node.name.getStart(), node.name.getWidth(), Rule.FAILURE_STRING);
            }
        } else if (this.hasOption(OPTION_NEVER)) {
            if (this.hasPrefixI(interfaceName)) {
                this.addFailureAt(node.name.getStart(), node.name.getWidth(), Rule.FAILURE_STRING_NO_PREFIX);
            }
        }

        super.visitInterfaceDeclaration(node);
    }

    private startsWithI(name: string): boolean {
        if (name.length <= 0) {
            return true;
        }

        const firstCharacter = name.charAt(0);
        return (firstCharacter === "I");
    }

    private hasPrefixI(name: string): boolean {
        if (name.length <= 0) {
            return true;
        }

        const firstCharacter = name.charAt(0);
        if (firstCharacter !== "I") {
            return false;
        }

        const secondCharacter = name.charAt(1);
        if (secondCharacter === "") {
            return false;
        } else if (secondCharacter !== secondCharacter.toUpperCase()) {
            return false;
        }

        if (name.indexOf("IDB") === 0) {
            // IndexedDB
            return false;
        }

        return true;
    }


    private addFailureAt(position: number, width: number, failureString: string) {
        const failure = this.createFailure(position, width, failureString);
        this.addFailure(failure);
    }

}
