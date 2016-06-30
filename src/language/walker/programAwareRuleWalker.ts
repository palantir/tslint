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
import {IOptions} from "../../lint";
import {RuleWalker} from "./ruleWalker";

export class ProgramAwareRuleWalker extends RuleWalker {
    protected program: ts.Program;
    protected typeChecker: ts.TypeChecker;

    constructor(sourceFile: ts.SourceFile, options: IOptions, program: ts.Program) {
        super(sourceFile, options);

        this.program = program;
        this.typeChecker = program.getTypeChecker();
    }

    public getProgram(): ts.Program {
        return this.program;
    }

    public getTypeChecker(): ts.TypeChecker {
        return this.typeChecker;
    }
}
