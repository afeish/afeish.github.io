---
layout: single
title: "Basic example debug configuration for VsCode Python"
date: 2024-03-22 20:48:54 +0800
categories: dev
tags: vscode python debug
collection: 2024
classes: wide

toc: true
toc_label: "Content Outline"
toc_icon: "cog"
toc_sticky: true

---



# Basic example debug configuration for VsCode Python

## Prerequisites

First, we can use [`jurigged`](https://github.com/breuleux/jurigged) to hot reload our script：

```shell
pip install jurigged
```

## The configuration file
```json
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "name": "live-server",
            "type": "debugpy",
            "request": "launch",
            "program": "${userHome}/.pyenv/versions/3.8.19/bin/jurigged",
            "console": "integratedTerminal",
            "cwd": "${workspaceFolder}",
            "args": [
                "-v",
                "-w",
                "*.*",
                "--poll",
                "1",
                "__main__.py",
                "-nu"
            ]
        },
        {
            "name": "server",
            "type": "debugpy",
            "request": "launch",
            "program": "${workspaceFolder}/__main__.py",
            "console": "integratedTerminal",
            "cwd": "${workspaceFolder}",
            "args": [
                "-nu"
            ]
        },
        {
            "name": "Python Debugger: Current File",
            "type": "debugpy",
            "request": "launch",
            "program": "${file}",
            "console": "integratedTerminal",
            "cwd": "${workspaceFolder}",
            "env": {
                "PYTHONPATH": "${workspaceFolder}"
            }
        },
    ]
}

```



