/// <reference path='../typescript/compiler/text/scriptSnapshot.ts' />
/// <reference path='../typescript/services/languageService.ts' />

/// <reference path='./logger.ts' />

module Lint {

  export class LanguageServiceHost extends Logger implements Services.ILanguageServiceHost {
    private compilationSettings:TypeScript.CompilationSettings;
    private diagnostics: Services.ILanguageServicesDiagnostics;
    private fileName: string;
    private scriptSnapshot: TypeScript.IScriptSnapshot;

    constructor(fileName: string, contents: string) {
      super();
      this.compilationSettings = new TypeScript.CompilationSettings();
      this.diagnostics = new LanguageServicesDiagnostics();
      this.fileName = fileName;
      this.scriptSnapshot = TypeScript.ScriptSnapshot.fromString(contents);
    }

    public getCompilationSettings(): TypeScript.CompilationSettings {
      return this.compilationSettings;
    }

    public getScriptFileNames(): string[] {
      return [this.fileName];
    }

    public getScriptVersion(fileName: string): number {
      return 0;
    }

    public getScriptIsOpen(fileName: string): boolean {
      return false;
    }

    public getScriptSnapshot(fileName: string): TypeScript.IScriptSnapshot {
      return this.scriptSnapshot;
    }

    public getDiagnosticsObject(): Services.ILanguageServicesDiagnostics {
      return this.diagnostics;
    }
  }

  export class LanguageServicesDiagnostics implements Services.ILanguageServicesDiagnostics {
    private logger: Logger;

    constructor() {
      this.logger = new Logger();
    }

    public log(content: string): void {
      this.logger.log(content);
    }
  }

}
