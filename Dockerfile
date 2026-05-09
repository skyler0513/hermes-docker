ARG NODE_IMAGE=docker.1ms.run/library/node:24-bookworm
FROM ${NODE_IMAGE}

ARG HERMES_AGENT_REF=main
ARG HERMES_INSTALL_URL=https://res1.hermesagent.org.cn/install.sh
ARG HERMES_INSTALL_OPTIONAL_EXTRAS=false
ARG HERMES_WEB_UI_VERSION=latest
ARG APT_MIRROR=https://mirrors.tuna.tsinghua.edu.cn/debian
ARG PIP_INDEX_URL=https://pypi.tuna.tsinghua.edu.cn/simple
ARG NPM_REGISTRY=https://registry.npmmirror.com
ARG NODE_DISTURL=https://npmmirror.com/mirrors/node

ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1
ENV HERMES_HOME=/home/hermes/.hermes
ENV HERMES_WEB_UI_HOME=/home/hermes/.hermes-web-ui
ENV PIP_INDEX_URL=${PIP_INDEX_URL}
ENV PIP_TRUSTED_HOST=pypi.tuna.tsinghua.edu.cn
ENV npm_config_registry=${NPM_REGISTRY}
ENV npm_config_disturl=${NODE_DISTURL}
ENV PATH="/opt/hermes-agent/venv/bin:/usr/local/bin:${PATH}"

RUN sed -i "s|http://deb.debian.org/debian|${APT_MIRROR}|g; s|http://deb.debian.org/debian-security|${APT_MIRROR}-security|g" /etc/apt/sources.list.d/debian.sources && \
    apt-get update && \
    apt-get install -y --no-install-recommends \
      bash build-essential ca-certificates curl ffmpeg gcc git gosu \
      libffi-dev openssh-client procps python3 python3-dev python3-venv \
      ripgrep sqlite3 tini && \
    rm -rf /var/lib/apt/lists/*

RUN useradd -m -d /home/hermes -s /bin/bash hermes && \
    mkdir -p /opt /home/hermes/.hermes && \
    curl --http1.1 -fsSL --retry 5 --retry-delay 3 --connect-timeout 30 "${HERMES_INSTALL_URL}" -o /tmp/install-hermes.sh && \
    install_args="--skip-setup --branch ${HERMES_AGENT_REF} --dir /opt/hermes-agent" && \
    if [ "${HERMES_INSTALL_OPTIONAL_EXTRAS}" = "true" ]; then install_args="$install_args --with-optional-extras"; fi && \
    HOME=/home/hermes bash /tmp/install-hermes.sh $install_args && \
    rm -f /tmp/install-hermes.sh && \
    ln -sf /opt/hermes-agent/venv/bin/hermes /usr/local/bin/hermes && \
    test -x /usr/local/bin/hermes

RUN npm install -g --omit=dev --no-audit --no-fund "hermes-web-ui@${HERMES_WEB_UI_VERSION}" && \
    webui_root="$(npm root -g)/hermes-web-ui" && \
    mkdir -p /home/hermes/.hermes-web-ui/data && \
    rm -rf "$webui_root/dist/data" && \
    ln -s /home/hermes/.hermes-web-ui/data "$webui_root/dist/data" && \
    npm cache clean --force

RUN \
    mkdir -p /workspace && \
    chown -R hermes:hermes /home/hermes /workspace

COPY entrypoint.sh /usr/local/bin/hermes-container-entrypoint
RUN chmod +x /usr/local/bin/hermes-container-entrypoint

EXPOSE 8648
ENTRYPOINT ["/usr/bin/tini", "-g", "--", "/usr/local/bin/hermes-container-entrypoint"]
CMD ["web"]
