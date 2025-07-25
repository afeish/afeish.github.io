---
layout: single
title: "golang cross build"
categories: golang
tags: golang build cross
collection: 2025
classes: wide

toc: true
toc_label: "Content Outline"
toc_icon: "cog"
toc_sticky: true

---

## Cross build

```shell
BUILD_DIR = output
APP = sshanger
GOOS ?= windows
GOARCH ?= amd64
STRIP ?= true  # 默认启用
# 统一转换为小写，避免大小写问题
STRIP := $(shell echo $(STRIP) | tr '[:upper:]' '[:lower:]')

# 自动检测当前系统类型
ifeq ($(OS),Windows_NT)
    HOST_OS := windows
else
    UNAME_S := $(shell uname -s)
    ifeq ($(UNAME_S),Darwin)
        HOST_OS := darwin
    else
        HOST_OS := linux
    endif
endif

# 自动检测当前系统架构
UNAME_M := $(shell uname -m)
ifeq ($(UNAME_M),x86_64)
    HOST_ARCH := amd64
else ifeq ($(UNAME_M),arm64)
    HOST_ARCH := arm64
else ifneq (,$(findstring arm,$(UNAME_M)))
    HOST_ARCH := arm
else
    HOST_ARCH := $(UNAME_M)
endif

# 获取git信息（兼容无git仓库的情况）
VERSION := $(shell git branch --show-current 2>/dev/null || echo "unknown")
CommitHash := $(shell git log -1 --pretty=format:"%H" 2>/dev/null || echo "unknown")

# 输出文件后缀
suffix := $(if $(filter $(GOOS),windows),.exe,)

# 交叉编译工具链配置
ifeq ($(HOST_OS),darwin)
    ifeq ($(GOOS),windows)
        CC := $(if $(filter $(HOST_ARCH),arm64),/opt/homebrew/bin/x86_64-w64-mingw32-gcc,x86_64-w64-mingw32-gcc)
        CXX := $(if $(filter $(HOST_ARCH),arm64),/opt/homebrew/bin/x86_64-w64-mingw32-g++,x86_64-w64-mingw32-g++)
    else ifeq ($(GOOS),linux)
        CC := $(if $(filter $(HOST_ARCH),arm64),/opt/homebrew/bin/x86_64-linux-musl-gcc,x86_64-linux-musl-gcc)
        CXX := $(if $(filter $(HOST_ARCH),arm64),/opt/homebrew/bin/x86_64-linux-musl-g++,x86_64-linux-musl-g++)
    else ifeq ($(GOOS),darwin)
        CC := clang
        CXX := clang++
    endif
else ifeq ($(HOST_OS),linux)
    ifeq ($(GOOS),windows)
        CC := x86_64-w64-mingw32-gcc
        CXX := x86_64-w64-mingw32-g++
    else ifeq ($(GOOS),linux)
        CC := gcc
        CXX := g++
    endif
else ifeq ($(HOST_OS),windows)
    ifeq ($(GOOS),windows)
        CC := x86_64-w64-mingw32-gcc
        CXX := x86_64-w64-mingw32-g++
    else
        $(error "Cross-compiling from Windows to non-Windows is not supported")
    endif
endif

# 链接选项（根据 STRIP 控制 -s -w）
ifeq ($(STRIP),true)
    GO_LDFLAGS := -s -w -X main.Version=$(VERSION) -X main.GitCommit=$(CommitHash)
else
    GO_LDFLAGS := -X main.Version=$(VERSION) -X main.GitCommit=$(CommitHash)
    $(info "注意: 未启用二进制文件剥离 (-s -w)，生成的文件体积会更大")
endif

# Go 编译前缀
PREFIX := CGO_ENABLED=1 CC=$(CC) CXX=$(CXX) GOOS=$(GOOS) GOARCH=$(GOARCH) go build -x -v

# 平台构建通用函数
define build-platform
    $(eval _GOOS := $(1))
    $(eval _GOARCH := $(2))
    $(eval _SUFFIX := $(if $(filter $(_GOOS),windows),.exe,))
    $(eval _IS_CMD := $(filter $(3),cmd))  # 是否构建控制工具

    @echo "Building $(if $(_IS_CMD),control tool,main program) for $(_GOOS)/$(_GOARCH)..."

    # 设置编译器（覆盖全局变量，确保正确）
    $(eval _CC := )
    $(eval _CXX := )
    $(if $(filter $(_GOOS),windows), \
        $(eval _CC := $(if $(and $(filter $(HOST_OS),darwin), $(filter $(HOST_ARCH),arm64)), \
                         /opt/homebrew/bin/x86_64-w64-mingw32-gcc, x86_64-w64-mingw32-gcc)), \
        $(eval _CXX := $(if $(and $(filter $(HOST_OS),darwin), $(filter $(HOST_ARCH),arm64)), \
                          /opt/homebrew/bin/x86_64-w64-mingw32-g++, x86_64-w64-mingw32-g++)))
    $(if $(filter $(_GOOS),linux), \
        $(eval _CC := $(if $(and $(filter $(HOST_OS),darwin), $(filter $(HOST_ARCH),arm64)), \
                         /opt/homebrew/bin/x86_64-linux-musl-gcc, gcc)), \
        $(eval _CXX := $(if $(and $(filter $(HOST_OS),darwin), $(filter $(HOST_ARCH),arm64)), \
                          /opt/homebrew/bin/x86_64-linux-musl-g++, g++)))
    $(if $(filter $(_GOOS),darwin), \
        $(eval _CC := clang), $(eval _CXX := clang++))

    # 输出路径和源码
    $(eval _OUTPUT := $(BUILD_DIR)/$(APP)$(if $(_IS_CMD),ctl,)-$(_GOOS)-$(_GOARCH)$(_SUFFIX))
    $(eval _SOURCE := $(if $(_IS_CMD),sshanger/cmd/hangerctl,main.go))

    # 执行编译
    CGO_ENABLED=1 \
    CC=$(_CC) \
    CXX=$(_CXX) \
    GOOS=$(_GOOS) \
    GOARCH=$(_GOARCH) \
    go build -x -v \
    -ldflags "$(GO_LDFLAGS)" \
    -o $(_OUTPUT) \
    $(_SOURCE)
endef

# 目标定义（全部声明为伪目标，避免文件冲突）
.PHONY: all version clean build build-debug \
        windows linux linux-arm64 mac mac-arm64 \
        cmd cmd-debug bugfix run ctl help

# 默认目标：显示帮助
all: help

## version: 打印版本和系统信息
version:
	@echo "Branch: $(VERSION)"
	@echo "CommitHash: $(CommitHash)"
	@echo "Host OS: $(HOST_OS)"
	@echo "Host Arch: $(HOST_ARCH)"
	@echo "Target OS: $(GOOS)"
	@echo "Target Arch: $(GOARCH)"

## clean: 清理编译产物
clean:
	@echo "Cleaning $(BUILD_DIR)..."
	@rm -rf $(BUILD_DIR)

# 创建输出目录
$(BUILD_DIR):
	@mkdir -p $(BUILD_DIR)

$(BUILD_DIR)/bugfix:
	@mkdir -p $(BUILD_DIR)/bugfix

## build: 构建当前平台版本（默认linux/amd64，可指定GOOS/GOARCH）
build: $(BUILD_DIR)
	$(call build-platform,$(GOOS),$(GOARCH))

## build-debug: 构建带调试信息的版本（禁用 -s -w）
build-debug:
	$(MAKE) build STRIP=false  # 强制传递 STRIP=false

## windows: 构建Windows/amd64版本
windows: $(BUILD_DIR)
	$(call build-platform,windows,amd64)

## linux: 构建Linux/amd64版本
linux: $(BUILD_DIR)
	$(call build-platform,linux,amd64)

## linux-arm64: 构建Linux/arm64版本
linux-arm64: $(BUILD_DIR)
	$(call build-platform,linux,arm64)

## mac: 构建macOS/amd64版本（Intel）
mac: $(BUILD_DIR)
	$(call build-platform,darwin,amd64)

## mac-arm64: 构建macOS/arm64版本（Apple Silicon）
mac-arm64: $(BUILD_DIR)
	$(call build-platform,darwin,arm64)

## cmd: 构建控制工具（支持跨平台，如 make cmd GOOS=windows）
cmd: $(BUILD_DIR)
	$(call build-platform,$(GOOS),$(GOARCH),cmd)

## cmd-debug: 构建带调试信息的控制工具
cmd-debug:
	$(MAKE) cmd STRIP=false  # 强制传递 STRIP=false

## bugfix: 构建bugfix版本（需指定id，如 make bugfix id=123）
bugfix: $(BUILD_DIR)/bugfix
	@echo "Building bugfix version $(id)..."
	$(PREFIX) -ldflags "$(GO_LDFLAGS)" -o $(BUILD_DIR)/bugfix/$(APP)-bugfix-$(id)-$(GOOS)-$(GOARCH)$(suffix)

## run: 直接运行主程序（带竞态检测）
run:
	go run -race main.go

## ctl: 直接运行控制工具
ctl:
	go run sshanger/cmd/hangerctl

## help: 显示帮助信息
help:
	@echo "Usage: make [target]\n"
	@sed -n 's/^##//p' ${MAKEFILE_LIST} | column -t -s ':' | sed -e 's/^/  /'
```
