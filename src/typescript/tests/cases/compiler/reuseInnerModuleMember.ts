declare module 'foo' { }

declare module bar {

  interface alpha {}

}
 
import f = require('foo');

module bar {

  var x: alpha;

}
