/*
 * Copyright 2013 Palantir Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var ts = require("typescript");
var path = require("path");
function getSourceFile(fileName, source) {
    var normalizedName = path.normalize(fileName).replace(/\\/g, "/");
    var compilerOptions = createCompilerOptions();
    var compilerHost = {
        fileExists: function () { return true; },
        getCanonicalFileName: function (filename) { return filename; },
        getCurrentDirectory: function () { return ""; },
        getDefaultLibFileName: function () { return "lib.d.ts"; },
        getNewLine: function () { return "\n"; },
        getSourceFile: function (filenameToGet) {
            if (filenameToGet === normalizedName) {
                return ts.createSourceFile(filenameToGet, source, compilerOptions.target, true);
            }
        },
        readFile: function () { return null; },
        useCaseSensitiveFileNames: function () { return true; },
        writeFile: function () { return null; }
    };
    var program = ts.createProgram([normalizedName], compilerOptions, compilerHost);
    return program.getSourceFile(normalizedName);
}
exports.getSourceFile = getSourceFile;
function createCompilerOptions() {
    return {
        noResolve: true,
        target: 1
    };
}
exports.createCompilerOptions = createCompilerOptions;
function doesIntersect(failure, disabledIntervals) {
    return disabledIntervals.some(function (interval) {
        var maxStart = Math.max(interval.startPosition, failure.getStartPosition().getPosition());
        var minEnd = Math.min(interval.endPosition, failure.getEndPosition().getPosition());
        return maxStart <= minEnd;
    });
}
exports.doesIntersect = doesIntersect;
function abstract() {
    console.warn("Lint.abstract() is deprecated and will be removed in a future release. TSLint now uses abstract classes.");
    return "abstract method not implemented";
}
exports.abstract = abstract;
function scanAllTokens(scanner, callback) {
    var lastStartPos = -1;
    while (scanner.scan() !== 1) {
        var startPos = scanner.getStartPos();
        if (startPos === lastStartPos) {
            break;
        }
        lastStartPos = startPos;
        callback(scanner);
    }
}
exports.scanAllTokens = scanAllTokens;
function hasModifier(modifiers) {
    var modifierKinds = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        modifierKinds[_i - 1] = arguments[_i];
    }
    if (modifiers == null || modifierKinds == null) {
        return false;
    }
    return modifiers.some(function (m) {
        return modifierKinds.some(function (k) { return m.kind === k; });
    });
}
exports.hasModifier = hasModifier;
function isBlockScopedVariable(node) {
    var parentNode = (node.kind === 209)
        ? node.parent
        : node.declarationList;
    return isNodeFlagSet(parentNode, 16384)
        || isNodeFlagSet(parentNode, 32768);
}
exports.isBlockScopedVariable = isBlockScopedVariable;
function isBlockScopedBindingElement(node) {
    var currentParent = node.parent;
    while (currentParent.kind !== 209) {
        if (currentParent.parent == null) {
            return true;
        }
        else {
            currentParent = currentParent.parent;
        }
    }
    return isBlockScopedVariable(currentParent);
}
exports.isBlockScopedBindingElement = isBlockScopedBindingElement;
function isNodeFlagSet(node, flagToCheck) {
    return (node.flags & flagToCheck) !== 0;
}
exports.isNodeFlagSet = isNodeFlagSet;
