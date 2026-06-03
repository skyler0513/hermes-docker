#!/usr/bin/env bash
set -euo pipefail

HERMES_HOME="${HERMES_HOME:-/home/hermes/.hermes}"
HERMES_WEB_UI_HOME="${HERMES_WEB_UI_HOME:-/home/hermes/.hermes-web-ui}"
HERMES_WORKSPACE="${HERMES_WORKSPACE:-/workspace}"

if [ "$(id -u)" = "0" ]; then
  if [ -n "${HERMES_GID:-}" ] && [ "$HERMES_GID" != "$(id -g hermes)" ]; then
    groupmod -o -g "$HERMES_GID" hermes 2>/dev/null || true
  fi
  if [ -n "${HERMES_UID:-}" ] && [ "$HERMES_UID" != "$(id -u hermes)" ]; then
    usermod -u "$HERMES_UID" hermes 2>/dev/null || true
  fi
  mkdir -p /home/hermes "$HERMES_HOME" "$HERMES_WEB_UI_HOME" "$HERMES_WORKSPACE" /home/hermes/.agents
  chown hermes:hermes /home/hermes "$HERMES_WORKSPACE" 2>/dev/null || true
  exec gosu hermes "$0" "$@"
fi

export HOME=/home/hermes
export HERMES_HOME
export HERMES_BIN="${HERMES_BIN:-/usr/local/bin/hermes}"
export PATH="/opt/hermes-agent/node_modules/.bin:$HERMES_HOME/node_modules/.bin:/opt/hermes-agent/venv/bin:/usr/local/bin:$PATH"

mkdir -p "$HERMES_HOME"/{cron,sessions,logs,hooks,memories,skills,skins,plans,workspace,home}
mkdir -p "$HERMES_WEB_UI_HOME"/{data,logs}

if [ -z "${AUTH_TOKEN:-}" ] && [ ! -f "$HERMES_WEB_UI_HOME/.token" ]; then
  umask 077
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))" > "$HERMES_WEB_UI_HOME/.token"
fi

if [ -z "${AUTH_TOKEN:-}" ] && [ -f "$HERMES_WEB_UI_HOME/.token" ]; then
  AUTH_TOKEN="$(tr -d '\r\n' < "$HERMES_WEB_UI_HOME/.token")"
  export AUTH_TOKEN
fi

cleanup() {
  if [ -n "${gateway_pid:-}" ]; then
    kill "$gateway_pid" 2>/dev/null || true
    wait "$gateway_pid" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

case "${1:-web}" in
  web)
    shift || true
    hermes gateway run --replace --accept-hooks &
    gateway_pid=$!
    exec hermes-web-ui "${PORT:-8648}" "$@"
    ;;
  gateway)
    shift || true
    exec hermes gateway run --replace --accept-hooks "$@"
    ;;
  shell)
    shift || true
    exec bash "$@"
    ;;
  *)
    exec "$@"
    ;;
esac
