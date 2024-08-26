---
layout: single
title: "common used socket tool"
categories: network
tags: network socket nc ncat netcat
collection: 2024
classes: wide

toc: true
toc_label: "Content Outline"
toc_icon: "cog"
toc_sticky: true

---



# Common used socket tool

## socat

### start a echo server

```shell
socat -v tcp-l:9100,fork exec:'/bin/cat'
```





