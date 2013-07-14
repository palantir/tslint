// bug 520891:  Compiler allows AMD module import from relative path without . or .. 

import a = require('A/A');

a.A();