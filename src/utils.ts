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

/**
 * Enforces the invariant that the input is an array.
 */
export function arrayify<T>(arg?: T | T[]): T[] {
    if (Array.isArray(arg)) {
        return arg;
    } else if (arg != null) {
        return [arg];
    } else {
        return [];
    }
}

/**
 * Enforces the invariant that the input is an object.
 */
export function objectify(arg: any): any {
    if (typeof arg === "object" && arg != null) {
        return arg;
    } else {
        return {};
    }
}

/**
 * Replace hyphens in a rule name by upper-casing the letter after them.
 * E.g. "foo-bar" -> "fooBar"
 */
export function camelize(stringWithHyphens: string): string {
    return stringWithHyphens.replace(/-(.)/g, (_, nextLetter) => nextLetter.toUpperCase());
}

export function isUpperCase(str: string): boolean {
    return str === str.toUpperCase();
}

export function isLowerCase(str: string): boolean {
    return str === str.toLowerCase();
}

/**
 * Removes leading indents from a template string without removing all leading whitespace
 */
export function dedent(strings: TemplateStringsArray, ...values: string[]) {
    let fullString = strings.reduce((accumulator, str, i) => {
        return accumulator + values[i - 1] + str;
    });

    // match all leading spaces/tabs at the start of each line
    const match = fullString.match(/^[ \t]*(?=\S)/gm);
    if (!match) {
        // e.g. if the string is empty or all whitespace.
        return fullString;
    }

    // find the smallest indent, we don't want to remove all leading whitespace
    const indent = Math.min(...match.map((el) => el.length));
    const regexp = new RegExp("^[ \\t]{" + indent + "}", "gm");
    fullString = indent > 0 ? fullString.replace(regexp, "") : fullString;
    return fullString;
}

/**
 * Strip comments from file content.
 */
export function stripComments(content: string): string {
    /**
     * First capturing group matches double quoted string
     * Second matches single quotes string
     * Third matches block comments
     * Fourth matches line comments
     */
    const regexp: RegExp = /("(?:[^\\\"]*(?:\\.)?)*")|('(?:[^\\\']*(?:\\.)?)*')|(\/\*(?:\r?\n|.)*?\*\/)|(\/{2,}.*?(?:(?:\r?\n)|$))/g;
    const result = content.replace(regexp, (match, _m1, _m2, m3, m4) => {
        // Only one of m1, m2, m3, m4 matches
        if (m3) {
            // A block comment. Replace with nothing
            return "";
        } else if (m4) {
            // A line comment. If it ends in \r?\n then keep it.
            const length = m4.length;
            if (length > 2 && m4[length - 1] === "\n") {
                return m4[length - 2] === "\r" ? "\r\n" : "\n";
            } else {
                return "";
            }
        } else {
            // We match a string
            return match;
        }
    });
    return result;
}

/**
 * Escapes all special characters in RegExp pattern to avoid broken regular expressions and ensure proper matches
 */
export function escapeRegExp(re: string): string {
    return re.replace(/[.+*?|^$[\]{}()\\]/g, "\\$&");
}

/** Return true if both parameters are equal. */
export type Equal<T> = (a: T, b: T) => boolean;

export function arraysAreEqual<T>(a: T[] | undefined, b: T[] | undefined, eq: Equal<T>): boolean {
    return a === b || !!a && !!b && a.length === b.length && a.every((x, idx) => eq(x, b[idx]));
}

/** Returns an array that is the concatenation of all output arrays. */
export function flatMap<T, U>(inputs: T[], getOutputs: (input: T) => U[]): U[] {
    const out = [];
    for (const input of inputs) {
        out.push(...getOutputs(input));
    }
    return out;
}

/** Returns an array of all outputs that are not `undefined`. */
export function mapDefined<T, U>(inputs: T[], getOutput: (input: T) => U | undefined): U[] {
    const out = [];
    for (const input of inputs) {
        const output = getOutput(input);
        if (output !== undefined) {
            out.push(output);
        }
    }
    return out;
}
