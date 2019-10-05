/*
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
 * Generates entries for CHANGELOG.md from pull requests
 *
 * Reads changelog entries from pull requests merged since the last release tag.
 * Changelog entries are lines within the first PR comment that matches /^\[[a-z\-]+\]/ like `[new-rule]` and `[bugfix]`
 */

// tslint:disable:no-console

import * as Octokit from "@octokit/rest";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

import { camelize } from "../lib/utils";

// ignores TLS certificate error
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const tokenFile = path.join(os.homedir(), "github_token.txt");
const authToken = fs
    .readFileSync(tokenFile, "utf8")
    .toString()
    .trim();
console.log(`Using OAuth token ${authToken}\n`);

const octokit = new Octokit({
    auth: authToken,
    host: "api.github.com",
    protocol: "https",
    request: {
        timeout: 5000,
    },
});

const repoInfo = {
    owner: "palantir",
    repo: "tslint",
};

const commitList: ICommit[] = [];
octokit.repos
    .getLatestRelease(repoInfo)
    .then(({ data: { tag_name } }) => {
        console.log(`Getting commits ${tag_name}..master`);
        // get the commits between the most recent release and the head of master
        return octokit.repos.compareCommits({
            base: tag_name,
            head: "master",
            ...repoInfo,
        });
    })
    .then(({ data: { commits } }) => {
        // for each commit, get the PR, and extract changelog entries
        const promises: Array<Promise<any>> = [];
        for (const commitInfo of commits) {
            const commit: ICommit = {
                fields: [],
                sha: commitInfo.sha,
                submitter:
                    commitInfo.commit.author.name !== null
                        ? commitInfo.commit.author.name
                        : commitInfo.author.login,
                title: commitInfo.commit.message,
            };
            commitList.push(commit);

            // check for a pull request number in the commit title
            const match = (commitInfo.commit.message as string).match(/\(#(\d+)\)/);
            if (match && match.length > 1) {
                commit.pushRequestNum = Number.parseInt(match[1], 10);

                // get the PR text
                promises.push(
                    octokit.issues
                        .get({
                            issue_number: commit.pushRequestNum,
                            ...repoInfo,
                        })
                        .then(({ data: { body } }) => {
                            // extract the changelog entries
                            const lines = body.split("\r\n");
                            for (const line of lines) {
                                const fieldMatch = line.match(/^(\[[a-z\-]+\])/);
                                if (fieldMatch) {
                                    commit.fields.push({
                                        tag: fieldMatch[1],
                                        text: `${addLinks(line)} (#${commit.pushRequestNum})`,
                                    });
                                }
                            }
                        }),
                );
            }
        }
        return Promise.all(promises);
    })
    .then(() => {
        const entries: IField[] = [];
        const noFields: string[] = [];
        const contributors = new Set<string>();
        for (const commit of commitList) {
            if (commit.fields.length > 0) {
                for (const field of commit.fields) {
                    if (field.tag !== "[no-log]") {
                        entries.push(field);
                    }
                }
            } else {
                noFields.push(commit.title);
            }
            contributors.add(commit.submitter);
        }
        entries.sort((a, b) => a.tag.localeCompare(b.tag));

        console.log("\n---- formatted changelog entries: ----");
        for (const entry of entries) {
            console.log(`- ${entry.text}`);
        }

        console.log("\n---- PRs with missing changelog entries: ----");
        for (const missing of noFields) {
            console.log(`- ${missing.replace(/[\r\n]+/, "\r\n    ")}`);
        }

        console.log("\n---- thanks ----");
        console.log("Thanks to our contributors!");
        contributors.forEach(contributor => {
            console.log(`- ${contributor}`);
        });
    })
    .catch(error => {
        console.log(`Error: ${error}`);
    });

const cache = new Map<string, boolean>();

function isRule(ruleName: string): boolean {
    let result = cache.get(ruleName);
    if (result === undefined) {
        result = fs.existsSync(`./src/rules/${camelize(ruleName)}Rule.ts`);
        cache.set(ruleName, result);
    }
    return result;
}

/** Replace rule names with links to the docs website */
function addLinks(text: string): string {
    let result = "";
    let lastIndex = 0;
    // match everything that looks like a rule name and is enclosed in backticks
    const regex = /`([a-z][-a-z]*[a-z])+`/g;
    let match = regex.exec(text);
    while (match !== null) {
        if (isRule(match[1])) {
            result += `${text.slice(lastIndex, match.index)}[${
                match[0]
            }](https://palantir.github.io/tslint/rules/${match[1]}/)`;
            lastIndex = regex.lastIndex;
        }
        match = regex.exec(text);
    }
    return result + text.slice(lastIndex);
}

interface IField {
    tag: string;
    text: string;
}

interface ICommit {
    pushRequestBody?: string;
    pushRequestNum?: number;
    submitter: string;
    sha: string;
    title: string;
    fields: IField[];
}
