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

///<reference path='typescript.ts' />

module TypeScript {
    export class SourceMapPosition {
        public sourceLine: number;
        public sourceColumn: number;
        public emittedLine: number;
        public emittedColumn: number;
    }

    export class SourceMapping {
        public start = new SourceMapPosition();
        public end = new SourceMapPosition();
        public nameIndex: number = -1;
        public childMappings: SourceMapping[] = [];
    }

    export class SourceMapSourceInfo {
        public jsFileName: string;
        public tsFilePath: string;
        public sourceMapPath: string;
        public sourceMapDirectory: string;
        public sourceRoot: string;

        constructor(oldSourceMapSourceInfo?: SourceMapSourceInfo) {
            if (oldSourceMapSourceInfo) {
                this.jsFileName = oldSourceMapSourceInfo.jsFileName;
                this.sourceMapPath = oldSourceMapSourceInfo.sourceMapPath;
                this.sourceMapDirectory = oldSourceMapSourceInfo.sourceMapDirectory;

                this.sourceRoot = oldSourceMapSourceInfo.sourceRoot;
            }
        }
    }

    export class SourceMapper {
        static MapFileExtension = ".map";
        
        public sourceMappings: SourceMapping[] = [];
        public currentMappings: SourceMapping[][] = [];

        public names: string[] = [];
        public currentNameIndex: number[] = [];

        constructor(public jsFile: ITextWriter,
            public sourceMapOut: ITextWriter,
            public sourceMapSourceInfo: SourceMapSourceInfo) {
            this.currentMappings.push(this.sourceMappings);
        }
        
        // Generate source mapping.
        // Creating files can cause exceptions, they will be caught higher up in TypeScriptCompiler.emit
        static emitSourceMapping(allSourceMappers: SourceMapper[]): void {
            // At this point we know that there is at least one source mapper present.
            // If there are multiple source mappers, all will correspond to same map file but different sources

            // Output map file name into the js file
            var sourceMapper = allSourceMappers[0];
            sourceMapper.jsFile.WriteLine("//# sourceMappingURL=" + sourceMapper.sourceMapSourceInfo.sourceMapPath);

            // Now output map file
            var sourceMapOut = sourceMapper.sourceMapOut;
            var mappingsString = "";
            var tsFiles: string[] = [];

            var prevEmittedColumn = 0;
            var prevEmittedLine = 0;
            var prevSourceColumn = 0;
            var prevSourceLine = 0;
            var prevSourceIndex = 0;
            var prevNameIndex = 0;
            var namesList: string[] = [];
            var namesCount = 0;
            var emitComma = false;

            var recordedPosition: SourceMapPosition = null;
            for (var sourceMapperIndex = 0; sourceMapperIndex < allSourceMappers.length; sourceMapperIndex++) {
                sourceMapper = allSourceMappers[sourceMapperIndex];

                // If there are any mappings generated
                var currentSourceIndex = tsFiles.length;
                tsFiles.push(sourceMapper.sourceMapSourceInfo.tsFilePath);

                // Join namelist
                if (sourceMapper.names.length > 0) {
                    namesList.push.apply(namesList, sourceMapper.names);
                }

                var recordSourceMapping = (mappedPosition: SourceMapPosition, nameIndex: number) => {
                    if (recordedPosition !== null &&
                        recordedPosition.emittedColumn === mappedPosition.emittedColumn &&
                        recordedPosition.emittedLine === mappedPosition.emittedLine) {
                        // This position is already recorded
                        return;
                    }

                    // Record this position
                    if (prevEmittedLine !== mappedPosition.emittedLine) {
                        while (prevEmittedLine < mappedPosition.emittedLine) {
                            prevEmittedColumn = 0;
                            mappingsString = mappingsString + ";";
                            prevEmittedLine++;
                        }
                        emitComma = false;
                    }
                    else if (emitComma) {
                        mappingsString = mappingsString + ",";
                    }

                    // 1. Relative Column
                    mappingsString = mappingsString + Base64VLQFormat.encode(mappedPosition.emittedColumn - prevEmittedColumn);
                    prevEmittedColumn = mappedPosition.emittedColumn;

                    // 2. Relative sourceIndex 
                    mappingsString = mappingsString + Base64VLQFormat.encode(currentSourceIndex - prevSourceIndex);
                    prevSourceIndex = currentSourceIndex;

                    // 3. Relative sourceLine 0 based
                    mappingsString = mappingsString + Base64VLQFormat.encode(mappedPosition.sourceLine - 1 - prevSourceLine);
                    prevSourceLine = mappedPosition.sourceLine - 1;

                    // 4. Relative sourceColumn 0 based 
                    mappingsString = mappingsString + Base64VLQFormat.encode(mappedPosition.sourceColumn - prevSourceColumn);
                    prevSourceColumn = mappedPosition.sourceColumn;

                    // 5. Relative namePosition 0 based
                    if (nameIndex >= 0) {
                        mappingsString = mappingsString + Base64VLQFormat.encode(namesCount + nameIndex - prevNameIndex);
                        prevNameIndex = namesCount + nameIndex;
                    }

                    emitComma = true;
                    recordedPosition = mappedPosition;
                };

                // Record starting spans
                var recordSourceMappingSiblings = (sourceMappings: SourceMapping[]) => {
                    for (var i = 0; i < sourceMappings.length; i++) {
                        var sourceMapping = sourceMappings[i];
                        recordSourceMapping(sourceMapping.start, sourceMapping.nameIndex);
                        recordSourceMappingSiblings(sourceMapping.childMappings);
                        recordSourceMapping(sourceMapping.end, sourceMapping.nameIndex);
                    }
                };

                recordSourceMappingSiblings(sourceMapper.sourceMappings);
                namesCount = namesCount + sourceMapper.names.length;
            }

            // Write the actual map file
            sourceMapOut.Write(JSON.stringify({
                version: 3,
                file: sourceMapper.sourceMapSourceInfo.jsFileName,
                sourceRoot: sourceMapper.sourceMapSourceInfo.sourceRoot,
                sources: tsFiles,
                names: namesList,
                mappings: mappingsString
            }));

            // Closing files could result in exceptions, report them if they occur
            sourceMapOut.Close();
        }
    }
}