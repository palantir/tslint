/// <reference path='jsonFormatter.ts'/>
/// <reference path='proseFormatter.ts'/>

module Lint.Formatters {

    var ALL_FORMATTERS: Formatter[] = [];

    export function createAllFormatters() {
        ALL_FORMATTERS.push(new JsonFormatter());
        ALL_FORMATTERS.push(new ProseFormatter());
    }

    export function getFormatterForName(name: string): Lint.Formatter {
        var filteredFormatters = ALL_FORMATTERS.filter(function(formatter) {
            return formatter.getName() === name;
        });

        if (filteredFormatters.length > 0) {
            return filteredFormatters[0];
        } else {
            return undefined;
        }
    }

}
