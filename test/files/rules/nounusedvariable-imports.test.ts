import  $ = require("jquery");
import  _ = require("underscore");
import  xyz = require("xyz"); // failure
import {createReadStream, createWriteStream} from "fs"; // failure
export import a = require("a");

createWriteStream();

$(_.xyz());

/// <reference path="../externalFormatter.test.ts" />

module S {
  var template = ""; // failure
}

import * as foo from "libA"; // failure on 'foo'
import * as bar from "libB";
import baz from "libC";
import defaultExport, { namedExport } from "libD"; // failure on 'defaultExport'

bar.someFunc();
baz();
namedExport();

import "jquery";
