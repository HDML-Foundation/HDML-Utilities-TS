#!/bin/bash

# @author Artem Lytvynov
# @copyright Artem Lytvynov
# @license Apache-2.0

# Checking version parameter:
RELEASE=$1
# POSIX `[` uses `=`, not `==`. Under a dash /bin/sh the `[` builtin rejects
# `==` ("unexpected operator") and exits non-zero, which makes this condition
# read FALSE -- so the guard below is BYPASSED rather than failed and the
# script runs on through `git commit -a` and `git push origin main` with an
# EMPTY $RELEASE, blanking all 23 version entries. Same defect class as the
# branch guard below (019 S9/C57/C174); measured in both shells.
if [ "v$RELEASE" = "v" ]; then
  echo "Error: release number must be specified";
  exit 1;
fi

# For every package:
for d in packages/*/ ; do
  # building package name:
  n=${d#*packages/}
  n=${n%/}

  # checking package.json:
  p=$d"package.json"
  if [ ! -f $p ]; then
    echo "Error: $p not found"
    exit 1
  fi

  # updating package.json version:
  sed -i.bak -E "s/\"version\": \"[^\"]+\"/\"version\": \"$RELEASE\"/" $p
  # `sed -i` exits 0 even when it matches nothing, so grep the file it
  # just wrote. A manifest with no "version" key is a hard error.
  if grep -q "\"version\": \"$RELEASE\"" "$p"; then
    echo "Version updated to $RELEASE in $p"
  else
    echo "Error: failed to update version in $p"
    exit 1
  fi

  # recursively update current package version in all dependent packages: 
  for sub_d in packages/*/ ; do
    # checking package.json:
    sub_p=$sub_d"package.json"
    if [ ! -f $sub_p ]; then
      echo "Error: $sub_p not found"
      exit 1
    fi

    # updating package.json version:
    sed -i.bak -E "s/\"@hdml\/$n\": \"[^\"]+\"/\"@hdml\/$n\": \"$RELEASE\"/" $sub_p
    # Unlike the version rewrite above, a miss here is NORMAL: only 15
    # of the 64 (package, manifest) pairs are real dependency edges, so
    # report a rewrite and stay silent otherwise. Never exit.
    if grep -q "\"@hdml/$n\": \"$RELEASE\"" "$sub_p"; then
      echo "@hdml/$n version updated to $RELEASE in $sub_p"
    fi
  done
done

# removing .bak files
rm -rf packages/**/package.json.bak

# Checking and applying GH token:
if [ ! -f /home/.ssh/gh_token ]; then
    echo "Error: /home/.ssh/gh_token not found"
    exit 1
fi
. /home/.ssh/gh_token

# Checking git branch:
BRANCH="$(git rev-parse --abbrev-ref HEAD)"
# POSIX `[` on purpose: under a dash /bin/sh, `[[` is "not found", the
# condition reads FALSE, and execution falls through to the push block
# below -- the guard is bypassed rather than failed.
if [ "$BRANCH" != "main" ]; then
  echo "Error: must be run from the 'main' branch";
  exit 1;
fi

# Keep package-lock.json in step with the manifests this script just
# rewrote. Without this the lock records the PREVIOUS version, which
# release.yml's `npm ci` then installs from -- survivable only because
# all eight are workspace `link: true` entries, so npm resolves them
# against the on-disk manifests and never reads the lock's version.
# It is still wrong, and it drifted a full release before 019 caught it.
npm install --package-lock-only

# Commiting changes and adding new tag:
git commit -a -m "chore(release): $RELEASE"
git push origin main
git tag -a $RELEASE -m "$RELEASE"
git push origin $RELEASE
