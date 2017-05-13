/**
 * @license
 * Copyright 2017 Palantir Technologies, Inc.
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

/**
 * This script auto-generate test files for the `no-irregular-whitespace` rule
 */

import * as fs from 'fs';
import * as path from 'path';

import { IRREGULAR_WHITESPACE_REGEX } from '../../../src/rules/noIrregularWhitespaceRule';

const matches = IRREGULAR_WHITESPACE_REGEX.source
    .substring(1, IRREGULAR_WHITESPACE_REGEX.source.length - 2)
    .match(/\\\w+/g)
    .filter(match => ['\\u2029', '\\u2028'].indexOf(match) === -1) // those seems to break the parser
    .map(match => JSON.parse(`"${match}"`) as string);

const lintFilePath = path.join(__dirname, "test.ts.lint");
const lintFileContent = matches.reduce((acc: string, match) => {
    return acc += `let ${match} foo;\n    ~    [Irregular whitespace not allowed]\n`;
}, '');
fs.writeFileSync(lintFilePath, lintFileContent);

const fixFilePath = path.join(__dirname, "test.ts.fix");
const fixFileContent = 'let   foo;\n'.repeat(matches.length)
fs.writeFileSync(fixFilePath, fixFileContent);
