//
// Copyright (c) Microsoft Corporation.  All rights reserved.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

///<reference path='es5compat.ts' />
///<reference path='..\compiler\typescript.ts' />
///<reference path='coreServices.ts' />
///<reference path='classifier.ts' />
///<reference path='emitOutputTextWriter.ts' />
///<reference path='compilerState.ts' />
///<reference path='languageService.ts' />
///<reference path='completionHelpers.ts' />
///<reference path='keywordCompletions.ts' />
///<reference path='signatureInfoHelpers.ts' />
///<reference path='completionSession.ts' />
///<reference path='pullLanguageService.ts' />
///<reference path='findReferenceHelpers.ts' />
///<reference path='shims.ts' />
///<reference path='formatting\formatting.ts' />
///<reference path='outliningElementsCollector.ts' />
///<reference path='braceMatcher.ts' />
///<reference path='indenter.ts' />
///<reference path='breakpoints.ts' />

module Services {
    export function copyDataObject(dst: any, src: any): any {
        for (var e in dst) {
            if (typeof dst[e] == "object") {
                copyDataObject(dst[e], src[e]);
            }
            else if (typeof dst[e] != "function") {
                dst[e] = src[e];
            }
        }
        return dst;
    }

    export function compareDataObjects(dst: any, src: any): boolean {
        for (var e in dst) {
            if (typeof dst[e] == "object") {
                if (!compareDataObjects(dst[e], src[e]))
                    return false;
            }
            else if (typeof dst[e] != "function") {
                if (dst[e] !== src[e])
                    return false;
            }
        }
        return true;
    }

    export class TypeScriptServicesFactory implements IShimFactory {
        private _shims: IShim[] = [];

        public createPullLanguageService(host: Services.ILanguageServiceHost): Services.ILanguageService {
            try {
                return new Services.LanguageService(host);
            }
            catch (err) {
                Services.logInternalError(host, err);
                throw err;
            }
        }

        public createLanguageServiceShim(host: ILanguageServiceShimHost): ILanguageServiceShim {
            try {
                var hostAdapter = new LanguageServiceShimHostAdapter(host);
                var pullLanguageService = this.createPullLanguageService(hostAdapter);
                return new LanguageServiceShim(this, host, pullLanguageService);
            }
            catch (err) {
                Services.logInternalError(host, err);
                throw err;
            }
        }

        public createClassifier(host: Services.IClassifierHost): Services.Classifier {
            try {
                return new Services.Classifier(host);
            }
            catch (err) {
                Services.logInternalError(host, err);
                throw err;
            }
        }

        public createClassifierShim(host: Services.IClassifierHost): ClassifierShim {
            try {
                return new ClassifierShim(this, host);
            }
            catch (err) {
                Services.logInternalError(host, err);
                throw err;
            }
        }

        public createCoreServices(host: Services.ICoreServicesHost): Services.CoreServices {
            try {
                return new Services.CoreServices(host);
            }
            catch (err) {
                Services.logInternalError(host.logger, err);
                throw err;
            }
        }

        public createCoreServicesShim(host: Services.ICoreServicesHost): CoreServicesShim {
            try {
                return new CoreServicesShim(this, host);
            }
            catch (err) {
                Services.logInternalError(host.logger, err);
                throw err;
            }
        }

        public close(): void {
            // Forget all the registered shims
            this._shims = [];
        }

        public registerShim(shim: IShim): void {
            this._shims.push(shim);
        }

        public unregisterShim(shim: IShim): void {
            for(var i =0, n = this._shims.length; i<n; i++) {
                if (this._shims[i] === shim) {
                    delete this._shims[i];
                    return;
                }
            }

            throw TypeScript.Errors.invalidOperation();
        }
    }
}

