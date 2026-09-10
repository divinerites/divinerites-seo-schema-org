#!/usr/bin/env bash
set -euo pipefail

module_root="$(cd "$(dirname "$0")/.." && pwd)"
themes_dir="$(dirname "$module_root")"
theme_name="$(basename "$module_root")"
test_output="$(mktemp -d)"
trap 'rm -rf "$test_output"' EXIT

hugo \
  --source "$module_root/testdata" \
  --themesDir "$themes_dir" \
  --theme "$theme_name" \
  --destination "$test_output/public" \
  --cacheDir "$test_output/cache" \
  --noBuildLock \
  --minify

node "$module_root/tests/assert-schema.mjs" "$test_output/public"
