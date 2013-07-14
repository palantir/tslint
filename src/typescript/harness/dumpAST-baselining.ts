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

/// <reference path='harness.ts'/>
/// <reference path='external\json2.ts'/>

module DumpAST {

    import assert = Harness.Assert;

    class DumpEntry {
        public nodeType: string;
        public minChar: number;
        public limChar: number;
        public startLine: number;
        public startCol: number;
        public endLine: number;
        public endCol: number;
        public children: DumpEntry[];

        constructor () {
            this.children = [];
        }
    }

    function getOutputPath() {
        return Harness.userSpecifiedroot + 'tests/cases/unittests/services/dumpAST/baselines';
    }

    function getInputPath() {
        return Harness.userSpecifiedroot + 'tests/cases/unittests/services/testCode';
    }

    function getExistingTestCodeFileNames(): string[] {
        var inputPath = getInputPath();

        return IO.dir(inputPath, null, { recursive: true });
    }

    function deleteExistingBaselineFiles() {
        var outputPath = getOutputPath();

        // Might need to create this
        IO.createDirectory(outputPath);

        // Delete any old reports from the local path
        var localFiles = IO.dir(outputPath);
        for (var i = 0; i < localFiles.length; i++) {
            var localFilename = localFiles[i];
            if (localFilename.indexOf('.html') > 0) {
                IO.deleteFile(localFilename);
            }
        }
    }

    function createDumpTree(script: TypeScript.Script): DumpEntry {
        var entries: DumpEntry[] = [];
        var root: DumpEntry = null;

        var pre = (cur: TypeScript.AST, parent: TypeScript.AST): TypeScript.AST => {
            //verifyAstNodePositions(script, cur);

            var parent2 = (entries.length == 0 ? null : entries[entries.length - 1]);
            var newEntry = createDumpEntry(script, cur, parent2);
            if (entries.length == 0) {
                root = newEntry;
            }

            var dumpComments = function (comments: TypeScript.Comment[]): void {
                if (comments) {
                    for (var i = 0; i < comments.length; i++) {
                        entries.push(createDumpEntry(script, comments[i], parent2));
                    }
                }
            }

            dumpComments(cur.preComments);
            entries.push(newEntry);
            dumpComments(cur.postComments);
            return cur;
        };

        var post = (cur, parent) => {
            entries.pop();
            return cur;
        };

        TypeScript.getAstWalkerFactory().walk(script, pre, post);
        return root;
    }

    function createDumpEntry(script: TypeScript.Script, ast: TypeScript.AST, parent: DumpEntry): DumpEntry {
        var entry = new DumpEntry();
        entry.nodeType = (<any>TypeScript.NodeType)._map[ast.nodeType];
        entry.minChar = ast.minChar;
        entry.limChar = ast.limChar;

        var lineMap = null; //script.locationInfo.lineMap;
        entry.startLine = lineMap.getLineAndCharacterFromPosition(ast.minChar).line();
        entry.startCol = lineMap.getLineAndCharacterFromPosition(ast.minChar).character();
        entry.endLine = lineMap.getLineAndCharacterFromPosition(ast.limChar).line();
        entry.endCol = lineMap.getLineAndCharacterFromPosition(ast.limChar).character();

        if (entry.startLine >= 0) {
            entry.startLine++;
        }

        if (entry.startCol >= 0) {
            entry.startCol++;
        }

        if (entry.endLine >= 0) {
            entry.endLine++;
        }

        if (entry.endCol >= 0) {
            entry.endCol++;
        }
        if (parent)
            parent.children.push(entry);
        return entry;
    }

