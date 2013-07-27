/// <reference path='configuration.ts' />
/// <reference path='formatters/formatters.ts' />
/// <reference path='language/languageServiceHost.ts' />

module Lint {

    export interface LintResult {
        failureCount: number;
        format: string;
        output: string;
    }

    export class Linter {
        private fileName: string;
        private source: string;
        private options: any;

        constructor(fileName: string, source: string, options: any) {
            this.fileName = fileName;
            this.source = source;
            this.options = options;

            Lint.Rules.createAllRules();
            Lint.Formatters.createAllFormatters();
        }

        public lint(): LintResult {
            var i, failures = [];

            var languageServiceHost = new Lint.LanguageServiceHost(this.fileName, this.source);
            var languageService = new Services.LanguageService(languageServiceHost);
            var syntaxTree = languageService.getSyntaxTree(this.fileName);
            var configuredRules = Lint.Configuration.getConfiguredRules(this.options.configuration);

            for (i = 0; i < configuredRules.length; ++i) {
                var rule = configuredRules[i];
                if (rule.isEnabled()) {
                    failures = failures.concat(rule.apply(syntaxTree));
                }
            }

            var formatter = Lint.Formatters.getFormatterForName(this.options.formatter);
            if (formatter === undefined) {
                formatter = new Lint.Formatters.ProseFormatter();
            }

            var output = formatter.format(failures);
            return {
                failureCount: failures.length,
                format: this.options.formatter,
                output: output
            };
        }
    }

}

module.exports = Lint.Linter;
