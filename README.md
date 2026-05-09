# Hermes Docker

Portable Docker setup for Hermes Agent plus `hermes-web-ui`.

The image is built with the Hermes Agent Chinese community installer used by the article:

- `curl -fsSL https://res1.hermesagent.org.cn/install.sh | bash`
- `hermes-web-ui@latest` from npm

Runtime configuration is not copied into the image. The compose file mounts your host config directly:

- `${HOME}/.hermes` -> `/home/hermes/.hermes`
- `${HOME}/.hermes-web-ui` -> `/home/hermes/.hermes-web-ui`
- `${HOME}/.agents/skills` -> `/home/hermes/.agents/skills` read-only, for shared external skills

The container uses `network_mode: host`, so it shares the host network namespace. This lets Hermes use host-local proxy settings and host-local services.

## Run

```bash
cd ~/hermes-docker
docker compose build
docker compose up -d
```

To pin Hermes Agent to a branch or tag:

```bash
HERMES_AGENT_REF=main docker compose build
```

To install the heavier optional Python extras during image build:

```bash
HERMES_INSTALL_OPTIONAL_EXTRAS=true docker compose build
```

To pin Web UI to a specific version instead of latest:

```bash
HERMES_WEB_UI_VERSION=0.5.15 docker compose build
```

## China Mirrors

The default build uses China-friendly mirrors:

- Base image: `docker.1ms.run/library/node:24-bookworm`
- Debian apt: `https://mirrors.tuna.tsinghua.edu.cn/debian`
- pip: `https://pypi.tuna.tsinghua.edu.cn/simple`
- npm: `https://registry.npmmirror.com`
- Node headers for `node-gyp`: `https://npmmirror.com/mirrors/node`

You can override them:

```bash
NODE_IMAGE=node:24-bookworm \
APT_MIRROR=https://deb.debian.org/debian \
PIP_INDEX_URL=https://pypi.org/simple \
NPM_REGISTRY=https://registry.npmjs.org \
NODE_DISTURL=https://nodejs.org/download/release \
docker compose build
```

To use another installer mirror:

```bash
HERMES_INSTALL_URL=https://example.com/install.sh docker compose build
```

Open:

```text
http://localhost:8648
```

## Proxy

With host networking, a proxy listening on host `127.0.0.1` is reachable from the container as `127.0.0.1`.

If your proxy also needs environment variables, start compose with them:

```bash
HTTP_PROXY=http://127.0.0.1:7890 \
HTTPS_PROXY=http://127.0.0.1:7890 \
ALL_PROXY=socks5://127.0.0.1:7890 \
docker compose up -d
```

If your Linux host user is not UID/GID 1000, pass your IDs so the container can write mounted files:

```bash
HERMES_UID=$(id -u) HERMES_GID=$(id -g) docker compose up -d
```

The default Web UI upstream is `http://127.0.0.1:8643`, matching the current mounted Hermes config. Override it if your `platforms.api_server.extra.port` differs:

```bash
HERMES_UPSTREAM=http://127.0.0.1:8642 docker compose up -d
```

## Operations

```bash
docker compose logs -f
docker compose exec hermes hermes --version
docker compose exec hermes hermes gateway status
docker compose down
```

## Notes

`network_mode: host` works natively on Linux and is supported by OrbStack. On Docker Desktop for macOS, host networking depends on the Docker Desktop version and settings.

This setup writes directly to your mounted `~/.hermes` and `~/.hermes-web-ui`, so back them up before first use if those files are important.
