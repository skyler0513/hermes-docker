#!/usr/bin/env bash
set -euo pipefail

if command -v hermes-web-ui >/dev/null 2>&1; then
  hermes-web-ui stop || true
fi

if command -v launchctl >/dev/null 2>&1; then
  launchctl bootout "gui/$(id -u)" "$HOME/Library/LaunchAgents/ai.hermes.gateway.plist" 2>/dev/null || true
fi

if command -v hermes >/dev/null 2>&1; then
  hermes gateway stop || true
fi

echo "Local Hermes launch services stopped if they were running."