    function verifyAstNodePositions(script: TypeScript.Script, ast: TypeScript.AST): void {
        var fileName = null;  //script.locationInfo.fileName;
        var maxLimChar = script.limChar;

        var minChar = ast.minChar;

        if (minChar < 0) {
            assert.is(minChar === -1, "file \"" + fileName + "\": " + "The only valid nagative value for minChar is '-1'");
        }
        assert.is(minChar <= maxLimChar, "file \"" + fileName + "\": " + "minChar value " + minChar + " is greater than the length of the source file " + maxLimChar);

        var limChar = ast.limChar;
        if (limChar < 0) {
            assert.is(limChar === -1, "file \"" + fileName + "\": " + "The only valid nagative value for limChar is '-1'");
        }
        assert.is(limChar <= maxLimChar, "file \"" + fileName + "\": " + "limChar value " + limChar + " is greater than the length of the source file " + maxLimChar);

        if (minChar < 0) {
            assert.is(limChar < 0, "file \"" + fileName + "\": " + "minChar value is '-1' but limChar value '" + limChar + "' is not");
        }

        if (limChar < 0) {
            assert.is(minChar < 0, "file \"" + fileName + "\": " + "limChar value is '-1' but minChar value '" + minChar + "' is not");
        }

        assert.is(minChar <= limChar, "file \"" + fileName + "\": " + "minChar value " + minChar + " is greater the limChar value " + limChar);
    }

    function getBaselineFileName(fileName: string): string {
        fileName = switchToForwardSlashes(fileName);
        var nameIndex = fileName.lastIndexOf("/") + 1;
        return getOutputPath() + "/" + fileName.substring(nameIndex) + ".json";
    }

    var addKey = function (key: string): string {
        return JSON2.stringify(key);
    }

    var addString = function (key: string, value: string): string {
        return addKey(key) + ": " + JSON2.stringify(value);
    }

    var addNumber = function (key: string, value: number): string {
        return addKey(key) + ": " + JSON2.stringify(value);
    }

    function dumpEntries(entry: DumpEntry, indent: number): string {
        var indentStr = "";
        for (var i = 0; i < indent; i++) {
            indentStr += "  ";
        }

        if (entry === null)
            return "";

        var result = indentStr;
        result += "{";
        result += addString("nodeType", entry.nodeType) + ", ";
        result += addNumber("minChar", entry.minChar) + ", ";
        result += addNumber("limChar", entry.limChar) + ", ";
        result += addNumber("startLine", entry.startLine) + ", ";
        result += addNumber("startCol", entry.startCol) + ", ";
        result += addNumber("endLine", entry.endLine) + ", ";
        result += addNumber("endCol", entry.endCol) + ", ";
        result += addKey("children") + ": [";
        if (entry.children !== null && entry.children.length > 0) {
            result += "\r\n";
            for (i = 0; i < entry.children.length; i++) {
                result += dumpEntries(entry.children[i], indent + 1);
                if (i < entry.children.length - 1) {
                    result += ",";
                    result += "\r\n";
                }
            }
        }
        result += "]";
        result += "}";
        return result;
    }

    function createDumpContentForFile(typescriptLS: Harness.TypeScriptLS, fileName: string): string {
        var sourceText = TypeScript.ScriptSnapshot.fromString(IO.readFile(fileName).contents())
        var script = typescriptLS.parseSourceText(fileName, sourceText);

        // Dump source text (as JS comments)
        var indentStr = "  ";
        var text = "{\r\n";
        text += indentStr;
        text += addKey("sourceText");
        text += ": [\r\n";

        var lineStarts = null;// script.locationInfo.lineMap.lineStarts();
        for (var i = 0; i < lineStarts.length; i++) {
            if (i > 0) {
                text += ",\r\n";
            }
            var start = lineStarts[i];
            var end = (i < lineStarts.length - 1 ? lineStarts[i + 1] : sourceText.getLength());
            text += indentStr + indentStr + JSON2.stringify(sourceText.getText(start, end));
        }
        text += "],";
        text += "\r\n";

        // Dump source locations (as JSON entries)
        text += indentStr;
        text += addKey("ast");
        text += ":\r\n";
        var entry = createDumpTree(script);
        text += dumpEntries(entry, 2);
        text += "\r\n}\r\n";
        return text;
    }

    export function compareDumpFilesWithBaseline() {
        var typescriptLS = new Harness.TypeScriptLS();
        var fileNames = getExistingTestCodeFileNames();

        for (var i = 0; i < fileNames.length; i++) {
            var fileName = switchToForwardSlashes(fileNames[i]);
            var nameOnly = fileName.substr(fileName.lastIndexOf('/') + 1);
            
            var run = (fn) => {
                Harness.Baseline.runBaseline('AST data for ' + fn, nameOnly.replace(/\.ts/, '.ast'),
                    function () {
                        return createDumpContentForFile(typescriptLS, fn);
                    }
                );
            }

            run(fileName);
        }
    }
}
