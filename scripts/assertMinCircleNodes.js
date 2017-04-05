var requiredNodes = 4;
var nodes = parseInt(process.argv[2], 10);
if (requiredNodes != null && requiredNodes > nodes) {
    console.error("ERROR: You must run CircleCI with " + requiredNodes + " parallel nodes");
    console.error("    This ensures that different environments are tested for TSLint compatibility");
    console.error("    https://circleci.com/gh/<YOUR ACCOUNT>/tslint/edit#parallel-builds");
    process.exit(1);
}
