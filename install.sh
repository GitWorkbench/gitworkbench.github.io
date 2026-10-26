#!/usr/bin/env bash
set -Eeuo pipefail

curl --fail --location --silent --show-error --retry 2 --connect-timeout 15 https://raw.githubusercontent.com/GitWorkbench/workbench/main/scripts/install-linux.sh | bash -s -- "$@"
