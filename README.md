# Hermes Docker Web UI

One-command Docker deployment for Hermes Agent + Hermes Web UI, with China-friendly defaults, host-mounted configuration, and persistent Web UI authentication.

Chinese documentation: [README.zh-CN.md](README.zh-CN.md)

This project is for people who already use Hermes, or who want to try Hermes Web UI without repeatedly dealing with local Python, Node, dependency, and network setup issues.

## What This Solves

- Keeps Python and Node dependencies out of your host environment
- Uses China-friendly mirrors by default for faster Docker builds
- Mounts the host `~/.hermes` directory so your existing Hermes configuration and models are preserved
- Mounts the host `~/.hermes-web-ui` directory so Web UI data and access tokens are preserved
- Automatically generates and persists a Web UI access token
- Installs `aiohttp`, which is required for the Hermes API Server used by Web UI chat
- Patches Hermes Web UI so custom providers can expose all models from `custom_providers[].models`

## Quick Start

```bash
git clone https://github.com/skyler0513/hermes-docker.git
cd hermes-docker

docker compose build --pull
docker compose up -d
```

Show the Web UI access token:

```bash
cat ~/.hermes-web-ui/.token
```

Open:

```text
http://localhost:8648
```

## Why Docker?

The official Hermes Agent installer is suitable for direct host installation. Docker is more convenient if you want the environment to be easier to move, rebuild, and isolate.

This image does not bake personal configuration into the image. It mounts host directories instead:

- `${HOME}/.hermes` -> `/home/hermes/.hermes`
- `${HOME}/.hermes-web-ui` -> `/home/hermes/.hermes-web-ui`
- `${HOME}/.agents/skills` -> `/home/hermes/.agents/skills`, mounted read-only
- `${HOME}/hermes-workspace` -> `/workspace`

This lets you rebuild the image, upgrade Web UI, or move to another machine without hardcoding API keys, model configuration, or chat data into the image.

## Who Is This For?

Use this project if you:

- Want Hermes Agent + Hermes Web UI without manually installing dependencies
- Often run into build or install failures under China mainland network conditions
- Already have your own `~/.hermes/config.yaml`
- Want the Docker container to use the Hermes configuration from your host machine
- Need to use multiple custom models through Web UI
- Have seen Web UI chat stop responding, the API Server fail to start, or the model list show only one custom-provider model

## What's Included

The image includes:

- Hermes Agent, installed through the China mainland mirror installer
- `hermes-web-ui@latest`
- `aiohttp`, required by the API Server
- A Hermes Web UI patch that expands custom-provider model lists
- An entrypoint script that persists the Web UI token
- China-friendly default package mirrors

Default upstream installation flow:

```bash
curl -fsSL https://res1.hermesagent.org.cn/install.sh | bash
npm install -g hermes-web-ui@latest
```

## Web UI Token

Web UI authentication is enabled by default.

If you do not set `HERMES_WEB_UI_AUTH_TOKEN` manually, the container generates a token on first startup and saves it to:

```text
~/.hermes-web-ui/.token
```

Show the token:

```bash
cat ~/.hermes-web-ui/.token
```

Set a custom token:

```bash
HERMES_WEB_UI_AUTH_TOKEN=your-token docker compose up -d
```

## Custom Provider Models

Models defined under `custom_providers[].models` in the Hermes config are expanded into the Web UI model list.

For example, if `~/.hermes/config.yaml` contains:

```yaml
custom_providers:
  - name: example-provider
    base_url: https://example.com/v1
    model: minimax-m2.7
    models:
      minimax-m2.7: {}
      deepseek-v4-flash: {}
      deepseek-v4-pro: {}
      glm-5: {}
      kimi-k2.6: {}
```

Web UI will show multiple models under `custom:example-provider`, instead of showing only the single model from the `model` field.

## China Mirrors

The default build uses China-friendly mirrors:

- Base image: `docker.1ms.run/library/node:24-bookworm`
- Debian apt: `https://mirrors.tuna.tsinghua.edu.cn/debian`
- pip: `https://pypi.tuna.tsinghua.edu.cn/simple`
- npm: `https://registry.npmmirror.com`
- Node headers for `node-gyp`: `https://npmmirror.com/mirrors/node`

You can switch back to official upstream sources:

```bash
NODE_IMAGE=node:24-bookworm \
APT_MIRROR=https://deb.debian.org/debian \
PIP_INDEX_URL=https://pypi.org/simple \
NPM_REGISTRY=https://registry.npmjs.org \
NODE_DISTURL=https://nodejs.org/download/release \
docker compose build --pull
```

## Configuration

Use a specific Hermes Agent branch or tag:

```bash
HERMES_AGENT_REF=main docker compose build --pull
```

Install heavier optional Python extras:

```bash
HERMES_INSTALL_OPTIONAL_EXTRAS=true docker compose build --pull
```

Use a specific Web UI version:

```bash
HERMES_WEB_UI_VERSION=0.5.24 docker compose build --pull
```

Use another Hermes installer URL:

```bash
HERMES_INSTALL_URL=https://example.com/install.sh docker compose build --pull
```

## Proxy

The container uses `network_mode: host`, so a proxy listening on `127.0.0.1` on the host is also reachable from the container through `127.0.0.1`.

If your proxy needs environment variables:

```bash
HTTP_PROXY=http://127.0.0.1:7890 \
HTTPS_PROXY=http://127.0.0.1:7890 \
ALL_PROXY=socks5://127.0.0.1:7890 \
docker compose up -d
```

## UID / GID

If your Linux user is not UID/GID 1000, pass the host user ID explicitly to avoid write-permission issues on mounted directories:

```bash
HERMES_UID=$(id -u) HERMES_GID=$(id -g) docker compose up -d
```

## Operations

Show service status:

```bash
docker compose ps
```

Follow logs:

```bash
docker compose logs -f
```

Enter the container:

```bash
docker compose exec hermes bash
```

Show the Hermes version:

```bash
docker compose exec hermes hermes --version
```

Check the API Server:

```bash
curl http://127.0.0.1:8642/health
```

Stop the stack:

```bash
docker compose down
```

## Notes

`network_mode: host` works natively on Linux and also works on OrbStack. Docker Desktop for macOS support depends on your Docker Desktop version and settings.

This project writes directly to the mounted host directories `~/.hermes` and `~/.hermes-web-ui`. If these directories already contain important data, back them up before first use.
