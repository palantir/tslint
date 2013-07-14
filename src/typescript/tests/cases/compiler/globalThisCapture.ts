// Add a lambda to ensure global 'this' capture is triggered
(()=>this.window);

// BUG 524571: Emitter generates wrong code for function expressions
// the generated code is not correct
var parts = [];

// Ensure that the generated code is correct
parts[0];
