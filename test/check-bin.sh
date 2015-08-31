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

  if [ $expect != $actual ]
  then
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

# make sure tslint only accepts typescript extensions without -e option
./bin/tslint test/files/sample.js
expectOut $? 1 "tslint without -e flag did not exit correctly when handling non-TS extensions"

# make sure tslint accepts other file extensions with -e flag
./bin/tslint -e test/files/sample.js
expectOut $? 0 "tslint with -e flag did not exit correctly when handling non-TS extensions"


if [ $num_failures != 0 ]
then
  echo "Failed $num_failures tests"
  exit 1
else
  echo "Done!"
  exit 0
fi
