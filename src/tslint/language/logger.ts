/// <reference path='../../typescript/src/compiler/diagnostics.ts'/>

module Lint {

  export class Logger implements TypeScript.ILogger {
    public information(): boolean {
      return true;
    }

    public debug(): boolean {
      return true;
    }

    public warning(): boolean {
      return true;
    }

    public error(): boolean {
      return true;
    }

    public fatal(): boolean {
      return true;
    }

    log(s: string): void {
      // do nothing yet
    }
  }

}
