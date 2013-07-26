/// <reference path='../../typescript/src/compiler/precompile.ts' />
/// <reference path='../../typescript/src/compiler/text/scriptSnapshot.ts' />
/// <reference path='../../typescript/src/services/languageService.ts' />

module Lint {

  export class LanguageServiceHost extends TypeScript.NullLogger implements Services.ILanguageServiceHost {
    private compilationSettings: TypeScript.CompilationSettings;
    private diagnostics: Services.ILanguageServicesDiagnostics;
    private fileName: string;
    private scriptSnapshot: TypeScript.IScriptSnapshot;

    constructor(fileName: string, contents: string) {
      super();

      this.compilationSettings = this.createCompilationSettings();
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
      return true;
    }

    public getScriptSnapshot(fileName: string): TypeScript.IScriptSnapshot {
      return this.scriptSnapshot;
    }

    public getDiagnosticsObject(): Services.ILanguageServicesDiagnostics {
      return this.diagnostics;
    }

    private createCompilationSettings(): TypeScript.CompilationSettings {
      var settings = new TypeScript.CompilationSettings();

      // set target to ES5
      settings.codeGenTarget = TypeScript.LanguageVersion.EcmaScript5;
      // disable automatic semicolon insertions
      settings.allowAutomaticSemicolonInsertion = false;

      return settings;
    }
  }

  class LanguageServicesDiagnostics implements Services.ILanguageServicesDiagnostics {
    private logger;

    constructor() {
      this.logger = new TypeScript.NullLogger();
    }

    public log(content: string): void {
      this.logger.log(content);
    }
  }

}
