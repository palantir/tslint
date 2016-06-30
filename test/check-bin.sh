# Copyright 2014 Palantir Technologies, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

num_failures=0

expectOut () {
  actual=$1
  expect=$2
  msg=$3

  nodeV=`node -v`

  # if Node 0.10.*, node will sometimes exit with status 8 when an error is thrown
  if [[ $expect != $actual || $nodeV == v0.10.* && $expect == 1 && $actual == 8 ]] ; then
    echo "$msg: expected $expect got $actual"
    num_failures=$(expr $num_failures + 1)
  fi
}

echo "Checking tslint binary"
# make sure calling tslint with no args exits correctly.
./bin/tslint
expectOut $? 1  "tslint with no args did not exit correctly"

# make sure calling tslint with a good file exits correctly.
./bin/tslint src/configuration.ts
expectOut $? 0 "tslint with a good file did not exit correctly"

# make sure calling tslint without the -f flag exits correctly
./bin/tslint src/configuration.ts src/formatterLoader.ts
expectOut $? 0 "tslint with valid arguments did not exit correctly"

# make sure calling tslint with the -f flag exits correctly
./bin/tslint src/configuration.ts -f src/formatterLoader.ts
expectOut $? 1 "tslint with -f flag did not exit correctly"

# make sure calling tslint with a CLI custom rules directory that doesn't exist fails
# (redirect stderr because it's confusing to see a stack trace during the build)
./bin/tslint -c ./test/config/tslint-custom-rules.json -r ./someRandomDir src/tslint.ts
expectOut $? 1 "tslint with -r pointing to a nonexistent directory did not fail"

# make sure calling tslint with a CLI custom rules directory that does exist finds the errors it should
./bin/tslint -c ./test/config/tslint-custom-rules.json -r ./test/files/custom-rules src/tslint.ts
expectOut $? 2 "tslint with with -r pointing to custom rules did not find lint failures"

# make sure calling tslint with a rulesDirectory in a config file works
./bin/tslint -c ./test/config/tslint-custom-rules-with-dir.json src/tslint.ts
expectOut $? 2 "tslint with with JSON pointing to custom rules did not find lint failures"

# make sure calling tslint with an array as rulesDirectory in a config file works
./bin/tslint -c ./test/config/tslint-custom-rules-with-two-dirs.json src/tslint.ts
expectOut $? 2 "tslint with with JSON pointing to two custom rules did not find lint failures from second directory"

# make sure --force option makes TSLint return a status code of 0 when there are lint errors
./bin/tslint -c ./test/config/tslint-custom-rules.json -r ./test/files/custom-rules --force src/tslint.ts
expectOut $? 0 "tslint with with -r pointing to custom rules did not find lint failures"

# make sure path to config without a preceding "./" works on the CLI
./bin/tslint -c test/config/tslint-almost-empty.json src/tslint.ts
expectOut $? 0 "-c relative path without ./ did not work"

# make sure calling tslint with a config file which extends a package relative to the config file works
./bin/tslint -c test/config/tslint-extends-package-no-mod.json src/tslint.ts
expectOut $? 0 "tslint (with config file extending relative package) did not work"

# make sure tslint --init generates a file
cd ./bin
if [ -f tslint.json ]; then
  rm tslint.json
fi

./tslint --init
if [ ! -f tslint.json ]; then
  echo "--init failed, tslint.json not created"
  num_failures=$(expr $num_failures + 1)
fi
expectOut $? 0 "tslint with --init flag did not exit correctly"

# should fail since tslint.json already exists
./tslint --init
expectOut $? 1 "tslint with --init flag did not exit correctly when tslint.json already exists"

rm tslint.json
cd ..

# ensure --test command works correctly
./bin/tslint --test test/rules/no-eval
expectOut $? 0 "tslint --test did not exit correctly for a passing test"

./bin/tslint --test test/files/incorrect-rule-test
expectOut $? 1 "tslint --test did not exit correctly for a failing test"

# ensure --test command works correctly with custom rules
./bin/tslint --test test/files/custom-rule-rule-test
expectOut $? 0 "tslint --test did not exit correctly for a passing test with custom rules"

./bin/tslint -r test/files/custom-rules-2 --test test/files/custom-rule-cli-rule-test
expectOut $? 0 "tslint --test did not exit correctly for a passing test with custom rules from the CLI"

# make sure tslint exits correctly when tsconfig is specified but no files are given
./bin/tslint -c test/files/tsconfig-test/tslint.json --project test/files/tsconfig-test/tsconfig.json
expectOut $? 0 "tslint with tsconfig did not exit correctly"

# make sure tslint only lints files given if tsconfig is also specified
./bin/tslint -c test/files/tsconfig-test/tslint.json --project test/files/tsconfig-test/tsconfig.json test/files/tsconfig-test/other.test.ts
expectOut $? 2 "tslint with tsconfig and files did not find lint failures from given files"

# make sure tslint runs the type checker
./bin/tslint -c test/files/tsconfig-test/tslint.json --project test/files/tsconfig-test/tsconfig.json --type-check
expectOut $? 2 "tslint with --type-check flag did not find type checked lint failures"

if [ $num_failures != 0 ]; then
  echo "Failed $num_failures tests"
  exit 1
else
  echo "Done!"
  exit 0
fi
