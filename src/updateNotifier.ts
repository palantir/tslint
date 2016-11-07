/**
 * @license
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

// tslint:disable-next-line:no-var-requires
const updateNotifier = require("update-notifier");
// tslint:disable-next-line:no-var-requires 
const pkg = require("../package.json");

export function updateNotifierCheck(): void {
    // Check every 3 days for a new version
    const cacheTime: number = 1000 * 60 * 60 * 24 * 3;
    const changeLogUrl: string = "https://github.com/palantir/tslint/blob/master/CHANGELOG.md";
    const notifier = updateNotifier({
        pkg,
        updateCheckInterval: cacheTime,
    });

    if (notifier.notify && notifier.update) {
        let message: string = `TSLint update available v${notifier.update.current} → v${notifier.update.latest} \n See ${changeLogUrl}`;
        notifier.notify({ message });
    }
};
