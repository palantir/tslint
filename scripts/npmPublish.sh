#!/usr/bin/env bash

# Publishes TSLint to NPM
# This script must be run with yarn: "yarn run publish:local gitTagToPublish"
# A user running this script must have Palantir NPM organization credentials

set -e

if [[ $# -ne 1 ]]; then
    echo "usage: yarn run publish:local gitTagToPublish"
    exit 1
fi

rm -rf tempPublish
mkdir tempPublish

git clone git@github.com:palantir/tslint.git tempPublish
cd tempPublish
git checkout $1

yarn install --pure-lockfile
yarn run verify

# courtesy of https://stackoverflow.com/a/3232082/3124288
read -r -p "Are you sure you want to publish version $npm_package_version? [y/N] " response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])+$ ]]; then
    yarn publish --tag latest
else
    echo "Publishing aborted"
fi

cd ..
rm -rf tempPublish
