#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

main() {
  pushd "${SCRIPT_DIR}/hooks"

  for file in *; do
    ln -s -f "$(pwd)/${file}" "${SCRIPT_DIR}/../.git/hooks/${file}"
    echo "${file} hook installed"
  done

  popd
}

main
