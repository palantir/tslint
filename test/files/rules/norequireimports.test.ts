var lib = require('lib'); // failure

let lib2 = require('lib2'); // failure

import {l} from 'lib';

var lib3 = load('not_an_import');

var lib4 = lib2.subImport;

var lib5 = require('lib5'), // failure
    lib6 = require('lib6'), // failure
    lib7 = 700;

import lib8 = require('lib8'); // failure

import lib9 = lib2.anotherSubImport;
