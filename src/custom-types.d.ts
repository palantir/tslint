declare module "builtin-modules" {
    let result: string[];
    export = result;
}

declare module "url-regex" {
    const urlRegex: (config?: { exact: boolean; strict: boolean }) => RegExp;
    export = urlRegex;
}
