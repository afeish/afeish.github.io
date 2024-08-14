---
layout: single
title: "dev toolkit"
date: 2024-03-22 20:48:54 +0800
categories: tool
tags: docker ubuntu mirror debian
collection: 2024
classes: wide

toc: true
toc_label: "Content Outline"
toc_icon: "cog"
toc_sticky: true

---



# 构建自己的Linux 开发环境

## 问题

我们使用 `peewee` 去准备我们的基础数据，如下：

```docker
FROM debian:bullseye
ARG COMMIT_ID
ARG PIPELINE_ID
ARG REF_NAME
ARG BUILT_TIME

RUN sed -i -e 's/http:\/\/[^\/]*/http:\/\/mirrors.tuna.tsinghua.edu.cn/g' /etc/apt/sources.list \
    && apt update && apt install -y iputils-ping netcat iproute2 net-tools procps bsdmainutils vim tree fio lsof sudo wget gnupg htop autoconf build-essential gdb fuse git wget zsh \
    && sed -i -e 's/#user_allow_other/user_allow_other/' /etc/fuse.conf \
    # && sh -c "$(wget -O- https://github.com/deluan/zsh-in-docker/releases/download/v1.1.5/zsh-in-docker.sh)" \
    && rm -rf /var/lib/apt/lists/*

ENV MOUNTPOINT=${MOUNTPOINT:-/tmp/hugo} \
    META_URL=${META_URL:-localhost:26666} \
    TRANSPORT=${TRANSPORT:-grpc}

RUN groupadd --gid 1000 hugo && \
    useradd --uid 1000 --gid 1000 -m hugo -s /bin/bash
RUN echo hugo ALL=\(ALL\) NOPASSWD:ALL > /etc/sudoers.d/hugo && \
    chmod 0440 /etc/sudoers.d/hugo
# USER hugo

CMD ["sh", "-c", "sleep infinity"]
EXPOSE 2345 6060

```



