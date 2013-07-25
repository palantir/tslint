/// <reference path='abstractFormatter.ts' />

module Lint.Formatters {

  export class JsonFormatter extends AbstractFormatter {
    constructor() {
      super("json");
    }

    public format(failures: Lint.RuleFailure[]): string {
      var failuresJSON = [];

      for (var i = 0; i < failures.length; ++i) {
        var failure = failures[i];
        failuresJSON.push(failure.toJson());
      }

      return JSON.stringify(failuresJSON);
    }
  }

}
