---
layout: single
title: "install pg on mac"
categories: shell
tags: shell postgres
collection: 2024
classes: wide

toc: true
toc_label: "Content Outline"
toc_icon: "cog"
toc_sticky: true

---

## Install

```shell
brew install postgresql@16

```

## Set password

```shell
psql -U postgres
postgres=# \password
Enter new password for user "postgres":
```

## Listen on '*'

Add or edit the following line in your postgresql.conf :

listen_addresses = '*'
Add the following line as the first line of pg_hba.conf. It allows access to all databases for all users with an encrypted password:

## TYPE DATABASE USER CIDR-ADDRESS  METHOD

```ini
host  all  all 0.0.0.0/0 scram-sha-256
```
Restart Postgresql after adding this with service postgresql restart or the equivalent command for your setup. For brew, brew services restart postgresql

Edit: The authentication method was updated from md5 to scram-sha-256 because "the MD5 hash algorithm is nowadays no longer considered secure against determined attacks." Please note that scram-sha-256 "is the most secure of the currently provided methods, but it is not supported by older client libraries." Source: official documentation


## Restart service

```shell
brew services restart postgresql@16
```
