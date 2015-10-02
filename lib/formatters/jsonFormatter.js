var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var Lint = require("../lint");
var Formatter = (function (_super) {
    __extends(Formatter, _super);
    function Formatter() {
        _super.apply(this, arguments);
    }
    Formatter.prototype.format = function (failures) {
        var failuresJSON = failures.map(function (failure) { return failure.toJson(); });
        return JSON.stringify(failuresJSON);
    };
    return Formatter;
})(Lint.Formatters.AbstractFormatter);
exports.Formatter = Formatter;
