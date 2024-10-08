---
layout: single
title: "Proxy script"
categories: shell
tags: shell proxy
collection: 2024
classes: wide

toc: true
toc_label: "Content Outline"
toc_icon: "cog"
toc_sticky: true

---



# Proxy script


```shell
#!/bin/sh

showHelp() {
    cat <<-EOF
Usage: $0 [-e | -d] [-v] [-h]

-h, -help                  Display help

-e, --enable               Enable the http proxy

-d, --disable              Disable the proxy

-v, --verbose              Check the proxy setting

EOF
}

usage() {
    showHelp
    exit 2
}

# $@ is all command line parameters passed to the script.
# -o is for short options like -v
# -l is for long options with double dash like --version
# the comma separates different long options
# -a is for long options with single dash like -version
opts=$(getopt -l "help,enable,disable,verbose" -o "hedv" -a -- "$@")

# set --:
# If no arguments follow this option, then the positional parameters are unset. Otherwise, the positional parameters
# are set to the arguments, even if some of them begin with a ‘-’.
eval set -- "$opts"

if [ "$*" = "--" ]; then
    usage
fi

# MASTER_IP=$(hostname -I | awk '{print $1}')
# 4.2.2.2 via 10.0.2.2 dev enp0s3 src 10.0.2.15 uid 1000 
#   cache
MASTER_IP=$(ip route get 4.2.2.2 | awk '{print $3; exit}')
while true; do
    case $1 in
    -h | --help)
        showHelp
        exit 0
        ;;
    -e | --enable)
        echo "enable proxy ..."
        export http_proxy=http://${MASTER_IP:-127.0.0.1}:1088
        export https_proxy=http://${MASTER_IP:-127.0.0.1}:1088
        export no_proxy="localhost,$MASTER_IP,127.0.0.1,.example.com"
        export NO_PROXY="localhost,$MASTER_IP,127.0.0.1,.example.com"
        shift
        ;;
    -d | --disable)
        echo "disable proxy ..."
        unset http_proxy
        unset https_proxy
        unset no_proxy
        shift
        ;;
    -v | --verbose)
        echo "http_proxy: $http_proxy"
        echo "https_proxy: $https_proxy"
        echo "no_proxy: $no_proxy"
        shift
        ;;
    --)
        shift
        break
        ;;
    *) echo "Unexpeceted option: $1 - this should not happen" ;;
    esac
done
```




