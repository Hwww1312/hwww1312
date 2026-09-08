#!/usr/bin/env bash
# Idempotent Cloud Agent bootstrap for the Cambodian Food Stars asset tools.
# Safe to run repeatedly: it only installs what is missing.
set -euo pipefail

cd "$(dirname "$0")/.."

# ffmpeg encodes the rendered hero frames into app/public/assets/hero.mp4.
if ! command -v ffmpeg >/dev/null 2>&1; then
  sudo apt-get update
  sudo apt-get install -y --no-install-recommends ffmpeg
fi

# Python render dependencies (numpy, Pillow, fonttools, Brotli).
python3 -m pip install --user --disable-pip-version-check -r requirements.txt

echo "cloud-agent-install: ffmpeg=$(command -v ffmpeg) python=$(python3 --version)"
