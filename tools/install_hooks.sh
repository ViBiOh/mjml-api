#!/usr/bin/env bash

cd `dirname ${0}`

WORKING_DIR=`pwd`
HOOKS_DIR="hooks"
GIT_ROOT=`git rev-parse --show-cdup`

for file in `ls ${HOOKS_DIR}`; do
  fullpath="${WORKING_DIR}/${GIT_ROOT%%/}/.git/hooks/${file}"
  ln -f -s "${WORKING_DIR}/${HOOKS_DIR}/${file}" "${fullpath}"
  echo "${file} hook installed"
done
