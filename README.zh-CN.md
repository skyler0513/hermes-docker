# Hermes Docker Web UI

一键 Docker 部署 Hermes Agent + Hermes Web UI，默认适配国内网络，保留宿主机配置，并持久化 Web UI 访问令牌。

英文文档：[README.md](README.md)

这个项目适合已经在用 Hermes，或者想快速体验 Hermes Web UI、但不想在本机反复处理 Python、Node、依赖和国内网络问题的人。

## 解决什么问题

- 不污染本机 Python / Node 环境
- 默认使用国内镜像，加速 Docker 构建
- 挂载宿主机 `~/.hermes`，保留已有的 Hermes 配置和模型
- 挂载宿主机 `~/.hermes-web-ui`，保留 Web UI 数据和访问令牌
- 自动生成并持久化 Web UI 访问令牌
- 安装 API Server 需要的 `aiohttp`，避免 Web UI 聊天无响应
- 修补 Hermes Web UI，让自定义 provider 可以显示 `custom_providers[].models` 里的全部模型

## 快速开始

```bash
git clone https://github.com/skyler0513/hermes-docker.git
cd hermes-docker

docker compose build --pull
docker compose up -d
```

查看 Web UI 访问令牌：

```bash
cat ~/.hermes-web-ui/.token
```

打开：

```text
http://localhost:8648
```

## 为什么使用 Docker？

Hermes Agent 官方安装器适合直接安装在宿主机上使用。如果你希望环境更容易迁移、重建和隔离，Docker 会更方便。

这个镜像不会把个人配置打进镜像，而是挂载宿主机目录：

- `${HOME}/.hermes` -> `/home/hermes/.hermes`
- `${HOME}/.hermes-web-ui` -> `/home/hermes/.hermes-web-ui`
- `${HOME}/.agents/skills` -> `/home/hermes/.agents/skills`，只读挂载
- `${HOME}/hermes-workspace` -> `/workspace`

这样你可以重建镜像、升级 Web UI 或换机器部署，而不需要把 API Key、模型配置、聊天数据写死在镜像里。

## 适合谁使用？

如果你有下面这些需求，这个项目会比较适合：

- 想用 Hermes Agent + Hermes Web UI，但不想手动处理依赖
- 在国内网络下构建或安装 Hermes 经常失败
- 已经有自己的 `~/.hermes/config.yaml`
- 希望 Docker 容器直接使用宿主机上的 Hermes 配置
- 需要通过 Web UI 使用多个自定义模型
- 遇到过 Web UI 聊天无响应、API Server 没起来、模型列表显示不完整等问题

## 包含内容

镜像包含：

- Hermes Agent，通过中国大陆镜像安装器安装
- `hermes-web-ui@latest`
- API Server 运行所需的 `aiohttp`
- Web UI 自定义 provider 模型展开补丁
- 持久化 Web UI token 的入口脚本
- 国内默认镜像源配置

默认使用的上游安装方式：

```bash
curl -fsSL https://res1.hermesagent.org.cn/install.sh | bash
npm install -g hermes-web-ui@latest
```

## Web UI 访问令牌

Web UI 默认开启访问令牌。

如果没有手动设置 `HERMES_WEB_UI_AUTH_TOKEN`，容器第一次启动时会自动生成 token，并保存到：

```text
~/.hermes-web-ui/.token
```

查看 token：

```bash
cat ~/.hermes-web-ui/.token
```

手动指定 token：

```bash
HERMES_WEB_UI_AUTH_TOKEN=your-token docker compose up -d
```

## 自定义 Provider 模型

Hermes 配置里的 `custom_providers[].models` 会被 Web UI 展开到模型列表里。

例如你的 `~/.hermes/config.yaml` 里配置了：

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

Web UI 会显示 `custom:example-provider` 下的多个模型，而不是只显示 `model` 字段里的一个模型。

## 国内镜像

默认构建使用国内友好的镜像：

- Base image: `docker.1ms.run/library/node:24-bookworm`
- Debian apt: `https://mirrors.tuna.tsinghua.edu.cn/debian`
- pip: `https://pypi.tuna.tsinghua.edu.cn/simple`
- npm: `https://registry.npmmirror.com`
- Node headers for `node-gyp`: `https://npmmirror.com/mirrors/node`

也可以切回官方源：

```bash
NODE_IMAGE=node:24-bookworm \
APT_MIRROR=https://deb.debian.org/debian \
PIP_INDEX_URL=https://pypi.org/simple \
NPM_REGISTRY=https://registry.npmjs.org \
NODE_DISTURL=https://nodejs.org/download/release \
docker compose build --pull
```

## 配置

指定 Hermes Agent 分支或 tag：

```bash
HERMES_AGENT_REF=main docker compose build --pull
```

安装更重的可选 Python extras：

```bash
HERMES_INSTALL_OPTIONAL_EXTRAS=true docker compose build --pull
```

指定 Web UI 版本：

```bash
HERMES_WEB_UI_VERSION=0.5.24 docker compose build --pull
```

指定另一个 Hermes 安装脚本：

```bash
HERMES_INSTALL_URL=https://example.com/install.sh docker compose build --pull
```

## 代理

容器使用 `network_mode: host`，因此宿主机上监听 `127.0.0.1` 的代理，在容器里也可以通过 `127.0.0.1` 访问。

如果你的代理需要环境变量：

```bash
HTTP_PROXY=http://127.0.0.1:7890 \
HTTPS_PROXY=http://127.0.0.1:7890 \
ALL_PROXY=socks5://127.0.0.1:7890 \
docker compose up -d
```

## UID / GID

如果你的 Linux 用户不是 UID/GID 1000，可以显式传入宿主机用户 ID，避免挂载目录写入权限问题：

```bash
HERMES_UID=$(id -u) HERMES_GID=$(id -g) docker compose up -d
```

## 常用操作

查看状态：

```bash
docker compose ps
```

查看日志：

```bash
docker compose logs -f
```

进入容器：

```bash
docker compose exec hermes bash
```

查看 Hermes 版本：

```bash
docker compose exec hermes hermes --version
```

检查 API Server：

```bash
curl http://127.0.0.1:8642/health
```

停止：

```bash
docker compose down
```

## 注意事项

`network_mode: host` 在 Linux 上原生可用，在 OrbStack 上也可用。Docker Desktop for macOS 对 host networking 的支持取决于 Docker Desktop 版本和设置。

这个项目会直接写入宿主机挂载的 `~/.hermes` 和 `~/.hermes-web-ui`。如果这些目录里已有重要数据，首次使用前建议先备份。
