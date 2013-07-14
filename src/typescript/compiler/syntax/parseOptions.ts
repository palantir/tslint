///<reference path='references.ts' />

module TypeScript {
    export class ParseOptions {
        private _allowAutomaticSemicolonInsertion: boolean;
        private _allowModuleKeywordInExternalModuleReference: boolean;

        constructor(allowAutomaticSemicolonInsertion, allowModuleKeywordInExternalModuleReference) {
            this._allowAutomaticSemicolonInsertion = allowAutomaticSemicolonInsertion;
            this._allowModuleKeywordInExternalModuleReference = allowModuleKeywordInExternalModuleReference;
        }

        public toJSON(key) {
            return { allowAutomaticSemicolonInsertion: this._allowAutomaticSemicolonInsertion,
                     allowModuleKeywordInExternalModuleReference: this._allowModuleKeywordInExternalModuleReference };
        }

        public allowAutomaticSemicolonInsertion(): boolean {
            return this._allowAutomaticSemicolonInsertion;
        }

        public allowModuleKeywordInExternalModuleReference(): boolean {
            return this._allowModuleKeywordInExternalModuleReference;
        }
    }
}