var lib = require('lib'); // error

let lib2 = require('lib2'); // error

import {l} from 'lib';

var lib3 = load('not_an_import');

var lib4 = lib2.subImport;

var lib5 = require('lib5'), // error
    lib6 = require('lib6'), // error
    lib7 = 700;

import lib8 = require('lib8'); // error

import foo = bar; // error
