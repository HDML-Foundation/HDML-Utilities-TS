#!/bin/bash

# @author Artem Lytvynov
# @copyright Artem Lytvynov
# @license Apache-2.0

# Checking version parameter:
RELEASE=$1
if [ "v$RELEASE" == "v" ]; then
  echo "Error: release number must be specified";
  exit 1;
fi

# For every package:
for d in packages/*/ ; do

  # checking package.json:
  p=$d"package.json"
  if [ ! -f $p ]; then
    echo "Error: $p not found"
    exit 1
  fi

  # updating package.json version:
  sed -E "s/\"version\": \"[^\"]+\"/\"version\": \"$RELEASE\"/" $p
  if [ $? -eq 0 ]; then
    echo "Version updated to $RELEASE in $p"
  else
    echo "Failed to update version in $p"
  fi
done

# Checking and applying GH token:
if [ ! -f /home/.ssh/gh_token ]; then
    echo "Error: /home/.ssh/gh_token not found"
    exit 1
fi
. /home/.ssh/gh_token

# Checking git branch:
BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$BRANCH" != "main" ]]; then
  echo "Error: must be run from the 'main' branch";
  exit 1;
fi

# Commiting changes and adding new tag:
git commit -a -m "v$RELEASE"
git push origin main
git tag -a v$RELEASE -m "v$RELEASE"
git push origin v$RELEASE