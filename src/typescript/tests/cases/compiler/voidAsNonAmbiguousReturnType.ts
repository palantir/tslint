declare module "fs" {
    export function mkdirSync(path: string, mode?: number): void;
    export function mkdirSync(path: string, mode?: string): void;
}

import fs = require("fs");

function main() {
 fs.mkdirSync('test'); // should not error - return types are the same
}
