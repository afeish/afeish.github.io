---
layout: single
title: "common used shell option"
categories: shell
tags: shell cmd log signal
collection: 2024
classes: wide

toc: true
toc_label: "Content Outline"
toc_icon: "cog"
toc_sticky: true

---



# Common used shell option

## getopts 1

```shell
while [[ $# -gt 0 ]]
do
    key="$1"
    case $key in
        -i|--ip)
        IP="$2"
        shift # past argument
        ;;
        -p|--port)
        PORT="$2"
        shift # past argument
        ;;
        -f|--file)
        INPUT_FILE="$2"
        shift # past argument
        ;;
        *)
        # Unknown option
        echo "Unknown option: $key"
        exit 1
        ;;
    esac
    shift # past argument or value
done
```


## getopts 2

```shell

function usage() {
    echo "Usage: $0 -a <access key> -s <secret key> -b <bucket> [-t <session token>] [-r <region>] [-v] [-C]" 1>&2
    exit 1
}

function main() {
    while getopts "a:s:t::b:hr::vC" opt; do
        case ${opt} in
        a)
            COS_AK=${OPTARG}
            ;;
        s)
            COS_SK=${OPTARG}
            ;;
        t)
            COS_TOKEN=${OPTARG}
            ;;
        b)
            COS_BUCKET=${OPTARG}
            ;;
        r)
            COS_REGION=${OPTARG}
            ;;
        h)
            usage
            ;;
        C)
            CLEANUP=true
            ;;
        :)
            echo "ERROR: Invalid option: ${opt} requires an argument" >&2
            exit 1
            ;;
        *)
            usage
            ;;
        esac
    done
    shift $((OPTIND - 1))

    if [ x"$CLEANUP" = x"true" ]; then
        exit 0
    fi

    if [ -z "${COS_AK}" ]; then
        echo "ERROR: missing cos accesskey"
        usage
    fi

    if [ -z "${COS_SK}" ]; then
        echo "ERROR: missing cos secretkey"
        usage
    fi

    if [ -z "${COS_BUCKET}" ]; then
        echo "ERROR: missing cos bucket"
        usage
    fi
}

main "$@"
```

## log

```shell
function log_info {
    local DATE=$(date "+%Y-%m-%d %H:%M:%S[%Z]")
    echo -e "\033[35;1m${DATE}\033[35;1m: \033[36;1m[info    ]: $1\033[0m"
}

function log_err() {
    local DATE=$(date "+%Y-%m-%d %H:%M:%S[%Z]")
    echo -e "\033[35;1m${DATE}\033[35;1m: \033[31;1m[error   ]: $1\033[0m"
}

function log_warn() {
    local DATE=$(date "+%Y-%m-%d %H:%M:%S[%Z]")
    echo -e "\033[35;1m${DATE}\033[35;1m: \033[1;33m[warn    ]: $1\033[0m"
}

function log_suc() {
    local DATE=$(date "+%Y-%m-%d %H:%M:%S[%Z]")
    echo -e "\033[35;1m${DATE}\033[35;1m: \033[32;1m[success ]: $1\033[0m"
}
```

## trap signal

```shell
function sig_handler() {
    rc=$?
    if [[ $rc = 0 ]]; then
        rc=255
    fi
    log_err "script finished abnormally by signal, cleanup ..."
    clean
    exit -1
}

function exit_handler() {
    rc=$?
    if [[ $rc = 0 && $1 = 'EXIT' ]]; then
        log_suc "script finished normally, cleanup ..."
        clean
    elif [[ $rc != 255 ]]; then # means that exit by other signal (which cause another exit)
        log_err "script finished abnormally by exit, cleanup ..."
        clean
    fi

}

trap_with_arg() {
    func="$1"
    shift
    for sig; do
        trap "$func $sig" "$sig"
    done
}

trap_with_arg sig_handler INT HUP TERM QUIT
trap_with_arg exit_handler EXIT
```




