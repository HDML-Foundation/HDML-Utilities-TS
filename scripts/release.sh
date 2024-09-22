#!/bin/bash

# @author Artem Lytvynov
# @copyright Artem Lytvynov
# @license Apache-2.0

if [ ! -f /home/.ssh/gh_token ]; then
    echo "Error: /home/.ssh/gh_token not found"
    exit 1
fi

. /home/.ssh/gh_token

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$BRANCH" != "main" ]]; then
  echo "Error: must be run from the 'main' branch";
  exit 1;
fi

RELEASE=$1
if [ "v$RELEASE" == "v" ]; then
  echo "Error: release number must be specified";
  exit 1;
fi

# if [ ! -f lib/ts/package.json ]; then
#     echo "Error: package.json not found"
#     exit 1
# fi

# sed -i.bak -E "s/\"version\": \"[^\"]+\"/\"version\": \"$RELEASE\"/" lib/ts/package.json

# if [ $? -eq 0 ]; then
#     echo "Version updated to $RELEASE in package.json"
# else
#     echo "Failed to update version in package.json"
# fi

# git commit -a -m "v$RELEASE"
# git push origin main
# git tag -a v$RELEASE -m "v$RELEASE"
# git push origin v$RELEASE