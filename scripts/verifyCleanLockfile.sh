#!/usr/bin/env bash

# Verifies that yarn.lock is in its cleanest possible state

set -e
set -o pipefail

scripts_dir="$( dirname "$(readlink -f "$0")" )"
bin="$scripts_dir/../node_modules/.bin"

if [[ $($bin/yarn-deduplicate --list) ]]; then
    echo "Found duplicate blocks in yarn.lock which can be cleaned up. Please run 'yarn-deduplicate yarn.lock --strategy fewer'"
    exit 1
else
    exit 0
fi
