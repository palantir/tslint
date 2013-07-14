// bug: 684225
declare module 'filexx'{
export enum Mode{ Open }
}

import f = require('filexx');

var x = f.Mode.Open;
