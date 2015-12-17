/*
 * Copyright 2016 Palantir Technologies, Inc.
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

import {LintError} from "../ruleTestRunner/types";

/* tslint:disable:object-literal-sort-keys */

export const lintStr1 = `
Yay some file contents
That have ~~ in it in the middle
And some brackets too   [brackets are here]
~~~ And even lines that start with   [tildes]
`;
export const codeStr1 = lintStr1;
export const resultErrs1: LintError[] = [];


export const lintStr2 = `
A file with an error
~~~~~                  [error]
`;
export const codeStr2 = `
A file with an error
`;
export const resultErrs2: LintError[] = [
  { startPos: { line: 2, col: 1 }, endPos: { line: 2, col: 6 }, message: "error" }
];


export const lintStr3 = `
A file with lots of errors
~~~~~                  [error]
    ~~~~~~~~~~~~~      [error2]
   ~~~~~~~~~~~~~~~~~~~~~~~
   Some more code goes here
~~~~~~~~~~~~~~~~~~~~~~~~~~~
~~~~~~~~~~~~~~~~~~~~~~~~~~~
   And more code here
~~~~~~~~~~~~    [multiline error1]
~~~~~~~~~~~~~~~~~~~~~
      ~  [error3]
   Final code here
~~  [multiline error2]
`;

export const codeStr3 = `
A file with lots of errors
   Some more code goes here
   And more code here
   Final code here
`;
export const resultErrs3: LintError[] = [
  { startPos: { line: 2, col: 1 }, endPos: { line: 2, col: 6 }, message: "error" },
  { startPos: { line: 2, col: 4 }, endPos: { line: 4, col: 13 }, message: "multiline error1" },
  { startPos: { line: 2, col: 5 }, endPos: { line: 2, col: 18 }, message: "error2" },
  { startPos: { line: 3, col: 1 }, endPos: { line: 5, col: 3 }, message: "multiline error2" },
  { startPos: { line: 4, col: 7 }, endPos: { line: 4, col: 8 }, message: "error3" }
];

export const lintStr4 = "";
export const codeStr4 = "";
export const resultErrs4: LintError[] = [];

// this is a ideally formatted lint string, errors ordered by start position,
// error messages one space after end of line of code above
export const lintStr5 = `
someObject.someProperty.doSomething();
          ~~~~~~~~~~~~~                [unsafe access]
            ~~~~~~~~~~~~~~~~~~~~~~~~~~
someVar <- someObject.crazyMethod(arg1, arg2, arg3);
~~~~~~~                                              [another error]
`;
export const codeStr5 = `
someObject.someProperty.doSomething();
someVar <- someObject.crazyMethod(arg1, arg2, arg3);
`;
export const resultErrs5: LintError[] = [
  { startPos: { line: 2, col: 11 }, endPos: { line: 2, col: 24 }, message: "unsafe access" },
  { startPos: { line: 2, col: 13 }, endPos: { line: 3, col: 8 }, message: "another error" }
];
/* tslint:enable:object-literal-sort-keys */
