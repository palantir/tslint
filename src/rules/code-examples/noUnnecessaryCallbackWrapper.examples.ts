/**
 * @license
 * Copyright 2018 Palantir Technologies, Inc.
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

import * as Lint from "../../index";

// tslint:disable: object-literal-sort-keys
export const codeExamples = [
    {
        description: "Disallows unnecessary callback wrappers",
        config: Lint.Utils.dedent`
            "rules": { "no-unnecessary-callback-wrapper": true }
        `,
        pass: Lint.Utils.dedent`
            const handleContent = (content) => console.log('Handle content:', content);
            const handleError = (error) => console.log('Handle error:', error);
            promise.then(handleContent).catch(handleError);
        `,
        fail: Lint.Utils.dedent`
            const handleContent = (content) => console.log('Handle content:', content);
            const handleError = (error) => console.log('Handle error:', error);
            promise.then((content) => handleContent(content)).catch((error) => handleError(error));
        `
    }
];
