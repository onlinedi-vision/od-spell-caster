#!/usr/bin/env bash
#
# Pre commit hook for Division Online development.
# Component:
#   
#   https://github.com/onlinedi-vision/od-spell-caster
#

if ! $(cd $(git rev-parse --show-toplevel) && go build); then 
  echo "[X] failed pre-commit build test" >&2
  echo "    make sure your code builds before committing it!" >&2

  exit 1
fi
